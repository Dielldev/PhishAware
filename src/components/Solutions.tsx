import React from 'react';
import Link from 'next/link';

const Solutions = () => {
  return (
    <div className="relative px-4 py-32" id="solutions">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-6xl font-bold text-white mb-8">Our Solutions</h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Comprehensive protection against phishing with our advanced browser extension and enterprise solutions.
          </p>
        </div>

        {/* Main Feature - Chrome Extension */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-blue-400 font-medium">Browser Extension</span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-6">Real-Time Phishing Protection</h3>
              <p className="text-gray-400 text-lg mb-8">
                Our Chrome extension provides instant protection against phishing attempts, scanning emails and websites in real-time using advanced AI technology.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-400">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Website safety verification
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time link analysis
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://chrome.google.com/webstore" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-2-6l6-4-6-4v8z"/>
                  </svg>
                  Add to Chrome
                </a>
              </div>
            </div>
            {/* Extension Preview */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl aspect-square p-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl h-full border border-white/10 shadow-2xl">
                {/* Mock extension interface */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-white font-medium">PhishAware Detector</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
                    <div className="h-4 bg-white/5 rounded-full w-1/2"></div>
                    <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
                    <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
                    <div className="h-4 bg-white/5 rounded-full w-1/2"></div>
                    <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="h-12 w-12 bg-purple-500/20 rounded-xl mb-6 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Instant Alerts</h3>
            <p className="text-gray-400">Get immediate notifications when suspicious activity is detected.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="h-12 w-12 bg-emerald-500/20 rounded-xl mb-6 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Smart Scanning</h3>
            <p className="text-gray-400">Advanced AI algorithms to detect even the most sophisticated phishing attempts.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="h-12 w-12 bg-red-500/20 rounded-xl mb-6 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Link Protection</h3>
            <p className="text-gray-400">Automatically scan and verify links before you click them.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;