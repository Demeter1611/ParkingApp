const Router = require('koa-router');
const mainRouter = new Router();

const { router: userRouter } = require('./user.js')
const { router: parkingLotRouter} = require('./parking-lot.js');

mainRouter.use(userRouter.routes());
mainRouter.use(parkingLotRouter.routes());

module.exports = {
    mainRouter
}