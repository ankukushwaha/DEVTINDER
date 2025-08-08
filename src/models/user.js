const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName:{
        type: String,
        minLength: 3,
        maxLength: 50
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Invalid email format: " + val);
            }
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        validate(val){
            if(!validator.isStrongPassword(val)){
                throw new Error("Password must be strong! " + val);
            }
        }
    },
    age:{
        type: Number,
        min: 10
    },
    gender:{
        type: String,
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: '{VALUE} is not a valid gender type!'
        }
    },
    imageUrl:{
        type:String,
        default: "https://www.w3schools.com/howto/img_avatar.png",
        validate(val){
            if(!validator.isURL(val)){
                throw new Error("Invalid URL format: " + val);
            }
        }
    },
    skills:{
        type: [String],
        default:["JavaScript", "React", "Node.js"]
    }
}, {timestamps: true});

userSchema.methods.getJWT = async function(){
    const token = await jwt.sign({email: this.email, id:this._id},
        "djerhfuhrfugfugrfghrf", {expiresIn: "1h"});

    if(!token){
        throw new Error("Error generating JWT token!");
    }

    return token;
}

userSchema.methods.comparePassword = async function(passwordInputByUser){
    if(!passwordInputByUser){
        throw new Error("Password is required!");
    }
    const isMatch = await bcrypt.compare(passwordInputByUser, this.password);
    if(!isMatch){
        throw new Error("Invalid Credentials!");
    }
    return isMatch;
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;