const express = require("express")
const expenseRouter = require('./routes/expenseRoute')
const app = express();
const cors = require('cors')


//middleware
app.use(express.json())
app.use('/api/v2/expense', expenseRouter)

module.exports = app;