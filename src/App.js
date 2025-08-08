const express = require('express');
const connectToDB = require('./config/database');
const userModel = require('./models/user');
const app = express();
const port = 3000;
const {validateSignup} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jsonwebtoken = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser())

app.post('/signup', async(req, res) => {
    try{
        validateSignup(req);
        const {firstName, lastName, email , password} = req.body;
        const passwordHashed = await bcrypt.hash(password, 10);
        console.log(passwordHashed);
        const newUser = new userModel({
            firstName,
            lastName,
            email,
            password: passwordHashed
        })
        await newUser.save();
        res.status(201).send("User created successfully");
    }
    catch(err){
        res.status(500).send("Error creating user: " + err.message);
    }
})

app.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email: email});
        if(!user || user.length === 0){
            throw new Error("Invalid Credentials!");
        }

        await user.comparePassword(password);
        const jwtToken = await user.getJWT();
        res.cookie("token" , jwtToken, {expires: new Date(Date.now() + 3600000), httpOnly: true});
        res.status(200).send("Login successfull!");
    }
    catch(err){
        res.status(500).send("Error Logging in: " + err.message);
    }
})


app.get("/profile", (req, res) => {
    try{
        const token = req.cookies.token;
        if(!token){
            res.status(401).send("Unauthorized! Please login.");
        }
        const user = jsonwebtoken.verify(token, "djerhfuhrfugfugrfghrf");
        if(!user){
            res.status(401).send("Unauthorized please login.");
        }
        res.send(user);
    }
    catch(err){
        res.json(500).send("Error fetching data." + err.message);
    }
})

app.get('/users', async(req, res) => {
    try{
        const user = await userModel.find({firstName: 'Ankur'});
        if(user.length === 0){
            res.status(404).send("User not found!");
        }
        else{
            res.status(200).send(user);
        }
    }
    catch(err){
        res.status(500).send("Error fetching users: "+ err.message);
    }
});

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
