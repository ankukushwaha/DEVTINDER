const express = require('express');
const profileRouter = express.Router();
const {validateAuthorizedUser} = require('../middlewares/auth');
const {validateProfileEdit} = require('../utils/validation');
const userModel = require('../models/user');

profileRouter.get("/profile/view", validateAuthorizedUser, (req, res) => {
    return res.send(req.user);
})

profileRouter.patch("/profile/edit", validateAuthorizedUser, async(req, res) => {
    try{
        validateProfileEdit(req);
        const dataToUpdate = req.body;
        const user = await userModel.findOneAndUpdate({_id: req.user.id}, dataToUpdate, {returnDocument: 'after'},
            {runValidators: true});
        if(!user){
            return res.status(404).send("User not found!");
        }
        else{
            console.log(user);
            return res.status(200).send("User updated successfully!");
        }
    }
    catch(err){
        res.status(500).send("Error updating profile: " + err.message);
    }
})

module.exports = profileRouter;