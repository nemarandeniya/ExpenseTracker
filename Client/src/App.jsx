import { DollarSign, Plus, ShoppingCart, TrendingUp, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import StatCard from './components/StatCard'
import SpendingChart from './components/SpendingChart'
import CategoryChart from './components/CategoryChart'
import TransactionList from './components/TransactionList'
import Model from './components/Model'

import { fetchExpenses, createExpenses, updateExpenses, deleteExpenses } from '../api'


function App() {

  const [expenses, setExpenses] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [editExpense, setEditExpense] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")

  //STATS CALCULATIONS
  const calculationStats = (expenseList) => {
    const list = expenseList || [];
    const total = list.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const categoryTotals = list.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0)
      return acc;
    }, {})

    return {
      total,
      count: list.length,
      avg: list.length > 0 ? total / list.length : 0,
      highest:
        list.length > 0 ? Math.max(...list.map((e) => Number(e.amount) || 0)) : 0,
      categoryTotals,
    }
  }

  const stats = calculationStats(expenses)

  //LOAD INITIAL DATA
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const [expData] = await Promise.all([fetchExpenses()]);//Fetch expenses data

        const normalized = (expData || []).map((e) => ({
          ...e,//The spread operator (...) copies all properties of the expense object into the new object.This way, you keep all existing fields before adding or modifying specific ones
          date: e?.date
            ? String(e.date).split("T")[0]// If date exists, keep only the date part (YYYY-MM-DD)
            : new Date().toISOString().split("T")[0]// Otherwise, use today's date
        }))

        setExpenses(normalized)
      } catch (error) {
        console.error("load error:", error);
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  //ADD FUNCTION
  const handleAddExpense = async (payload) => {
    try {
      const created = await createExpenses();

      if (!created) {
        throw new Error("No created expense returned")
      }

      setExpenses((prev) => [
        { ...created, date: created.date.split("T")[0] },
        ...prev
      ])
      setIsModelOpen(false)
    } catch (error) {
      console.error("Create error:", error);
    }
  }

  const onEdit = (expense) => {
    setEditExpense(expense);
    setIsModelOpen(true)
  }

  const handleSaveEdit = async (payload) => {
    if (!editExpense) {
      return;
    }

    try {
      const updated = await updateExpenses(editExpense._id, payload)

      setExpenses((prev) => prev.map((e) => e._id === updated._id
        ? { ...updated, date: updated.date.split("T")[0] }
        : e
      ))
      setEditExpense(null);
      setIsModelOpen(false)
    } catch (error) {
      console.error("Create error:", error);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Expense")) {
      return;
    }
    try {
      await deleteExpenses(id)
    } catch (error) {
      console.error("Create error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br
     from-slate-50 via-gray-50 to-slate-100">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 lg:py-4 flex items-center justify-between">
          <div>
            <h1 className='text-3xl font-bold text-gray-700 lg:text-4xl mb-1'>
              Expense tracker
            </h1>
            <p className='text-gray-700'>Manage Your finance with ease</p>
          </div>
          <div className='flex items-center gap-3'>
            <button className='px-4 py-2 bg-gray-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all flex items-center gap-2'>
              <Plus className='w-6 h-6' /> Add Expenses
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={`$${stats.total.toFixed(2)}`}
            title="Total Spent"
            icon={Wallet}
            subtitle="This Month"
            bgColor="bg-gradient-to-br from-indigo-500 to-indigo-600"
            iconColor="bg-indigo-700"
          />
          <StatCard
            value={stats.count}
            title="Expenses"
            icon={ShoppingCart}
            subtitle={`${stats.count} transactions`}
            bgColor="bg-gradient-to-br from-red-500 to-red-600"
            iconColor="bg-red-700"
          />
          <StatCard
            value={`$${stats.avg.toFixed(2)}`}
            title="Average"
            icon={TrendingUp}
            subtitle="Per expense"
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
            iconColor="bg-purple-700"
          />
          <StatCard
            value={`$${stats.highest.toFixed(2)}`}
            title="Highest"
            icon={DollarSign}
            subtitle="Single expense"
            bgColor="bg-gradient-to-br from-green-500 to-green-600"
            iconColor="bg-green-700"
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3">
            <SpendingChart expenses={expenses} />
          </div>
          <div className="lg:col-span-2">
            <CategoryChart categoryTotal={stats.categoryTotals} />
          </div>
        </div>

        {/* TRANSACTION LIST */}
        <TransactionList
          expenses={expenses}
          onDelete={handleDelete}
          onEdit={onEdit}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />
      </div>

      {/* MODEL */}
      {/* <Model /> */}
    </div>
  )
}

export default App
