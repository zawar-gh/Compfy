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
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { getBuilds } from './api/builds';
import { signup, login } from './api/auth';
import { categories } from './data/mockData';
import { registerShop } from './services/api';

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
  const [showProfileModal, setShowProfileModal] = useState(false);

  // App navigation state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('auth');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityType | null>(null);
  const [showElectricityModal, setShowElectricityModal] = useState(false);
  const [electricitySettings, setElectricitySettings] = useState<ElectricitySettings | null>(null);
  const [selectedBuild, setSelectedBuild] = useState<PCBuild | null>(null);

  // Builds fetched from backend
  const [builds, setBuilds] = useState<PCBuild[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Saved builds
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);

  // Fetch builds from backend
  useEffect(() => {
    getBuilds()
      .then((data) => {
        const normalized = data.map((b, i) => ({
          ...b,
          category: (b as any).category || (i % 2 === 0 ? 'gaming' : 'office'),
          intensity: (b as any).intensity || 'casual',
          isActive: (b as any).isActive ?? true,
        }));
        setBuilds(normalized);
      })
      .catch((err) => {
        console.error('Failed to fetch builds:', err);
        setError('Could not load builds. Check backend and API response.');
      });
  }, []);

  // ------------------- HANDLERS -------------------

  // Authentication
  const handleLogin = (user: User, token: string) => {
    localStorage.setItem("access_token", token);
    setAuthState({
      isAuthenticated: true,
      user,
      vendor: null,
      token,
    });
    setShowAuthModal(false);
    setCurrentScreen('role-selection');
  };

  const handleSignup = async () => {
  if (!signupForm.username || !signupForm.password || !signupForm.email) {
    setErrors({ general: "All fields required" });
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch(`${API_BASE}/auth/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signupForm.username,
        email: signupForm.email,
        password: signupForm.password,
        role: signupForm.role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const messages = Object.values(data).flat().join(" ");
      setErrors({ general: messages || "Signup failed" });
      return;
    }

    const token = data.access;
    const user: UserType = {
      id: data.user?.id || data.id,
      username: data.user?.username || data.username,
      email: data.user?.email || data.email,
      address: '',
      createdAt: '',
    };

    localStorage.setItem("token", token);
    onSignup(user, token);
    onClose();
   } catch (err) {
    setErrors({ general: "Signup failed. Please try again." });
   } finally {
    setIsLoading(false);
   }
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

  // Role selection
  const handleRoleSelect = (role: UserRole) => {
    if (role === 'customer') {
      setCurrentScreen('selection');
    } else {
      setCurrentScreen('vendor-dashboard');
    }
  };


  // Vendor registration
 const handleRegisterShop = async (shopData: Omit<Vendor, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  if (!authState.user || !authState.token) return;

  try {
    const registeredVendor = await registerShop(shopData, authState.token);
    setAuthState((prev) => ({ ...prev, vendor: registeredVendor }));
    alert('✅ Shop registered successfully!');
  } catch (err: any) {
    console.error('Shop registration failed', err.response || err);
    alert('❌ Failed to register shop. Check console for details.');
  }
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

  // Filter builds
  const getFilteredBuilds = (): PCBuild[] => {
    if (!selectedCategory || !selectedIntensity) return [];
    return builds.filter(
      (b) => b.category === selectedCategory && b.intensity === selectedIntensity && b.isActive !== false
    );
  };

  // Theme
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

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated && currentScreen !== 'auth') {
      setCurrentScreen('auth');
    }
  }, [authState.isAuthenticated, currentScreen]);

  if (error)
    return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (builds.length === 0 && !error)
    return <div className="p-8 text-gray-300 text-center">Loading builds...</div>;

  // ------------------- RENDER -------------------
  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${getThemeClasses()}`}>
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

      {/* Background Images */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Gaming Setup Background"
          className="absolute top-0 right-0 w-1/3 h-1/2 object-cover"
        />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1636036766419-4e0e3e628acc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Gaming Workstation Background"
          className="absolute bottom-0 left-0 w-1/3 h-1/2 object-cover"
        />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1636488363148-818c08eec89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Cyberpunk Gaming Setup Background"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 object-cover"
        />
      </div>

      {/* Header */}
      {authState.isAuthenticated && currentScreen !== 'selection' && currentScreen !== 'role-selection' && currentScreen !== 'auth' && (
        <Header
          authState={authState}
          savedBuilds={savedBuilds}
          onShowSavedBuilds={() => setShowSavedBuildsModal(true)}
          onEditProfile={() => setShowProfileModal(true)}
          onEditVendorProfile={() => {}}
          onDeleteProfile={() => {}}
          onLogout={handleLogout}
          isCompact={currentScreen !== 'selection'}
        />
      )}

      {(currentScreen === 'selection' || currentScreen === 'auth' || currentScreen === 'role-selection') && (
        <motion.header
          className="text-center py-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Compfy
          </h1>
          <p className={`text-xl ${getTextColorClasses()}`}>
            Build Your PC with Comfort
          </p>
        </motion.header>
      )}

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
                Begin your Digital journey
              </h1>
              <div className="flex space-x-4 mt-4 w-full justify-center">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-white border border-cyan-500/50 rounded-lg transition-all duration-300"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 neon-button bg-purple-900/30 hover:bg-purple-900/50 text-white border border-purple-500/50 rounded-lg transition-all duration-300"
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
             onBackToSelection={handleBackToRoleSelection} // <-- pass handler here
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
        {showProfileModal && authState.user && (
          <ProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            user={authState.user}
            onLogout={handleLogout}
          />
        )}

      </AnimatePresence>
    </div>
  );
}
