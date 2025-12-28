const Router = require('koa-router');
const router = new Router({
    prefix: '/parking-spot'
});

const parkingSpotAPI = require('../resources/parking-spot');
const { verifyLogin, roleChecker, ROLE_LIST } = require('../middlewares/auth-middleware');

router.post('/', verifyLogin, roleChecker([ROLE_LIST.parking]), async(ctx, next) => {
    const { name, parkingLotId } = ctx.request.body;
    if(!name || !parkingLotId ){
        throw { status: 400, message: { error: 'All fields are required ' }};
    }

    try{
        const parkingSpotId = await parkingSpotAPI.add(name, parkingLotId);

        ctx.response.status = 201;
        ctx.response.body = {
            ...ctx.request.body,
            id: parkingSpotId
        };
    } catch (err) {
        throw { status: 400, message: { error: 'Invalid field types' }};
    }
})

router.get('/:id', async(ctx, next) => {
    const parkingLotId = ctx.params.id;
    const parkingSpots = await parkingSpotAPI.getByParkingLotId(parkingLotId);
    ctx.response.status = 200;
    ctx.response.body = parkingSpots;
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

module.exports = {
    router
}