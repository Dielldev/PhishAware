'use client';

import Navigation from '../components/Navigation';
import PhishingInfo from '../components/PhishingInfo';
import Solutions from '../components/Solutions';
import Quizzes from '../components/Quizzes';
import Contact from '../components/Contact';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import GlobalAttacks from '../components/GlobalAttacks';
import AboutUsSection from '../components/AboutUsSection';

export default function Home() {
  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* Main gradient background effect */}
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-[1000px] h-[1000px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>
      
      {/* Radial gradient overlay */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-black/50 to-black" />

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <PhishingInfo />
        <GlobalAttacks />
        <Quizzes />
        <Solutions />
        <AboutUsSection />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}