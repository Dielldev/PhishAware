'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconBrain, IconCheck, IconX, IconTrophy } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Spinner } from '@/components/ui/spinner'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  completed: boolean
}

const quizzes: Question[] = [
  {
    id: 1,
    question: "Which of the following is NOT a common indicator of a phishing email?",
    options: [
      "Urgent or threatening language",
      "Professional company logo",
      "Misspelled sender domain",
      "Requests for sensitive information"
    ],
    correctAnswer: 1, // Professional company logo
    explanation: "A professional company logo can appear in both legitimate and phishing emails. Other options are clear red flags of phishing attempts.",
    completed: false
  },
  {
    id: 2,
    question: "What should you do if you're unsure about an email's legitimacy?",
    options: [
      "Click the link to verify it",
      "Reply asking for verification",
      "Contact the company through official channels",
      "Forward it to colleagues"
    ],
    correctAnswer: 2,
    explanation: "Always verify suspicious communications through official channels, like visiting the company's website directly or calling their official number.",
    completed: false
  },
  {
    id: 3,
    question: "Which email address is most likely to be legitimate?",
    options: [
      "support@paypa1.com",
      "amazon-support@amazonhelp.net",
      "service@netflix.com",
      "microsoft.support@hotmail.com"
    ],
    correctAnswer: 2,
    explanation: "service@netflix.com uses the official netflix.com domain. Other options use suspicious variations or unrelated domains.",
    completed: false
  },
  {
    id: 4,
    question: "What is 'spear phishing'?",
    options: [
      "Mass email campaigns",
      "Targeted attacks using personal information",
      "Phone-based scams",
      "Social media hacking"
    ],
    correctAnswer: 1,
    explanation: "Spear phishing involves targeted attacks using personal information about the victim to make the scam more convincing.",
    completed: false
  }
]

