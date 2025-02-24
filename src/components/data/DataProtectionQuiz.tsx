'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconBrain, IconCheck, IconX, IconShieldLock } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  completed: boolean
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is data classification?",
    options: [
      "A method of organizing files by date",
      "The process of categorizing data based on its sensitivity and importance",
      "A way to compress data for storage",
      "A technique for encrypting files"
    ],
    correctAnswer: 1,
    explanation: "Data classification is the process of organizing data based on its sensitivity level and importance to the organization. This helps determine appropriate security controls and handling procedures for different types of data.",
    completed: false
  },
  {
    id: 2,
    question: "Which of the following is NOT a recommended practice for data disposal?",
    options: [
      "Using a cross-cut paper shredder",
      "Secure wiping of digital storage devices",
      "Physical destruction of hard drives",
      "Moving files to the recycle bin"
    ],
    correctAnswer: 3,
    explanation: "Simply moving files to the recycle bin does not securely delete data. Proper data disposal requires methods that make data unrecoverable, such as secure wiping, shredding, or physical destruction.",
    completed: false
  },
  {
    id: 3,
    question: "What is data minimization?",
    options: [
      "Using compression to reduce file sizes",
      "Collecting and retaining only the data necessary for specific purposes",
      "Limiting access to data to senior management only",
      "Storing all data in encrypted format"
    ],
    correctAnswer: 1,
    explanation: "Data minimization is the practice of collecting and retaining only the minimum amount of personal data necessary to fulfill specific purposes. This reduces risk and complies with data protection regulations.",
    completed: false
  },
  {
    id: 4,
    question: "Which encryption approach is most secure for storing sensitive data?",
    options: [
      "Password protection on files",
      "Basic file compression",
      "End-to-end encryption with strong keys",
      "Hidden files and folders"
    ],
    correctAnswer: 2,
    explanation: "End-to-end encryption with strong encryption keys provides the highest level of security for sensitive data. It ensures data remains encrypted throughout its lifecycle and can only be accessed by authorized parties.",
    completed: false
  },
  {
    id: 5,
    question: "What is a data retention policy?",
    options: [
      "A backup schedule for important files",
      "Guidelines for how long to keep different types of data",
      "Rules about who can access data",
      "A system for organizing files"
    ],
    correctAnswer: 1,
    explanation: "A data retention policy defines how long different types of data should be kept before being securely disposed of. This helps organizations comply with regulations and reduce risk while maintaining necessary records.",
    completed: false
  }
]

