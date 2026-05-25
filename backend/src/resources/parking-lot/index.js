const { sqlRequest } = require('../../db.js');

const PARKING_LOT_FIELDS = `
        p.id,
        p.name,
        p.address,
        p.userId
`;

module.exports = {
    add: async (name, address, userId)=>{
        const result = await sqlRequest()
            .input('name', name)
            .input('address', address)
            .input('userId', userId)
            .query(`
                    INSERT INTO ParkingLots(name, address, userId)
                    VALUES(@name, @address, @userId)
                    SELECT SCOPE_IDENTITY() AS ParkingLotId
                `)
            const parkingLotId = result.recordset[0].ParkingLotId;
            return parkingLotId;
    },
    getById: async(id) => {
        const result = await sqlRequest()
            .input('id', id)
            .query(`
                    SELECT ${PARKING_LOT_FIELDS}
                    FROM ParkingLots p
                    WHERE p.id = @id
                `);
            return result.recordset[0];
    },
    getByUserId: async(userId)=>{
        const result = await sqlRequest()
            .input('userId', userId)
            .query(`
                    SELECT ${PARKING_LOT_FIELDS}
                    FROM ParkingLots p WHERE userId=@userId
                `)
        return result.recordset;
    },
    update: async(newInfo) => {
        const result = await sqlRequest()
            .input('id', newInfo.id)
            .input('name', newInfo.name)
            .input('address', newInfo.address)
            .query(`
                    UPDATE ParkingLots
                    SET 
                        name = ISNULL(@name, name),
                        address = ISNULL(@address, address)
                    WHERE id = @id
                `);
        if(result.rowsAffected[0] === 0){
            return null;
        }

        const selectResult = await sqlRequest()
            .input('id', newInfo.id)
            .query(`
                    SELECT ${PARKING_LOT_FIELDS}
                    FROM ParkingLots p WHERE id = @id
                `);
        return selectResult.recordset[0];
    },
    delete: async(id) => {
        const result = await sqlRequest()
            .input('id', id)
            .query(`
                DELETE FROM ParkingLots
                WHERE id = @id
                `)
        return result.rowsAffected[0] > 0;
    },

    addUserParkingAccess: async(parkingLotId, userId) => {
        const result = await sqlRequest()
            .input('parkingLotId', parkingLotId)
            .input('userId', userId)
            .query(`
                    INSERT INTO UserParkingAccess(userId, parkingLotId)
                    VALUES(@userId, @parkingLotId)
                `)
        return { userId, parkingLotId };
    },

    deleteUserParkingAccess: async(parkingLotId, userId) => {
        const result = await sqlRequest()
            .input('parkingLotId', parkingLotId)
            .input('userId', userId)
            .query(`
                    DELETE FROM UserParkingAccess
                    WHERE parkingLotId = @parkingLotId
                        AND userId = @userId
                `)
        return result.rowsAffected[0] > 0;
    },

    getAllUsersWithAccess: async(parkingLotId) => {
        const result = await sqlRequest()
            .input('parkingLotId', parkingLotId)
            .query(`
                    SELECT u.id,
                        u.email,
                        u.username,
                        u.carplate
                    FROM UserParkingAccess upa
                    LEFT JOIN Users u
                        ON upa.userId = u.id
                    WHERE upa.parkingLotId = @parkingLotId
                    ORDER BY u.username ASC
                `)
        return result.recordset;
    },

    getAccessibleParkingLots: async (userId) => {
        const result = await sqlRequest()
            .input('userId', userId)
            .query(`
                    SELECT ${PARKING_LOT_FIELDS}
                    FROM UserParkingAccess upa
                    INNER JOIN ParkingLots p ON upa.parkingLotId = p.id
                    WHERE upa.userId = @userId
                    ORDER BY p.name ASC
                `);
        return result.recordset;
    },

    checkAccess: async(parkingLotId, userId) => {
        const result = await sqlRequest()
            .input('parkingLotId', parkingLotId)
            .input('userId', userId)
            .query(`
                    SELECT upa.parkingLotId,
                        upa.userId
                    WHERE upa.parkingLotId = @parkingLotId
                        AND upa.userId = @userId
                `)
        return result.recordset.length !== 0;
    },

    getAllAvailableSpots: async (parkingLotId, startDate, endDate) => {
        const windowsResult = await sqlRequest()
            .input('parkingLotId', parkingLotId)
            .input('startDate', startDate)
            .input('endDate', endDate)
            .query(`
                    SELECT aw.spotId, p.name AS spotName, aw.startDate, aw.endDate
                    FROM AvailabilityWindows aw
                    INNER JOIN ParkingSpots p ON aw.spotId = p.id
                    WHERE p.parkingLotId = @parkingLotId
                        AND aw.endDate >= @startDate
                        AND aw.startDate <= @endDate
                `);
        
        const reservationsResult = await sqlRequest()
                .input('parkingLotId', parkingLotId)
                .input('startDate', startDate)
                .input('endDate', endDate)
                .query(`
                        SELECT r.spotId, r.startDate, r.endDate
                        FROM Reservations r
                        INNER JOIN ParkingSpots p on r.spotId = p.id
                        WHERE p.parkingLotId = @parkingLotId
                            AND r.endDate >= @startDate
                            AND r.startDate <= @endDate
                    `);
        
        const windows = windowsResult.recordset;
        const reservations = reservationsResult.recordset;

        const spotsMap = new Map();
        
        for (const win of windows) {
            if (!spotsMap.has(win.spotId)) {
                spotsMap.set(win.spotId, {
                    spotId: win.spotId,
                    spotName: win.spotName,
                    availablePeriods: []
                });
            }

            spotsMap.get(win.spotId).availablePeriods.push({
                startDate: new Date(win.startDate),
                endDate: new Date(win.endDate)
            });
        }

        for (const res of reservations) {
            const spot = spotsMap.get(res.spotId);
            if (!spot) continue;

            const resStart = new Date(res.startDate);
            const resEnd = new Date(res.endDate);

            let newAvailablePeriods = [];
            
            for (const win of spot.availablePeriods) {
                if(resStart <= win.endDate && resEnd >= win.startDate) {
                    if (resStart > win.startDate) {
                        const beforeEnd = new Date(resStart);
                        beforeEnd.setDate(beforeEnd.getDate() - 1);
                        newAvailablePeriods.push({ startDate: win.startDate, endDate: beforeEnd });
                    }
                    
                    if (resEnd < win.endDate) {
                        const afterStart = new Date(resEnd);
                        afterStart.setDate(afterStart.getDate() + 1);
                        newAvailablePeriods.push({startDate: afterStart, endDate: win.endDate});
                    }
                } else {
                    newAvailablePeriods.push(win);
                }
            }
            spot.availablePeriods = newAvailablePeriods;
        }
        
        const finalResult = [];

        for (const spot of spotsMap.values()) {
            if (spot.availablePeriods.length > 0) {
                finalResult.push(spot);
            }
        }

        return finalResult;
    }
}