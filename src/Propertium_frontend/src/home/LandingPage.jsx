import React from 'react';
import background from "/background.png";

export default function AestaticsLanding() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: '100% 100%'
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="absolute top-6 left-6 text-white text-2xl tracking-widest font-bold z-20 drop-shadow-md">
          Propertium
        </div>

        {/* Main content container - moved to right side */}
        <div className="flex-1 flex justify-end items-start px-6 md:px-12 pt-0">
          {/* Right side content area */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mt-12 mr-8 items-start">
            {/* First text block */}
            <div className="text-white text-xs leading-relaxed drop-shadow-md">
              Propertium is a WebGIS-based NFT real estate platform that simplifies digital property transactions through interactive maps and blockchain transparency.
            </div>
            
            {/* Second text block */}
            <div className="text-white text-xs leading-relaxed drop-shadow-md">
              Our real estate agents are licensed professionals who organize real estate transactions and act as representatives in negotiations on the acquisition of real estate.
            </div>
            
            {/* Button */}
            <button 
              className="bg-black text-white text-sm font-semibold rounded-full px-4 py-2 self-start hover:bg-gray-800 transition-all duration-300"
              type="button"
            >
              LOGIN
            </button>
          </div>

          {/* Right side vertical navigation */}
          <nav className="absolute top-1/2 right-6 md:right-12 transform -translate-y-1/2 flex flex-col space-y-6 text-xs font-bold">
            <a 
              className="text-black hover:text-gray-600 transition-colors cursor-pointer" 
              href="#"
            >
              HOME
            </a>
            <a 
              className="text-white hover:text-gray-600 transition-colors cursor-pointer" 
              href="#"
            >
              MAPS
            </a>
            <a 
              className="text-white hover:text-gray-600 transition-colors cursor-pointer" 
              href="#"
            >
              PRICING
            </a>
            <a 
              className="text-white hover:text-gray-600 transition-colors cursor-pointer" 
              href="#"
            >
              JOIN US
            </a>
          </nav>
          
          <button
            className="absolute bottom-8 right-8 md:right-12 w-16 h-16 rounded-full bg-transparent backdrop-blur-md border border-white/30 text-white hover:bg-white/10 shadow-lg flex items-center justify-center transition-all duration-300"
            type="button"
          >
            <i className="fas fa-arrow-down text-xl"></i>
          </button>

          <div className="absolute bottom-2 right-10 md:right-16 flex flex-col items-center">
            <div className="w-px h-12 bg-gray-400"></div>
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-gray-400"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(-90deg); }
          to { transform: rotate(270deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
}