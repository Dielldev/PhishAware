'use client';

import React from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PhishingPage = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0">
        {/* Main gradient orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[1000px] h-[1000px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        </div>
        
        {/* Secondary floating orbs */}
        <div className="absolute top-1/4 left-1/4">
          <div className="w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] animate-float-slow" />
        </div>
        <div className="absolute bottom-1/4 right-1/4">
          <div className="w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] animate-float" />
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <div className="relative pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
                Understanding Phishing
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Learn about the most common cyber threat and how to protect yourself and your organization from sophisticated phishing attacks.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative px-4 py-16">
          <div className="max-w-7xl mx-auto">
            {/* What is Phishing Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">What is Phishing?</h2>
              <p className="text-gray-400 text-lg mb-8">
                Phishing is a type of cyber attack where criminals pose as legitimate institutions to trick individuals into revealing sensitive information such as passwords, credit card numbers, or bank account details. These attacks often come through emails, text messages, or fake websites that look genuine but are designed to steal your information.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-2xl font-semibold text-white mb-4">Common Types</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      Email Phishing
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      Spear Phishing
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      Whaling Attacks
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      Smishing (SMS Phishing)
                    </li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-2xl font-semibold text-white mb-4">Warning Signs</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      Urgent or threatening language
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      Suspicious sender addresses
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      Poor spelling and grammar
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      Requests for sensitive information
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Protection Methods */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 mb-12">
              <h2 className="text-4xl font-bold text-white mb-8">How to Protect Yourself</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="h-12 w-12 bg-emerald-500/20 rounded-lg mb-6 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Email Security</h3>
                  <p className="text-gray-400">Enable spam filters and never click on suspicious links or download unexpected attachments.</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="h-12 w-12 bg-blue-500/20 rounded-lg mb-6 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Strong Passwords</h3>
                  <p className="text-gray-400">Use unique, complex passwords and enable two-factor authentication whenever possible.</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="h-12 w-12 bg-purple-500/20 rounded-lg mb-6 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Stay Updated</h3>
                  <p className="text-gray-400">Keep your software and systems updated with the latest security patches.</p>
                </div>
              </div>
            </div>

          
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default PhishingPage; 