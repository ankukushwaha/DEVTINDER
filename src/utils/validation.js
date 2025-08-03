const validator = require('validator')

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

module.exports = {validateSignup};