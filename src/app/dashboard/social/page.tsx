'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SocialEngineeringScenarios from "@/components/social/SocialEngineeringScenarios"
import SocialEngineeringQuiz from "@/components/social/SocialEngineeringQuiz"
import SocialEngineeringTips from "@/components/social/SocialEngineeringTips"

export default function SocialEngineeringPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Social Engineering Training</h1>
        <p className="text-gray-400 mt-2">Learn to identify and protect against social engineering attacks.</p>
      </div>

      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="bg-[#2a2a2a] border-b border-[#3a3a3a]">
          <TabsTrigger 
            value="scenarios"
            className="data-[state=active]:bg-[#47F3AB] data-[state=active]:text-[#1a1a1a]"
          >
            Interactive Scenarios
          </TabsTrigger>
          <TabsTrigger 
            value="quiz"
            className="data-[state=active]:bg-[#47F3AB] data-[state=active]:text-[#1a1a1a]"
          >
            Knowledge Quiz
          </TabsTrigger>
          <TabsTrigger 
            value="tips"
            className="data-[state=active]:bg-[#47F3AB] data-[state=active]:text-[#1a1a1a]"
          >
            Security Tips
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scenarios" className="mt-6">
          <SocialEngineeringScenarios />
        </TabsContent>
        <TabsContent value="quiz" className="mt-6">
          <SocialEngineeringQuiz />
        </TabsContent>
        <TabsContent value="tips" className="mt-6">
          <SocialEngineeringTips />
        </TabsContent>
      </Tabs>
    </div>
  )
} 