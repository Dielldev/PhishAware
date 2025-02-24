'use client'

import { useState } from 'react'
import DataProtectionScenarios from "@/components/data/DataProtectionScenarios"
import DataProtectionQuiz from "@/components/data/DataProtectionQuiz"
import DataProtectionTips from "@/components/data/DataProtectionTips"

export default function DataProtectionPage() {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'quiz' | 'tips'>('scenarios')

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Data Protection Training</h1>
        <p className="text-gray-400 mt-2">Learn how to protect sensitive data and maintain security.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#2a2a2a] p-1 rounded-xl inline-flex">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`rounded-lg px-8 py-2.5 transition-all ${
              activeTab === 'scenarios'
                ? 'bg-[#47F3AB] text-[#1a1a1a]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Interactive Scenarios
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`rounded-lg px-8 py-2.5 transition-all ${
              activeTab === 'quiz'
                ? 'bg-[#47F3AB] text-[#1a1a1a]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Knowledge Quiz
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`rounded-lg px-8 py-2.5 transition-all ${
              activeTab === 'tips'
                ? 'bg-[#47F3AB] text-[#1a1a1a]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Security Tips
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'scenarios' && <DataProtectionScenarios />}
          {activeTab === 'quiz' && <DataProtectionQuiz />}
          {activeTab === 'tips' && <DataProtectionTips />}
        </div>
      </div>
    </div>
  )
} 