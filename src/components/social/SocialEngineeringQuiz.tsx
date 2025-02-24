'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconBrain, IconCheck, IconX } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  completed: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is social engineering?",
    options: [
      "A type of computer virus",
      "The psychological manipulation of people to gain access to information or systems",
      "A software development method",
      "A network security protocol"
    ],
    correctAnswer: 1,
    explanation: "Social engineering is the art of manipulating people to give up confidential information. It relies on human error rather than technical hacking techniques.",
    completed: false
  },
  {
    id: 2,
    question: "Which of these is a common social engineering tactic?",
    options: [
      "Installing antivirus software",
      "Pretending to be tech support",
      "Using strong passwords",
      "Updating software regularly"
    ],
    correctAnswer: 1,
    explanation: "Impersonating authority figures, like tech support, is a common social engineering tactic used to gain trust and access to systems or information.",
    completed: false
  },
  {
    id: 3,
    question: "What is tailgating in social engineering?",
    options: [
      "Following someone too closely while driving",
      "Following authorized personnel through secure doors",
      "Sending multiple emails in succession",
      "Running multiple programs at once"
    ],
    correctAnswer: 1,
    explanation: "Tailgating, also known as piggybacking, is when an attacker follows an authorized person into a restricted area without proper authentication.",
    completed: false
  }
];

export default function SocialEngineeringQuiz() {
  const [userQuestions, setUserQuestions] = useState<Question[]>(questions)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  const loadQuizProgress = async () => {
    try {
      const response = await fetch('/api/quizzes/progress?type=social')
      const data = await response.json()
      
      const updatedQuizzes = questions.map(quiz => ({
        ...quiz,
        completed: data.completedQuizIds.includes(quiz.id)
      }))
      
      setUserQuestions(updatedQuizzes)
      setLoading(false)

      const allCompleted = updatedQuizzes.every(quiz => quiz.completed)
      if (allCompleted) {
        await fetch('/api/modules/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleId: 'social',
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
          type: 'social',
          pathId: 'social'
        })
      })

      await loadQuizProgress()
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
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-8 rounded-3xl border border-[#3a3a3a]"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#47F3AB] to-[#47F3AB]/70 text-transparent bg-clip-text">
            Social Engineering Quiz
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Test your knowledge about social engineering tactics.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#1a1a1a]/50 px-6 py-4 rounded-2xl border border-[#3a3a3a]">
          <div className="w-12 h-12 bg-gradient-to-br from-[#47F3AB] to-[#47F3AB]/70 rounded-xl flex items-center justify-center">
            <IconBrain size={24} className="text-[#1a1a1a]" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Progress</div>
            <div className="text-xl font-bold text-white">
              {userQuestions.filter(q => q.completed).length}/{userQuestions.length}
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
                    selectedQuestion?.id === question.id 
                      ? 'bg-gradient-to-br from-[#47F3AB]/20 to-[#47F3AB]/5 border-[#47F3AB] shadow-lg shadow-[#47F3AB]/20' 
                      : 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#47F3AB]/50'
                  } rounded-2xl`}
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
                      <IconBrain size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-lg ${
                        selectedQuestion?.id === question.id
                          ? 'text-white'
                          : 'text-white'
                      }`}>
                        Question {question.id}
                      </h3>
                      <p className={`text-sm ${
                        selectedQuestion?.id === question.id
                          ? 'text-gray-400'
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
                            {selectedQuestion.explanation}
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