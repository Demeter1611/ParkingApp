const { sqlRequest } = require('../../db.js');

const PARKING_LOT_FIELDS = `
        p.id,
        p.name,
        p.address,
        p.maxCapacity,
        p.timeslotsEnabled,
        p.sharingEnabled,
        p.temporaryOnlyEnabled,
        p.visitorSpotsEnabled,
        p.simplifiedGridEnabled,
        p.userId
`;

module.exports = {
    add: async (name, address, maxCapacity, timeslotsEnabled, sharingEnabled, temporaryOnlyEnabled, visitorSpotsEnabled, simplifiedGridEnabled, userId)=>{
        const result = await sqlRequest()
            .input('name', name)
            .input('address', address)
            .input('maxCapacity', maxCapacity)
            .input('timeslotsEnabled', timeslotsEnabled)
            .input('sharingEnabled', sharingEnabled)
            .input('temporaryOnlyEnabled', temporaryOnlyEnabled)
            .input('visitorSpotsEnabled', visitorSpotsEnabled)
            .input('simplifiedGridEnabled', simplifiedGridEnabled)
            .input('userId', userId)
            .query(`
                    INSERT INTO ParkingLots(name, address, maxCapacity, timeslotsEnabled, sharingEnabled, temporaryOnlyEnabled, visitorSpotsEnabled, simplifiedGridEnabled, userId)
                    VALUES(@name, @address, @maxCapacity, @timeslotsEnabled, @sharingEnabled, @temporaryOnlyEnabled, @visitorSpotsEnabled, @simplifiedGridEnabled, @userId)
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
            .input('maxCapacity', newInfo.maxCapacity)
            .input('timeslotsEnabled', newInfo.timeslotsEnabled)
            .input('sharingEnabled', newInfo.sharingEnabled)
            .input('temporaryOnlyEnabled', newInfo.temporaryOnlyEnabled)
            .input('visitorSpotsEnabled', newInfo.visitorSpotsEnabled)
            .input('simplifiedGridEnabled', newInfo.simplifiedGridEnabled)
            .query(`
                    UPDATE ParkingLots
                    SET 
                        name = ISNULL(@name, name),
                        address = ISNULL(@address, address),
                        maxCapacity = ISNULL(@maxCapacity, maxCapacity),
                        timeslotsEnabled = ISNULL(@timeslotsEnabled, timeslotsEnabled),
                        sharingEnabled = ISNULL(@sharingEnabled, sharingEnabled),
                        temporaryOnlyEnabled = ISNULL(@temporaryOnlyEnabled, temporaryOnlyEnabled),
                        visitorSpotsEnabled = ISNULL(@visitorSpotsEnabled, visitorSpotsEnabled),
                        simplifiedGridEnabled = ISNULL(@simplifiedGridEnabled, simplifiedGridEnabled)
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
    }
}