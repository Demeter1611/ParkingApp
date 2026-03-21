const { sqlRequest } = require("../../db.js");
const sql = require('mssql');

const RESERVATION_REQUEST_FIELDS = `
    req.id,
    req.userId,
    req.parkingLotId,
    req.reason,
    req.requestedDate,
    req.dateOfRequest
`

module.exports = {
    add: async(userId, parkingLotId, reason, requestedDate, dateOfRequest) => {
        console.log(requestedDate, dateOfRequest);
        const result = await sqlRequest()
            .input('userId', userId)
            .input('parkingLotId', parkingLotId)
            .input('reason', reason)
            .input('requestedDate', requestedDate)
            .input('dateOfRequest', dateOfRequest)
            .query(`
                    INSERT INTO ReservationRequests(userId, parkingLotId, reason, requestedDate, dateOfRequest, statusId)
                    VALUES(
                        @userId,
                        @parkingLotId, 
                        @reason, 
                        @requestedDate,
                        @dateOfRequest,
                        (SELECT id FROM RequestStatuses WHERE statusName = 'pending')
                    );
                    SELECT SCOPE_IDENTITY() AS ReservationRequestId
                `);
        const reservationRequestId = result.recordset[0].ReservationRequestId;
        return reservationRequestId;
    },

    getById: async(id) => {
        const result = await sqlRequest()
            .input('id', id)
            .query(`
                    SELECT
                    ${RESERVATION_REQUEST_FIELDS},
                    u.username,
                    s.statusName AS status
                    FROM ReservationRequests req
                    INNER JOIN Users u ON req.userId=u.id
                    INNER JOIN RequestStatuses s
                        ON s.id=req.statusId WHERE req.id=@id
            `);
        return result.recordset[0];
    },

    update: async(newInfo) => {
        const result = await sqlRequest()
            .input('id', newInfo.id)
            .input('reason', newInfo.reason)
            .input('status', newInfo.status)
            .query(`
                    UPDATE ReservationRequests
                    SET
                        reason = ISNULL(@reason, reason),
                        statusId = ISNULL(
                        (SELECT id FROM RequestStatuses WHERE statusName = @status),
                        statusId
                        )
                    WHERE id = @id
                `);
        if(result.rowsAffected[0] === 0){
            return null;
        }
        return true;
    },

    search: async(searchQuery) => {
        const result = await sqlRequest()
            .input('parkingLotId', searchQuery.parkingLotId)
            .input('requestedDate', searchQuery.requestedDate)
            .input('status', searchQuery.status)
            .query(`
                    SELECT
                        ${RESERVATION_REQUEST_FIELDS},
                        u.username,
                        s.statusName AS status
                    FROM ReservationRequests req
                    INNER JOIN Users u ON req.userId=u.id
                    INNER JOIN RequestStatuses s ON s.id=req.statusId
                    WHERE
                    req.parkingLotId = @parkingLotId
                    AND (@requestedDate IS NULL OR req.requestedDate = @requestedDate)
                    AND (@status IS NULL OR s.statusName = @status)
                    ORDER BY req.dateOfRequest ASC
                `);
        return result.recordset;
    }
}