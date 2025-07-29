const express = require('express');
const app = express();
const port = 3000;

app.get("/user", (req, res) => {
    res.send({
        name: "Ankur",
        title: "Kushwaha"
    })
})

app.post("/user", (req, res) => {
    res.send("sucessfully posted");
})

app.delete("/user", (req, res) => {
    res.send("sucessfully deleted");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});