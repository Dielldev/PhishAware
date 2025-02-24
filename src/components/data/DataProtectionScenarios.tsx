'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconDatabase, IconCheck, IconX, IconShieldLock } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface Scenario {
  id: number
  title: string
  description: string
  situation: string
  options: {
    text: string
    isCorrect: boolean
    explanation: string
  }[]
  completed: boolean
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "The Public WiFi Dilemma",
    description: "Handle sensitive data access while working remotely.",
    situation: `You're working from a coffee shop and need to access the company's customer database to complete an urgent task. You have your laptop but the only available internet connection is the cafe's public WiFi.

What's the most secure way to proceed?`,
    options: [
      {
        text: "Connect directly to the company database using the public WiFi",
        isCorrect: false,
        explanation: "Using public WiFi to directly access sensitive data puts the information at risk of interception. Always use secure connections for sensitive data."
      },
      {
        text: "Use your mobile hotspot or company-provided VPN to connect",
        isCorrect: true,
        explanation: "Using a VPN or secure mobile hotspot creates an encrypted connection, protecting sensitive data from potential eavesdropping on public networks."
      },
      {
        text: "Download the data to your laptop for offline work",
        isCorrect: false,
        explanation: "Downloading sensitive data to a local device increases the risk of data breaches if the device is lost or compromised."
      }
    ],
    completed: false
  },
  {
    id: 2,
    title: "The Data Disposal Challenge",
    description: "Properly handle sensitive document disposal.",
    situation: `You're cleaning your desk and find several old documents containing customer information, employee details, and financial records. Some are printed and others are on a USB drive you no longer need.

How should you dispose of these materials?`,
    options: [
      {
        text: "Recycle the papers and format the USB drive",
        isCorrect: false,
        explanation: "Regular recycling and formatting don't securely destroy sensitive data. Documents can be retrieved from recycling, and formatted drives can be recovered."
      },
      {
        text: "Use the office shredder and keep the USB drive as backup",
        isCorrect: false,
        explanation: "While shredding is good, keeping unnecessary sensitive data on storage devices creates security risks. All unused sensitive data should be securely destroyed."
      },
      {
        text: "Use a cross-cut shredder for papers and securely wipe/destroy the USB drive",
        isCorrect: true,
        explanation: "Cross-cut shredding makes document reconstruction nearly impossible, and secure device destruction ensures digital data cannot be recovered."
      }
    ],
    completed: false
  },
  {
    id: 3,
    title: "The Data Sharing Request",
    description: "Handle an external request for sensitive information.",
    situation: `You receive an email from a partner company requesting a spreadsheet of customer contact details for a joint marketing campaign. The email mentions the project is approved by management and needs to be completed today.

How do you handle this data sharing request?`,
    options: [
      {
        text: "Share the file via email since it's an approved partner",
        isCorrect: false,
        explanation: "Sending sensitive data via regular email is insecure. Additionally, proper data sharing procedures should be followed regardless of partner status."
      },
      {
        text: "Verify the request through proper channels and use secure file transfer methods",
        isCorrect: true,
        explanation: "Always verify data sharing requests through official channels and use approved secure methods for transferring sensitive data."
      },
      {
        text: "Send only partial data to reduce risk",
        isCorrect: false,
        explanation: "Sending any amount of sensitive data without proper verification and secure methods violates data protection principles."
      }
    ],
    completed: false
  },
  {
    id: 4,
    title: "The Cloud Storage Situation",
    description: "Manage sensitive data in cloud storage.",
    situation: `Your team is moving project files to a cloud storage service for easier collaboration. Some files contain sensitive company data and personal information.

What's the best approach for setting up the cloud storage?`,
    options: [
      {
        text: "Upload all files to a shared team folder for easy access",
        isCorrect: false,
        explanation: "Storing sensitive data without proper access controls and encryption puts it at risk. Different types of data require different security measures."
      },
      {
        text: "Keep sensitive files on local storage only",
        isCorrect: false,
        explanation: "While this might seem safer, it prevents legitimate collaboration and might lead to unsafe workarounds by team members."
      },
      {
        text: "Use encrypted storage with proper access controls and data classification",
        isCorrect: true,
        explanation: "This approach ensures data security while enabling collaboration. Encryption protects sensitive data, and access controls ensure only authorized users can view specific files."
      }
    ],
    completed: false
  }
]

