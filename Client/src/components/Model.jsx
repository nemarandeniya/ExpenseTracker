import { X } from 'lucide-react'
import React from 'react'

const Model = () => {
    return (
        <div className='fixed inset-0 bg-opacity-30 backdrop-blur-lg z-50 flex items-center p-4'>
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>Add Expense</h2>
                        <p className='text-sm  text-gray-500 mt-1'>Track you'r spending</p>
                    </div>
                    <button className='p-2 hover:bg-gray-100 rounded-full transition'>
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className='block text-sm font-bold text-gray-700 mb-2'>
                            What did you buy?
                        </label>
                        <input type='text' placeholder='Enter description' className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Model