import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconShieldLock } from '@tabler/icons-react';

export const MobileOverlay = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="w-48 h-32 relative mx-auto mb-6">
          <div className="p-4 border-b border-[#2a2a2a]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#47F3AB] rounded-lg flex items-center justify-center">
                        <IconShieldLock size={20} className="text-[#1a1a1a]" />
                      </div>
                      <h1 className="text-xl font-bold text-white">PhishAware</h1>
                    </div>
                  </div>
        </div>
        <h2 className="text-2xl font-bold text-primary">Desktop Experience Recommended</h2>
        <p className="text-muted-foreground max-w-md">
          We highly recommend switching to a desktop or laptop device for the best experience. 
          The dashboard is optimized for larger screens.
        </p>
        <Link href="/" className="inline-flex items-center justify-center rounded-md bg-white text-black px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100">
                  Go Back
                </Link>
      </motion.div>
    </motion.div>
  );
};