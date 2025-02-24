'use client'

import Link from 'next/link'
import { memo, useState, useEffect } from 'react'
import { 
  IconShieldLock, 
  IconMenu2,
  IconX
} from '@tabler/icons-react'

const Navigation = memo(function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const NavItems = () => (
    <>
      <a href="#phishing-info" className="text-sm font-medium transition-colors hover:text-primary">
        Phishing
      </a>
      <a href="#quizzes" className="text-sm font-medium transition-colors hover:text-primary">
        Quizzes
      </a>
      <a href="#solutions" className="text-sm font-medium transition-colors hover:text-primary">
        Solution
      </a>
      <a href="#about" className="text-sm font-medium transition-colors hover:text-primary">
        About
      </a>
      <a href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
        Contact
      </a>
    </>
  )

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2"
            onClick={() => window.location.href = '/'}
          >
            <div className="w-8 h-8 bg-[#47F3AB] rounded-lg flex items-center justify-center">
              <IconShieldLock size={20} className="text-[#1a1a1a]" />
            </div>
            <h1 className="text-xl font-bold text-white">PhishAware</h1>
          </Link>
          
          <div className="hidden md:flex flex-1 justify-center">
            <nav className="flex items-center space-x-20">
              <NavItems />
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="text-sm font-medium transition-colors hover:text-primary">
              Login
            </Link>
            <Link href="/auth/register" className="inline-flex items-center justify-center rounded-md bg-white text-black px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100">
              Get Started
            </Link>
          </div>

          <div className="flex flex-1 justify-end md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-400 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <IconX size={24} />
              ) : (
                <IconMenu2 size={24} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity" 
            onClick={toggleMobileMenu}
          />
          <div className="fixed right-0 top-0 h-full w-[250px] bg-background/95 backdrop-blur p-6 shadow-xl transition-transform">
            <div className="flex flex-col space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-gray-400 hover:text-white"
                  aria-label="Close mobile menu"
                >
                  <IconX size={24} />
                </button>
              </div>
              
              <nav className="flex flex-col space-y-6">
                <NavItems />
              </nav>

              <div className="flex flex-col space-y-4 pt-6 border-t border-gray-700">
                <Link href="/auth/login" className="text-sm font-medium transition-colors hover:text-primary">
                  Login
                </Link>
                <Link href="/auth/register" className="inline-flex items-center justify-center rounded-md bg-white text-black px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

export default Navigation