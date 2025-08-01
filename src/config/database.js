const mongoose = require('mongoose');

const connectToDB = async () => {
    const url = 'mongodb+srv://ankurkushwaha7408:Kushwaha123@cluster0.8onnf8w.mongodb.net/DevTinder';
    await mongoose.connect(url);
};

module.exports = connectToDB;
