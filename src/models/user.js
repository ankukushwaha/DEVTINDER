const mongoose = require('mongoose');
const validator = require('validator');

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
        default: "https://www.w3schools.com/howto/img_avatar.png"
    },
    skills:{
        type: [String],
        default:["JavaScript", "React", "Node.js"]
    }
}, {timestamps: true});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;