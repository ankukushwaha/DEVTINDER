const express = require('express');
const connectToDB = require('./config/database');
const userModel = require('./models/user');
const app = express();
const port = 3000;

app.post('/signup', async(req, res) => {
    // const {firstName, lastName, email, password} = req.body;

    try{
        const newUser = new userModel({
            firstName: "Ankur",
            lastName: "Kushwaha",
            email: "ankur@gmail.com",
            password: "ankur123@"
        });
        await newUser.save();
        res.status(201).send("User created successfully");
    }
    catch(err){
        res.status(500).send("Error creating user: " + err.message);
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
