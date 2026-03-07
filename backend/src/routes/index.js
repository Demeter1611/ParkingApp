const Router = require('koa-router');
const mainRouter = new Router();

const { router: userRouter } = require('./user.js')
const { router: parkingLotRouter} = require('./parking-lot.js');
const { router: parkingSpotRouter} = require('./parking-spot.js');
const { router: reservationRouter } = require('./reservations.js');
const { router: invitationTokenRouter} = require('./invitation-token.js');
const { router: reservationRequestRouter } = require('./reservation-request.js');

mainRouter.use(userRouter.routes());
mainRouter.use(parkingLotRouter.routes());
mainRouter.use(parkingSpotRouter.routes());
mainRouter.use(reservationRouter.routes());
mainRouter.use(invitationTokenRouter.routes());
mainRouter.use(reservationRequestRouter.routes());


module.exports = {
    mainRouter
}