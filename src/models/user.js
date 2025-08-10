const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    resetPasswordToken: String,
    resetPasswordExpire: Date,
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

userSchema.methods.getJWT = function(){
    const token = jwt.sign({email: this.email, id:this._id},
        process.env.JWT_SECRET, {expiresIn: "1h"});

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

userSchema.methods.generateTokenForForgotPassword = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordToken = hashedToken;
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await this.save();
    return resetToken;
}

// userModel.js
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


const userModel = mongoose.model('User', userSchema);
module.exports = userModel;