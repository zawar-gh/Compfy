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
import { saveBuild as saveBuildAPI, getSavedBuilds } from "./api/savedBuilds";
import ProfileModal from './components/ProfileModal';
import toast from 'react-hot-toast';
// removed unused getShops import to avoid confusion

type AppScreen =
  | 'auth'
  | 'role-selection'
  | 'selection'
  | 'builds'
  | 'details'
  | 'price-editor'
  | 'vendor-dashboard';

export default function App() {
  // ------ normalize helper ------
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

  // optional: which form tab to show when opening AuthModal
  const [authModalMode, setAuthModalMode] = useState<'login'|'signup'>('signup');

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
    // persist token
    localStorage.setItem("access_token", token);

    try {
      // Fetch full user info from backend
      const res = await fetch("http://127.0.0.1:8000/api/users/current/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();

      // Try to fetch the vendor for logged-in user using dedicated endpoint
      let vendorRaw: any = null;
      try {
        const vendorRes = await fetch("http://127.0.0.1:8000/api/vendor/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (vendorRes.ok) {
          vendorRaw = await vendorRes.json();
          // If API returns an array, find the one for current user
          if (Array.isArray(vendorRaw)) {
            vendorRaw = vendorRaw.find((v: any) => (v.user ?? v.user_id) === data.user.id) || null;
          }
        } else {
          // fallback: use vendor info from /users/current/ if present
          vendorRaw = Array.isArray(data.vendor) ? data.vendor[0] : data.vendor || null;
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

      // Navigate depending on vendor presence
      if (vendor) {
        setCurrentScreen("role-selection");
      } else {
        setCurrentScreen("role-selection");
      }
    } catch (err) {
      console.error("Login fetch failed:", err);
      toast.error("Failed to log in. Try again.");
    }
  };

  // Centralized logout (clears everything and shows auth screen)
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuthState({ isAuthenticated: false, user: null, vendor: null, token: null });
    setSelectedCategory(null);
    setSelectedIntensity(null);
    setElectricitySettings(null);
    setSelectedBuild(null);
    setSavedBuilds([]);
    // Make sure we move to auth screen
    setCurrentScreen('auth');
    // open auth modal in signup mode so user sees sign up quickly (optional)
    setAuthModalMode('signup');
  };

  // Call this when the account was deleted server-side (Header currently calls deleteAccount and then onDeleteProfile)
  const handleAccountDeleted = () => {
    // close profile modal if open
    setShowProfileModal(false);
    // clear auth locally
    localStorage.removeItem("access_token");
    setAuthState({ isAuthenticated: false, user: null, vendor: null, token: null });
    setSelectedCategory(null);
    setSelectedIntensity(null);
    setElectricitySettings(null);
    setSelectedBuild(null);
    setSavedBuilds([]);
    toast.success("Profile deleted successfully!");

    // ensure we show the auth screen and open the signup modal
    setCurrentScreen('auth');
    setAuthModalMode('signup');
  };

  // --------- Restore Auth State on App Load ----------
  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        // Fetch current logged-in user
        const res = await fetch("http://127.0.0.1:8000/api/users/current/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();

        // Fetch the vendor tied to this user using dedicated endpoint
        let vendorRaw: any = null;
        try {
          const vendorRes = await fetch("http://127.0.0.1:8000/api/vendor/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (vendorRes.ok) {
            vendorRaw = await vendorRes.json();
            if (Array.isArray(vendorRaw)) {
              vendorRaw = vendorRaw.find((v: any) => (v.user ?? v.user_id) === data.user.id) || null;
            }
          }
        } catch (e) {
          console.warn("Failed to fetch /api/vendor/:", e);
        }

        const vendor = normalizeVendor(vendorRaw);

        setAuthState({
          isAuthenticated: true,
          user: data.user || null,
          vendor,
          token,
        });

        // Navigate depending on vendor presence
        if (vendor) {
          setCurrentScreen("role-selection");
        } else {
          setCurrentScreen("role-selection");
        }
      } catch (err) {
        console.error("Auth restore failed:", err);
        localStorage.removeItem("access_token");
      }
    };

    restoreAuth();
    // run once on mount
  }, []);

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
        user: authState.user.id, // attach user link (safe)
      };

      const registeredVendor = await registerShop(payload, token);

      // Normalize vendor fields (registeredVendor may be raw Django JSON)
      // If backend returns the vendor created, normalize; else attempt to fetch /api/vendor/
      let vendorRaw = registeredVendor;
      if (!vendorRaw || !vendorRaw.id) {
        try {
          const vendorRes = await fetch("http://127.0.0.1:8000/api/vendor/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (vendorRes.ok) {
            vendorRaw = await vendorRes.json();
            if (Array.isArray(vendorRaw)) {
              vendorRaw = vendorRaw.find((v: any) => (v.user ?? v.user_id) === authState.user!.id) || vendorRaw;
            }
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
    setCurrentScreen('builds');
  };

  const handleBuildSelect = (build: PCBuild) => {
    setSelectedBuild(build);
    setCurrentScreen('details');
  };

  const handleSaveBuild = async (build: PCBuild) => {
    const token = authState.token ?? localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to save builds.");
      return;
    }

    try {
      const saved = await saveBuildAPI(build, token);
      setSavedBuilds((prev) => [...prev, saved]);
      alert("✅ Build saved successfully!");
    } catch (err) {
      console.error("Save build failed:", err);
      alert("❌ Failed to save build. Try again.");
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
  const handleSaveBuilds = (updatedBuilds: PCBuild[]) => setBuilds(updatedBuilds);

  // Filter builds
  const getFilteredBuilds = (): PCBuild[] => {
    if (!selectedCategory || !selectedIntensity) return [];

    return builds.filter(
      (b) => b.category.id === selectedCategory && b.intensity.id === selectedIntensity
    );
  };

  // Theme helpers
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
    // intentionally depend on authState.isAuthenticated and currentScreen
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
      {authState.isAuthenticated && currentScreen !== 'auth' && (
        <Header
          authState={authState}
          savedBuilds={savedBuilds}
          onShowSavedBuilds={() => setShowSavedBuildsModal(true)}
          onEditProfile={() => setShowProfileModal(true)}
          onEditVendorProfile={() => {}}
          // <- PASS the centralized delete completion handler HERE
          onDeleteProfile={() => {
            // The Header component itself typically performs the server delete (deleteAccount)
            // and then calls this prop after a successful delete. When this prop is invoked
            // we close modals, clear auth and show the signup modal.
            handleAccountDeleted();
          }}
          onLogout={handleLogout}
          isCompact={currentScreen !== 'selection'}
        />
      )}

      {(currentScreen === 'auth' || currentScreen === 'role-selection') && (
        <motion.header
          className="text-center py-3"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Compfy
          </h1>
          <p className="text-xl text-gray-300">
            Build your PC Comfortably
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
            onSignup={(user, token) => handleLogin(user, token)}
            /* Note: if your AuthModal accepts an initial mode prop, you can pass authModalMode here.
               I intentionally didn't change AuthModal's signature to avoid breaking anything; instead
               we control which tab we want via authModalMode state and setShowAuthModal(true) accordingly. */
          />
        )}
        {showSavedBuildsModal && (
          <SavedBuildsModal
            isOpen={showSavedBuildsModal}
            onClose={() => setShowSavedBuildsModal(false)}
            savedBuilds={savedBuilds}
            onSelectBuild={handleBuildSelect}
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
