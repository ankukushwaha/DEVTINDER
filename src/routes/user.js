const express = require('express');
const userRouter = express.Router();
const {validateAuthorizedUser} = require('../middlewares/auth');
const {connectionModel} = require('../models/connectionRequest');

const SAFE_INFO_TO_SHOW = ['firstName', 'lastName', 'age', 'imageUrl', 'skills'];

userRouter.get("/user/request/received", validateAuthorizedUser, async(req, res) => {
    try{
        const receiverUserId = req.user._id;
        const receivedRequests = await connectionModel.find({receiver: receiverUserId, status: "interested"})
        .populate('sender', SAFE_INFO_TO_SHOW);
        if(!receivedRequests || receivedRequests.length === 0){
            return res.status(404).send("No received requests found!");
        }

        const data = receivedRequests.map((request) => request.sender);

        return res.status(200).json(data);
    }
    catch(err){
        return res.status(500).send("Error fetching received requests: " + err.message);
    }
});

userRouter.get("/user/connections", validateAuthorizedUser, async(req, res) => {
    try{
        const userId = req.user._id;
        const connections = await connectionModel.find({
            $or: [
                {sender: userId, status: "accepted"}, 
                {receiver: userId, status: "accepted"},
            ]
        }).populate('sender', SAFE_INFO_TO_SHOW)
        .populate('receiver', SAFE_INFO_TO_SHOW);

        if(!connections || connections.length === 0){
            return res.status(404).send("No connections found!");
        }

        const data = connections.map((connection) => {
            if(connection.sender._id.toString() === userId.toString()){
                return connection.receiver;
            }
            return connection.sender;
        })

        return res.status(200).json(data);
    }
    catch(err){
        return res.status(500).send("Error fetching connections: " + err.message);
    }
});

module.exports = userRouter;