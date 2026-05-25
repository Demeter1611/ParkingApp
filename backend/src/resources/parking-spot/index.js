const { sqlRequest } = require("../../db.js");
const sql = require('mssql');

const PARKING_SPOT_FIELDS = `
    p.id,
    p.name
`

module.exports = {
    add: async (name, parkingLotId) => {
        const result = await sqlRequest()
            .input('name', name)
            .input('parkingLotId', parkingLotId)
            .query(`
                    INSERT INTO ParkingSpots(name, parkingLotId)
                    VALUES(@name, @parkingLotId)
                    SELECT SCOPE_IDENTITY() AS ParkingSpotId
                `)
            const parkingSpotId = result.recordset[0].ParkingSpotId;
            return parkingSpotId;
    },

    addBulk: async (spots, parkingLotId) => {
        const table = new sql.Table('ParkingSpots');
        table.create = false;

        table.columns.add('name', sql.VarChar(100), { nullable: false });
        table.columns.add('parkingLotId', sql.Int);
        spots.forEach(spot => {
            table.rows.add(spot.name, parkingLotId);
        })
        
        
        const request = await sqlRequest();
        const result = await request.bulk(table);
        
        return result.rowsAffected;
    },

    getByParkingLotId: async (parkingLotId) => {
        const result = await sqlRequest()
            .input('parkingLotId', parkingLotId)
            .query(`
                SELECT ${PARKING_SPOT_FIELDS}
                FROM ParkingSpots p
                WHERE p.parkingLotId = @parkingLotId
                `);
        return result.recordset;
    },

    getUserSpotForDate: async (userId, targetDate) => {
        const reservedSpot = await sqlRequest()
            .input('userId', userId)
            .input('targetDate', targetDate)
            .query(`
                    SELECT ${PARKING_SPOT_FIELDS}
                    FROM Reservations r
                    INNER JOIN ParkingSpots p ON r.spotId = p.id
                    WHERE r.userId = @userId
                        AND @targetDate BETWEEN r.startDate AND r.endDate
                `);
        if(reservedSpot.recordset[0]){
            return({...reservedSpot.recordset[0], status: 'reserved'});
        }

        const allocatedSpot = await sqlRequest()
            .input('userId', userId)
            .query(`
                    SELECT ${PARKING_SPOT_FIELDS}
                    FROM Allocations a
                    INNER JOIN ParkingSpots p ON a.spotId = p.id
                        WHERE a.userId = @userId
                `)
        if(allocatedSpot.recordset[0]){
            const releaseCheck = await sqlRequest()
                .input('spotId', allocatedSpot.recordset[0].id)
                .input('targetDate', targetDate)
                .query(`
                    SELECT
                        aw.id as windowId,
                        r.id as reservationId
                    FROM ParkingSpots p
                    LEFT JOIN AvailabilityWindows aw ON aw.spotId = p.id
                        AND @targetDate BETWEEN aw.startDate AND aw.endDate
                    LEFT JOIN Reservations r ON r.spotId = p.id
                        AND @targetDate BETWEEN r.startDate AND r.endDate
                    WHERE p.id = @spotId
                    `)
            const released = releaseCheck.recordset[0] && 
                (releaseCheck.recordset[0].windowId || releaseCheck.recordset[0].reservationId);
            if(released){
                return {...allocatedSpot.recordset[0], status: 'released'}
            }
            return {...allocatedSpot.recordset[0], status: 'allocated'};
        }

        return null;
    },

    getMonthData: async (userId, startOfMonth, endOfMonth) => {
        const allocation = await sqlRequest()
            .input('userId', userId)
            .query(`
                    SELECT spotId, 'allocated' as status
                    FROM Allocations a
                    WHERE userId=@userId
                `);
        if(!allocation.recordset[0]){
            const reservations = await sqlRequest()
                .input('userId', userId)
                .input('startOfMonth', startOfMonth)
                .input('endOfMonth', endOfMonth)
                .query(`
                    SELECT r.spotId, r.startDate, r.endDate, 'reserved' as status
                    FROM Reservations r
                    WHERE userId=@userId
                    AND (r.startDate <= @endOfMonth AND r.endDate >= @startOfMonth)
                `);
            return reservations.recordset;
        }

        const spotId = allocation.recordset[0].spotId;

        
        const released = await sqlRequest()
        .input('userId', userId)
        .input('startOfMonth', startOfMonth)
        .input('endOfMonth', endOfMonth)
        .query(`
            SELECT aw.spotId, aw.startDate, aw.endDate, 'released' as status
            FROM AvailabilityWindows aw
            WHERE userId=@userId
            AND (aw.startDate <= @endOfMonth AND aw.endDate >= @startOfMonth)
            `);

        const occupiedByOthers = await sqlRequest()
                .input('spotId', spotId)
                .input('startOfMonth', startOfMonth)
                .input('endOfMonth', endOfMonth)
                .query(`
                        SELECT r.spotId, r.startDate, r.endDate, 'occupied' as status
                        FROM Reservations r
                        WHERE r.spotId = @spotId
                        AND (r.startDate <= @endOfMonth AND r.endDate >= @startOfMonth)
                    `);

        return [...released.recordset, allocation.recordset[0], ...occupiedByOthers.recordset];
    },
    
    delete: async(id) => {
        const result = await sqlRequest()
            .input('id', id)
            .query(`
                DELETE FROM ParkingSpots
                WHERE id = @id
                `)
        return result.rowsAffected[0] > 0;
    }
}