const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDb Connected");

    } catch (error) {
        console.error("MongoDB Connection Error");

    }
}

module.exports = connectDB