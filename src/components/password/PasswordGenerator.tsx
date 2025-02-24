'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconRefresh, IconCopy, IconCheck, IconShieldLock } from '@tabler/icons-react'
import { motion } from 'framer-motion'

interface GeneratorOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  })

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    let chars = ''
    if (options.includeUppercase) chars += uppercase
    if (options.includeLowercase) chars += lowercase
    if (options.includeNumbers) chars += numbers
    if (options.includeSymbols) chars += symbols

    if (chars === '') {
      // Default to lowercase if nothing is selected
      chars = lowercase
      setOptions(prev => ({ ...prev, includeLowercase: true }))
    }

    let result = ''
    const length = Math.max(8, Math.min(32, options.length)) // Ensure length is between 8 and 32
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    setPassword(result)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy password:', error)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#2a2a2a] p-6 rounded-2xl"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">
            Strong Password Generator
          </h2>
          <p className="text-gray-400 mt-2">Generate secure, random passwords that are hard to crack.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#2a2a2a]">
          <div className="w-8 h-8 bg-[#47F3AB] rounded-lg flex items-center justify-center">
            <IconShieldLock size={20} className="text-[#1a1a1a]" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Security</div>
            <div className="font-semibold text-white">
              {options.length} Characters
            </div>
          </div>
        </div>
      </motion.div>

      <Card className="bg-[#2a2a2a] border-0 p-6 rounded-2xl">
        <div className="space-y-6">
          {/* Password Display */}
          <div className="relative">
            <Input
              value={password}
              readOnly
              placeholder="Click generate to create a password"
              className="pr-24 font-mono text-lg h-14 bg-[#1a1a1a] border-[#3a3a3a] text-white"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-[#47F3AB] hover:bg-[#47F3AB]/10"
                onClick={copyToClipboard}
              >
                {copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-[#47F3AB] hover:bg-[#47F3AB]/10"
                onClick={generatePassword}
              >
                <IconRefresh size={20} />
              </Button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Password Length: {options.length}</label>
              <input
                type="range"
                min="8"
                max="32"
                value={options.length}
                onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#47F3AB]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={options.includeUppercase}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeUppercase: e.target.checked }))}
                  className="rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#47F3AB] focus:ring-[#47F3AB]"
                />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeLowercase: e.target.checked }))}
                  className="rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#47F3AB] focus:ring-[#47F3AB]"
                />
                Lowercase (a-z)
              </label>
              <label className="flex items-center gap-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeNumbers: e.target.checked }))}
                  className="rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#47F3AB] focus:ring-[#47F3AB]"
                />
                Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={options.includeSymbols}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeSymbols: e.target.checked }))}
                  className="rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#47F3AB] focus:ring-[#47F3AB]"
                />
                Symbols (!@#$%^&*)
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generatePassword}
            className="w-full py-6 bg-[#47F3AB] hover:bg-[#47F3AB]/90 text-[#1a1a1a] rounded-xl font-medium text-lg"
          >
            Generate Password
          </Button>

          {/* Password Tips */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#3a3a3a]">
            <h3 className="text-[#47F3AB] font-medium mb-2">Password Tips:</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• Use a minimum of 12 characters for better security</li>
              <li>• Mix uppercase, lowercase, numbers, and symbols</li>
              <li>• Avoid using personal information</li>
              <li>• Use a different password for each account</li>
              <li>• Consider using a password manager to store passwords securely</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
} 