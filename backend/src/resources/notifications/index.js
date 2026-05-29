const { sqlRequest } = require('../../db.js');

const NOTIFICATION_FIELDS = `
        n.id,
        n.title,
        n.message,
        n.userId,
        n.type,
        n.createdAt,
        n.isRead
        `;

module.exports = {
    add: async (userId, title, message, type ='info') => {
        const result = await sqlRequest()
            .input('userId', userId)
            .input('title', title)
            .input('message', message)
            .input('type', type)
            .query(`
                INSERT INTO notifications (userId, title, message, type)
                VALUES (@userId, @title, @message, @type);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    },

    getUserNotifications: async (userId) => {
        const result = await sqlRequest()
            .input('userId', userId)
            .query(`
                SELECT ${NOTIFICATION_FIELDS}
                FROM notifications n
                WHERE n.userId = @userId
                ORDER BY n.createdAt DESC
            `);
        return result.recordset;
    },

    markAsRead: async (notificationId) => {
        const result = await sqlRequest()
            .input('notificationId', notificationId)
            .query(`
                UPDATE notifications
                SET isRead = 1
                WHERE id = @notificationId
            `);
        return result.rowsAffected[0] > 0;
    },

    markAllAsRead: async (userId) => {
        const result = await sqlRequest()
            .input('userId', userId)
            .query(`
                UPDATE notifications
                SET isRead = 1
                WHERE userId = @userId
            `);
        return result.rowsAffected[0] > 0;
    }
}