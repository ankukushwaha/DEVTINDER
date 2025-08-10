const express = require('express');
const profileRouter = express.Router();
const {validateAuthorizedUser, validateResetToken} = require('../middlewares/auth');
const {validateProfileEdit} = require('../utils/validation');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

profileRouter.get("/profile/view", validateAuthorizedUser, (req, res) => {
    return res.send(req.user);
})

profileRouter.patch("/profile/edit", validateAuthorizedUser, async(req, res) => {
    try{
        validateProfileEdit(req);
        const dataToUpdate = req.body;
        const user = await userModel.findOneAndUpdate({_id: req.user.id}, dataToUpdate, {returnDocument: 'after', runValidators: true});
        if(!user){
            return res.status(404).send("User not found!");
        }
        else{
            return res.status(200).send("User updated successfully!");
        }
    }
    catch(err){
        res.status(500).send("Error updating profile: " + err.message);
    }
})

profileRouter.patch('/profile/forgotPassword' , async(req, res) => {
    try{
        const emailId = req.body.email;
        if(!emailId){
            throw new Error("Email Id is required!");
        }
        const user = await userModel.findOne({email: emailId});
        if(!user || user.length === 0){
            return res.send("If an account with this email exists, a password reset link has been sent. Click the link to reset your password.");
        } else{
            const resetToken = await user.generateTokenForForgotPassword();
            const resetJwt = jwt.sign({ resetToken }, process.env.JWT_SECRET, { expiresIn: "15m" });
            res.cookie("resetPasswordJwt", resetJwt, {expires: new Date(Date.now() + 15*60*1000)});
            return res.status(200).send("Password reset link sent to your email.");
        }
    }
    catch(err){
        res.status(500).send("Error in forgot password: " + err.message);
    }
})

profileRouter.patch('/profile/resetPassword', validateResetToken, async(req, res) => {
  try {
    const { newPassword } = req.body;

    // Find user with valid token and expiry
    const user = await userModel.findOne({
      resetPasswordToken: req.hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user || user.length === 0) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    // Update password 
    user.password = newPassword;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Clear the cookie
    res.clearCookie("resetPasswordJwt");

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(401).json({"Error" : err.message,  message: "Invalid or expired token" });
  }
})

module.exports = profileRouter;