const jwt = require('jsonwebtoken');
const { JWT_SECRET: jwtSEC } = require('../config/jwtConfig');

const checkLogin = async  (req,res,next) => {
// checking header
let authHeader = req.header('Authorization')

if (!authHeader) {
    return res.status (400).send({ message: "Token is missing." })
    }
// verify Token
const token = req.headers.authorization.split(' ')[1];
jwt.verify(token,jwtSEC, function(err, decoded) {
    // Bug fix: this used to send the 401 and then call next() anyway, letting
    // the request continue into the route handler with an invalid/absent token.
    if(err) return res.status(401).send({message:'Session Expired, please login again'})
    req.body.userData = decoded;
    next();
})

}

const checkCoordinatorLogin = async  (req,res,next) => {
    // checking header
    let authHeader = req.header('Authorization')

    if (!authHeader) {
        return res.status (400).send({ message: "Token is missing." })
        }
    // verify Token
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token,jwtSEC, function(err, decoded) {
        if(err) return res.status(401).send({message:'Session Expired, please login again'})
        req.body.userData = decoded;
        next();
    })

    }

module.exports = {checkLogin,checkCoordinatorLogin}