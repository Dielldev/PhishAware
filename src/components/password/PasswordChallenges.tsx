'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconLock, IconCheck, IconX, IconShieldLock, IconKey } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import zxcvbn from 'zxcvbn'

interface Challenge {
  id: number
  title: string
  description: string
  type: 'strength' | 'pattern'
  completed: boolean
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Password Strength Analyzer",
    description: "Test different passwords and learn what makes them strong or weak.",
    type: 'strength',
    completed: false
  },
  {
    id: 2,
    title: "Pattern Recognition",
    description: "Identify common password patterns that make them vulnerable.",
    type: 'pattern',
    completed: false
  }
]

export default function PasswordChallenges() {
  const [userChallenges, setUserChallenges] = useState<Challenge[]>(challenges)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [password, setPassword] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string>('')

  useEffect(() => {
    const loadChallengeProgress = async () => {
      try {
        const response = await fetch('/api/challenges/progress?type=password')
        const data = await response.json()
        
        const updatedChallenges = userChallenges.map(challenge => ({
          ...challenge,
          completed: data.completedChallengeIds.includes(challenge.id)
        }))
        
        setUserChallenges(updatedChallenges)
      } catch (error) {
        console.error('Failed to load challenge progress:', error)
      }
    }

    loadChallengeProgress()
  }, [])

  const handlePasswordTest = () => {
    if (!password || !selectedChallenge) return

    const result = zxcvbn(password)
    setScore(result.score)
    
    let feedbackMessage = ''
    if (result.score === 0) {
      feedbackMessage = "This password is very weak. It could be cracked instantly."
    } else if (result.score === 1) {
      feedbackMessage = "This password is weak. It uses common patterns."
    } else if (result.score === 2) {
      feedbackMessage = "This password is moderate. Consider making it stronger."
    } else if (result.score === 3) {
      feedbackMessage = "This password is strong. Good job!"
    } else {
      feedbackMessage = "This password is very strong. Excellent work!"
    }

    if (result.feedback.warning) {
      feedbackMessage += " " + result.feedback.warning
    }

    setFeedback(feedbackMessage)

    // Mark challenge as completed if score is 3 or higher
    if (result.score >= 3) {
      setUserChallenges(prev => prev.map(challenge => 
        challenge.id === selectedChallenge?.id 
          ? { ...challenge, completed: true }
          : challenge
      ))

      try {
        fetch('/api/challenges/save-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId: selectedChallenge?.id,
            correct: true,
            type: 'password',
            pathId: 'password'
          })
        })

        // Check if all challenges are completed
        const allCompleted = userChallenges.every(c => 
          c.id === selectedChallenge.id ? true : c.completed
        )

        if (allCompleted) {
          fetch('/api/modules/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              moduleId: 'password',
              score: 100
            })
          })
        }
      } catch (error) {
        console.error('Failed to save challenge result:', error)
      }
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-gray-200'
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-[#47F3AB]'
    ]
    return colors[score]
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
            Password Security Challenges
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Practice creating and analyzing secure passwords.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#1a1a1a]/50 px-6 py-4 rounded-2xl border border-[#3a3a3a]">
          <div className="w-12 h-12 bg-gradient-to-br from-[#47F3AB] to-[#47F3AB]/70 rounded-xl flex items-center justify-center">
            <IconShieldLock size={24} className="text-[#1a1a1a]" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Progress</div>
            <div className="text-xl font-bold text-white">
              {userChallenges.filter(c => c.completed).length}/{userChallenges.length}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Challenge List */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white px-1">Available Challenges</h3>
          <div className="space-y-4">
            {userChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                    selectedChallenge?.id === challenge.id 
                      ? 'bg-gradient-to-br from-[#47F3AB]/20 to-[#47F3AB]/5 border-[#47F3AB] shadow-lg shadow-[#47F3AB]/20' 
                      : 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#47F3AB]/50'
                  } rounded-2xl`}
                  onClick={() => {
                    setSelectedChallenge(challenge)
                    setPassword('')
                    setScore(null)
                    setFeedback('')
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedChallenge?.id === challenge.id
                        ? 'bg-[#1a1a1a] text-[#47F3AB]'
                        : challenge.completed 
                          ? 'bg-[#47F3AB] text-[#1a1a1a]' 
                          : 'bg-[#1a1a1a] text-gray-400'
                    }`}>
                      <IconKey size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-lg ${
                        selectedChallenge?.id === challenge.id
                          ? 'text-[#1a1a1a]'
                          : 'text-white'
                      }`}>
                        {challenge.title}
                      </h3>
                      <p className={`text-sm ${
                        selectedChallenge?.id === challenge.id
                          ? 'text-[#1a1a1a]/80'
                          : challenge.completed 
                            ? 'text-[#47F3AB]' 
                            : 'text-gray-400'
                      }`}>
                        {challenge.completed ? 'Completed ✓' : challenge.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Challenge Viewer */}
        <div className="md:sticky md:top-4">
          <Card className="shadow-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#3a3a3a] rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              {selectedChallenge ? (
                <motion.div
                  key={selectedChallenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-6"
                >
                  {selectedChallenge.type === 'strength' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-white">Test Password Strength</h3>
                        <p className="text-gray-400">Enter a password to test its strength and get feedback on how to make it more secure.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Enter a password to test"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-[#1a1a1a] border-[#2a2a2a] text-white rounded-xl"
                          />
                          <Button
                            onClick={handlePasswordTest}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#47F3AB] hover:bg-[#47F3AB]/90 text-[#1a1a1a] rounded-lg"
                          >
                            Test
                          </Button>
                        </div>

                        {score !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${getScoreColor(score)}`}
                                  style={{ width: `${(score + 1) * 20}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-white">
                                {score}/4
                              </span>
                            </div>

                            <div className={`p-4 rounded-xl ${
                              score >= 3
                                ? 'bg-[#47F3AB]/10 text-[#47F3AB] border border-[#47F3AB]/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              <p className="text-sm">{feedback}</p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedChallenge.type === 'pattern' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-white">Common Password Patterns</h3>
                        <p className="text-gray-400">Learn to identify common patterns that make passwords vulnerable.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
                          <h4 className="font-medium text-white mb-2">Common Weak Patterns:</h4>
                          <ul className="space-y-2 text-gray-400">
                            <li>• Adding numbers at the end (e.g., password123)</li>
                            <li>• Simple character substitutions (e.g., p@ssw0rd)</li>
                            <li>• Using keyboard patterns (e.g., qwerty123)</li>
                            <li>• Personal information (birthdays, names)</li>
                            <li>• Common words with simple modifications</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-[#47F3AB]/10 rounded-xl border border-[#47F3AB]/20">
                          <h4 className="font-medium text-[#47F3AB] mb-2">Strong Password Tips:</h4>
                          <ul className="space-y-2 text-white">
                            <li>• Use random combinations of characters</li>
                            <li>• Make passwords at least 12 characters long</li>
                            <li>• Include uppercase, lowercase, numbers, and symbols</li>
                            <li>• Avoid personal information and common words</li>
                            <li>• Use a password manager for unique passwords</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
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
                    Select a challenge to begin
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