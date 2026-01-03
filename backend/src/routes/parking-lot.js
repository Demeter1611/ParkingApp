const Router = require('koa-router');
const router = new Router({
    prefix: '/parking-lot'
});

const parkingLotAPI = require('../resources/parking-lot');
const parkingSpotAPI = require('../resources/parking-spot');
const ReservationAPI = require('../resources/reservations');
const { verifyLogin, roleChecker, ROLE_LIST } = require('../middlewares/auth-middleware');

async function getAllSpotsWithStatus(parkingLotId, targetDate){
    const spots = await ReservationAPI.getOccupancyStatus(parkingLotId, targetDate);
    
    const mappedSpots = spots.map(spot => {
        let status = 'available';

        if(spot.ownerId){
            if(spot.windowId){
                status = spot.occupantId ? 'occupied' : 'available';
            }
            else{
                status = 'locked';
            }
        } else {
            status = spot.occupantId ? 'occupied' : 'available';
        }

        return {
            ...spot,
            status: status
        }
    })

    return mappedSpots;
}

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

router.get('/:id', async(ctx, next) => {
    const userId = ctx.params.id;
    const parkingLots = await parkingLotAPI.getByUserId(userId);
    ctx.response.status = 200;
    ctx.response.body = parkingLots;
})

router.patch('/:id', verifyLogin, roleChecker([ROLE_LIST.parking]), async(ctx, next) => {
    const parkingLotId = ctx.params.id;

    const updatedEntity = await parkingLotAPI.update({
        id: parkingLotId,
        ...ctx.request.body
    })

    if(!updatedEntity) {
        throw {status: 404, message: { error: 'Parking lot not found' }};
    }
    
    ctx.response.status = 200;
    ctx.response.body = updatedEntity;
})

router.delete('/:id', verifyLogin, roleChecker([ROLE_LIST.parking]), async(ctx, next) => {
    const parkingLotId = ctx.params.id;
    const deleteResult = await parkingLotAPI.delete(parkingLotId);

    if(!deleteResult){
        throw {status: 404, message: { error: 'Parking lot not found' }};
    }

    ctx.response.status = 200;
    ctx.response.body = {message: 'Parking lot has been deleted'};
})

router.get('/:id/spots', async(ctx, next) => {
    const parkingLotId = ctx.params.id;
    const parkingSpots = await parkingSpotAPI.getByParkingLotId(parkingLotId);
    ctx.response.status = 200;
    ctx.response.body = parkingSpots;
})

router.get('/:id/spots-with-status', async(ctx, next) => {
    const parkingLotId = ctx.params.id;
    const { targetDate } = ctx.query;

    const spots = await getAllSpotsWithStatus(parkingLotId, targetDate);

    ctx.response.status = 200;
    ctx.response.body = spots;
})

router.post('/:id/give-access/:userId', async(ctx, next) => {
    const parkingLotId = ctx.params.id;
    const userId = ctx.params.userId;
    
    if(!userId){
        throw { status: 400, message: { error: 'All fields are required' }};
    }

    try{
        const userParkingAccessId = await parkingLotAPI.addUserParkingAccess(parkingLotId, userId);

        ctx.response.status = 201;
        ctx.response.body = {
            ...userParkingAccessId
        };
    } catch (err) {
        throw { status: 400, message: { error: 'Invalid field types' }};
    }
})

router.delete('/:id/revoke-access/:userId', async(ctx, next) => {
    const parkingLotId = ctx.params.id;
    const userId = ctx.params.userId;
    const deleteResult = await parkingLotAPI.deleteUserParkingAccess(parkingLotId, userId);

    if(!deleteResult){
        throw { status: 404, message: { error: 'User does not have access to parking lot' }};
    }

    ctx.response.status = 200;
    ctx.response.body = {message: 'User access revoked'};
})

router.get('/:id/users-with-access', async(ctx, next) => {
    const parkingLotId = ctx.params.id;
    const users = await parkingLotAPI.getAllUsersWithAccess(parkingLotId);

    ctx.response.status = 200;
    ctx.response.body = users;
})

module.exports = {
    router
}