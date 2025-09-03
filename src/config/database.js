const mongoose = require('mongoose');

const connectToDB = async () => {
    const url = process.env.CONNECTION_DB;
    await mongoose.connect(url);
};

module.exports = connectToDB;
