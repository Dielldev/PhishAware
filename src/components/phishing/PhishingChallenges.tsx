'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconMail, IconCheck, IconX, IconShieldCheck } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Spinner } from '@/components/ui/spinner'

interface Challenge {
  id: number
  title: string
  description: string
  emailContent: {
    from: string
    to: string
    subject: string
    date: string
    body: string
  }
  isPhishing: boolean
  explanation: string
  completed: boolean
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Urgent Bank Account Update",
    description: "Review this email from 'Your Bank' and determine if it's legitimate.",
    emailContent: {
      from: "security@yourbank-secure.com",
      to: "customer@email.com",
      subject: "⚠️ Urgent: Suspicious Activity Detected on Your Account",
      date: "Today, 10:45 AM",
      body: `Dear Valued Customer,

We have detected unusual login activity on your account from an unrecognized device. For your security, we have temporarily limited access to your online banking.

To restore full access to your account, please verify your identity immediately by clicking the secure link below:

[Verify Account Now]

If you do not verify your account within 24 hours, your account access will be suspended as a security measure.

Best regards,
Your Bank Security Team

Note: This is an automated message. Please do not reply.`
    },
    isPhishing: true,
    explanation: "This is a phishing attempt. Red flags include: generic greeting ('Valued Customer'), urgency and threats, suspicious sender domain (-secure.com), and pressure to act quickly.",
    completed: false
  },
  {
    id: 2,
    title: "Package Delivery Notice",
    description: "Analyze this delivery notification email.",
    emailContent: {
      from: "delivery-notification@trackyourpackage.net",
      to: "customer@email.com",
      subject: "📦 Your Package Delivery Status Update #TN8547962",
      date: "Yesterday, 3:22 PM",
      body: `Tracking Number: #TN8547962

Your recent order has arrived at our local facility but requires additional delivery instructions.

Action Required:
- Review and confirm your delivery address
- Select preferred delivery time
- Pay outstanding processing fee ($2.99)

Click here to manage your delivery: [Track Package Status]

Please note: Packages not claimed within 48 hours will be returned to sender.

Delivery Management Team`
    },
    isPhishing: true,
    explanation: "This is a phishing attempt. Red flags: unexpected delivery, unusual processing fee request, generic tracking number, pressure tactics, and suspicious domain name.",
    completed: false
  },
  {
    id: 3,
    title: "Password Reset Confirmation",
    description: "Evaluate this password reset email.",
    emailContent: {
      from: "no-reply@netflix.com",
      to: "customer@email.com",
      subject: "🔒 Netflix Password Reset Request",
      date: "2 hours ago",
      body: `Hello,

We received a request to reset the password for your Netflix account. 

If you did not make this request, you can safely ignore this email and your password will remain unchanged.

To reset your password, click the secure button below:

[Reset Password]

This password reset link will expire in 24 hours for security reasons.

Thanks,
The Netflix Team

Note: We never ask for your password or payment details via email.`
    },
    isPhishing: false,
    explanation: "This is legitimate. It follows security best practices: no urgency, clear option to ignore if not requested, security-focused messaging, official domain, and clear security statement about never asking for sensitive information.",
    completed: false
  }
]

