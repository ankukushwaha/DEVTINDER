const express = require('express');
const profileRouter = express.Router();
const jsonwebtoken = require('jsonwebtoken');

profileRouter.get("/profile", (req, res) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).send("Unauthorized! Please login.");
        }
        const user = jsonwebtoken.verify(token, "djerhfuhrfugfugrfghrf");
        if(!user){
            return res.status(401).send("Unauthorized please login.");
        }
        return res.send(user);
    }
    catch(err){
        return res.json(500).send("Error fetching data." + err.message);
    }
})

module.exports = profileRouter;