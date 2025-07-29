const express = require('express');
const app = express();
const port = 3000;

app.get(/ab+c/, (req, res) => {
    res.send({
        name: "Ankur",
        title: "Kushwaha"
    })
})

app.post("/ab*c", (req, res) => {
    res.send("sucessfully posted");
})

app.delete(/ab?c/, (req, res) => {
    res.send("sucessfully deleted");
})

app.get("/user/:userID/:password", (req, res) => {
    console.log("Query params are: ", req.params);
    res.send("ends with fly");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});