const { sqlRequest } = require('../../db.js');

module.exports = {
    add: async (token, email, parkingLotId, expiresAt) => {
        const result = await sqlRequest()
            .input('token', token)
            .input('email', email)
            .input('parkingLotId', parkingLotId)
            .input('expiresAt', expiresAt)
            .query(`
                    INSERT INTO InvitationTokens(token, email, parkingLotId, expiresAt, used)
                    VALUES(@token, @email, @parkingLotId, @expiresAt, 0)
                    SELECT SCOPE_IDENTITY() AS InvitationTokenId
                `)
            const invitationTokenId = result.recordset[0].InvitationTokenId;
            return invitationTokenId;
    },

    update: async(newInfo) => {
        const result = await sqlRequest()
            .input('id', newInfo.id)
            .input('token', newInfo.token)
            .input('email', newInfo.email)
            .input('parkingLotId', newInfo.parkingLotId)
            .input('expiresAt', newInfo.expiresAt)
            .input('used', newInfo.used)
            .query(`
                    UPDATE InvitationTokens
                    SET
                        token = ISNULL(@token, token),
                        email = ISNULL(@email, email),
                        parkingLotId = ISNULL(@parkingLotId, parkingLotId),
                        expiresAt = ISNULL(@expiresAt, expiresAt),
                        used = ISNULL(@used, used)
                    WHERE id = @id    
                `);
        if(result.rowsAffected[0] === 0){
            return null;
        }

        const selectresult = await sqlRequest()
            .input('id', newInfo.id)
            .query(`
                    SELECT 
                        it.id,
                        it.token,
                        it.email,
                        it.parkingLotid,
                        it.expiresAt,
                        it.used
                    FROM InvitationTokens it
                    WHERE it.id = @id
                `);
        return selectresult.recordset[0];
    },

    validateToken: async (token) => {
        const selectResult = await sqlRequest()
            .input('token', token)
            .query(`
                    SELECT
                        it.id,
                        it.email,
                        it.parkingLotId
                    FROM InvitationTokens it
                    WHERE it.token = @token            
                `);
        return selectResult.recordset[0];
    },

    getPending: async (parkingLotId) => {
        const selectResult = await sqlRequest()
            .input('parkingLotId', parkingLotId)
            .query(`
                    SELECT
                        it.id,
                        it.email,
                        it.parkingLotId
                        FROM InvitationTokens it
                        WHERE it.parkingLotId = @parkingLotId
                `);
        return selectResult.recordset;
    },

    deleteInvitation: async (id) => {
        const result = await sqlRequest()
            .input('id', id)
            .query(`
                    DELETE FROM InvitationTokens
                    WHERE id = @id
                `);
        return result.rowsAffected[0] > 0;
    }
}