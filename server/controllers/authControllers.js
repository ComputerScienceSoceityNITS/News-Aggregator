const jwt = require("jsonwebtoken")
const {User} = require("../models/UserModel.js")
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt")

const token =(userid)=>{ return jwt.sign({userid}, process.env.SECRET, {
        expiresIn:30*24*60*60*1000    //30days
    })
}

exports.signup = async (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;

    if (!username || !email || !password || !passwordConfirm) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    if (password !== passwordConfirm) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists, please log in!" });
    }

    const newUser = await User.create({ username, email, password }); 

    const authToken = token(newUser._id);
    res.cookie("BearerToken", authToken, {
        httpOnly: true,
        sameSite: "Lax", 
        secure: false    
      });
      

    return res.status(201).json({
        message: "User Created Successfully",
        data: {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    });
};


exports.authMiddleware = async (req,res, next)=>{
    
    const token = req.cookie.BearerToken;
    try{
        const decoded = await jwt.verify(token, process.env.SECRET);
        req.userid = decoded.userid;                                    

        next()
    }catch(err){
        res.status(401).json({
            message:"Invalid Token"
        })
    }
}


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide a valid email and password."
            });
        }

        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(400).json({
                message: "User not found. Please sign up first."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password. Please try again."
            });
        }

        const authToken = token(user._id);
        
        res.cookie("BearerToken", authToken) //yaha pe naya BearerToken cookie ka value update hora hai
        res.status(200).json({
            message: "You have successfully logged in."
        });

    } catch (err) {
        next(err); 
    }
};
