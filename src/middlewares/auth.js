const jsonwebtoken = require('jsonwebtoken');
const crypto = require('crypto');

const validateAuthorizedUser = (req,res,next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).send("Unauthorized! Please login.");
        }
        const user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        if(!user){
            return res.status(401).send("Unauthorized please login.");
        }
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).send("Invalid or expired token. Please login again.");
    }
}

const validateResetToken = (req, res, next) => {
    try {
        const tokenFromCookie = req.cookies.resetPasswordJwt;
        
        if (!tokenFromCookie) {
            return res.status(401).json({ message: "Reset token missing" });
        }

        // Verify JWT and extract resetToken
        const decoded = jsonwebtoken.verify(tokenFromCookie, process.env.JWT_SECRET);
        const plainResetToken = decoded.resetToken;
    
        // Hash it to compare with DB
        const hashedToken = crypto.createHash("sha256").update(plainResetToken).digest("hex");
        // req.newPaswword = newPassword;
        req.hashedToken = hashedToken;
        next();

    } catch (err) {
        return res.status(401).send("Invalid or expired token: " + err.message);
    }
}

module.exports = {validateAuthorizedUser, validateResetToken};