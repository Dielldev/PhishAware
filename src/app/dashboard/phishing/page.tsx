import { Metadata } from 'next'
import PhishingChallenges from '@/components/phishing/PhishingChallenges'
import PhishingQuizzes from '@/components/phishing/PhishingQuizzes'

export const metadata: Metadata = {
  title: 'Phishing Awareness | PhishAware',
  description: 'Learn to identify and protect yourself from phishing attacks',
}

export default function PhishingPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Phishing Awareness Training</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Master the art of identifying and avoiding phishing attacks through interactive challenges and quizzes.
        </p>
      </div>

      <div className="grid gap-6">
        <PhishingChallenges />
        <PhishingQuizzes />
      </div>
    </div>
  )
} 