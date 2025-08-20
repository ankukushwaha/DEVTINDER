const express = require('express');
const requestRouter = express.Router();
const {validateAuthorizedUser} = require('../middlewares/auth');
const {  connectionModel } = require('../models/connectionRequest');
const { userModel } = require('../models/user');

requestRouter.post("/request/send/:status/:toUserId", validateAuthorizedUser, async(req, res) => {
    try{
        const status = req.params.status;
        const ReceiverUserId = req.params.toUserId;
        if(!status || !ReceiverUserId){
            return res.status(400).send("Status and User ID are required!");
        }

        const isValidStatus = ["interested", "ignored"].includes(status);
        if(!isValidStatus){
            return res.status(400).send("Invalid status! Use 'interested' or 'ignored'.");
        }

        const isReceiverInDB = await userModel.findById(ReceiverUserId);
        if(!isReceiverInDB){
            return res.status(404).send("Receiver not found!");
        }

        const senderUserId = (req.user._id).toString();

        const isValidRequest = await connectionModel.findOne({$or: [{sender: senderUserId, receiver: ReceiverUserId},
             {sender: ReceiverUserId, receiver: senderUserId}]});

        if(isValidRequest){
            return res.status(400).send("Connection request already exists!");
        }

        const newConnectionRequest = new connectionModel({
            sender: senderUserId,
            receiver: ReceiverUserId,
            status: status
        });

        const data = await newConnectionRequest.save();
        return res.status(201).json({message: `${req.user.firstName} is ${status} to ${isReceiverInDB.firstName} `}, data );
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
})

requestRouter.patch("/request/review/:status/:requestId", validateAuthorizedUser, async(req, res) => {
    try{
        const senderUserId = req.params.requestId;
        const receiverUserId = (req.user._id).toString();
        const status = req.params.status;

        if(!senderUserId || !status){
            throw new Error("Sender User ID and status are required!");
        }

        const isValidStatus = ["accepted", "rejected"].includes(status);
        if(!isValidStatus){
            return res.status(400).send("Invalid status! Use 'accepted' or 'rejected' only.");
        }

        const connectionRequest = await connectionModel.findOne({sender: senderUserId, receiver: receiverUserId, status:'interested'});
        if(!connectionRequest){
            return res.status(404).send("You don't have any pending connection requests!");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        return res.status(200).json({
            message: `Connection request from ${senderUserId} has been ${status}.`,
            data
        });
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
})

module.exports = requestRouter;