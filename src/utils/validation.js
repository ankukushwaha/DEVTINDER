const validator = require('validator');

const validateSignup = (req) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is compulsory!");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email id is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password!");
    }
}

const validateProfileEdit = (req) => {
    try{
        const data = req.body;
        const allowedChange = ['age', 'gender', 'imageUrl', 'skills'];
        const isAllowed = Object.keys(data).every((field) => {
            return allowedChange.includes(field);
        })

        if(!isAllowed){
            throw new Error("Invalid update fields!");
        }

        return isAllowed;
    }
    catch(err){
        console.log("Error in profile edit validation:", err.message);
    }
}

module.exports = {validateSignup, validateProfileEdit};