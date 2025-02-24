'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { IconLogout, IconUsers, IconBook, IconQuestionMark, IconTrophy } from '@tabler/icons-react'

interface DatabaseData {
  users?: any[]
  learningPaths?: any[]
  quizResults?: any[]
  challengeResults?: any[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<DatabaseData>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/data')
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/duhet-admini')
            return
          }
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/duhet-admini' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-200 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Total Users',
      value: data.users?.length || 0,
      icon: <IconUsers className="w-6 h-6" />,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Learning Paths',
      value: data.learningPaths?.length || 0,
      icon: <IconBook className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Quiz Results',
      value: data.quizResults?.length || 0,
      icon: <IconQuestionMark className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Challenge Results',
      value: data.challengeResults?.length || 0,
      icon: <IconTrophy className="w-6 h-6" />,
      color: 'from-amber-500 to-amber-600'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-dark-200 rounded-xl p-6 border border-dark-100">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-dark-100 hover:bg-primary text-white hover:text-dark-200 rounded-lg transition-all duration-300"
          >
            <IconLogout size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-dark-200 border border-dark-100 rounded-xl p-6 hover:border-primary transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-white`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{metric.title}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Tables */}
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="bg-dark-200 border border-dark-100 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <div className="overflow-x-auto">
              {Array.isArray(value) && value.length > 0 ? (
                <div className="border border-dark-100 rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-dark-100">
                        {Object.keys(value[0]).map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-100">
                      {value.map((item, index) => (
                        <tr key={index} className="hover:bg-dark-100/50 transition-colors">
                          {Object.values(item).map((cell: any, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {typeof cell === 'object' ? JSON.stringify(cell) : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}