export default function DataProtectionScenarios() {
  const [userScenarios, setUserScenarios] = useState<Scenario[]>(scenarios)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  // Load scenarios progress
  useEffect(() => {
    const loadScenariosProgress = async () => {
      try {
        const response = await fetch('/api/modules/data-protection-progress')
        const data = await response.json()
        
        if (response.ok) {
          const updatedScenarios = scenarios.map(scenario => ({
            ...scenario,
            completed: data.completedChallengeIds.includes(scenario.id)
          }))
          setUserScenarios(updatedScenarios)
        }
      } catch (error) {
        console.error('Failed to load scenarios progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadScenariosProgress()
  }, [])

  const handleAnswer = async (optionIndex: number) => {
    if (!selectedScenario) return

    const correct = selectedScenario.options[optionIndex].isCorrect
    setIsCorrect(correct)
    setSelectedOption(optionIndex)
    setShowResult(true)

    // Mark scenario as completed in local state
    setUserScenarios(prev => prev.map(scenario => 
      scenario.id === selectedScenario.id 
        ? { ...scenario, completed: true }
        : scenario
    ))

    try {
      await fetch('/api/scenarios/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          correct,
          type: 'data'
        })
      })

      // Check if all scenarios are completed and update module progress if needed
      const allCompleted = userScenarios.every(s => 
        s.id === selectedScenario.id ? true : s.completed
      )
      
      if (allCompleted) {
        await fetch('/api/modules/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            module: 'data-protection',
            type: 'challenge'
          })
        })
      }
    } catch (error) {
      console.error('Failed to save scenario result:', error)
    }
  }

  const handleNextScenario = () => {
    const currentIndex = selectedScenario ? userScenarios.findIndex(s => s.id === selectedScenario.id) : -1
    const nextIndex = currentIndex + 1
    if (nextIndex < userScenarios.length) {
      setSelectedScenario(userScenarios[nextIndex])
      setShowResult(false)
      setSelectedOption(null)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#47F3AB]" />
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
                Data Protection Scenarios
              </h2>
              <p className="text-gray-400 mt-2 text-lg">Practice handling real-world data protection challenges.</p>
            </div>
            <div className="flex items-center gap-3 bg-[#1a1a1a]/50 px-6 py-4 rounded-2xl border border-[#3a3a3a]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#47F3AB] to-[#47F3AB]/70 rounded-xl flex items-center justify-center">
                <IconDatabase size={24} className="text-[#1a1a1a]" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Progress</div>
                <div className="text-xl font-bold text-white">
                  {userScenarios.filter(s => s.completed).length}/{userScenarios.length}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Scenario List */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white px-1">Available Scenarios</h3>
              <div className="space-y-4">
                {userScenarios.map((scenario) => (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                        selectedScenario?.id === scenario.id 
                          ? 'bg-gradient-to-br from-[#47F3AB]/20 to-[#47F3AB]/5 border-[#47F3AB] shadow-lg shadow-[#47F3AB]/20' 
                          : 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#47F3AB]/50'
                      } rounded-2xl`}
                      onClick={() => {
                        setSelectedScenario(scenario)
                        setShowResult(false)
                        setSelectedOption(null)
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedScenario?.id === scenario.id
                            ? 'bg-[#1a1a1a] text-[#47F3AB]'
                            : scenario.completed 
                              ? 'bg-[#47F3AB] text-[#1a1a1a]' 
                              : 'bg-[#1a1a1a] text-gray-400'
                        }`}>
                          <IconDatabase size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium text-lg ${
                            selectedScenario?.id === scenario.id
                              ? 'text-[#1a1a1a]'
                              : 'text-white'
                          }`}>
                            {scenario.title}
                          </h3>
                          <p className={`text-sm ${
                            selectedScenario?.id === scenario.id
                              ? 'text-[#1a1a1a]/80'
                              : scenario.completed 
                                ? 'text-[#47F3AB]' 
                                : 'text-gray-400'
                          }`}>
                            {scenario.completed ? 'Completed ✓' : scenario.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scenario Viewer */}
            <div className="md:sticky md:top-4">
              <Card className="shadow-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#3a3a3a] rounded-3xl overflow-hidden">
                <AnimatePresence mode="wait">
                  {selectedScenario ? (
                    <motion.div
                      key={selectedScenario.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6 p-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">{selectedScenario.title}</h3>
                        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#3a3a3a] mb-6">
                          <p className="text-white whitespace-pre-wrap">{selectedScenario.situation}</p>
                        </div>
                        <div className="space-y-3">
                          {selectedScenario.options.map((option, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Button
                                variant={
                                  showResult
                                    ? option.isCorrect
                                      ? 'default'
                                      : index === selectedOption
                                      ? 'destructive'
                                      : 'outline'
                                    : 'outline'
                                }
                                className={`w-full justify-start text-left p-6 text-base rounded-xl bg-[#1a1a1a] border-[#2a2a2a] hover:bg-[#2a2a2a] ${
                                  showResult && option.isCorrect
                                    ? 'ring-2 ring-[#47F3AB] text-[#47F3AB]'
                                    : showResult && index === selectedOption && !option.isCorrect
                                    ? 'ring-2 ring-red-500 text-red-400'
                                    : 'text-white hover:text-[#47F3AB]'
                                }`}
                                onClick={() => !showResult && handleAnswer(index)}
                                disabled={showResult}
                              >
                                {option.text}
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence>
                        {showResult && selectedOption !== null && (
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
                                  {isCorrect ? 'Excellent decision!' : 'That could be risky'}
                                </span>
                              </div>
                              <p className="text-base leading-relaxed text-white">
                                {selectedScenario.options[selectedOption].explanation}
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
                                  setSelectedScenario(null)
                                  setShowResult(false)
                                  setSelectedOption(null)
                                }}
                              >
                                Back to Scenarios
                              </Button>
                              {selectedScenario.id < userScenarios.length && (
                                <Button 
                                  variant="default"
                                  className="flex-1 py-6 text-base font-medium bg-[#47F3AB] hover:bg-[#47F3AB]/90 text-[#1a1a1a] rounded-xl"
                                  onClick={handleNextScenario}
                                >
                                  Next Scenario
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
                        <IconDatabase size={24} className="text-[#1a1a1a]" />
                      </div>
                      <p className="text-gray-400 text-lg">
                        Select a scenario to begin
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