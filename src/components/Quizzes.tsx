import React from 'react';
import { signIn } from 'next-auth/react';

const Quizzes = () => {
  const handleQuizClick = () => {
    signIn();
  };

  return (
    <div className="relative px-4 py-32" id="quizzes">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">Test Your Knowledge</h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Take our interactive quizzes to assess your phishing awareness level
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-semibold text-white mb-4">Basic Assessment</h3>
            <p className="text-gray-400 mb-6">Perfect for beginners to test their fundamental knowledge.</p>
            <button
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition-colors"
              onClick={handleQuizClick}
            >
              Start Quiz →
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-semibold text-white mb-4">Advanced Scenarios</h3>
            <p className="text-gray-400 mb-6">Complex scenarios for experienced users to challenge themselves.</p>
            <button
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition-colors"
              onClick={handleQuizClick}
            >
              Start Quiz →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;