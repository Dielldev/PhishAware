'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconUsers, IconCheck, IconX } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Scenario {
  id: number;
  title: string;
  description: string;
  situation: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  completed: boolean;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "The Phone Call",
    description: "Handle a suspicious phone call claiming to be from IT support.",
    situation: `You receive a phone call from someone claiming to be from your company's IT department. They say they've detected suspicious activity on your computer and need your login credentials to fix the issue immediately.

What should you do?`,
    options: [
      {
        text: "Provide your credentials since they're from IT",
        isCorrect: false,
        explanation: "Never share your credentials over the phone, even if the caller claims to be from IT. Legitimate IT staff will never ask for your password."
      },
      {
        text: "Hang up and report the incident to your actual IT department",
        isCorrect: true,
        explanation: "This is the correct response. Always verify requests through official channels and never share credentials over the phone."
      },
      {
        text: "Ask them to prove they're from IT by sharing internal information",
        isCorrect: false,
        explanation: "Attackers might already have some internal information. The best response is to end the call and report it."
      }
    ],
    completed: false
  },
  {
    id: 2,
    title: "The LinkedIn Request",
    description: "Evaluate a suspicious connection request.",
    situation: `You receive a LinkedIn connection request from someone claiming to be a recruiter from a well-known tech company. Their profile was created recently and has minimal information, but they mention a job opportunity with an impressive salary.

How should you proceed?`,
    options: [
      {
        text: "Accept the request to learn more about the opportunity",
        isCorrect: false,
        explanation: "New profiles with minimal information offering too-good-to-be-true opportunities are often scams or social engineering attempts."
      },
      {
        text: "Research the profile and company thoroughly before responding",
        isCorrect: true,
        explanation: "Always verify the legitimacy of recruiters and job opportunities. Check official company channels and verify the recruiter's credentials."
      },
      {
        text: "Share your resume and contact information to start the process",
        isCorrect: false,
        explanation: "Never share personal information with unverified contacts, as this could lead to identity theft or other scams."
      }
    ],
    completed: false
  },
  {
    id: 3,
    title: "The USB Drive",
    description: "Handle a found USB drive situation.",
    situation: `You find a USB drive in the parking lot with your company's logo on it. There's a label saying "Confidential Salary Information 2024".

What's the safest course of action?`,
    options: [
      {
        text: "Plug it in to see if it contains important company information",
        isCorrect: false,
        explanation: "Never plug in unknown USB drives. They could contain malware that automatically executes when connected."
      },
      {
        text: "Turn it in to IT security without plugging it in",
        isCorrect: true,
        explanation: "This is the correct approach. Unknown USB drives could be part of a social engineering attack. Let IT security handle it safely."
      },
      {
        text: "Share it with HR since it contains salary information",
        isCorrect: false,
        explanation: "The USB could be planted as a trap. Always treat unknown storage devices as potential security threats."
      }
    ],
    completed: false
  }
];

export default function SocialEngineeringScenarios() {
  const [userScenarios, setUserScenarios] = useState<Scenario[]>(scenarios)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  const loadScenariosProgress = async () => {
    try {
      const response = await fetch('/api/scenarios/progress?type=social')
      const data = await response.json()
      
      const updatedScenarios = scenarios.map(scenario => ({
        ...scenario,
        completed: data.completedScenarioIds.includes(scenario.id)
      }))
      
      setUserScenarios(updatedScenarios)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load scenarios progress:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScenariosProgress()
  }, [])

  const handleAnswer = async (optionIndex: number) => {
    if (!selectedScenario) return

    const correct = selectedScenario.options[optionIndex].isCorrect
    setIsCorrect(correct)
    setSelectedOption(optionIndex)
    setShowResult(true)

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
          type: 'social',
          pathId: 'social'
        })
      })

      await loadScenariosProgress()

      // Check if all scenarios are completed
      const allCompleted = userScenarios.every(s => 
        s.id === selectedScenario.id ? true : s.completed
      )
      
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-8 rounded-3xl border border-[#3a3a3a]"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#47F3AB] to-[#47F3AB]/70 text-transparent bg-clip-text">
            Social Engineering Scenarios
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Practice handling real-world social engineering situations.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#1a1a1a]/50 px-6 py-4 rounded-2xl border border-[#3a3a3a]">
          <div className="w-12 h-12 bg-gradient-to-br from-[#47F3AB] to-[#47F3AB]/70 rounded-xl flex items-center justify-center">
            <IconUsers size={24} className="text-[#1a1a1a]" />
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
                      <IconUsers size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-lg ${
                        selectedScenario?.id === scenario.id
                          ? 'text-white'
                          : 'text-white'
                      }`}>
                        {scenario.title}
                      </h3>
                      <p className={`text-sm ${
                        selectedScenario?.id === scenario.id
                          ? 'text-gray-400'
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
                              {isCorrect ? 'Good thinking!' : 'That could be risky'}
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
                    <IconUsers size={24} className="text-[#1a1a1a]" />
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
    </div>
  )
}