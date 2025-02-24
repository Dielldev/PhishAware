'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PasswordSecurityQuiz from "@/components/password/PasswordSecurityQuiz"
import PasswordChallenges from "@/components/password/PasswordChallenges"
import PasswordGenerator from "@/components/password/PasswordGenerator"

export default function PasswordSecurityPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Password Security Training</h1>
        <p className="text-gray-400 mt-2">Learn about password security best practices and test your knowledge.</p>
      </div>

      <Tabs defaultValue="quiz" className="w-full">
        <TabsList className="bg-[#2a2a2a] border-b border-[#3a3a3a]">
          <TabsTrigger 
            value="quiz"
            className="data-[state=active]:bg-[#47F3AB] data-[state=active]:text-[#1a1a1a]"
          >
            Knowledge Quiz
          </TabsTrigger>
          <TabsTrigger 
            value="challenges"
            className="data-[state=active]:bg-[#47F3AB] data-[state=active]:text-[#1a1a1a]"
          >
            Password Challenges
          </TabsTrigger>
          <TabsTrigger 
            value="generator"
            className="data-[state=active]:bg-[#47F3AB] data-[state=active]:text-[#1a1a1a]"
          >
            Password Generator
          </TabsTrigger>
        </TabsList>
        <TabsContent value="quiz" className="mt-6">
          <PasswordSecurityQuiz />
        </TabsContent>
        <TabsContent value="challenges" className="mt-6">
          <PasswordChallenges />
        </TabsContent>
        <TabsContent value="generator" className="mt-6">
          <PasswordGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
} 