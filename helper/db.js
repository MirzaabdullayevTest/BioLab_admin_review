const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({ path: "./.env" });
const MONGODB_URI = process.env.MONGODB_URI

module.exports = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        const db = mongoose.connection

        db.on('error', console.error.bind(console, 'Connection error: '))
        db.once('open', function () {
            console.log('MongoDB global connected');
        })
    } catch (e) {
        console.log(e);
    }
}