export default function PhishingChallenges() {
  const [userChallenges, setUserChallenges] = useState<Challenge[]>(challenges)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  const loadChallengeProgress = async () => {
    try {
      const response = await fetch('/api/challenges/progress?type=phishing')
      const data = await response.json()
      
      const updatedChallenges = challenges.map(challenge => ({
        ...challenge,
        completed: data.completedChallengeIds.includes(challenge.id)
      }))
      
      setUserChallenges(updatedChallenges)
      setLoading(false)

      // Check if all challenges are completed and update module progress
      const allCompleted = updatedChallenges.every(challenge => challenge.completed)
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
      console.error('Failed to load challenge progress:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChallengeProgress()
  }, [])

  const handleAnswer = async (isPhishingGuess: boolean) => {
    if (!selectedChallenge) return

    const correct = isPhishingGuess === selectedChallenge.isPhishing
    setLastAnswer(correct)
    setShowResult(true)

    setUserChallenges(prev => prev.map(challenge => 
      challenge.id === selectedChallenge.id 
        ? { ...challenge, completed: true }
        : challenge
    ))

    try {
      await fetch('/api/challenges/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          correct,
          type: 'phishing',
          pathId: 'phishing'
        })
      })

      await loadChallengeProgress() // Reload progress after saving
    } catch (error) {
      console.error('Failed to save challenge result:', error)
    }
  }

  const handleNextChallenge = () => {
    const currentIndex = selectedChallenge ? userChallenges.findIndex(c => c.id === selectedChallenge.id) : -1
    const nextIndex = currentIndex + 1
    if (nextIndex < userChallenges.length) {
      setSelectedChallenge(userChallenges[nextIndex])
      setShowResult(false)
      setLastAnswer(null)
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
                Phishing Email Challenges
              </h2>
              <p className="text-gray-400 mt-2 text-lg">Practice identifying real phishing attempts in a safe environment.</p>
            </div>
            <div className="flex items-center gap-3 bg-[#1a1a1a]/50 px-6 py-4 rounded-2xl border border-[#3a3a3a]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#47F3AB] to-[#47F3AB]/70 rounded-xl flex items-center justify-center">
                <IconShieldCheck size={24} className="text-[#1a1a1a]" />
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
                        setShowResult(false)
                        setLastAnswer(null)
                      }}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedChallenge?.id === challenge.id
                            ? 'bg-[#47F3AB] text-[#1a1a1a]'
                            : challenge.completed 
                              ? 'bg-[#47F3AB]/20 text-[#47F3AB]' 
                              : 'bg-[#1a1a1a] text-gray-400'
                        }`}>
                          <IconMail size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${
                            selectedChallenge?.id === challenge.id
                              ? 'text-[#47F3AB]'
                              : 'text-white'
                          }`}>
                            {challenge.title}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            selectedChallenge?.id === challenge.id
                              ? 'text-[#47F3AB]/80'
                              : challenge.completed 
                                ? 'text-[#47F3AB]/70' 
                                : 'text-gray-400'
                          }`}>
                            {challenge.completed ? (
                              <span className="flex items-center gap-2">
                                <IconCheck size={16} />
                                Completed
                              </span>
                            ) : challenge.description}
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
                      className="space-y-6 p-8"
                    >
                      {/* Email Viewer */}
                      <div className="space-y-4">
                        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#3a3a3a]">
                          {/* Email Header */}
                          <div className="border-b border-[#3a3a3a] p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold text-xl text-white">{selectedChallenge.emailContent.subject}</h3>
                              <span className="text-[#47F3AB] text-sm font-medium px-3 py-1 bg-[#47F3AB]/10 rounded-full">
                                {selectedChallenge.emailContent.date}
                              </span>
                            </div>
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center gap-3">
                                <span className="text-gray-400 min-w-[3rem]">From:</span>
                                <span className="text-white font-mono px-3 py-1 bg-[#2a2a2a] rounded-lg">{selectedChallenge.emailContent.from}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-gray-400 min-w-[3rem]">To:</span>
                                <span className="text-white font-mono px-3 py-1 bg-[#2a2a2a] rounded-lg">{selectedChallenge.emailContent.to}</span>
                              </div>
                            </div>
                          </div>
                          {/* Email Body */}
                          <div className="p-6">
                            <div className="font-mono text-[15px] whitespace-pre-wrap text-white/90 leading-relaxed">
                              {selectedChallenge.emailContent.body.split('\n').map((line, i) => (
                                <div key={i} className={`${line.trim() === '' ? 'h-4' : 'mb-2'}`}>
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {!showResult ? (
                        <motion.div className="flex gap-4">
                          <Button 
                            variant="destructive"
                            className="flex-1 py-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border-2 border-red-500/20 hover:border-red-500/30 transition-all duration-300"
                            onClick={() => handleAnswer(true)}
                          >
                            <IconX className="mr-2" size={20} />
                            Mark as Phishing
                          </Button>
                          <Button 
                            variant="default"
                            className="flex-1 py-6 bg-[#47F3AB] hover:bg-[#47F3AB]/90 text-[#1a1a1a] rounded-xl font-medium border-2 border-[#47F3AB] transition-all duration-300"
                            onClick={() => handleAnswer(false)}
                          >
                            <IconCheck className="mr-2" size={20} />
                            Mark as Legitimate
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          <div className={`p-6 rounded-2xl border-2 ${
                            lastAnswer 
                              ? 'bg-[#47F3AB]/10 text-[#47F3AB] border-[#47F3AB]/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}>
                            <div className="flex items-center gap-3 mb-4">
                              {lastAnswer ? (
                                <div className="w-10 h-10 rounded-xl bg-[#47F3AB]/20 flex items-center justify-center">
                                  <IconCheck size={24} />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                  <IconX size={24} />
                                </div>
                              )}
                              <span className="font-semibold text-lg">
                                {lastAnswer ? 'Great catch!' : 'Keep practicing!'}
                              </span>
                            </div>
                            <p className="text-base leading-relaxed text-white/90">{selectedChallenge.explanation}</p>
                          </div>

                          <motion.div
                            className="flex gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Button 
                              variant="outline"
                              className="flex-1 py-6 text-base font-medium bg-[#1a1a1a] border-[#3a3a3a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-xl transition-all duration-300"
                              onClick={() => {
                                setSelectedChallenge(null)
                                setShowResult(false)
                              }}
                            >
                              Back to Challenges
                            </Button>
                            {selectedChallenge.id < userChallenges.length && (
                              <Button 
                                variant="default"
                                className="flex-1 py-6 text-base font-medium bg-gradient-to-r from-[#47F3AB] to-[#47F3AB]/80 hover:from-[#47F3AB]/90 hover:to-[#47F3AB]/70 text-[#1a1a1a] rounded-xl transition-all duration-300"
                                onClick={handleNextChallenge}
                              >
                                Next Challenge
                              </Button>
                            )}
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-16"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-[#47F3AB] to-[#47F3AB]/70 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <IconMail size={32} className="text-[#1a1a1a]" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Ready to Start?</h3>
                      <p className="text-gray-400 text-lg">
                        Select a challenge from the list to begin
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