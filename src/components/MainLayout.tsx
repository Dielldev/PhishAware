'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';


interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = memo(function MainLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <main className={`flex min-h-screen flex-col ${isDashboard ? 'bg-background' : 'bg-[#0A0A0A]'}`}>
      {/* Noise texture overlay */}
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>

      {/* Actual content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Add the PhishingAttackMap component */}
          <div className="mb-8">
           
          </div>
          
          {children}
        </div>
      </div>
    </main>
  );
});

export default MainLayout;