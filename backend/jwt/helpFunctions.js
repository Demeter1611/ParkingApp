const jwt = require("jsonwebtoken");
const secret = 'supersecret';

function createToken(id){
    const token = jwt.sign(
        {userId: id},
        secret, { expiresIn: 3600 }
    );
    return token;
}
function createToken(id){ 
    return jwt.sign({userId: id}, secret, { expiresIn: 3600 }); 
}

function decodeToken(token){
    return jwt.verify(token, secret);
}

module.exports={
    createToken,
    decodeToken
}