const { sqlRequest } = require('../../db.js');
const sql = require('mssql');

const RESERVATION_FIELDS = `
    r.id,
    r.startDate,
    r.endDate,
    r.spotId,
    r.userId
`

const AVAILABILITYWINDOW_FIELDS = `
    aw.id,
    aw.startDate,
    aw.endDate,
    aw.spotId,
    aw.userId
`

module.exports = {
    addAllocation: async (spotId, userId) => {
        const result = await sqlRequest()
            .input('spotId', spotId)
            .input('userId', userId)
            .query(`
                    INSERT INTO Allocations(spotId, userId)
                    VALUES(@spotId, @userId)
                    SELECT SCOPE_IDENTITY() AS AllocationId
                `);
        const allocationId = result.recordset[0].AllocationId;
        return allocationId;
    },

    addAvailabilityWindow: async (spotId, startDate, endDate) => {
        //sterge userId poate?
        const result = await sqlRequest()
            .input('startDate', startDate)
            .input('endDate', endDate)
            .input('spotId', spotId)
            .query(`
                    INSERT INTO AvailabilityWindows(startDate, endDate, spotId)
                    VALUES(@startDate, @endDate, @spotId)
                    SELECT SCOPE_IDENTITY() AS AvailabilityWindowId
                `);
        const availabilityWindowId = result.recordset[0].AvailabilityWindowId;
        return availabilityWindowId;
    },

    addReservation: async (spotId, userId, startDate, endDate) => {
        const result = await sqlRequest()
        .input('spotId', spotId)
        .input('userId', userId)
        .input('startDate', startDate)
        .input('endDate', endDate)
        .query(`
                    INSERT INTO Reservations(spotId, userId, startDate, endDate)
                    VALUES(@spotId, @userId, @startDate, @endDate);
                    SELECT SCOPE_IDENTITY() AS ReservationId
                `)
        const reservationId = result.recordset[0].ReservationId;
        return reservationId;
    },

    checkAvailability: async(spotId, startDate, endDate) => {
        // verifica daca exista alocare, daca nu exista e echivalent cu existenta unui availabilityWindow
        const checkAvailabilityWindows = await sqlRequest()
            .input('startDate', startDate)
            .input('endDate', endDate)
            .input('spotId', spotId)
            .query(`
                    SELECT 1 FROM AvailabilityWindows
                    WHERE spotId = @spotId 
                        AND startDate <= @startDate 
                        AND endDate >= @endDate
                `)
        const availabilityWindowExists = checkAvailabilityWindows.recordset.length !== 0;
        if(!availabilityWindowExists){
            return false;
        }

        const checkReservations = await sqlRequest()
            .input('startDate', startDate)
            .input('endDate', endDate)
            .input('spotId', spotId)
            .query(`
                    SELECT 1 FROM Reservations
                    WHERE spotId = @spotId
                    AND startDate <= @startDate
                    AND endDate >= @endDate
                `)
        const hasConflict = checkReservations.recordset.length !== 0;

        return !hasConflict;
    },

    deleteAllocation: async (spotId) => {
        const result = await sqlRequest()
            .input('spotId', spotId)
            .query(`
                    DELETE FROM Allocations
                    WHERE spotId = @spotId
                `)
        return result.rowsAffected[0] > 0;
    },

    deleteAvailabilityWindow: async (id) => {
        const result = await sqlRequest()
            .input('id', id)
            .query(`
                    DELETE FROM AvailabilityWindows
                    WHERE id = @id
                `)
        return result.rowsAffected[0] > 0;
    },

    deleteReservation: async (id) => {
        const result = await sqlRequest()
            .input('id', id)
            .query(`
                    DELETE FROM Reservations
                    WHERE id = @id
                `)
        return result.rowsAffected[0] > 0;
    },
    //check daca utilizatorul are acces la locul respectiv in data respectiva

    getReservationByDate: async(spotId, startDate, endDate) => {
        const result = await sqlRequest()
            .input('spotId', spotId)
            .input('startDate', startDate)
            .input('endDate', endDate)
            .query(`
                    SELECT ${RESERVATION_FIELDS}
                    FROM Reservations r
                    WHERE spotId = @spotId
                        AND r.startDate >= @startDate
                        AND r.endDate <= @endDate
                `);
        return result.recordset;
    },

    getAvailabilityWindowById: async(windowId) => {
        const result = await sqlRequest()
            .input('id', windowId)
            .query(`
                    SELECT ${AVAILABILITYWINDOW_FIELDS}
                    FROM AvailabilityWindows aw
                    WHERE id = @id
                `
            );
        return result.recordset[0];
    },

    getAvailablityWindowsBySpotId: async(spotId) => {
        const result = await sqlRequest()
            .input('spotId', spotId)
            .query(`
                    SELECT ${AVAILABILITYWINDOW_FIELDS}
                    FROM AvailabilityWindows aw
                    where aw.spotId = @spotId
                `);
        return result.recordset;
    },

    getOccupancyStatus: async(parkingLotId, targetDate) => {
        console.log(targetDate);
        const result = await sqlRequest()
            .input('parkingLotId', parkingLotId)
            .input('targetDate', targetDate)
            .query(`
                    SELECT
                        p.id,
                        p.name,
                        
                        a.userId AS ownerId,
                        u1.username AS ownerUsername,
                        u1.carplate AS ownerCarplate,

                        w.id AS windowId,


                        r.userId AS occupantId,
                        u2.username AS occupantUsername,
                        u2.carplate AS occupantCarplate

                    FROM ParkingSpots p
                    LEFT JOIN Allocations a ON p.id = a.spotId
                
                    LEFT JOIN Users u1 ON a.userId = u1.id

                    LEFT JOIN AvailabilityWindows w ON p.id = w.spotId
                        AND @targetDate BETWEEN w.startDate and w.endDate

                    LEFT JOIN Reservations r ON p.id = r.spotId
                        AND @targetDate BETWEEN r.startDate AND r.endDate

                    LEFT JOIN Users u2 ON r.userId = u2.id

                    WHERE p.parkingLotId = @parkingLotId
                `);
        return result.recordset;
    },

    updateAvailabilityWindow: async(newInfo) => {
        const result = await sqlRequest()
            .input('id', newInfo.id)
            .input('startDate', newInfo.startDate)
            .input('endDate', newInfo.endDate)
            .input('spotId', newInfo.spotId)
            .input('userId', newInfo.userId)
            .query(`
                    UPDATE AvailabilityWindows
                    SET
                        startDate = ISNULL(@startDate, startDate),
                        endDate = ISNULL(@endDate, endDate),
                        spotId = ISNULL(@spotId, spotId),
                        userId = ISNULL(@userId, userId)
                    WHERE id = @id
                `);
            if(result.rowsAffected[0] === 0){
                return null;
            }

            const selectResult = await sqlRequest()
                .input('id', newInfo.id)
                .query(`
                        SELECT ${AVAILABILITYWINDOW_FIELDS}
                        FROM AvailabilityWindows aw WHERE id = @id
                    `);
            return selectResult.recordset[0];
    }
}