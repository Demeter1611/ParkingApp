const Router = require('koa-router');

const router = new Router({
    prefix: '/notifications'
});

const notificationAPI = require('../resources/notifications');
const { verifyLogin } = require('../middlewares/auth-middleware');

router.get('/', verifyLogin, async(ctx, next) => {
    const userId = ctx.user.id;
    const notifications = await notificationAPI.getUserNotifications(userId);
    ctx.response.status = 200;
    ctx.response.body = notifications;
});

router.patch('/:id/read', verifyLogin, async(ctx, next) => {
    const notificationId = ctx.params.id;
    await notificationAPI.markAsRead(notificationId);
    ctx.response.status = 200;
    ctx.response.body = { message: 'Notification marked as read' };
});

router.patch('/read-all', verifyLogin, async(ctx, next) => {
    const userId = ctx.user.id;
    await notificationAPI.markAllAsRead(userId);
    ctx.response.status = 200;
    ctx.response.body = { message: 'All notifications marked as read' };
});

module.exports = {
    router
};