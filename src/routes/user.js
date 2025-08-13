const express = require('express');
const userRouter = express.Router();
const {validateAuthorizedUser} = require('../middlewares/auth');
const {connectionModel} = require('../models/connectionRequest');
const {userModel} = require('../models/user');

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

userRouter.get("/user/feed", validateAuthorizedUser, async(req, res) => {
    try{
        const userId = req.user._id;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        const connectionRequests = await connectionModel.find({
            $or: [
                {sender: userId},
                {receiver: userId}
            ] 
        });

        const hideUsersFromFeed = new Set();
        if(connectionRequests && connectionRequests.length > 0){
            connectionRequests.forEach((request) => {
                hideUsersFromFeed.add(request.sender.toString());
                hideUsersFromFeed.add(request.receiver.toString());
            })
        }

        const users = await userModel.find({
            $and : [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: userId}}
            ]
        })
        .select(SAFE_INFO_TO_SHOW).skip(skip).limit(limit);

        res.status(200).json({"message": "Feed fetched successfully", "users": users});
        
    }
    catch(err){
        res.status(400).send("Error fetching feed: " + err.message);
    }
});

module.exports = userRouter;