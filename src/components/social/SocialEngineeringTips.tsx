'use client'

import { Card } from '@/components/ui/card'
import { IconShieldLock, IconAlertTriangle, IconBrain, IconUsers } from '@tabler/icons-react'
import { motion } from 'framer-motion'

interface Tip {
  icon: JSX.Element
  title: string
  description: string
  guidelines: string[]
}

const tips: Tip[] = [
  {
    icon: <IconAlertTriangle size={24} />,
    title: "Recognize Common Tactics",
    description: "Learn to identify the most frequent social engineering approaches.",
    guidelines: [
      "Be wary of unsolicited contact requesting sensitive information",
      "Watch for urgency or pressure tactics in requests",
      "Question unexpected prizes or 'too good to be true' offers",
      "Be suspicious of requests that bypass normal procedures",
      "Look out for emotional manipulation attempts"
    ]
  },
  {
    icon: <IconBrain size={24} />,
    title: "Verify and Validate",
    description: "Always confirm the authenticity of requests through proper channels.",
    guidelines: [
      "Use official contact numbers to verify suspicious requests",
      "Never trust caller ID or email addresses without verification",
      "Confirm unusual requests with supervisors or relevant departments",
      "Check email headers and links before clicking",
      "Use multi-factor authentication when available"
    ]
  },
  {
    icon: <IconUsers size={24} />,
    title: "Physical Security",
    description: "Protect against in-person social engineering attempts.",
    guidelines: [
      "Never allow tailgating through secure entrances",
      "Always wear visible identification in secure areas",
      "Question unfamiliar faces in restricted areas",
      "Secure sensitive documents and screens when away",
      "Follow clean desk policies and document disposal procedures"
    ]
  },
  {
    icon: <IconShieldLock size={24} />,
    title: "Information Handling",
    description: "Protect sensitive information from social engineering attacks.",
    guidelines: [
      "Never share passwords or access credentials",
      "Use secure channels for sensitive communications",
      "Be careful with information shared on social media",
      "Shred or securely dispose of sensitive documents",
      "Follow data classification and handling policies"
    ]
  }
]

export default function SocialEngineeringTips() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#2a2a2a] p-6 rounded-2xl"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">
            Security Best Practices
          </h2>
          <p className="text-gray-400 mt-2">Essential guidelines to protect against social engineering attacks.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#2a2a2a]">
          <div className="w-8 h-8 bg-[#47F3AB] rounded-lg flex items-center justify-center">
            <IconShieldLock size={20} className="text-[#1a1a1a]" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Tips</div>
            <div className="font-semibold text-white">
              {tips.length} Categories
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-[#2a2a2a] border-0 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#47F3AB] rounded-xl flex items-center justify-center text-[#1a1a1a]">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{tip.title}</h3>
                  <p className="text-gray-400">{tip.description}</p>
                </div>
              </div>
              <div className="space-y-3">
                {tip.guidelines.map((guideline, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a]"
                  >
                    <div className="w-6 h-6 bg-[#47F3AB]/10 rounded-lg flex items-center justify-center text-[#47F3AB] mt-0.5">
                      <IconShieldLock size={14} />
                    </div>
                    <p className="flex-1 text-white text-sm leading-relaxed">
                      {guideline}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Card className="p-6 bg-[#2a2a2a] border-0 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">Remember</h3>
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#3a3a3a]">
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <IconShieldLock size={16} className="text-[#47F3AB]" />
                Trust your instincts - if something feels wrong, it probably is
              </li>
              <li className="flex items-center gap-2">
                <IconShieldLock size={16} className="text-[#47F3AB]" />
                It's better to take extra time to verify than to fall victim to an attack
              </li>
              <li className="flex items-center gap-2">
                <IconShieldLock size={16} className="text-[#47F3AB]" />
                Report suspicious activities to your security team
              </li>
              <li className="flex items-center gap-2">
                <IconShieldLock size={16} className="text-[#47F3AB]" />
                Stay updated on the latest social engineering tactics
              </li>
            </ul>
          </div>
        </Card>
      </motion.div>
    </div>
  )
} 