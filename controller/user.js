const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//To verify the variable
function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

//Siging up a user
const signup = async (req, res) => {
    try 
    {
        const{name, email, password} = req.body;

        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: "Bad parameters. Something is missing"});
        }

        //Rejecting if the user already exist in the database
        const existing  = await User.findOne({ where: { email: email } });
        if(existing){
            return res.status(201).json({message: "User already exist please login"});
        }

        //Protecting the password stored in the database
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async(err, hash) => {
            await User.create({name, email, password: hash});
            res.status(201).json({message: 'Successfully created new User'});
        })
    } 
    catch (error) {
        res.status(500).json({message: error, success: false});
    }
}

//Creating a Jason Web Token
function generateAccessToken(id, name){
    return jwt.sign({userId: id, name: name}, process.env.TOKEN_SECRET);
}

//Sining in a user
const signin = async (req, res) => {
    try 
    {
        const {email, password} = req.body;
        if(isstringinvalid(email) || isstringinvalid(password))
        {
            return res.status(400).json({message: 'Email id or password is missing', success: false});
        }
        const user = await User.findOne({ where : { email }})
        if(user){
            bcrypt.compare(password, user.password, (err, result) => {
                if(err){
                    throw new Error('Something went wrong')
                }
                if(result){
                    return res.status(201).json({success: true, message: "User logged in successfully", token: generateAccessToken(user.id, user.name), name: user.name})
                }
                else{
                    return  res.status(400).json({message: 'Password is incorrect', success: false});
                }
            })
        }
        else{
            return  res.status(404).json({message: 'User does not exist', success: false});
        }
    } 
    catch (error) {
        res.status(500).json({message: error, success: false});
    }
}

//If user already sigined in skiping the signin
const issignin = async (req, res) => {
    try 
    {
        return res.status(201).json({success: true, message: 'User as already singed in'});
    } 
    catch (error) {
        res.status(500).json({message: error, success: false});
    }
}

//To export the functions
module.exports = {
    signup,
    signin,
    issignin
}
