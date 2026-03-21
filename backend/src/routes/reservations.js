const Router = require('koa-router');
const router = new Router({
    prefix: '/reservation'
});

const reservationAPI = require('../resources/reservations');
const { verifyLogin, roleChecker, ROLE_LIST } = require('../middlewares/auth-middleware');

router.post('/', verifyLogin, async(ctx, next) => {
    const { spotId, userId, startDate, endDate } = ctx.request.body;
    if(!spotId || !userId || !startDate || !endDate){
        throw { status: 400, message: { error: 'All fields are required' }};
    }

    const isAvailable = await reservationAPI.checkAvailability(spotId, startDate, endDate);
    if(!isAvailable){
        throw { status:  400, message: { error: 'Parking spot unavailable' }};
    }

    try{
        const reservationId = await reservationAPI.addReservation(spotId, userId, startDate, endDate);
        ctx.response.status = 201;
        ctx.response.body = {
            id: reservationId,
            ...ctx.request.body
        }
    } catch (err) {
        throw { status: 400, message: { error: 'Invalid field types' }};
    }
})

router.delete('/:id', verifyLogin, async(ctx, next) => {
    const reservationId = ctx.params.id;

    try{
        const deleteResult = await reservationAPI.deleteReservation(reservationId);
        if(!deleteResult) {
            throw { status: 404, message: { error: 'Reservation not found' }};
        };

        ctx.response.status = 200;
        ctx.response.body = { message: 'Reservation successfuly deleted' };
    } catch (err){
        throw { status: 400, message: { error: 'Request failed' }};
    }
})


module.exports = {
    router
}