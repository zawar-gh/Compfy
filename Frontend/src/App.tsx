// src/App.tsx
import React, { useEffect, useState } from 'react';
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
import { categories } from './data/mockData';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

type AppScreen =
  | 'auth'
  | 'role-selection'
  | 'selection'
  | 'builds'
  | 'details'
  | 'price-editor'
  | 'vendor-dashboard';

export default function App() {
  // -----------------------
  // App state (merged)
  // -----------------------
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    vendor: null,
    token: null,
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSavedBuildsModal, setShowSavedBuildsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('auth');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityType | null>(null);
  const [showElectricityModal, setShowElectricityModal] = useState(false);
  const [electricitySettings, setElectricitySettings] = useState<ElectricitySettings | null>(null);
  const [selectedBuild, setSelectedBuild] = useState<PCBuild | null>(null);

  // Builds (prefers backend; falls back to mockData)
  const [builds, setBuilds] = useState<PCBuild[]>([]);
  const [isLoadingBuilds, setIsLoadingBuilds] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Saved builds
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);

  // -----------------------
  // Fetch builds on mount
  // -----------------------
  useEffect(() => {
    let cancelled = false;
    setIsLoadingBuilds(true);
    getBuilds()
      .then((data) => {
        if (cancelled) return;
        // Normalize a bit so missing fields don't break UI
        const normalized: PCBuild[] = data.map((b: any, i: number) => ({
          ...b,
          category: (b as any).category || (i % 2 === 0 ? ('gaming' as CategoryType) : ('office' as CategoryType)),
          intensity: (b as any).intensity || ('casual' as IntensityType),
          isActive: (b as any).isActive ?? true,
        }));
        setBuilds(normalized);
      })
      .catch((err) => {
        console.error('Failed to fetch builds, falling back to local mockData.', err);
        setError('Could not load builds from backend. Using fallback data.');
        // fallback to pcBuilds from mockData so the UI still works
        const fallback = pcBuilds.map((b) => ({ ...b, isActive: b.isActive ?? true }));
        setBuilds(fallback);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBuilds(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // -----------------------
  // Auth handlers (flexible signatures)
  // -----------------------
  // Accepts either (user: User) or (user: User, token: string)
  const handleLogin = (user: User, token?: string) => {
    const tok = token ?? 'mock-jwt-token';
    setAuthState({
      isAuthenticated: true,
      user,
      vendor: null,
      token: tok,
    });
    setShowAuthModal(false);
    setCurrentScreen('role-selection');
  };

  const handleSignup = (user: User, token?: string) => {
    const tok = token ?? 'mock-jwt-token';
    setAuthState({
      isAuthenticated: true,
      user,
      vendor: null,
      token: tok,
    });
    setShowAuthModal(false);
    setCurrentScreen('role-selection');
  };

  const handleLogout = () => {
    setAuthState({ isAuthenticated: false, user: null, vendor: null, token: null });
    setCurrentScreen('auth');
    setSelectedCategory(null);
    setSelectedIntensity(null);
    setElectricitySettings(null);
    setSelectedBuild(null);
    setSavedBuilds([]);
  };

  // -----------------------
  // Role / Vendor
  // -----------------------
  const handleRoleSelect = (role: UserRole) => {
    if (role === 'customer') {
      setCurrentScreen('selection');
    } else {
      setCurrentScreen('vendor-dashboard');
    }
  };

  const handleRegisterShop = (
    shopData: Omit<Vendor, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!authState.user) {
      // safety check — don't crash if user isn't present
      console.warn('Attempted to register shop without a logged-in user.');
      return;
    }
    const vendor: Vendor = {
      id: '1',
      userId: authState.user.id,
      ...shopData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAuthState((prev) => ({ ...prev, vendor }));
  };

  // -----------------------
  // PC Build flows
  // -----------------------
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
    if (savedBuilds.some((s) => s.buildId === build.id)) return;
    const savedBuild: SavedBuild = {
      id: `saved-${Date.now()}`,
      userId: authState.user?.id ?? 'guest',
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

  // -----------------------
  // Filtering & theme helpers
  // -----------------------
  const getFilteredBuilds = (): PCBuild[] => {
    if (!selectedCategory || !selectedIntensity) return [];
    return builds.filter(
      (b) => b.category === selectedCategory && b.intensity === selectedIntensity && b.isActive !== false
    );
  };

  const getThemeClasses = () => 'bg-gradient-to-br from-slate-900 via-gray-900 to-black';
  const getTextColorClasses = () => 'text-gray-300';
  const getHeaderGradient = () => {
    if (!selectedCategory) return 'from-blue-600 to-cyan-600';
    switch (selectedCategory) {
      case 'gaming':
        return 'from-cyan-400 to-blue-500';
      case 'editing':
        return 'from-blue-600 to-indigo-600';
      case 'office':
        return 'from-slate-600 to-blue-600';
      default:
        return 'from-blue-600 to-cyan-600';
    }
  };

  // Redirect to auth if not authenticated (keeps currentScreen === 'auth' while unauthenticated)
  useEffect(() => {
    if (!authState.isAuthenticated && currentScreen !== 'auth') setCurrentScreen('auth');
  }, [authState.isAuthenticated, currentScreen]);

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className={`min-h-screen ${getThemeClasses()} relative overflow-hidden transition-all duration-1000`}>
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

      {/* Neon accent lines */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        <div className="absolute left-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
        <div className="absolute right-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent" />
      </div>

      {/* Background Images - Gaming Setup Theme */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMGRlc2slMjBSR0IlMjBuZW9ufGVufDF8fHx8MTc1ODEwNzU5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Gaming Setup Background"
          className="absolute top-0 right-0 w-1/3 h-1/2 object-cover"
        />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1636036766419-4e0e3e628acc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB3b3Jrc3RhdGlvbiUyMGNvbXB1dGVyJTIwc2V0dXAlMjBuZW9ufGVufDF8fHx8MTc1ODEwNzU5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Gaming Workstation Background"
          className="absolute bottom-0 left-0 w-1/3 h-1/2 object-cover"
        />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1636488363148-818c08eec89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBnYW1pbmclMjBzZXR1cCUyMExFRHxlbnwxfHx8fDE3NTgxMDc2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Cyberpunk Gaming Setup Background"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header for authenticated users (original-style header rendering preserved) */}
        {authState.isAuthenticated && currentScreen !== 'selection' && currentScreen !== 'role-selection' && currentScreen !== 'auth' && (
          <Header
            authState={authState}
            savedBuilds={savedBuilds}
            onShowSavedBuilds={() => setShowSavedBuildsModal(true)}
            onEditProfile={() => setShowProfileModal(true)}
            onEditVendorProfile={() => {/* vendor profile edit placeholder */}}
            onDeleteProfile={() => {/* delete profile placeholder */}}
            onLogout={handleLogout}
            isCompact={currentScreen !== 'selection'}
            /* keep compatibility with newer header props some versions expect */
            setShowAuthModal={setShowAuthModal}
            setShowSavedBuildsModal={setShowSavedBuildsModal}
          />
        )}

        {/* Header - Large and centered for selection screen */}
        {currentScreen === 'selection' && (
          <motion.header
            className="text-center py-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Compfy
            </h1>
            <p className={`text-base ${getTextColorClasses()} opacity-80`}>comfortably build your pc</p>
          </motion.header>
        )}

        {/* Header - For auth and role selection screens */}
        {(currentScreen === 'auth' || currentScreen === 'role-selection') && (
          <motion.header
            className="text-center py-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Compfy
            </h1>
            <p className={`text-base ${getTextColorClasses()} opacity-80`}>comfortably build your pc</p>
          </motion.header>
        )}

        {/* Header - Small for other screens (kept for builds/details/price-editor/vendor-dashboard) */}
        {authState.isAuthenticated && (currentScreen === 'builds' || currentScreen === 'details' || currentScreen === 'price-editor' || currentScreen === 'vendor-dashboard') && (
          <div className="px-6 py-4">
            <Header
              authState={authState}
              savedBuilds={savedBuilds}
              onShowSavedBuilds={() => setShowSavedBuildsModal(true)}
              onEditProfile={() => setShowProfileModal(true)}
              onEditVendorProfile={() => {/* vendor profile edit placeholder */}}
              onDeleteProfile={() => {/* delete profile placeholder */}}
              onLogout={handleLogout}
              isCompact={true}
              setShowAuthModal={setShowAuthModal}
              setShowSavedBuildsModal={setShowSavedBuildsModal}
            />
          </div>
        )}

        {/* Screen Content */}
        <AnimatePresence mode="wait">
          {/* AUTH */}
          {currentScreen === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex items-center justify-center min-h-[400px] px-4"
            >
              <div className="text-center">
                <p className="text-gray-300 mb-6">Welcome to Compfy! Please sign in to continue.</p>
                <div className="space-x-4">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-6 py-3 neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-white border-cyan-500/50 rounded-lg"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-6 py-3 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20 rounded-lg"
                  >
                    Login
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ROLE SELECTION */}
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

          {/* SELECTION */}
          {currentScreen === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <RequirementSelection categories={categories} onSelect={handleCategoryIntensitySelect} selectedCategory={selectedCategory} onBackToRoleSelection={handleBackToRoleSelection} />
            </motion.div>
          )}

          {/* BUILDS */}
          {currentScreen === 'builds' && (
            <motion.div
              key="builds"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {/* show loading state specifically in builds screen */}
              {isLoadingBuilds ? (
                <div className="p-8 text-center text-gray-300">Loading builds...</div>
              ) : (
                <>
                  {selectedCategory && selectedIntensity ? (
                    <RecommendedBuilds
                      builds={getFilteredBuilds()}
                      category={selectedCategory}
                      intensity={selectedIntensity}
                      onBuildSelect={handleBuildSelect}
                      onBackToSelection={handleBackToSelection}
                      onBackToRoleSelection={handleBackToRoleSelection}
                      themeCategory={selectedCategory}
                    />
                  ) : (
                    <div className="p-8 text-center text-gray-300">No category or intensity selected.</div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* DETAILS */}
          {currentScreen === 'details' && selectedBuild && electricitySettings && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <BuildDetails
                build={selectedBuild}
                electricitySettings={electricitySettings}
                onSaveBuild={handleSaveBuild}
                onBackToBuilds={handleBackToBuilds}
                isSaved={savedBuilds.some((saved) => saved.buildId === selectedBuild.id)}
                themeCategory={selectedCategory}
                onOpenPriceEditor={handleOpenPriceEditor}
                user={authState.user}
              />
            </motion.div>
          )}

          {/* PRICE EDITOR */}
          {currentScreen === 'price-editor' && selectedBuild && (
            <motion.div
              key="price-editor"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {/* We pass both old and new prop shapes for compatibility */}
              <PriceEditor
                build={selectedBuild}
                onClose={handleBackFromPriceEditor}
                onBackToApp={handleBackFromPriceEditor}
                onSaveBuilds={handleSaveBuilds}
              />
            </motion.div>
          )}

          {/* VENDOR DASHBOARD */}
          {currentScreen === 'vendor-dashboard' && (
            <motion.div
              key="vendor-dashboard"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <VendorDashboard vendor={authState.vendor} onRegisterShop={handleRegisterShop} onBackToSelection={handleBackToRoleSelection} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          // Provide flexible handlers (AuthModal can call with (user) or (user, token))
          onLogin={(user: User, token?: string) => handleLogin(user, token)}
          onSignup={(user: User, token?: string) => handleSignup(user, token)}
        />

        <ElectricityModal
          isOpen={showElectricityModal}
          onClose={() => setShowElectricityModal(false)}
          onSubmit={handleElectricitySubmit}
        />

        <SavedBuildsModal
          isOpen={showSavedBuildsModal}
          onClose={() => setShowSavedBuildsModal(false)}
          savedBuilds={savedBuilds}
          onSelectBuild={(b) => {
            setSelectedBuild(b);
            setShowSavedBuildsModal(false);
            setCurrentScreen('details');
          }}
        />
      </div>
    </div>
  );
}
