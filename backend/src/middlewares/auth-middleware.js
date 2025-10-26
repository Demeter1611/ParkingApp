const jwt = require('../../jwt/helpFunctions');
const userAPI = require('../resources/user');

ROLE_LIST = {
    'admin': 'admin',
    'parking': 'parking',
    'user': 'user'
}

async function verifyLogin(ctx, next) {
    const error = {status: 401, message: { error: 'User not found' }};
    let token = ctx.get('Authorization');
    if(!token) throw error;
    const { userId } = jwt.decodeToken(token);
    if(!userId) throw error;
    const user = await userAPI.getById(userId);
    if(!user) throw error;
    ctx.user = user;
    await next();
}


function roleChecker(allowedRoles) {
    return async (ctx, next) => {
        if(!ctx.user){
            throw {status: 401, message: {error: 'User not found'}};
        }
        const userRole = ctx.user.roleName;
        if(!allowedRoles.includes(userRole)){
            throw {status: 401, message: {error: 'Invalid role'}};
        }
        await next();
    }
}

module.exports = {
    ROLE_LIST,
    verifyLogin,
    roleChecker
}