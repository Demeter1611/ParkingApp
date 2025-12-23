const Router = require('koa-router');
const mainRouter = new Router();

const { router: userRouter } = require('./user.js')
const { router: parkingLotRouter} = require('./parking-lot.js');
const { router: parkingSpotRouter} = require('./parking-spot.js');


mainRouter.use(userRouter.routes());
mainRouter.use(parkingLotRouter.routes());
mainRouter.use(parkingSpotRouter.routes());


module.exports = {
    mainRouter
}