export default function DataProtectionQuiz() {
  const [userQuestions, setUserQuestions] = useState<Question[]>(questions)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  // Load quiz progress
  useEffect(() => {
    const loadQuizProgress = async () => {
      try {
        const response = await fetch('/api/modules/data-protection-progress')
        const data = await response.json()
        
        if (response.ok) {
          const updatedQuestions = questions.map(question => ({
            ...question,
            completed: data.completedQuizIds.includes(question.id)
          }))
          
          setUserQuestions(updatedQuestions)
          // Update score based on completed questions
          setScore(updatedQuestions.filter(q => q.completed).length)
        }
      } catch (error) {
        console.error('Failed to load quiz progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuizProgress()
  }, [])

  const handleAnswer = async (answerIndex: number) => {
    if (!currentQuestion) return

    const correct = answerIndex === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    if (correct) setScore(prev => prev + 1)

    // Mark question as completed in local state
    setUserQuestions(prev => prev.map(question => 
      question.id === currentQuestion.id 
        ? { ...question, completed: true }
        : question
    ))

    try {
      // Save quiz result
      const saveResult = await fetch('/api/quiz/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          correct,
          type: 'data'
        })
      })

      if (!saveResult.ok) {
        throw new Error('Failed to save quiz result')
      }

      // Check if all questions are completed
      const allCompleted = userQuestions.every(q => 
        q.id === currentQuestion.id ? true : q.completed
      )
      
      if (allCompleted) {
        const completeModule = await fetch('/api/modules/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            module: 'data-protection',
            type: 'quiz'
          })
        })

        if (!completeModule.ok) {
          throw new Error('Failed to update module completion')
        }
      }
    } catch (error) {
      console.error('Failed to save quiz result:', error)
    }
  }

  const handleNextQuestion = () => {
    const currentIndex = currentQuestion ? userQuestions.findIndex(q => q.id === currentQuestion.id) : -1
    const nextIndex = currentIndex + 1
    if (nextIndex < userQuestions.length) {
      setCurrentQuestion(userQuestions[nextIndex])
      setShowResult(false)
      setSelectedAnswer(null)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-8 rounded-3xl border border-[#3a3a3a]"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#47F3AB] to-[#47F3AB]/70 text-transparent bg-clip-text">
            Data Protection Quiz
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Test your understanding of data protection principles.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#1a1a1a]/50 px-6 py-4 rounded-2xl border border-[#3a3a3a]">
          <div className="w-12 h-12 bg-gradient-to-br from-[#47F3AB] to-[#47F3AB]/70 rounded-xl flex items-center justify-center">
            <IconBrain size={24} className="text-[#1a1a1a]" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Score</div>
            <div className="text-xl font-bold text-white">
              {score}/{userQuestions.length}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Question List */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white px-1">Available Questions</h3>
          <div className="space-y-4">
            {userQuestions.map((question) => (
              <motion.div
                key={question.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                    currentQuestion?.id === question.id 
                      ? 'bg-gradient-to-br from-[#47F3AB]/20 to-[#47F3AB]/5 border-[#47F3AB] shadow-lg shadow-[#47F3AB]/20' 
                      : 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#47F3AB]/50'
                  } rounded-2xl`}
                  onClick={() => {
                    setCurrentQuestion(question)
                    setShowResult(false)
                    setSelectedAnswer(null)
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      currentQuestion?.id === question.id
                        ? 'bg-[#1a1a1a] text-[#47F3AB]'
                        : question.completed 
                          ? 'bg-[#47F3AB] text-[#1a1a1a]' 
                          : 'bg-[#1a1a1a] text-gray-400'
                    }`}>
                      <IconBrain size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-lg ${
                        currentQuestion?.id === question.id
                          ? 'text-[#1a1a1a]'
                          : 'text-white'
                      }`}>
                        Question {question.id}
                      </h3>
                      <p className={`text-sm ${
                        currentQuestion?.id === question.id
                          ? 'text-[#1a1a1a]/80'
                          : question.completed 
                            ? 'text-[#47F3AB]' 
                            : 'text-gray-400'
                      }`}>
                        {question.completed ? 'Completed ✓' : 'Not attempted yet'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Question Viewer */}
        <div className="md:sticky md:top-4">
          <Card className="shadow-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#3a3a3a] rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              {currentQuestion ? (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Question {currentQuestion.id}</h3>
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#3a3a3a] mb-6">
                      <p className="text-white">{currentQuestion.question}</p>
                    </div>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Button
                            variant={
                              showResult
                                ? index === currentQuestion.correctAnswer
                                  ? 'default'
                                  : index === selectedAnswer
                                  ? 'destructive'
                                  : 'outline'
                                : 'outline'
                            }
                            className={`w-full justify-start text-left p-6 text-base rounded-xl bg-[#1a1a1a] border-[#2a2a2a] hover:bg-[#2a2a2a] ${
                              showResult && index === currentQuestion.correctAnswer
                                ? 'ring-2 ring-[#47F3AB] text-[#47F3AB]'
                                : showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer
                                ? 'ring-2 ring-red-500 text-red-400'
                                : 'text-white hover:text-[#47F3AB]'
                            }`}
                            onClick={() => !showResult && handleAnswer(index)}
                            disabled={showResult}
                          >
                            {option}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {showResult && selectedAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <div className={`p-6 rounded-xl ${
                          isCorrect 
                            ? 'bg-[#47F3AB]/10 text-[#47F3AB] border border-[#47F3AB]/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          <div className="flex items-center gap-3 mb-3">
                            {isCorrect ? (
                              <IconCheck size={24} />
                            ) : (
                              <IconX size={24} />
                            )}
                            <span className="font-medium text-lg">
                              {isCorrect ? 'Correct!' : 'Not quite right'}
                            </span>
                          </div>
                          <p className="text-base leading-relaxed text-white">
                            {currentQuestion.explanation}
                          </p>
                        </div>

                        <motion.div
                          className="mt-6 flex gap-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Button 
                            variant="outline"
                            className="flex-1 py-6 text-base font-medium bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:bg-[#2a2a2a] rounded-xl"
                            onClick={() => {
                              setCurrentQuestion(null)
                              setShowResult(false)
                              setSelectedAnswer(null)
                            }}
                          >
                            Back to Questions
                          </Button>
                          {currentQuestion.id < userQuestions.length && (
                            <Button 
                              variant="default"
                              className="flex-1 py-6 text-base font-medium bg-[#47F3AB] hover:bg-[#47F3AB]/90 text-[#1a1a1a] rounded-xl"
                              onClick={handleNextQuestion}
                            >
                              Next Question
                            </Button>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-12 h-12 bg-[#47F3AB] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconBrain size={24} className="text-[#1a1a1a]" />
                  </div>
                  <p className="text-gray-400 text-lg">
                    Select a question to begin
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  )
}