const auth = (req, res, next) => {
    const token = "xyz";
    const isValid = token === "xyz"; // Simulating token validation
    if(!isValid){
        res.status(401).send("Unauthorized");
    }
    next();
}

const userAuth = (req, res, next) => {
    const token = "userTokenn";
    const isValid = token === "userToken";
    if(!isValid){
        res.status(403).send("Forbidden");
    }
    next();
};

module.exports = {auth, userAuth};