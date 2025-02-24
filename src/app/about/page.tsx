'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Import images
import dashboardImage from '@/assets/images/dashboard.png';
import kaliImage from '@/assets/images/kali.jpg';
import person1Image from '@/assets/images/person1.png';
import person2Image from '@/assets/images/person2.png';
import students from '@/assets/images/students.png';

export default function AboutPage() {
  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0">
        {/* Main gradient orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[1000px] h-[1000px] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>
        
        {/* Secondary floating orbs */}
        <div className="absolute top-1/4 left-1/4">
          <div className="w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <section className="text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10 max-w-4xl mx-auto"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur-sm">
                    OUR MISSION
                  </span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl md:text-7xl font-bold text-white mb-12 leading-tight"
                >
                  Making Cybersecurity Education Accessible
                </motion.h1>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-4 mb-12"
                >
                  <img src={dashboardImage.src} alt="Our Mission" className="rounded-lg shadow-lg w-[800px]" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-2xl text-gray-300 mb-12"
                >
                  At PhishAware, we're committed to making cybersecurity education accessible and engaging for everyone. Through our innovative platform, we help individuals and organizations build strong defenses against phishing attacks.
                </motion.p>
              </motion.div>
            </section>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Our Approach</h2>
                <p className="text-gray-400">
                  We combine interactive learning experiences with real-world scenarios to create engaging and effective security awareness training.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Why Choose Us</h2>
                <p className="text-gray-400">
                  Our platform offers cutting-edge tools and real-time protection against the latest phishing threats, helping you stay one step ahead.
                </p>
              </div>
            </div>

          

            <section className="mt-16">
              <h2 className="text-4xl font-bold text-white mb-8">Our Team</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                  <img src={person2Image.src} alt="Diell Govori" className="rounded-lg mb-4 w-[200px] h-[200px] object-cover" />
                  <h3 className="text-2xl font-bold text-white mb-2">Diell Govori</h3>
                  <p className="text-emerald-400 font-semibold mb-2">CEO, CTO</p>
                  <p className="text-gray-400">As both CEO and CTO, leading PhishAware's strategic direction while personally overseeing the technical architecture. Combining business vision with deep technical expertise to create cutting-edge cybersecurity solutions.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                  <img src={person1Image.src} alt="Dion Kryeziu" className="rounded-lg mb-4 w-[200px] h-[200px] object-cover" />
                  <h3 className="text-2xl font-bold text-white mb-2">Dion Kryeziu</h3>
                  <p className="text-emerald-400 font-semibold mb-2">CMO</p>
                  <p className="text-gray-400">Driving our marketing strategy and brand awareness while ensuring our message reaches those who need cybersecurity education the most. Focused on making PhishAware's solutions accessible and engaging to users worldwide.</p>
                </div>
              </div>
            </section>

            <section className="mt-16">
              <h2 className="text-4xl font-bold text-white mb-8">Our Journey</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img src={students.src} alt="Future Mission" className="rounded-lg w-[550px]" />
                <p className="text-gray-400">
                  Once Victims of Phishing without knowledge, Our journey began with a simple idea: to make cybersecurity education accessible to everyone. We've come a long way since then, building a platform that empowers individuals and organizations to protect themselves against phishing attacks.
                </p>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}