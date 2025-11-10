const express = require('express')
const expenseRouter = require("../controllers/expenseController")

const router = express.Router()

router.get('/', expenseRouter.getAllExpenses)
router.post('/', expenseRouter.createExpense)
router.put('/:id', expenseRouter.updateExpense)
router.delete('/:id', expenseRouter.deleteExpense)

module.exports = router;