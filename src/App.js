const express = require('express');
const connectToDB = require('./config/database');
const userModel = require('./models/user');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/signup', async(req, res) => {
    try{
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send("User created successfully");
    }
    catch(err){
        res.status(500).send("Error creating user: " + err.message);
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
        res.status(500).send("Error fetching users: ", err.message);
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

connectToDB().then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((err) => {
    console.error('Error connecting to MongoDb: ', err);
})
