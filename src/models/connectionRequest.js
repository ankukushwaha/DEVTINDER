const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'interested', 'ignored'],
        default: 'pending'
    }
}, {timestamps: true});

connectionRequestSchema.index({sender: 1, receiver: 1});

connectionRequestSchema.pre('save', function(next){
    if(this.sender.equals(this.receiver)){
        return next(new Error("Sender and receiver cannot be the same!"));
    }
    next();
})

const connectionModel = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = { connectionModel };