'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconLock, IconCheck, IconX, IconShieldLock, IconKey } from '@tabler/icons-react'
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
    question: "Which of the following is the strongest password?",
    options: [
      "Password123!",
      "MyBirthday1990",
      "kX9#mP$vL2@nQ",
      "ILoveMyCat2024"
    ],
    correctAnswer: 2,
    explanation: "kX9#mP$vL2@nQ is the strongest as it contains a mix of uppercase, lowercase, numbers, and special characters in a random arrangement, making it harder to guess.",
    completed: false
  },
  {
    id: 2,
    question: "What is a common sign of a weak password?",
    options: [
      "Using special characters",
      "Personal information like birthdays",
      "Random combinations of letters",
      "Different cases (upper/lower)"
    ],
    correctAnswer: 1,
    explanation: "Using personal information like birthdays makes passwords easier to guess through social engineering or basic research about the target.",
    completed: false
  },
  {
    id: 3,
    question: "What is the recommended minimum length for a secure password?",
    options: [
      "6 characters",
      "8 characters",
      "12 characters",
      "16 characters"
    ],
    correctAnswer: 2,
    explanation: "12 characters is the current recommended minimum length. Longer passwords are exponentially harder to crack, and 12 characters provides a good balance of security and usability.",
    completed: false
  },
  {
    id: 4,
    question: "Which password practice is most secure?",
    options: [
      "Using the same strong password everywhere",
      "Writing passwords in a notebook",
      "Using a password manager",
      "Changing passwords every week"
    ],
    correctAnswer: 2,
    explanation: "Using a password manager is the most secure practice as it can generate and store unique, strong passwords for each account, protecting against credential reuse attacks.",
    completed: false
  },
  {
    id: 5,
    question: "What is 'password salting'?",
    options: [
      "Adding numbers to a password",
      "Adding random data before hashing",
      "Using special characters",
      "Encrypting a password"
    ],
    correctAnswer: 1,
    explanation: "Password salting is adding random data to a password before hashing it, making it resistant to rainbow table attacks and ensuring identical passwords have different hashes.",
    completed: false
  }
]

export default function PasswordSecurityQuiz() {
  const [userQuestions, setUserQuestions] = useState<Question[]>(questions)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)

  const handleAnswer = async (answerIndex: number) => {
    if (!selectedQuestion) return

    const correct = answerIndex === selectedQuestion.correctAnswer
    setIsCorrect(correct)
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    setUserQuestions(prev => prev.map(question => 
      question.id === selectedQuestion.id 
        ? { ...question, completed: true }
        : question
    ))

    try {
      await fetch('/api/quizzes/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: selectedQuestion.id,
          correct,
          type: 'password'
        })
      })
    } catch (error) {
      console.error('Failed to save quiz result:', error)
    }
  }

  const handleNextQuestion = () => {
    const currentIndex = selectedQuestion ? userQuestions.findIndex(q => q.id === selectedQuestion.id) : -1
    const nextIndex = currentIndex + 1
    if (nextIndex < userQuestions.length) {
      setSelectedQuestion(userQuestions[nextIndex])
      setShowResult(false)
      setSelectedAnswer(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#2a2a2a] p-6 rounded-2xl"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">
            Password Security Quiz
          </h2>
          <p className="text-gray-400 mt-2">Test your knowledge about password security and best practices.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#2a2a2a]">
          <div className="w-8 h-8 bg-[#47F3AB] rounded-lg flex items-center justify-center">
            <IconShieldLock size={20} className="text-[#1a1a1a]" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Progress</div>
            <div className="font-semibold text-white">
              {userQuestions.filter(q => q.completed).length}/{userQuestions.length} Completed
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Question List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white ml-1">Available Questions</h3>
          <div className="space-y-3">
            {userQuestions.map((question) => (
              <motion.div
                key={question.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`p-5 cursor-pointer transition-all hover:shadow-lg bg-[#2a2a2a] border-0 rounded-xl ${
                    selectedQuestion?.id === question.id 
                      ? 'bg-[#47F3AB] shadow-lg shadow-[#47F3AB]/20' 
                      : 'hover:bg-[#3a3a3a]'
                  }`}
                  onClick={() => {
                    setSelectedQuestion(question)
                    setShowResult(false)
                    setSelectedAnswer(null)
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedQuestion?.id === question.id
                        ? 'bg-[#1a1a1a] text-[#47F3AB]'
                        : question.completed 
                          ? 'bg-[#47F3AB] text-[#1a1a1a]' 
                          : 'bg-[#1a1a1a] text-gray-400'
                    }`}>
                      <IconKey size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-lg ${
                        selectedQuestion?.id === question.id
                          ? 'text-[#1a1a1a]'
                          : 'text-white'
                      }`}>
                        Question {question.id}
                      </h3>
                      <p className={`text-sm ${
                        selectedQuestion?.id === question.id
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
          <Card className="shadow-lg bg-[#2a2a2a] border-0 rounded-2xl">
            <AnimatePresence mode="wait">
              {selectedQuestion ? (
                <motion.div
                  key={selectedQuestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-white">{selectedQuestion.question}</h3>
                    <div className="space-y-3">
                      {selectedQuestion.options.map((option, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Button
                            variant={
                              showResult
                                ? index === selectedQuestion.correctAnswer
                                  ? 'default'
                                  : index === selectedAnswer
                                  ? 'destructive'
                                  : 'outline'
                                : 'outline'
                            }
                            className={`w-full justify-start text-left p-6 text-base rounded-xl bg-[#1a1a1a] border-[#2a2a2a] hover:bg-[#2a2a2a] ${
                              showResult && index === selectedQuestion.correctAnswer
                                ? 'ring-2 ring-[#47F3AB] text-[#47F3AB]'
                                : showResult && index === selectedAnswer && index !== selectedQuestion.correctAnswer
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
                    {showResult && (
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
                              {isCorrect ? 'Excellent work!' : 'Not quite right'}
                            </span>
                          </div>
                          <p className="text-base leading-relaxed text-white">{selectedQuestion.explanation}</p>
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
                              setSelectedQuestion(null)
                              setShowResult(false)
                              setSelectedAnswer(null)
                            }}
                          >
                            Back to Questions
                          </Button>
                          {selectedQuestion.id < userQuestions.length && (
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
                    <IconLock size={24} className="text-[#1a1a1a]" />
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