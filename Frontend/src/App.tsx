// src/App.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CategoryType,
  IntensityType,
  PCBuild,
  ElectricitySettings,
  User,
  Vendor,
  UserRole,
  AuthState,
  SavedBuild,
} from './types';

import RequirementSelection from './components/RequirementSelection';
import ElectricityModal from './components/ElectricityModal';
import RecommendedBuilds from './components/RecommendedBuilds';
import BuildDetails from './components/BuildDetails';
import PriceEditor from './components/PriceEditor';
import AuthModal from './components/AuthModal';
import RoleSelection from './components/RoleSelection';
import VendorDashboard from './components/VendorDashboard';
import Header from './components/Header';
import SavedBuildsModal from './components/SavedBuildsModal';
import { getBuilds } from './api/builds';
import { signup, login } from './api/auth';
import { categories } from './data/mockData';

type AppScreen =
  | 'auth'
  | 'role-selection'
  | 'selection'
  | 'builds'
  | 'details'
  | 'price-editor'
  | 'vendor-dashboard';

export default function App() {
  // Authentication state
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    vendor: null,
    token: null,
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSavedBuildsModal, setShowSavedBuildsModal] = useState(false);

  // App navigation state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('auth');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityType | null>(null);
  const [showElectricityModal, setShowElectricityModal] = useState(false);
  const [electricitySettings, setElectricitySettings] = useState<ElectricitySettings | null>(null);
  const [selectedBuild, setSelectedBuild] = useState<PCBuild | null>(null);

  // Builds (fetched from backend)
  const [builds, setBuilds] = useState<PCBuild[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Saved builds
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);

  // 🔥 Fetch builds from backend on mount
  useEffect(() => {
    getBuilds()
      .then((data) => {
        console.log('✅ Builds fetched:', data);
        const normalized = data.map((b, i) => ({
          ...b,
          category: (b as any).category || (i % 2 === 0 ? 'gaming' : 'office'),
          intensity: (b as any).intensity || 'casual',
          isActive: (b as any).isActive ?? true,
        }));
        setBuilds(normalized);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch builds:', err);
        setError('Could not load builds. Check backend and API response.');
      });
  }, []);

  // Role selection handler
  const handleRoleSelect = (role: UserRole) => {
    if (role === 'customer') {
      setCurrentScreen('selection');
    } else {
      setCurrentScreen('vendor-dashboard');
    }
  };
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Vendor registration handler
  const handleRegisterShop = (shopData: Omit<Vendor, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!authState.user) return;
    const vendor: Vendor = {
      id: '1',
      userId: authState.user.id,
      ...shopData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAuthState((prev) => ({ ...prev, vendor }));
  };

  // PC building flows
  const handleCategoryIntensitySelect = (category: CategoryType, intensity: IntensityType) => {
    setSelectedCategory(category);
    setSelectedIntensity(intensity);
    setShowElectricityModal(true);
  };

  const handleElectricitySubmit = (settings: ElectricitySettings) => {
    setElectricitySettings(settings);
    setShowElectricityModal(false);
    setCurrentScreen('builds');
  };

  const handleBuildSelect = (build: PCBuild) => {
    setSelectedBuild(build);
    setCurrentScreen('details');
  };

  const handleSaveBuild = (build: PCBuild) => {
    if (savedBuilds.some((saved) => saved.buildId === build.id)) return;
    const savedBuild: SavedBuild = {
      id: `saved-${Date.now()}`,
      userId: authState.user?.id || 'guest',
      buildId: build.id,
      build,
      savedAt: new Date().toISOString(),
    };
    setSavedBuilds((prev) => [...prev, savedBuild]);
  };

  const handleBackToBuilds = () => {
    setCurrentScreen('builds');
    setSelectedBuild(null);
  };

  const handleBackToSelection = () => {
    setCurrentScreen('selection');
    setSelectedCategory(null);
    setSelectedIntensity(null);
    setElectricitySettings(null);
  };

  const handleBackToRoleSelection = () => {
    setCurrentScreen('role-selection');
    setSelectedCategory(null);
    setSelectedIntensity(null);
    setElectricitySettings(null);
  };

  const handleOpenPriceEditor = () => setCurrentScreen('price-editor');
  const handleBackFromPriceEditor = () => setCurrentScreen('details');
  const handleSaveBuilds = (updatedBuilds: PCBuild[]) => setBuilds(updatedBuilds);

   // App.tsx
