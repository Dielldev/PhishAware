'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { 
  IconHome, 
  IconFish, 
  IconLock, 
  IconMask, 
  IconShieldLock, 
  IconShield,
  IconUser,
  IconLogout,
  IconChevronRight,
  IconBell
} from '@tabler/icons-react'

interface SidebarProps {
  userName?: string | null
  userImage?: string | null
}

export default function Sidebar({ userName, userImage }: SidebarProps) {
  const pathname = usePathname()
  
  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: true,
        callbackUrl: '/' 
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const menuItems = [
    { icon: <IconHome size={20} />, label: 'Home', href: '/dashboard' },
    { 
      icon: <IconFish size={20} />, 
      label: 'Phishing Awareness', 
      href: '/dashboard/phishing'
    },
    { icon: <IconLock size={20} />, label: 'Password Security', href: '/dashboard/password' },
    { icon: <IconMask size={20} />, label: 'Social Engineering', href: '/dashboard/social' },
    { icon: <IconShield size={20} />, label: 'Data Protection', href: '/dashboard/data' },
  ]

  return (
    <>
      {/* Remove the spacer div completely */}
      
      {/* Adjust the sidebar positioning and width */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col z-50">
        {/* Logo Section - adjusted padding */}
        <div className="p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#47F3AB] rounded-lg flex items-center justify-center">
              <IconShieldLock size={20} className="text-[#1a1a1a]" />
            </div>
            <h1 className="text-xl font-bold text-white">PhishAware</h1>
          </div>
        </div>

        {/* User Profile Quick View - adjusted for dynamic updates */}
        <div className="p-3 mt-2">
          <div className="bg-[#2a2a2a] rounded-xl p-3 flex items-center gap-3">
            <div className="relative">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName || 'Profile'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-[#47F3AB] rounded-full flex items-center justify-center">
                  <IconUser size={20} className="text-[#1a1a1a]" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2a2a2a]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">{userName || 'User'}</h3>
              <p className="text-xs text-gray-400">Security Learner</p>
            </div>
            <button className="p-2 hover:bg-[#3a3a3a] rounded-lg transition-colors">
              <IconBell size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation - adjusted padding */}
        <nav className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link 
                  key={index}
                  href={item.href}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-[#47F3AB] text-[#1a1a1a] font-medium shadow-lg shadow-[#47F3AB]/20' 
                      : 'text-gray-400 hover:bg-[#2a2a2a]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconChevronRight 
                      size={16} 
                      className={`transition-transform ${isActive ? 'rotate-90' : ''}`}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom Section - adjusted padding */}
        <div className="p-3 border-t border-[#2a2a2a]">
          <div className="space-y-1">
            <Link 
              href="/dashboard/profile"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#2a2a2a] rounded-xl transition-colors"
            >
              <IconUser size={20} />
              <span>Profile Settings</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <IconLogout size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 