export default function PhishingQuizzes() {
  const [userQuizzes, setUserQuizzes] = useState<Question[]>(quizzes)
  const [selectedQuiz, setSelectedQuiz] = useState<Question | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  const loadQuizProgress = async () => {
    try {
      const response = await fetch('/api/quizzes/progress?type=phishing')
      const data = await response.json()
      
      const updatedQuizzes = userQuizzes.map(quiz => ({
        ...quiz,
        completed: data.completedQuizIds.includes(quiz.id)
      }))
      
      setUserQuizzes(updatedQuizzes)
      setLoading(false)

      // Check if all quizzes are completed and update module progress
      const allCompleted = updatedQuizzes.every(quiz => quiz.completed)
      if (allCompleted) {
        await fetch('/api/modules/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleId: 'phishing',
            score: 100
          })
        })
      }
    } catch (error) {
      console.error('Failed to load quiz progress:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuizProgress()
  }, [])

  const handleAnswer = async (answerIndex: number) => {
    if (!selectedQuiz) return

    const correct = answerIndex === selectedQuiz.correctAnswer
    setIsCorrect(correct)
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    setUserQuizzes(prev => prev.map(quiz => 
      quiz.id === selectedQuiz.id 
        ? { ...quiz, completed: true }
        : quiz
    ))

    try {
      await fetch('/api/quizzes/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: selectedQuiz.id,
          correct,
          type: 'phishing',
          pathId: 'phishing'
        })
      })

      await loadQuizProgress()
    } catch (error) {
      console.error('Failed to save quiz result:', error)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-8 rounded-3xl border border-[#3a3a3a]"
          >
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#47F3AB] to-[#47F3AB]/70 text-transparent bg-clip-text">
                Phishing Security Quiz
              </h2>
              <p className="text-gray-400 mt-2 text-lg">Test your knowledge about phishing attacks and prevention.</p>
            </div>
            <div className="flex items-center gap-3 bg-[#1a1a1a]/50 px-6 py-4 rounded-2xl border border-[#3a3a3a]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#47F3AB] to-[#47F3AB]/70 rounded-xl flex items-center justify-center">
                <IconTrophy size={24} className="text-[#1a1a1a]" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Progress</div>
                <div className="text-xl font-bold text-white">
                  {userQuizzes.filter(q => q.completed).length}/{userQuizzes.length}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Quiz List */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white px-1">Available Questions</h3>
              <div className="space-y-4">
                {userQuizzes.map((quiz) => (
                  <motion.div
                    key={quiz.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                        selectedQuiz?.id === quiz.id 
                          ? 'bg-gradient-to-br from-[#47F3AB]/20 to-[#47F3AB]/5 border-[#47F3AB] shadow-lg shadow-[#47F3AB]/20' 
                          : 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#47F3AB]/50'
                      } rounded-2xl`}
                      onClick={() => {
                        if (!showResult) {
                          setSelectedQuiz(quiz)
                          setShowResult(false)
                          setSelectedAnswer(null)
                        }
                      }}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedQuiz?.id === quiz.id
                            ? 'bg-[#47F3AB] text-[#1a1a1a]'
                            : quiz.completed 
                              ? 'bg-[#47F3AB]/20 text-[#47F3AB]' 
                              : 'bg-[#1a1a1a] text-gray-400'
                        }`}>
                          <IconBrain size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${
                            selectedQuiz?.id === quiz.id
                              ? 'text-[#47F3AB]'
                              : 'text-white'
                          }`}>
                            Question {quiz.id}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            selectedQuiz?.id === quiz.id
                              ? 'text-[#47F3AB]/80'
                              : quiz.completed 
                                ? 'text-[#47F3AB]/70' 
                                : 'text-gray-400'
                          }`}>
                            {quiz.completed ? (
                              <span className="flex items-center gap-2">
                                <IconCheck size={16} />
                                Completed
                              </span>
                            ) : 'Not attempted yet'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quiz Viewer */}
            <div className="md:sticky md:top-4">
              <Card className="shadow-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#3a3a3a] rounded-3xl overflow-hidden">
                <AnimatePresence mode="wait">
                  {selectedQuiz ? (
                    <motion.div
                      key={selectedQuiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6 p-8"
                    >
                      <div>
                        <h3 className="text-2xl font-semibold mb-8 text-white leading-relaxed">{selectedQuiz.question}</h3>
                        <div className="space-y-4">
                          {selectedQuiz.options.map((option, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Button
                                variant={
                                  showResult
                                    ? index === selectedQuiz.correctAnswer
                                      ? 'default'
                                      : index === selectedAnswer
                                      ? 'destructive'
                                      : 'outline'
                                    : 'outline'
                                }
                                className={`w-full justify-start text-left p-6 text-base rounded-xl border-2 transition-all duration-300 ${
                                  showResult && index === selectedQuiz.correctAnswer
                                    ? 'bg-[#47F3AB]/10 border-[#47F3AB] text-[#47F3AB] hover:bg-[#47F3AB]/20'
                                    : showResult && index === selectedAnswer && index !== selectedQuiz.correctAnswer
                                    ? 'bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20'
                                    : 'bg-[#1a1a1a] border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:border-[#47F3AB]/50'
                                }`}
                                onClick={() => !showResult && handleAnswer(index)}
                                disabled={showResult}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    showResult && index === selectedQuiz.correctAnswer
                                      ? 'bg-[#47F3AB]/20'
                                      : showResult && index === selectedAnswer
                                      ? 'bg-red-500/20'
                                      : 'bg-[#2a2a2a]'
                                  }`}>
                                    {showResult ? (
                                      index === selectedQuiz.correctAnswer ? (
                                        <IconCheck size={20} />
                                      ) : index === selectedAnswer ? (
                                        <IconX size={20} />
                                      ) : null
                                    ) : (
                                      <span className="text-sm">{String.fromCharCode(65 + index)}</span>
                                    )}
                                  </div>
                                  {option}
                                </div>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence>
                        {showResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                          >
                            <div className={`p-6 rounded-xl border-2 ${
                              isCorrect 
                                ? 'bg-[#47F3AB]/10 border-[#47F3AB]/30 text-[#47F3AB]'
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}>
                              <div className="flex items-center gap-3 mb-4">
                                {isCorrect ? (
                                  <div className="w-10 h-10 rounded-xl bg-[#47F3AB]/20 flex items-center justify-center">
                                    <IconCheck size={24} />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                    <IconX size={24} />
                                  </div>
                                )}
                                <span className="font-semibold text-lg">
                                  {isCorrect ? 'Excellent work!' : 'Not quite right'}
                                </span>
                              </div>
                              <p className="text-base leading-relaxed text-white/90">{selectedQuiz.explanation}</p>
                            </div>

                            <motion.div
                              className="mt-6 flex gap-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Button 
                                variant="outline"
                                className="flex-1 py-6 text-base font-medium bg-[#1a1a1a] border-[#3a3a3a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-xl transition-all duration-300"
                                onClick={() => {
                                  setSelectedQuiz(null)
                                  setShowResult(false)
                                  setSelectedAnswer(null)
                                }}
                              >
                                Back to Questions
                              </Button>
                              {selectedQuiz.id < userQuizzes.length && (
                                <Button 
                                  variant="default"
                                  className="flex-1 py-6 text-base font-medium bg-gradient-to-r from-[#47F3AB] to-[#47F3AB]/80 hover:from-[#47F3AB]/90 hover:to-[#47F3AB]/70 text-[#1a1a1a] rounded-xl transition-all duration-300"
                                  onClick={() => {
                                    const nextQuiz = userQuizzes.find(q => q.id === selectedQuiz.id + 1)
                                    if (nextQuiz) {
                                      setSelectedQuiz(nextQuiz)
                                      setShowResult(false)
                                      setSelectedAnswer(null)
                                    }
                                  }}
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
                      className="text-center py-16"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-[#47F3AB] to-[#47F3AB]/70 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <IconBrain size={32} className="text-[#1a1a1a]" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Ready to Test Your Knowledge?</h3>
                      <p className="text-gray-400 text-lg">
                        Select a question from the list to begin
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}