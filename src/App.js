const express = require('express');
const app = express();
const port = 3000;

app.use("/test", (req, res) => {
    res.send("This is a test route!");
})

app.get("/hello", (req, res) => {
    res.send("Hello hello hello!");
})

app.use("/", (req,res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});