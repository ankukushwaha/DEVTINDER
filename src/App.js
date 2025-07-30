const express = require('express');
const {auth, userAuth} = require('./middlewares/auth');
const app = express();
const port = 3000;

app.get("/admin", auth, (req, res) => {
    res.send("Welcome to the admin area");
})

app.get("/user/login", (req, res) => {
    res.send("user logged in sucessfully");
})

app.use("/user", userAuth);

app.get("/user", (req, res) => {
    res.send("Welcome to the user area");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});