// Replace existing handlers with these:

 const handleLogin = (user: User, token: string) => {
  setAuthState({
    isAuthenticated: true,
    user,
    vendor: null,
    token,
  });
  setShowAuthModal(false);
  setCurrentScreen('role-selection');
 };

 const handleSignup = (user: User, token: string) => {
  setAuthState({
    isAuthenticated: true,
    user,
    vendor: null,
    token,
  });
  setShowAuthModal(false);
  setCurrentScreen('role-selection');
 };


  // Logout handler
  const handleLogout = () => {
    setAuthState({ isAuthenticated: false, user: null, vendor: null, token: null });
    setCurrentScreen('auth');
    setSelectedCategory(null);
    setSelectedIntensity(null);
    setElectricitySettings(null);
    setSelectedBuild(null);
    setSavedBuilds([]);
  };

  // Filter builds
  const getFilteredBuilds = (): PCBuild[] => {
    if (!selectedCategory || !selectedIntensity) return [];
    return builds.filter(
      (b) => b.category === selectedCategory && b.intensity === selectedIntensity && b.isActive !== false
    );
  };

  // Theme
  const getThemeClasses = () =>
    'bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-300';

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated && currentScreen !== 'auth') {
      setCurrentScreen('auth');
    }
  }, [authState.isAuthenticated, currentScreen]);

  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (builds.length === 0 && !error)
    return <div className="p-8 text-gray-300 text-center">Loading builds...</div>;

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${getThemeClasses()}`}
    >
      {/* Cyber grid background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(cyan 1px, transparent 1px),
              linear-gradient(90deg, cyan 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <Header
        authState={authState}
        setShowAuthModal={setShowAuthModal}
        setShowSavedBuildsModal={setShowSavedBuildsModal}
      />

      {/* Screens */}
      <AnimatePresence mode="wait">
        {currentScreen === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex items-center justify-center min-h-[400px] px-4"
          >
            <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black p-10 rounded-2xl border border-cyan-500/40 shadow-[0_0_20px_cyan] flex flex-col items-center space-y-6 w-full max-w-md">
              <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Welcome to Compfy
              </h1>
              <p className="text-gray-300 text-center text-lg">
                Comfortably build your PC. Sign up or log in to continue.
              </p>
              <div className="flex space-x-4 mt-4 w-full justify-center">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-white border border-cyan-500/50 rounded-lg transition-all duration-300"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20 rounded-lg transition-all duration-300"
                >
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentScreen === 'role-selection' && (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <RoleSelection onSelectRole={handleRoleSelect} />
          </motion.div>
        )}

        {currentScreen === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <RequirementSelection
              categories={categories}
              onSelect={handleCategoryIntensitySelect}
            />
          </motion.div>
        )}

        {currentScreen === 'builds' && (
          <motion.div
            key="builds"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <RecommendedBuilds
              builds={getFilteredBuilds()}
              category={selectedCategory!}
              intensity={selectedIntensity!}
              onBuildSelect={handleBuildSelect}
              onBackToSelection={handleBackToSelection}
              themeCategory={selectedCategory}
            />
          </motion.div>
        )}

        {currentScreen === 'details' && selectedBuild && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <BuildDetails
              build={selectedBuild}
              electricitySettings={electricitySettings!}
              onSaveBuild={handleSaveBuild}
              onBackToBuilds={handleBackToBuilds}
              user={authState.user}
              themeCategory={selectedCategory}
              onOpenPriceEditor={handleOpenPriceEditor}
            />
          </motion.div>
        )}

        {currentScreen === 'price-editor' && selectedBuild && (
          <motion.div
            key="price-editor"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <PriceEditor build={selectedBuild} onClose={handleBackFromPriceEditor} />
          </motion.div>
        )}

        {currentScreen === 'vendor-dashboard' && (
          <motion.div
            key="vendor-dashboard"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <VendorDashboard 
              vendor={authState.vendor} 
              onRegisterShop={handleRegisterShop} 
              onBackToSelection={handleBackToRoleSelection}
              
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showElectricityModal && (
          <ElectricityModal
            isOpen={showElectricityModal}
            onClose={() => setShowElectricityModal(false)}
            onSubmit={handleElectricitySubmit}
          />
        )}
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            onSignup={handleSignup}
          />
        )}
        {showSavedBuildsModal && (
          <SavedBuildsModal
            savedBuilds={savedBuilds}
            onClose={() => setShowSavedBuildsModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

