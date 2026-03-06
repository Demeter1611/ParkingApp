const Router = require('koa-router');
const crypto = require('crypto');
const { sendInvitationEmail } = require('../email-service');

const router = new Router({
    prefix: '/invitation-token'
});


const invitationTokenAPI = require('../resources/invitation-token');
const userAPI = require('../resources/user');
const { verifyLogin, roleChecker, ROLE_LIST } = require('../middlewares/auth-middleware');


const EXPIRES_IN_DAYS = 2;

router.post('/', verifyLogin, roleChecker([ROLE_LIST.parking]), async(ctx, next) => {
    const {email, parkingLotId} = ctx.request.body;
    if(!email, !parkingLotId) {
        throw { status: 400, message: { error: 'All fields are required' }};
    };

    const token = crypto.randomBytes(32).toString('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + EXPIRES_IN_DAYS);


    try{
        const invitationTokenId = await invitationTokenAPI.add(token, email, parkingLotId, expiresAt);
        const inviteLink = `http://localhost:4200/auth?mode=employee&invite-token=${token}`;
        await sendInvitationEmail(email, inviteLink);
        
        ctx.response.status = 201;
        ctx.response.body = {
            id: invitationTokenId,
            email,
            parkingLotId,
            token,
            expiresAt
        };
    } catch(err) {
        throw { status: 400, message: { error: err }};
    }
});

router.get('/validate/:token', async(ctx, next) => {
    const token = ctx.params.token;
    const registrationData = await invitationTokenAPI.validateToken(token);
    const isRegistered = await userAPI.mailExists(registrationData.email);
    ctx.response.status = 200;
    ctx.response.body = {
        ...registrationData,
        isRegistered: isRegistered
    };
})

router.get('/:id/pending', async(ctx, next) => {
    const parkingLotId = ctx.params.id;
    const pendingInvites = await invitationTokenAPI.getPending(parkingLotId);
    ctx.response.status = 200;
    ctx.response.body = pendingInvites;
})

router.delete('/:id', verifyLogin, async(ctx, next) => {
    const invitationId = ctx.params.id;
    try{
        const deleteResult = await invitationTokenAPI.deleteInvitation(invitationId);
        if(!deleteResult) {
            throw { status: 404, message: { error: 'Invitation not found' }};
        };
        ctx.response.status = 200;
        ctx.response.body = { message: 'Invitation successfully deleted'};
    } catch(err) {
        throw { status: 400, message: { error: 'Request failed' }};
    }
})

module.exports = {
    router
}