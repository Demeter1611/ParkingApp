const Router = require('koa-router');
const router = new Router({
    prefix: '/parking-spot'
});

const parkingSpotAPI = require('../resources/parking-spot');
const reservationAPI = require('../resources/reservations');
const { verifyLogin, roleChecker, ROLE_LIST } = require('../middlewares/auth-middleware');

router.post('/', verifyLogin, roleChecker([ROLE_LIST.parking]), async(ctx, next) => {
    const { name, parkingLotId } = ctx.request.body;
    if(!name || !parkingLotId ){
        throw { status: 400, message: { error: 'All fields are required' }};
    }

    try{
        const parkingSpotId = await parkingSpotAPI.add(name, parkingLotId);

        ctx.response.status = 201;
        ctx.response.body = {
            id: parkingSpotId,
            ...ctx.request.body
        };
    } catch (err) {
        throw { status: 400, message: { error: 'Invalid field types' }};
    }
})


router.post('/bulk', verifyLogin, roleChecker([ROLE_LIST.parking]), async(ctx, next) => {
    /*
        request body format:
            parkingSpotGenerator: {
                pattern: @string
                
                where pattern can be:
                A$ - A is kept as a prefix and $ turns into the numbers from startRange to endRange
                $A - A is kept as a suffix and $ turns into the numbers from startRange to endRange

                startRange: @int
                endRange: @int
                padding: @int

            }
            parkingLotId: @int
    */
    const { parkingSpotGenerator, parkingLotId } = ctx.request.body;
    const { pattern, startRange, endRange, padding } = parkingSpotGenerator;
    
    if (startRange > endRange) {
        throw { status: 400, message: 'Start range must be smaller than end range.'};
    }

    const parkingSpots = [];

    for(let i = startRange; i <= endRange; i++){
        const numberPart = i.toString().padStart(padding, '0');
        const spotName = pattern.replace('$', numberPart);

        parkingSpots.push({
            name: spotName
        })
    }

    if( !parkingSpots || !parkingLotId ) {
        throw { status: 400, message: { error: 'All fields are required' }};
    }

    try{
        const spotsAdded = await parkingSpotAPI.addBulk(parkingSpots, parkingLotId);

        ctx.response.status = 200;
        ctx.response.body = { message: `Added ${spotsAdded} parking spots` };
    } catch (err) {
        throw { status: 400, message: { error: 'Request failed' }};
    }
})

router.post('/:id/allocate', verifyLogin, roleChecker([ROLE_LIST.parking]), async(ctx, next) => {
    //sterge tabela de allocate ca am modificat
    const spotId = ctx.params.id;
    const { userId } = ctx.request.body;
    if( !userId ){
        throw { status: 400, message: { error: 'All fields are required' }};
    }

    try{
        const allocationId = await reservationAPI.addAllocation(spotId, userId);

        ctx.response.status = 200;
        ctx.response.body = { id: allocationId, spotId, ...ctx.request.body}
    } catch(err) {
        throw { status: 400, message: { error: 'Request Failed' }};
    }
})

router.delete('/:id/deallocate', verifyLogin, roleChecker([ROLE_LIST.parking]), async(ctx, next) => {
    const spotId = ctx.params.id;
    
    try{
        const deleteResult = await reservationAPI.deleteAllocation(spotId);

        if(!deleteResult) {
            throw {status: 404, message: { error: 'Parking spot has not been previously allocated'}};
        }

        ctx.response.status = 200;
        ctx.response.body = {message: 'Parking spot successfully deallocated'};
    } catch (err){
        throw { status: 400, message: { error: 'Request failed' }};
    }
})

router.post('/:id/release', verifyLogin, async(ctx, next) => {
    //acopera cazul in care datele se suprapun, windowul ar trebui sa se extinda in cazul acesta
    //windowul trebuie sa fie neaparat in viitor
    const spotId = ctx.params.id;
    const userId = ctx.user.id;
    
    const { startDate, endDate } = ctx.request.body;
    if(!startDate || !endDate) {
        throw { status: 400, message: { error: 'All fields are required' } };
    }


    try{
        const availabilityWindowId = await reservationAPI.addAvailabilityWindow(spotId, userId, startDate, endDate);

        ctx.response.status = 200;
        ctx.response.body = {
            id: availabilityWindowId,
            spotId: spotId,
            ...ctx.request.body
        }
    } catch (err) {
        throw { status: 400, message: { error: 'Request failed' }};
    }
});

router.post('/:id/reclaim', verifyLogin, async(ctx, next) => {
    const ownerId = ctx.user.id;
    const spotId = ctx.params.id;
    const { startDate, endDate } = ctx.request.body;

    if(!startDate || !endDate) {
        throw { status: 400, message: { error: 'startDate and endDate required'}};
    }

    try{
        const overlappingWindows = await reservationAPI.getOverlappingAvailabilityWindows(spotId, startDate, endDate);

        const conflictingReservations = await reservationAPI.getReservationByDate(spotId, startDate, endDate);

        const reclaimStart = new Date(startDate);
        const reclaimEnd = new Date(endDate);

        for(const availabilityWindow of overlappingWindows) {
            await reservationAPI.deleteAvailabilityWindow(availabilityWindow.id);
            const windowStart = new Date(availabilityWindow.startDate);
            const windowEnd = new Date(availabilityWindow.endDate);

            if(windowStart < reclaimStart){
                const beforeEnd = new Date(reclaimStart);
                beforeEnd.setDate(beforeEnd.getDate() - 1);

                await reservationAPI.addAvailabilityWindow(spotId, ownerId, windowStart.toISOString().split('T')[0], beforeEnd.toISOString().split('T')[0]);
            };
            if(windowEnd > reclaimEnd) {
                const afterStart = new Date(reclaimEnd);
                afterStart.setDate(afterStart.getDate() + 1);

                await reservationAPI.addAvailabilityWindow(spotId, ownerId, afterStart.toISOString().split('T')[0], windowEnd.toISOString().split('T')[0]);
            };
        }
        for(const reservation of conflictingReservations) {
            await reservationAPI.addAvailabilityWindow(spotId, ownerId, reservation.startDate, reservation.endDate);
        }
        ctx.response.status = 200;
        ctx.response.body = { message: 'Spot successfully reclaimed'};
    } catch(err) {
        console.error(err);
        throw { status: 400, message: { error: 'Request failed' }};
    }
})

router.get('/mine', verifyLogin, roleChecker([ROLE_LIST.user]), async (ctx, next) => {
    const userId = ctx.user.id;
    const { targetDate } = ctx.request.query;
    if(!targetDate) {
        throw { status: 400, message: { error: 'Date required' }};
    };
    try{
        const spot = await parkingSpotAPI.getUserSpotForDate(userId, targetDate);
        ctx.response.status = 200;
        ctx.response.body = spot;
    } catch(err) {
        throw { status: 400, message: { error: 'Request failed' }};
    }
})

router.get('/month-data', verifyLogin, roleChecker([ROLE_LIST.user]), async(ctx, next) => {
    const userId = ctx.user.id;
    const {startOfMonth, endOfMonth} = ctx.request.query;
    if(!startOfMonth || !endOfMonth){
        throw { status: 400, message: { error: 'Date required' }};
    };
    try{
        const data = await parkingSpotAPI.getMonthData(userId, startOfMonth, endOfMonth);
        ctx.response.status = 200;
        ctx.response.body = data; 
    } catch(err){
        throw { status: 400, message: { error: err }};
    }
})

module.exports = {
    router
}