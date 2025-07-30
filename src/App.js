const express = require('express');
const app = express();
const port = 3000;

app.get("/user", (req, res) => {
   try{
    throw new Error("This is an error");
    res.send("User endpoint reached");
   }
   catch(err){
       res.status(500).send({
           error: err.message,
       });
   }
})

app.use("/", (err, req, res, next) => {
    console.log("Error middleware triggered");
    if(err){
        res.status(500).send({
            error: err.message, 
        });
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});