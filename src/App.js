const express = require('express');
const cors = require('cors');
const connectToDB = require('./config/database');
const {userModel} = require('./models/user');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./utils/cronJob');

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectToDB().then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((err) => {
    console.error('Error connecting to MongoDb: ', err);
})
