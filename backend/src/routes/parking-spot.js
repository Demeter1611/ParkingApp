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
    
    const { startDate, endDate } = ctx.request.body;
    if(!startDate || !endDate) {
        throw { status: 400, message: { error: 'All fields are required' } };
    }

    try{
        const availabilityWindowId = reservationAPI.addAvailabilityWindow(spotId, startDate, endDate);

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

router.delete('/:id/reclaim/:windowid', async(ctx, next) => {
    const spotId = ctx.params.id;
    const windowId = ctx.params.windowid;
    
    const availabilityWindow = await reservationAPI.getAvailabilityWindowById(windowId);
    const { startDate, endDate, userId } = availabilityWindow;
    console.log(startDate, 'enddate: ', endDate);
    
    try{
        const deleteResult = await reservationAPI.deleteAvailabilityWindow(windowId);
        
        const conflictingReservations = await reservationAPI.getReservationByDate(spotId, startDate, endDate);
        console.log(conflictingReservations);

        await Promise.all(conflictingReservations.map(res => {
            reservationAPI.addAvailabilityWindow(spotId, res.startDate, res.endDate)
        }));

        ctx.response.status = 200;
        ctx.response.body = {message: 'Availability window successfully deleted'};
    } catch(err){
        throw { status: 400, message: { error: 'Request failed' }};
    }
    
})
/**
 * functie de reclaim
 * --------se sterg toate rezervarile?  !nu e bine
 * --------se termina availabilityWindow la ultima rezervare din window? !tot nu
 * --------utilizatorul poate crea mai multe window-uri
 * --------ce se intapmla daca locul e rezervat in prima zi a windowului si in ultima si owner-ul vrea sa isi reia locul,
 * --------cea mai buna solutie: stergi windowul initial si creezi fragmente care sa acopere doar datele in care locul e rezervat
 * merge la windowurile ce is unu dupa altu
 * ce se intampla daca mai apoi utilizatorul ce a rezervat locul renunta pentru cel ce detine parcarea?
 */

module.exports = {
    router
}