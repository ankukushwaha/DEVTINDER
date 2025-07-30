const express = require('express');
const app = express();
const port = 3000;

app.get("/user", [(req, res, next) => {
    next();
}, (req, res, next) => {
    console.log("User endpoint accessed");
    next();
}])

app.get("/user", (req, res) => {
    res.send("User endpoint response");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});