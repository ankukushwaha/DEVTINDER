const express = require('express');
const connectToDB = require('./config/database');
const {userModel} = require('./models/user');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
require('dotenv').config();

app.use(express.json());
app.use(cookieParser())

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

app.get('/feed', async(req, res) => {
    try{
        const users = await userModel.find({});
        if(users.length === 0){
            res.status(404).send("No Users found!");
        }
        else{
            res.status(200).send(users);
        }
    }
    catch(err){
        res.status(500).send("Error fetching feed: " + err.message);
    }
})

connectToDB().then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((err) => {
    console.error('Error connecting to MongoDb: ', err);
})
