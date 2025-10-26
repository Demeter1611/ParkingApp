const { sqlRequest } = require('../../db.js');

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
    }
}