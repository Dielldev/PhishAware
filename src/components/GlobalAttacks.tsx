'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Loading Globe...</div>
});

interface Attack {
  lat: number;
  lng: number;
  city: string;
  country: string;
  timestamp: number;
}

const GlobalAttacks = () => {
  const globeRef = useRef();
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [latestAttack, setLatestAttack] = useState<Attack | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const generateRandomAttack = () => {
      const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Singapore', 'Dubai'];
      const countries = ['USA', 'UK', 'Japan', 'France', 'Australia', 'Singapore', 'UAE'];
      const randomIndex = Math.floor(Math.random() * cities.length);
      
      return {
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        city: cities[randomIndex],
        country: countries[randomIndex],
        timestamp: Date.now()
      };
    };

    // Only set initial attacks after component mounts
    setAttacks(Array(20).fill(null).map(generateRandomAttack));

    const interval = setInterval(() => {
      const newAttack = generateRandomAttack();
      setLatestAttack(newAttack);
      setAttacks(prevAttacks => [
        ...prevAttacks.slice(-40),
        newAttack
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const size = Math.min(window.innerHeight * 0.8, 600);
      setDimensions({ width: size, height: size });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isClient || !dimensions) {
    return <div className="h-[600px] w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Globe Container */}
          <div className="relative flex-shrink-0" style={{ width: dimensions.width, height: dimensions.height }}>
            <Globe
              ref={globeRef}
              width={dimensions.width}
              height={dimensions.height}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              pointsData={attacks}
              pointLat="lat"
              pointLng="lng"
              pointColor={() => '#00ff88'}
              pointAltitude={0.1}
              pointRadius={0.8}
              pointsMerge={true}
              atmosphereColor="#ffffff"
              atmosphereAltitude={0.15}
              ringsData={attacks}
              ringLat="lat"
              ringLng="lng"
              ringColor={() => 'rgba(0, 255, 136, 0.3)'}
              ringMaxRadius={3}
              ringPropagationSpeed={5}
              ringRepeatPeriod={500}
              arcsData={attacks.slice(-5)}
              arcStartLat="lat"
              arcStartLng="lng"
              arcEndLat={() => (Math.random() - 0.5) * 180}
              arcEndLng={() => (Math.random() - 0.5) * 360}
              arcColor={() => ['rgba(0, 255, 136, 0.3)', 'rgba(0, 255, 136, 0.8)']}
              arcDashLength={0.5}
              arcDashGap={0.1}
              arcDashAnimateTime={2000}
            />
          </div>

          {/* Content Container */}
          <div className="flex-grow lg:pt-10">
            <div className="text-left mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Real-Time Phishing Attacks
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Witness the scale of phishing attacks happening around the globe. Each point represents a detected phishing attempt in real-time.
              </p>
              
              {/* Latest Attack Alert */}
              {latestAttack && (
                <div className="mb-8 p-4 bg-black/30 backdrop-blur-sm border border-emerald-500/20 rounded-lg">
                  <h3 className="text-emerald-500 font-semibold mb-2">Latest Attack Detected</h3>
                  <p className="text-gray-300">
                    Location: {latestAttack.city}, {latestAttack.country}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(latestAttack.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-emerald-500/20">
                <h3 className="text-3xl font-bold text-emerald-500 mb-2">24,567</h3>
                <p className="text-gray-400 text-sm">Attacks Today</p>
              </div>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-emerald-500/20">
                <h3 className="text-3xl font-bold text-emerald-500 mb-2">142</h3>
                <p className="text-gray-400 text-sm">Countries Affected</p>
              </div>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-emerald-500/20">
                <h3 className="text-3xl font-bold text-emerald-500 mb-2">$2.1M</h3>
                <p className="text-gray-400 text-sm">Damages Prevented</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalAttacks;