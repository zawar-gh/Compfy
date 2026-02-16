// src/App.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import toast, { Toaster } from 'react-hot-toast';

// Types imports
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

// Components Imports
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
import ProfileModal from './components/ProfileModal';
import { categories } from './data/mockData';

// APIs imports
import { getBuilds } from './api/builds';
import { registerShop } from './services/api';
import { saveBuild as saveBuildAPI, getSavedBuilds } from "./api/savedBuilds";
import client from './api/client'; // ✅ Centralized axios client

// App states and Screens
type AppScreen =
  | 'auth'
  | 'role-selection'
  | 'selection'
  | 'builds'
  | 'details'
  | 'price-editor'
  | 'vendor-dashboard';

// Root Function
export default function App() {
  // ------ Normalize Helper ------
  const normalizeVendor = (v: any): Vendor | null => {
    if (!v) return null;
    return {
      id: v.id ?? null,
      userId: v.user ?? v.user_id ?? null,
      shopName: v.shop_name ?? v.shopName ?? "",
      city: v.city ?? "",
      phone: v.contact ?? v.phone ?? "",
      address: v.address ?? "",
      createdAt: v.created_at ?? null,
      updatedAt: v.updated_at ?? null,
    } as Vendor;
  };

  // State Variables
  // Authentication state
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
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
  const [isFromSavedBuild, setIsFromSavedBuild] = useState(false);

  // Builds fetched from backend
  const [builds, setBuilds] = useState<PCBuild[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Saved builds
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);

  // Fetch builds from backend
  useEffect(() => {
    getBuilds()
      .then((data) => {
        const normalized = data.map((b: any, i: number) => {
          const category =
            typeof b.category === "string"
              ? { id: b.category, name: b.category }
              : b.category ?? { id: i % 2 === 0 ? "gaming" : "office", name: "Unknown" };

          const intensity =
            typeof b.intensity === "string"
              ? { id: b.intensity, name: b.intensity }
              : b.intensity ?? { id: "casual", name: "Casual" };

          return {
            ...b,
            category,
            intensity,
            isActive: b.isActive ?? true,
          } as PCBuild;
        });
        setBuilds(normalized);
      })
      .catch((err) => {
        console.error("Failed to fetch builds:", err);
        setError("Could not load builds. Check backend and API response.");
      });
  }, []);

  // ------------------- HANDLERS -------------------

  // Authentication: handleLogin
  const handleLogin = async (user: User, token: string) => {
    // persist token first so client interceptor picks it up
    localStorage.setItem("access_token", token);

    try {
      // ✅ FIX: Use client.get instead of fetch
      const res = await client.get("/users/current/");
      const data = res.data; // Axios returns data directly

      // Try to fetch the vendor for logged-in user using dedicated endpoint
      let vendorRaw: any = null;
      try {
        // ✅ FIX: Use client.get
        const vendorRes = await client.get("/vendor/");
        vendorRaw = vendorRes.data;

        // If API returns an array, find the one for current user
        if (Array.isArray(vendorRaw)) {
          vendorRaw = vendorRaw.find((v: any) => (v.user ?? v.user_id) === data.user.id) || null;
        }
      } catch (e) {
        // fallback to whatever /users/current/ provided
        vendorRaw = Array.isArray(data.vendor) ? data.vendor[0] : data.vendor || null;
      }

      const vendor = normalizeVendor(vendorRaw);

      setAuthState({
        isAuthenticated: true,
        user: data.user || user,
        vendor,
        token,
      });

      setCurrentScreen("role-selection");

    } catch (err) {
      console.error("Login fetch failed:", err);
      toast.error("Failed to log in. Try again.");
    }
  };

  // Centralized logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuthState({ isAuthenticated: false, user: null, vendor: null, token: null });
    setSelectedCategory(null);
    setSelectedIntensity(null);
    setElectricitySettings(null);
    setSelectedBuild(null);
    setSavedBuilds([]);
    setCurrentScreen('auth');
    setAuthModalMode('signup');
  };

  const handleAccountDeleted = () => {
    setShowProfileModal(false);
    localStorage.removeItem("access_token");
    setAuthState({ isAuthenticated: false, user: null, vendor: null, token: null });
    setSelectedCategory(null);
    setSelectedIntensity(null);
    setElectricitySettings(null);
    setSelectedBuild(null);
    setSavedBuilds([]);
    toast.success("Profile deleted successfully!");
    setCurrentScreen('auth');
    setAuthModalMode('signup');
  };

  // --------- Restore Auth State on App Load ----------
  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        // ✅ FIX: Use client.get instead of fetch
        const res = await client.get("/users/current/");
        const data = res.data;

        // Fetch the vendor tied to this user
        let vendorRaw: any = null;
        try {
          // ✅ FIX: Use client.get
          const vendorRes = await client.get("/vendor/");
          vendorRaw = vendorRes.data;
          
          if (Array.isArray(vendorRaw)) {
            vendorRaw = vendorRaw.find((v: any) => (v.user ?? v.user_id) === data.user.id) || null;
          }
        } catch (e) {
          console.warn("Failed to fetch /vendor/:", e);
        }

        const vendor = normalizeVendor(vendorRaw);

        setAuthState({
          isAuthenticated: true,
          user: data.user || null,
          vendor,
          token,
        });

        setCurrentScreen("role-selection");
        
      } catch (err) {
        console.error("Auth restore failed:", err);
        localStorage.removeItem("access_token");
      }
    };

    restoreAuth();
  }, []);

  // --------- Fetch Saved Builds After Login or Restore ----------
  useEffect(() => {
    const fetchSavedBuilds = async () => {
      const token = authState.token ?? localStorage.getItem("access_token");
      if (!token || !authState.isAuthenticated) return;

      try {
        // getSavedBuilds uses axios internally via savedBuilds.ts? 
        // Assuming yes, but if it takes token, passing it is fine.
        const builds = await getSavedBuilds(token);
        setSavedBuilds(builds);
      } catch (err) {
        console.error("Failed to fetch saved builds:", err);
      }
    };
    fetchSavedBuilds();
  }, [authState.isAuthenticated, authState.token]);

  // Role selection
  const handleRoleSelect = (role: UserRole) => {
    if (role === 'customer') {
      setCurrentScreen('selection');
    } else {
      setCurrentScreen('vendor-dashboard');
    }
  };

  // Vendor registration
  const handleRegisterShop = async (
    shopData: Omit<Vendor, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    if (!authState.user) {
      toast.error("You must be logged in to register a shop.");
      return;
    }
    const token = authState.token ?? localStorage.getItem("access_token");
    if (!token) {
      toast.error("Missing auth token.");
      return;
    }

    try {
      const payload = {
        ...shopData,
        user: authState.user.id,
      };

      const registeredVendor = await registerShop(payload, token);

      // Normalize vendor fields
      let vendorRaw = registeredVendor;
      if (!vendorRaw || !vendorRaw.id) {
        try {
          // ✅ FIX: Use client.get fallback
          const vendorRes = await client.get("/vendor/");
          vendorRaw = vendorRes.data;
          if (Array.isArray(vendorRaw)) {
            vendorRaw = vendorRaw.find((v: any) => (v.user ?? v.user_id) === authState.user!.id) || vendorRaw;
          }
        } catch (e) {
          console.warn("Failed to refetch vendor after register:", e);
        }
      }

      const vendor = normalizeVendor(vendorRaw);

      setAuthState((prev) => ({ ...prev, vendor, token }));
      toast.success("Shop registered successfully!");
      setCurrentScreen("vendor-dashboard");
    } catch (err: any) {
      console.error("Shop registration failed:", err?.response || err);
      toast.error("Failed to register shop.");
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

    if (isFromSavedBuild) {
      setCurrentScreen("details");
      setIsFromSavedBuild(false);
    } else {
      setCurrentScreen("builds");
    }
  };

  const handleBuildSelect = (build: PCBuild, fromSaved = false) => {
    setSelectedBuild(build);
    setIsFromSavedBuild(fromSaved);

    if (fromSaved) {
      setShowElectricityModal(true);
    } else {
      setCurrentScreen("details");
    }
  };

  const handleSaveBuild = async (build: PCBuild) => {
    const token = authState.token ?? localStorage.getItem("access_token");
    if (!token) {
      toast.error("Please log in to save builds.");
      return;
    }

    try {
      const saved = await saveBuildAPI(build, token);
      setSavedBuilds((prev) => [...prev, saved]);
      toast.success("Build saved successfully!");
    } catch (err) {
      console.error("Save build failed:", err);
      toast.error("Failed to save build. Try again.");
    }
  };

  const handleRemoveSavedBuild = async (savedBuildId: string) => {
    const token = authState.token ?? localStorage.getItem("access_token");
    if (!token) {
      toast.error("Not authenticated.");
      return;
    }

    try {
      // ✅ FIX: Use client.delete instead of fetch
      await client.delete(`/builds/saved-builds/${savedBuildId}/`);

      setSavedBuilds((prev) => prev.filter((b) => b.id !== savedBuildId));
      toast.success("Saved build removed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove saved build.");
    }
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

  // Filter builds
  const getFilteredBuilds = (): PCBuild[] => {
    if (!selectedCategory || !selectedIntensity) return [];

    return builds.filter(
      (b) => b.category.id === selectedCategory && b.intensity.id === selectedIntensity
    );
  };

  // Theme helpers
  const getThemeClasses = () => 'bg-gradient-to-br from-slate-900 via-gray-900 to-black';

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated && currentScreen !== 'auth') {
      setCurrentScreen('auth');
    }
  }, [authState.isAuthenticated, currentScreen]);

  if (error)
    return <div className="p-8 text-red-500 text-center">{error}</div>;

  if (builds.length === 0 && !error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-cyan-400 rounded-full animate-ping opacity-40" />
          <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin" />
        </div>
        <h2 className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Loading Builds...
        </h2>
        <p className="text-gray-400 mt-2">Please wait a moment</p>
      </motion.div>
    );
  }

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

      {/* Header */}
      {authState.isAuthenticated && currentScreen !== 'auth' && (
        <Header
          authState={authState}
          savedBuilds={savedBuilds}
          onShowSavedBuilds={() => setShowSavedBuildsModal(true)}
          onEditProfile={() => setShowProfileModal(true)}
          onEditVendorProfile={() => { }}
          onDeleteProfile={handleAccountDeleted}
          onLogout={handleLogout}
          isCompact={currentScreen !== 'selection'}
        />
      )}

      {(currentScreen === 'auth' || currentScreen === 'role-selection') && (
        <motion.div
          className="flex flex-col items-center space-y-6 mt-30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        </motion.div>
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
            <div className="flex flex-col items-center w-full max-w-md">
              <h1 className="text-6xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Compfy
              </h1>
              {/* Tagline */}
              <p className="text-l font-bold text-gray-300 mb-12">
                Build your PC Comfortably
              </p>
              <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Begin your Digital journey
              </h1>
              <div className="flex space-x-4 mt-4 w-full justify-center">
                <button
                  onClick={() => {
                    setAuthModalMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="px-6 py-3 neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-white border border-cyan-500/50 rounded-lg transition-all duration-300"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                  }}
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
              onBackToSelection={handleBackToRoleSelection}
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
              isSaved={savedBuilds.some(b => b.id === selectedBuild.id)}
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
            onSignup={(user, token) => handleLogin(user, token)}
          />
        )}
        {showSavedBuildsModal && (
          <SavedBuildsModal
            isOpen={showSavedBuildsModal}
            onClose={() => setShowSavedBuildsModal(false)}
            savedBuilds={savedBuilds}
            onSelectBuild={handleBuildSelect}
            onRemoveSavedBuild={handleRemoveSavedBuild}
          />
        )}

        {showProfileModal && authState.user && (
          <ProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            user={authState.user}
            vendor={authState.vendor}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
      {/* Global Toast Notification System */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#e2e8f0',
            border: '1px solid #22d3ee',
          },
        }}
      />
    </div>
  );
}