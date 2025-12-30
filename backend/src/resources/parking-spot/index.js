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
}