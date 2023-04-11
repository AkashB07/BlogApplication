const jwt = require('jsonwebtoken');
const User = require('../model/user');

//Athenticating or verifiying the user
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const userV = jwt.verify(token, 'securityKey522wsrhrrh5fa2fddrsh');
        const user = await User.findByPk(userV.userId)
        req.user = user;
        next();
    } 
    catch (err) {
        return res.status(401).json({success: false});
    }
}

//To export the functions
module.exports = {
    authenticate
}