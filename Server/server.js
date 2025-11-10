const { default: mongoose } = require('mongoose')
const app = require('./app')
require('dotenv').config()
const connectDB = require("./config/db")

connectDB()

const port = process.env.PORT || 8001
const server = app.listen(port, () => {
    console.log("Server is running on port ", port)
})

process.on("SIGINT", async () => {//SIGINT->Signal Interrupt(signal sent by your operating system to tell a process to stop running)

    //CLOSE MONGODB CONNECTION
    await mongoose.connection.close()

    //STOP THE HTTP SERVER
    server.close(() => {
        console.log("Server Stopped")
        process.exit(1)
    })
})