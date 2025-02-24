'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const PhishingInfo = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    setIsAnswered(true);
    // Hide feedback after 3 seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };

  return (
    <div className="relative px-4" >
      {/* Chat UI preview */}
      <div className="w-full max-w-6xl mx-auto bg-[#1a1a1a]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 min-h-[600px] z-20 -mt-32">
        {/* Tab Header */}
        <div className="flex items-center gap-4 p-6 border-b border-white/10">
          <div className="flex items-center gap-3 px-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">phishaware.com/training</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </div>
        </div>

        {/* Training Simulation Content */}
        <div className="p-8">
          {/* Email Simulation */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">Security Team</div>
                  <div className="text-gray-400 text-sm">random@companyxyz.com</div>
                </div>
              </div>
              <span className="text-gray-400 text-sm">Just now</span>
            </div>
            <h3 className="text-white text-lg font-medium mb-3">Urgent: Password Reset Required</h3>
            <p className="text-gray-400 mb-4">
              Dear Employee,<br /><br />
              Our security system has detected unusual activity on your account. Please click the button below to reset your password immediately.
            </p>
            <button className="bg-red-500/20 text-red-400 px-6 py-2 rounded-lg hover:bg-red-500/30 transition-colors">
              Reset Password
            </button>
          </div>

          {/* Training Interface */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-white font-medium mb-4">Is this a phishing attempt?</h4>
            <div className="space-y-3">
              <button 
                onClick={() => !isAnswered && handleAnswer(true)}
                className={`w-full bg-white/5 hover:bg-white/10 text-left text-white p-4 rounded-full transition-colors flex items-center justify-between group
                  ${isAnswered && isCorrect ? 'border-2 border-emerald-400' : ''}
                  ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                disabled={isAnswered}
              >
                <span>Yes, this is a phishing email</span>
                {!isAnswered && (
                  <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                   
                  </span>
                )}
                {isAnswered && isCorrect && (
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <button 
                onClick={() => !isAnswered && handleAnswer(false)}
                className={`w-full bg-white/5 hover:bg-white/10 text-left text-white p-4 rounded-full transition-colors flex items-center justify-between group
                  ${isAnswered && !isCorrect ? 'border-2 border-red-400' : ''}
                  ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                disabled={isAnswered}
              >
                <span>No, this is legitimate</span>
                {!isAnswered && (
                  <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  
                  </span>
                )}
                {isAnswered && !isCorrect && (
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-400">Question 1 of 1</span>
              </div>
              {!isAnswered && (
                <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-500 rounded-full ${isAnswered ? 'w-full bg-emerald-400' : 'w-1/5 bg-emerald-400'}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Popup */}
      {showFeedback && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full backdrop-blur-xl border transition-all duration-300 z-50 flex items-center gap-3
          ${isCorrect ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
          {isCorrect ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>You're a natural! Great job spotting the phishing attempt.</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Time to prepare! Let's learn more about spotting phishing emails.</span>
            </>
          )}
        </div>
      )}

      {/* What is Phishing Section - Redesigned */}
      <div className="relative py-32" id="phishing-info">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold text-white mb-8">What is Phishing?</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto mb-8">
              Phishing is a cybercrime where attackers pose as legitimate institutions to steal sensitive information. Learn how to protect yourself and your organization.
            </p>
            <Link href="learn/phishing" 
              className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-medium transition-colors duration-200 text-lg group">
              Learn More About Phishing
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column - Common Threats */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full">
                <div className="h-14 w-14 bg-red-500/20 rounded-xl mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-6">Common Threats</h3>
                <ul className="space-y-4 text-gray-400 text-lg">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    Email spoofing and fraudulent requests
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    Fake login pages and credential theft
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    Malicious attachments and links
                  </li>
                </ul>
              </div>
            </div>

            {/* Center column - Large Stats */}
            <div className="lg:col-span-1">
              <div className="grid gap-6 h-full">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                  <div className="text-5xl font-bold text-emerald-400 mb-4">91%</div>
                  <p className="text-gray-400 text-lg">of cyber attacks start with phishing</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-4">$4.2M</div>
                  <p className="text-gray-400 text-lg">average cost of a data breach</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                  <div className="text-5xl font-bold text-purple-400 mb-4">+300%</div>
                  <p className="text-gray-400 text-lg">increase in phishing attacks since 2020</p>
                </div>
              </div>
            </div>

            {/* Right column - Protection Tips */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full">
                <div className="h-14 w-14 bg-emerald-500/20 rounded-xl mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-6">Protection Tips</h3>
                <ul className="space-y-4 text-gray-400 text-lg">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    Verify sender identities and email domains
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    Never share sensitive information via email
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    Use multi-factor authentication
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhishingInfo;