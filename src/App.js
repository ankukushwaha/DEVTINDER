const express = require('express');
const connectToDB = require('./config/database');
const userModel = require('./models/user');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

app.use(express.json());
app.use(cookieParser())

app.use('/', authRouter);
app.use('/', profileRouter);

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

app.delete("/user", async(req, res) => {
    try{
        const userId = req.body.Id;
        if(!userId){
            throw new Error("User Id is required!");
        }
        const user = await userModel.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).send("User not found!");
        }
        else{
            res.status(200).send("User deleted successfully!");
        }
    }
    catch(err){
        res.status(500).send("Error deleting user: " + err.message);
    }
})

app.patch("/user/:email", async(req, res) => {
    try{
        const emailId = req.params.email;
        const data = req.body;
        if(!emailId){
            throw new error("email Id is required!");
        }

        const allowedChange = ['password', 'age', 'gender', 'imageUrl', 'skills'];
        const isAllowed = Object.keys(data).every((k) => {
            return allowedChange.includes(k);
        })

        if(!isAllowed){
            throw new Error("Invalid update fields!");
        }

        if(data?.skills.length > 10){
            throw new Error("Skills can not be more than 10!");
        }

        const user = await userModel.findOneAndUpdate({email: emailId}, data, {returnDocument: 'after'},
            {runValidators: true});
        if(!user){
            return res.status(404).send("User not found!");
        }
        else{
            console.log(user);
            res.status(200).send("User updated successfully!");
        }
    }
    catch(err){
        res.status(500).send("Error updating user: " + err.message);
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
