import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/Propertium_backend';
import { _SERVICE } from '../../../declarations/Propertium_backend/Propertium_backend.did';
import { Principal } from '@dfinity/principal';
import { NavLink } from 'react-router-dom';

export default function PropertiumLanding() {
  const [activeSection, setActiveSection] = useState('home');
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [actor, setActor] = useState<_SERVICE | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);
      }
    };
    initAuth();
  }, []);

  const handleAuthenticated = async (authClient: AuthClient) => {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal();
    setPrincipal(principal);

    const derivedUsername = principal.toText().slice(0, 4);
    setUsername(derivedUsername);

    const agent = new HttpAgent({ identity, host: 'http://localhost:4943' });

    const actor = Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId: 'ajuq4-ruaaa-aaaaa-qaaga-cai',
    });
    setActor(actor);

    await actor.register();
    const balance = await actor.getBalance();
    setWalletBalance(Number(balance));
  };

  const login = async () => {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: 'https://identity.ic0.app',
      onSuccess: () => {
        handleAuthenticated(authClient);
      },
    });
  };

  const logout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setPrincipal(null);
    setWalletBalance(null);
    setActor(null);
    setUsername(null);
    setDropdownOpen(false);
  };

  const playWithTokens = async () => {
    if (!actor || !principal) {
      alert('Please log in first');
      return;
    }
    try {
      const result = await actor.transfer(principal, 1000n);
      alert('Tokens transferred successfully!');
      const balance = await actor.getBalance();
      setWalletBalance(Number(balance));
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('Failed to transfer tokens');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };

  const handleUpload = () => {
    if (!principal) {
      alert('Please log in first');
      return;
    }
    setUploadOpen(true);
  };

  return (
    <div className="overflow-hidden">
      <section id="home" className="min-h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(/background.png)`,
            backgroundSize: '100% 100%',
          }}
        />
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="absolute top-6 left-6 text-white text-2xl tracking-widest font-bold z-20 drop-shadow-md">
            Propertium
          </div>
          <div className="flex-1 flex justify-end items-start px-6 md:px-12 pt-0">
            <div className="grid grid-cols-3 gap-4 max-w-3xl mt-12 mr-8 items-start">
              <div className="text-white text-xs leading-relaxed drop-shadow-md">
                Propertium is a WebGIS-based NFT real estate platform that simplifies digital property transactions through interactive maps and blockchain transparency.
              </div>
              <div className="text-white text-xs leading-relaxed drop-shadow-md">
                Our real estate agents are licensed professionals who organize real estate transactions and act as representatives in negotiations on the acquisition of real estates.
              </div>
              <div className="flex flex-col space-y-2 relative">
                {principal ? (
                  <div className="relative">
                    <button
                      className="bg-black text-white text-sm font-semibold rounded-full px-4 py-2 hover:bg-gray-800 transition-all duration-300 flex items-center"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      {username} <span className="ml-2">▼</span>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={playWithTokens}
                        >
                          Wallet
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={logout}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="bg-black text-white text-sm font-semibold rounded-full px-4 py-2 hover:bg-gray-800 transition-all duration-300"
                    onClick={login}
                  >
                    LOGIN
                  </button>
                )}
              </div>
            </div>
            <nav className="fixed top-1/2 right-6 md:right-12 transform -translate-y-1/2 flex flex-col space-y-6 text-xs font-bold z-30">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-black hover:text-gray-600 transition-colors cursor-pointer ${isActive ? 'font-bold' : ''}`
                }
                onClick={() => scrollToSection('home')}
              >
                HOME
              </NavLink>
              <NavLink
                to="/maps"
                className={({ isActive }) =>
                  `text-white hover:text-gray-600 transition-colors cursor-pointer ${isActive ? 'font-bold' : ''}`
                }
              >
                MAPS
              </NavLink>
              <NavLink
                to="/properties"
                className={({ isActive }) =>
                  `text-white hover:text-gray-600 transition-colors cursor-pointer ${isActive ? 'font-bold' : ''}`
                }
                onClick={() => scrollToSection('properties')}
              >
                PRICING
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-white hover:text-gray-600 transition-colors cursor-pointer ${isActive ? 'font-bold' : ''}`
                }
                onClick={() => scrollToSection('about')}
              >
                JOIN US
              </NavLink>
              <button
                className="text-white hover:text-gray-600 transition-colors cursor-pointer"
                onClick={handleUpload}
              >
                UPLOAD
              </button>
            </nav>
            <button
              className="absolute bottom-8 right-8 md:right-12 w-16 h-16 rounded-full bg-transparent backdrop-blur-md border border-white/30 text-white hover:bg-white/10 shadow-lg flex items-center justify-center transition-all duration-300"
              onClick={() => scrollToSection('features')}
            >
              <span className="text-xl">↓</span>
            </button>
            <div className="absolute bottom-2 right-10 md:right-16 flex flex-col items-center">
              <div className="w-px h-12 bg-gray-400"></div>
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-gray-400"></div>
            </div>
          </div>
        </div>
      </section>

      {uploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Upload Real Estate</h2>
            <p className="text-gray-600 mb-4">This is a placeholder. Upload functionality will be added later.</p>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => setUploadOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section id="features" className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Platform Features</h2>
            <p className="text-gray-300 text-lg">Advanced Web3 real estate solutions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/50 rounded-lg p-6 border border-gray-700">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-white mb-3">WebGIS Maps</h3>
              <p className="text-gray-300">Interactive mapping with detailed property information and location analytics.</p>
            </div>
            <div className="bg-black/50 rounded-lg p-6 border border-gray-700">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-white mb-3">Blockchain Security</h3>
              <p className="text-gray-300">All transactions secured by blockchain technology for transparency.</p>
            </div>
            <div className="bg-black/50 rounded-lg p-6 border border-gray-700">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-white mb-3">NFT Properties</h3>
              <p className="text-gray-300">Digital property certificates as NFTs for verifiable ownership.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="properties" className="min-h-screen bg-slate-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Featured Properties</h2>
            <p className="text-gray-300 text-lg">Premium NFT real estate listings</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Luxury Villa', price: '2.5 ETH', location: 'Beverly Hills' },
              { name: 'Modern Apartment', price: '1.8 ETH', location: 'Manhattan' },
              { name: 'Beach House', price: '3.2 ETH', location: 'Malibu' },
            ].map((property, index) => (
              <div key={index} className="bg-black/50 rounded-lg overflow-hidden border border-gray-700">
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  <span className="text-6xl">🏠</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white">{property.name}</h3>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">NFT</span>
                  </div>
                  <p className="text-gray-400 mb-4">{property.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">{property.price}</span>
                    <button className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">About Propertium</h2>
              <p className="text-gray-300 text-lg mb-8">
                We combine GIS technology with blockchain to create a transparent and efficient real estate marketplace.
                Our platform enables secure property transactions with verifiable digital ownership.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-gray-400">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+ ETH</div>
                  <div className="text-gray-400">Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1000+</div>
                  <div className="text-gray-400">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">25+</div>
                  <div className="text-gray-400">Countries</div>
                </div>
              </div>
            </div>
            <div className="bg-black/50 rounded-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Get Started</h3>
              <p className="text-gray-300 mb-6">Join the future of real estate</p>
              <div className="space-y-4">
                <button className="w-full bg-white text-black py-3 rounded font-semibold hover:bg-gray-200 transition-colors">
                  Start Investing
                </button>
                <button className="w-full border-2 border-white text-white py-3 rounded font-semibold hover:bg-white hover:text-black transition-colors">
                  List Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Propertium</h3>
              <p className="text-gray-400 mb-4">
                The future of real estate through Web3 technology.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Marketplace</a></li>
                <li><a href="#" className="hover:text-white">Maps</a></li>
                <li><a href="#" className="hover:text-white">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2025 Propertium. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}