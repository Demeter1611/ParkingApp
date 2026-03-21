const Router = require('koa-router');

const router = new Router({
    prefix: '/reservation-request'
});

const reservationRequestAPI = require('../resources/reservation-request');
const reservationAPI = require('../resources/reservations');
const { verifyLogin, roleChecker, ROLE_LIST } = require('../middlewares/auth-middleware');

router.post('/', verifyLogin, roleChecker([ROLE_LIST.user]), async(ctx, next) => {
    const userId = ctx.user.id;
    const { parkingLotId, reason, requestedDate} = ctx.request.body;
    if(!userId, !reason, !requestedDate) {
        throw { status: 400, message: { error: 'All fields are required' }};
    };

    const dateOfRequest = new Date();
    try{
        const reservationRequestId = await reservationRequestAPI.add(userId, parkingLotId, reason, requestedDate, dateOfRequest);
        ctx.response.status = 201;
        ctx.response.body = {
            id: reservationRequestId,
            ...ctx.request.body,
            requestedDate
        };
    } catch(err) {
        throw { status: 400, message: { error: err } }
    };
});

router.post('/:id/fulfill', verifyLogin, roleChecker([ROLE_LIST.user]), async(ctx, next) => {
    const reservationRequestId = ctx.params.id;
    const { spotId } = ctx.request.body;
    if(!spotId){
        throw { status: 400, message: { error: 'SpotId required' } };
    }
    //verifica daca ctx.user are acces la spotId

    try{
        const reservationRequest = await reservationRequestAPI.getById(reservationRequestId);
        if(!reservationRequest || reservationRequest.status !== 'pending'){
            throw { status: 400, message: { error: 'Request is no longer available' } };
        }

        const { userId, requestedDate } = reservationRequest;

        const reservationDate = new Date(requestedDate).toISOString().split('T')[0];

        const reservation = await reservationAPI.addReservation(spotId, userId, reservationDate, reservationDate);
        
        await reservationRequestAPI.update({id: reservationRequestId, status: 'fulfilled'});
        ctx.response.status = 201;
        ctx.response.body = reservation;
    } catch(err){
        throw { status: 400, message: { error: err } };
    };
});

router.get('/', async(ctx, next) => {
    const {parkingLotId, requestedDate, status} = ctx.request.query;
    if(!parkingLotId){
        throw { status: 400, message: { error: 'ParkingLotId required'}};
    };
    const reservationRequests = await reservationRequestAPI.search({parkingLotId, requestedDate, status});
    ctx.response.status = 200;
    ctx.response.body = reservationRequests
});

module.exports = {
    router
}