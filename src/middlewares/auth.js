const jsonwebtoken = require('jsonwebtoken');

const validateAuthorizedUser = (req,res,next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).send("Unauthorized! Please login.");
        }
        const user = jsonwebtoken.verify(token, "djerhfuhrfugfugrfghrf");
        if(!user){
            return res.status(401).send("Unauthorized please login.");
        }
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).send("Invalid or expired token. Please login again.");
    }
}

module.exports = {validateAuthorizedUser};