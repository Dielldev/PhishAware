'use client'

import { useEffect, useState } from 'react'
import { Progress } from '../ui/progress'

interface QuizProgress {
  quizScore: number
  challengeScore: number
  totalProgress: number
  xp?: number
}

export default function QuizSection() {
  const [progress, setProgress] = useState<Record<string, QuizProgress>>({})

  useEffect(() => {
    // Fetch progress when component mounts
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/learning-progress')
        const data = await response.json()
        setProgress(data)
      } catch (error) {
        console.error('Failed to fetch progress:', error)
      }
    }
    fetchProgress()
  }, [])

  const quizCategories = [
    {
      id: "phishing",
      title: "Phishing Awareness",
      description: "Learn to identify and protect against phishing attacks, social engineering attempts, and email-based threats",
      icon: "🌐",
      level: "Beginner",
     
    },
    {
      id: "password",
      title: "Password Security",
      description: "Master password best practices and secure password management techniques",
      icon: "🛡️",
      level: "Beginner",
      
    },
    {
      id: "social",
      title: "Social Engineering",
      description: "Protect against manipulation tactics",
      icon: "🎭",
      level: "Intermediate",
      xp: 750
    },
    {
      id: "data",
      title: "Data Protection",
      description: "Safeguard sensitive information",
      icon: "🛡️",
      level: "Advanced",
    
    }
  ]

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">Learning Paths</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizCategories.map((category) => {
          const categoryProgress = progress[category.id] || { quizScore: 0, challengeScore: 0, totalProgress: 0, xp: 0 }
          
          return (
            <div 
              key={category.id}
              className="bg-[#2a2a2a] rounded-lg p-4 hover:bg-[#333] transition-colors cursor-pointer relative"
            >
              <div className="absolute top-4 right-4 text-xs px-2 py-1 bg-[#3a3a3a] rounded-full">
                {category.level}
              </div>
              <div className="text-2xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
              <p className="text-sm text-gray-400 mb-6">{category.description}</p>
              
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-[#4ade80]">
                  {categoryProgress.totalProgress === 100 ? 'Completed' : `${categoryProgress.totalProgress}% Done`}
                </span>
                <span className="text-yellow-500 flex items-center gap-1">
                  <span>⚡</span> {category.xp} XP
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}