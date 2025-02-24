'use client';

import React from 'react';
import Link from 'next/link';
import { HyperText } from "@/registry/magicui/hyper-text";
import { motion } from 'framer-motion';
import { FlickeringGrid } from "@/registry/magicui/flickering-grid";

// Deferred sphere loading
const Sphere = () => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
    <div className="absolute -inset-32 rounded-full bg-emerald-400 blur-[120px]" />
  </div>
);

export default function HeroSection() {
  const [isClient, setIsClient] = React.useState(false);
  const [showEffects, setShowEffects] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    // Defer heavy animations
    const timer = setTimeout(() => setShowEffects(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Defer heavy background elements */}
      {showEffects && (
        <>
          <Sphere />
          {isClient && (
            <div className="fixed inset-0 w-full h-full">
              <FlickeringGrid
                className="w-full h-full [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
                squareSize={6}
                gridGap={8}
                color="#47F3AB"
                maxOpacity={0.2}
                flickerChance={0.02}
                height={window.innerHeight}
                width={window.innerWidth}
                refreshRate={2000}
              />
            </div>
          )}
        </>
      )}
      
      <div className="text-center z-10 max-w-4xl mx-auto">
        {/* Priority content loads immediately */}
        <div className="mb-8">
          <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur-sm">
            CYBER SECURITY AWARENESS
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-12 leading-tight">
          Explore the Secrets<br />
          of Cyber Attacks<br />
          <HyperText className="text-white">PHISHING</HyperText>
        </h1>

        {/* Defer non-critical animations */}
        {showEffects && (
          <>
            <div className="flex items-center justify-center gap-4 mb-12">
              <Link href="/auth/register" 
                className="flex justify-center gap-2 items-center shadow-xl text-lg bg-white/10 backdrop-blur-md 
                font-semibold border-white/20 relative z-10 px-8 py-3 overflow-hidden border-2 rounded-full 
                group hover:bg-emerald-500 hover:border-emerald-400 transition-colors duration-300"
              >
                <span className="relative z-10">Get Started</span>
                <svg
                  className="w-6 h-6 justify-end transition-transform duration-300 ease-out group-hover:rotate-90"
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    className="fill-white"
                  />
                </svg>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-gray-400 text-base">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Real-time Protection</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>AI-Powered Security</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}