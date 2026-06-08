const Router = require('koa-router');
const router = new Router({
    prefix: '/user'
});

const userAPI = require('../resources/user');
const jwt = require('../../jwt/helpFunctions');
const { verifyLogin } = require('../middlewares/auth-middleware');
const invitationTokenAPI = require('../resources/invitation-token');
const parkingLotAPI = require('../resources/parking-lot');

function isEmailValid(email){
    splittedEmail = email.split('@');
    if(splittedEmail.length != 2 || splittedEmail[0].length <= 0 || splittedEmail[1].length <= 0){
        return false;
    }
    return true;
}

function isPasswordValid(password){
    if(password.length < 8 ){
        return false;
    }
    for(character of password){
        if(!isNaN(parseInt(character))){
            return true;
        }
    }
    return false;
}

function isUsernameValid(username){
    if(username.length < 5){
        return false;
    }
    return true;
}

function isRoleValid(role){
    const roleList = ['user', 'parking'];
    return roleList.includes(role);
}

router.post('/login', async (ctx, next) => {
    const { email, password, inviteToken } = ctx.request.body;
    const user = await userAPI.getByMail(email);
    
    if(!user || !(await bcrypt.compare(password, user.password))){
        throw {status: 401, message: { error: 'Invalid user!' }};
    }
    
    const newUser = userSearchResponse[0];

    if(inviteToken){
        try{
            const invitationData = await invitationTokenAPI.validateToken(inviteToken);
            if(invitationData.email !== email){
                console.error("Email mismatch");
            } else {
                await parkingLotAPI.addUserParkingAccess(invitationData.parkingLotId, newUser.id);
                await invitationTokenAPI.update({id: invitationData.id, used: true});
            }
        } catch(err){
            console.error('Invitation failed: ', err);
        }
    }

    ctx.set("Access-Control-Expose-Headers", "Authorization");
    ctx.set("Authorization", jwt.createToken(newUser.id));
    ctx.response.body = {
        id: newUser.id, resourceType: 'User', email: email, role: {
            id: newUser.roleId,
            display: newUser.name
        }
    };
    ctx.response.status = 200;
})

router.post('/register', async (ctx, next) => {
    const { password, email, username, carplate, role, inviteToken } = ctx.request.body;

    if(!isEmailValid(email)){
        throw {status: 400, message: { error: 'Invalid email!' }};
    }

    if(!isPasswordValid(password)){
        throw {status: 400, message: { error: 'Invalid password!' }};
    }

    if(!isUsernameValid(username)){
        throw {status: 400, message: { error: 'Invalid role!' }};
    }

    if(!isRoleValid(role)){
        throw {status: 400, message: { error: 'Invalid role!' }};
    }

    if(await userAPI.mailExists(email)){
        throw {status: 400, message: { error: 'Mail already exists!' }};
    }

    const userAddResponse = await userAPI.add(password, email, username, carplate, role);
    if(userAddResponse.length == 0){
        throw {status: 401, message: { error: 'Invalid credentials!' }};
    }

    const newUser = userAddResponse[0];

    if(inviteToken){
        try{
            const invitationData = await invitationTokenAPI.validateToken(inviteToken);
            if(invitationData.email !== email){
                console.error("Email mismatch");
            } else {
                await parkingLotAPI.addUserParkingAccess(invitationData.parkingLotId, newUser.id);
                await invitationTokenAPI.update({id: invitationData.id, used: true});
            }
        } catch(err){
            console.error('Invitation failed: ', err);
        }
    }

    ctx.set("Access-Control-Expose-Headers", "Authorization");
    ctx.set("Authorization", jwt.createToken(newUser.id));
    ctx.response.status = 200;
    ctx.response.body = {
        id: newUser.id, resourceType: 'User', email: email, username: username, role: {
            id: newUser.roleId,
            display: newUser.name
        }
    };
})

router.patch('/:id', verifyLogin, async(ctx, next) => {
    try{
        const updatedUser = await userAPI.update({...ctx.request.body, id: ctx.params.id});
        ctx.response.status = 200;
        ctx.response.body = updatedUser;
    } catch(err){
        throw { status: 400, message: { error: 'Request failed' }};
    }
})

router.get('/search-suggestions', verifyLogin, roleCheck(['admin']), async(ctx, next) => {
    const { searchTerm, parkingLotId} = ctx.query;
    try{
        const searchResult = await userAPI.getSearchSuggestions(searchTerm, parkingLotId);
        ctx.response.status = 200;
        ctx.response.body = searchResult;
    } catch(err){
        throw { status: 400, message: { erorr: 'Request failed' }};
    }
})

module.exports = {
    router
}