import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryType, IntensityType, PCBuild, ElectricitySettings } from './types';
import RequirementSelection from './components/RequirementSelection';
import ElectricityModal from './components/ElectricityModal';
import RecommendedBuilds from './components/RecommendedBuilds';
import BuildDetails from './components/BuildDetails';
import PriceEditor from './components/PriceEditor';
import { pcBuilds } from './data/mockData';
import { fetchBuilds, seedBuilds } from './api';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'selection' | 'builds' | 'details' | 'price-editor'>('selection');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityType | null>(null);
  const [showElectricityModal, setShowElectricityModal] = useState(false);
  const [electricitySettings, setElectricitySettings] = useState<ElectricitySettings | null>(null);
  const [selectedBuild, setSelectedBuild] = useState<PCBuild | null>(null);
  const [savedBuilds, setSavedBuilds] = useState<PCBuild[]>([]);
  const [builds, setBuilds] = useState<PCBuild[]>(pcBuilds);
  const [apiReady, setApiReady] = useState<boolean>(false);

  // On mount: try to fetch builds from backend; if empty, seed with mockData
  useEffect(() => {
    (async () => {
      try {
        const serverBuilds = await fetchBuilds();
        if (serverBuilds.length === 0) {
          // seed
          await seedBuilds(pcBuilds);
          const seeded = await fetchBuilds();
          setBuilds(seeded);
        } else {
          setBuilds(serverBuilds);
        }
        setApiReady(true);
      } catch (e) {
        // Backend likely not running; keep mock data
        setApiReady(false);
      }
    })();
  }, []);

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
    setSavedBuilds(prev => [...prev, build]);
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

  const handleOpenPriceEditor = () => {
    setCurrentScreen('price-editor');
  };

  const handleBackFromPriceEditor = () => {
    setCurrentScreen('details');
  };

  const handleSaveBuilds = (updatedBuilds: PCBuild[]) => {
    setBuilds(updatedBuilds);
  };

  const getFilteredBuilds = (): PCBuild[] => {
    if (!selectedCategory || !selectedIntensity) return [];
    return builds.filter(build => 
      build.category === selectedCategory && build.intensity === selectedIntensity
    );
  };

  const getThemeClasses = () => {
    // Always use dark cyber theme
    return "bg-gradient-to-br from-slate-900 via-gray-900 to-black";
  };

  const getTextColorClasses = () => {
    // Always use light text for dark cyber theme
    return 'text-gray-300';
  };

  const getHeaderGradient = () => {
    if (!selectedCategory) return "from-blue-600 to-cyan-600";
    
    switch (selectedCategory) {
      case 'gaming':
        return "from-cyan-400 to-blue-500";
      case 'editing':
        return "from-blue-600 to-indigo-600";
      case 'office':
        return "from-slate-600 to-blue-600";
      default:
        return "from-blue-600 to-cyan-600";
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} relative overflow-hidden transition-all duration-1000`}>
      {/* Cyber grid background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(cyan 1px, transparent 1px),
            linear-gradient(90deg, cyan 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Neon accent lines */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute left-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
        <div className="absolute right-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
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
            <p className={`text-base ${getTextColorClasses()} opacity-80`}>
              What do you need your PC for?
            </p>
          </motion.header>
        )}

        {/* Header - Small in upper left for other screens */}
        {currentScreen !== 'selection' && (
          <motion.header 
            className="flex justify-start items-center px-6 py-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Compfy
            </h1>
          </motion.header>
        )}

        {/* Screen Content */}
        <AnimatePresence mode="wait">
          {currentScreen === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <RequirementSelection 
                onSelect={handleCategoryIntensitySelect} 
                selectedCategory={selectedCategory}
              />
            </motion.div>
          )}

          {currentScreen === 'builds' && (
            <motion.div
              key="builds"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
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
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <BuildDetails 
                build={selectedBuild}
                electricitySettings={electricitySettings!}
                onSaveBuild={handleSaveBuild}
                onBackToBuilds={handleBackToBuilds}
                isSaved={savedBuilds.some(b => b.id === selectedBuild.id)}
                themeCategory={selectedCategory}
                onOpenPriceEditor={handleOpenPriceEditor}
              />
            </motion.div>
          )}

          {currentScreen === 'price-editor' && (
            <motion.div
              key="price-editor"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <PriceEditor 
                onBackToApp={handleBackFromPriceEditor}
                onSaveBuilds={handleSaveBuilds}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Electricity Settings Modal */}
        <ElectricityModal
          isOpen={showElectricityModal}
          onClose={() => setShowElectricityModal(false)}
          onSubmit={handleElectricitySubmit}
        />
      </div>
    </div>
  );
}