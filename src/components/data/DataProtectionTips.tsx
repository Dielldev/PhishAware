'use client'

import { Card } from '@/components/ui/card'
import { IconLock, IconShieldLock, IconTrash, IconEye, IconDatabase } from '@tabler/icons-react'
import { motion } from 'framer-motion'

interface Tip {
  icon: React.ReactNode
  title: string
  description: string
  guidelines: string[]
}

const tips: Tip[] = [
  {
    icon: <IconLock size={24} />,
    title: "Data Access Control",
    description: "Implement strong access controls to protect sensitive data from unauthorized access.",
    guidelines: [
      "Use role-based access control (RBAC) to limit data access to authorized personnel only",
      "Regularly review and update access permissions",
      "Implement strong authentication methods including multi-factor authentication",
      "Maintain detailed access logs for audit purposes",
      "Remove access immediately when no longer needed"
    ]
  },
  {
    icon: <IconShieldLock size={24} />,
    title: "Data Encryption",
    description: "Protect data confidentiality through proper encryption practices.",
    guidelines: [
      "Use industry-standard encryption algorithms for data at rest and in transit",
      "Implement end-to-end encryption for sensitive communications",
      "Securely manage encryption keys",
      "Regularly update encryption protocols to address new vulnerabilities",
      "Encrypt sensitive data before cloud storage or transmission"
    ]
  },
  {
    icon: <IconTrash size={24} />,
    title: "Secure Data Disposal",
    description: "Ensure sensitive data is properly destroyed when no longer needed.",
    guidelines: [
      "Use secure methods for physical document destruction (cross-cut shredding)",
      "Employ secure wiping tools for digital storage devices",
      "Document the disposal process for compliance",
      "Verify successful data destruction",
      "Include removable media in disposal procedures"
    ]
  },
  {
    icon: <IconEye size={24} />,
    title: "Data Privacy",
    description: "Maintain privacy and compliance with data protection regulations.",
    guidelines: [
      "Follow data minimization principles - collect only necessary data",
      "Implement privacy by design in new projects and systems",
      "Maintain transparency about data collection and usage",
      "Respect data subject rights (access, deletion, portability)",
      "Regular privacy impact assessments"
    ]
  },
  {
    icon: <IconDatabase size={24} />,
    title: "Data Classification",
    description: "Categorize data based on sensitivity to apply appropriate protection measures.",
    guidelines: [
      "Define clear data classification levels (public, internal, confidential, restricted)",
      "Label data according to classification",
      "Apply security controls based on classification level",
      "Train employees on data handling procedures",
      "Regularly review and update classifications"
    ]
  }
]

export default function DataProtectionTips() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#2a2a2a] p-6 rounded-2xl"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">
            Security Tips
          </h2>
          <p className="text-gray-400 mt-2">Essential guidelines for protecting sensitive data.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#2a2a2a]">
          <div className="w-8 h-8 bg-[#47F3AB] rounded-lg flex items-center justify-center">
            <IconShieldLock size={20} className="text-[#1a1a1a]" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Tips</div>
            <div className="font-semibold text-white">
              {tips.length} Guidelines
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 }
            }}
          >
            <Card className="p-6 bg-[#2a2a2a] border-0 rounded-xl h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-[#47F3AB] rounded-lg flex items-center justify-center text-[#1a1a1a]">
                  {tip.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{tip.title}</h3>
              </div>
              <p className="text-gray-400 mb-4">{tip.description}</p>
              <ul className="space-y-3">
                {tip.guidelines.map((guideline, guidelineIndex) => (
                  <motion.li
                    key={guidelineIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: (index * 0.1) + (guidelineIndex * 0.1) }
                    }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 bg-[#1a1a1a] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#47F3AB] rounded-full" />
                    </div>
                    <p className="text-white text-sm leading-relaxed">{guideline}</p>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 