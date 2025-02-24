'use client';

import React, { useRef, useState, useEffect } from 'react'
import { User } from "@prisma/client"
import { 
  IconArrowRight, 
  IconBrandDiscord, 
  IconFish, 
  IconLock, 
  IconMask, 
  IconShield,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { Spinner } from '../ui/spinner'
import dynamic from 'next/dynamic'

// Import local images
import kaliImage from '@/assets/images/kali.jpg'

const NoSSR = dynamic<{ children: React.ReactNode }>(() => Promise.resolve(({ children }) => <>{children}</>), {
  ssr: false
})

interface DashboardMetricsProps {
  user?: User | null
}

interface ModuleProgress {
  progress: number;
  isComplete: boolean;
  quizProgress?: number;
  challengeProgress?: number;
}

interface LearningPath {
  title: string;
  description: string;
  progress: number;
  href: string;
  icon: React.ReactElement;
  imagePath: any;
}

export default function DashboardMetrics({ user }: DashboardMetricsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState<boolean | undefined>(undefined)
  const [canScrollRight, setCanScrollRight] = useState<boolean | undefined>(undefined)
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({})
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return;

    const fetchModuleProgress = async () => {
      try {
        const [phishingRes, passwordRes, socialRes, dataProtectionRes] = await Promise.all([
          fetch('/api/modules/phishing-progress'),
          fetch('/api/modules/password-progress'),
          fetch('/api/modules/social-engineering-progress'),
          fetch('/api/modules/data-protection-progress')
        ])

        const responses = {
          phishing: await phishingRes.json(),
          password: await passwordRes.json(),
          social: await socialRes.json(),
          dataProtection: await dataProtectionRes.json()
        }

        setModuleProgress({
          phishing: {
            progress: responses.phishing.progress,
            isComplete: responses.phishing.isComplete,
            quizProgress: responses.phishing.quizProgress,
            challengeProgress: responses.phishing.challengeProgress
          },
          password: {
            progress: responses.password.progress,
            isComplete: responses.password.isComplete,
            quizProgress: responses.password.quizProgress,
            challengeProgress: responses.password.challengeProgress
          },
          social: {
            progress: responses.social.progress,
            isComplete: responses.social.isComplete,
            quizProgress: responses.social.quizProgress,
            challengeProgress: responses.social.challengeProgress
          },
          dataProtection: {
            progress: responses.dataProtection.progress,
            isComplete: responses.dataProtection.isComplete,
            quizProgress: responses.dataProtection.quizProgress,
            challengeProgress: responses.dataProtection.challengeProgress
          }
        })
      } catch (error) {
        console.error('Error fetching module progress:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchModuleProgress()
    } else {
      setLoading(false)
    }
  }, [user, isMounted])

  const checkScroll = () => {
    if (!isMounted) return;
    
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    if (!isMounted) return;

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      checkScroll()
      scrollContainer.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)

      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [isMounted])

  const scroll = (direction: 'left' | 'right') => {
    if (!isMounted || !scrollContainerRef.current) return;
    
    const scrollAmount = 320
    const currentScroll = scrollContainerRef.current.scrollLeft
    const targetScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount
    
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  const learningPaths: LearningPath[] = [
    {
      title: "Phishing Awareness",
      description: "Learn to identify and protect against phishing attempts. Master email security and stay safe online.",
      progress: moduleProgress.phishing?.progress || 0,
      href: "/dashboard/phishing",
      icon: <IconFish size={20} />,
      imagePath: kaliImage,
    },
    {
      title: "Password Security",
      description: "Master the art of creating and managing secure passwords. Learn modern password protection techniques.",
      progress: moduleProgress.password?.progress || 0,
      href: "/dashboard/password",
      icon: <IconLock size={20} />,
      imagePath: kaliImage,
    },
    {
      title: "Social Engineering",
      description: "Understand and defend against social engineering tactics. Learn to identify manipulation attempts.",
      progress: moduleProgress.social?.progress || 0,
      href: "/dashboard/social",
      icon: <IconMask size={20} />,
      imagePath: kaliImage,
    },
    {
      title: "Data Protection",
      description: "Learn essential data protection practices. Master encryption and secure data handling.",
      progress: moduleProgress.dataProtection?.progress || 0,
      href: "/dashboard/data-protection",
      icon: <IconShield size={20} />,
      imagePath: kaliImage,
    }
  ]

  // Helper function to get full name
  const getFullName = (user?: User | null) => {
    if (!user) return "Learner";
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Learner";
  }

  // Helper function to get initials
  const getInitials = (user?: User | null) => {
    if (!user) return "?";
    return ((user.firstName?.[0] || "") + (user.lastName?.[0] || "")).toUpperCase() || "?";
  }

  if (!isMounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-8">
{/* User Welcome Section */}
 

      {/* User Welcome Section */}
      <div className="bg-dark-200 rounded-xl p-8 border border-dark-100">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full blur opacity-75"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border border-dark-100">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={getFullName(user)}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-dark-100 flex items-center justify-center text-3xl text-white">
                  {getInitials(user)}
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Hello, {getFullName(user)}! 👋
            </h1>
            <p className="text-gray-400 text-lg">Ready to continue your cybersecurity journey?</p>
          </div>
        </div>
      </div>

      {/* Learning Paths Section */}
      <NoSSR>
        <div className="relative bg-dark-200 rounded-xl border border-dark-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Learning Paths</h2>
              <p className="text-gray-400">Master essential cybersecurity skills with our guided learning paths</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className={`p-3 rounded-xl bg-dark-100/80 backdrop-blur-sm hover:bg-primary text-white hover:text-dark-200 transition-all duration-300 ${
                  canScrollLeft 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-5 pointer-events-none'
                }`}
                aria-label="Scroll left"
                disabled={!canScrollLeft}
              >
                <IconChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll('right')}
                className={`p-3 rounded-xl bg-dark-100/80 backdrop-blur-sm hover:bg-primary text-white hover:text-dark-200 transition-all duration-300 ${
                  canScrollRight 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-5 pointer-events-none'
                }`}
                aria-label="Scroll right"
                disabled={!canScrollRight}
              >
                <IconChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-dark-200 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-dark-200 to-transparent z-10 pointer-events-none" />
            
            <div 
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory custom-scrollbar scroll-smooth"
              style={{ overflowX: 'auto' }}
            >
              {learningPaths.map((path, index) => (
                <div key={index} className="flex-none w-[300px] snap-start">
                  <div className="bg-dark-200 relative border border-dark-100 group hover:border-primary dark:hover:border-primary/50 dark:hover:shadow-2xl dark:hover:shadow-primary/20 w-auto h-auto rounded-xl p-8">
                    <div className="w-full mb-6">
                      <div className="relative w-full h-64 rounded-xl overflow-hidden">
                        <Image
                          src={path.imagePath}
                          alt={path.title}
                          className="h-full w-full object-cover transition-all duration-300 transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-dark-100/90 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                              {React.cloneElement(path.icon, { 
                                className: "text-white group-hover:text-dark-200 transition-colors duration-300",
                                size: 24
                              })}
                            </div>
                            <span className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                              {path.title}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mt-2">
                            {path.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-primary font-medium">{path.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-dark-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 animate-pulse"
                            style={{ width: `${path.progress}%` }}
                          />
                        </div>
                      </div>
                      <Link 
                        href={path.href}
                        className="flex items-center justify-between w-full bg-dark-100 hover:bg-primary text-white hover:text-dark-200 px-6 py-3 rounded-xl transition-all duration-300 group/btn"
                      >
                        <span className="font-medium">Continue Learning</span>
                        <IconArrowRight 
                          size={20} 
                          className="transform transition-transform group-hover/btn:translate-x-1" 
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </NoSSR>

      {/* Discord Section */}
      <div className="bg-dark-200 rounded-xl p-8 border border-dark-100">
        <div className="relative w-full">
          <div className="relative w-full h-48 rounded-xl overflow-hidden">
            <Image
              src={kaliImage}
              alt="Discord Community"
              className="h-full w-full object-cover transition-all duration-300 transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-dark-200/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-dark-100/90 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <IconBrandDiscord className="text-white group-hover:text-dark-200 w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-white group-hover:text-primary transition-colors">Join Our Community</h2>
                <p className="text-gray-300 text-lg">Connect, learn, and grow together</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <a 
              href="https://discord.gg/your-invite-link" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 bg-dark-100 hover:bg-primary text-white hover:text-dark-200 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 group/btn"
            >
              <IconBrandDiscord size={24} className="transition-transform group-hover/btn:-translate-x-1" />
              <span>Join Discord</span>
              <IconArrowRight size={20} className="transition-transform group-hover/btn:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}