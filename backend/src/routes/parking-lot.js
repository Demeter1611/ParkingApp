const Router = require('koa-router')
const router = new Router({
    prefix: '/parking-lot'
})

const parkingLotAPI = require('../resources/parking-lot');
const { verifyLogin, roleChecker, ROLE_LIST } = require('../middlewares/auth-middleware');

router.post('/', verifyLogin, roleChecker([ROLE_LIST.parking]), async(ctx, next) => {
    const { name, address, maxCapacity, timeslotsEnabled, sharingEnabled, temporaryOnlyEnabled, visitorSpotsEnabled, simplifiedGridEnabled} = ctx.request.body;
    if(!name || !address || !maxCapacity){
        throw { status: 400, message: { error: 'All fields are required' }};
    }
    const user = ctx.user;
    const userId = user.id;

    try{
        const parkingLotId = await parkingLotAPI.add(name, address, maxCapacity, timeslotsEnabled, sharingEnabled, temporaryOnlyEnabled, visitorSpotsEnabled, simplifiedGridEnabled, userId);

        ctx.response.status = 201;
        ctx.response.body = {
            ...ctx.request.body,
            id: parkingLotId
        };
    } catch (err) {
        throw {status: 400, message: { error: 'Invalid field types' }};
    }
})

module.exports = {
    router
}