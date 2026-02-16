import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, AlertTriangle, Zap, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PCBuild, CategoryType, IntensityType } from '../types';
import VendorInfoModal from './VendorInfoModal';

interface RecommendedBuildsProps {
  builds: PCBuild[];
  category: CategoryType;
  intensity: IntensityType;
  onBuildSelect: (build: PCBuild) => void;
  onBackToSelection: () => void;
  themeCategory?: CategoryType | null;
}

export default function RecommendedBuilds({ 
  builds, 
  category, 
  intensity, 
  onBuildSelect, 
  onBackToSelection,
  themeCategory 
}: RecommendedBuildsProps) {
  const [visibleBuilds, setVisibleBuilds] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'low-to-high' | 'high-to-low' | 'default'>('low-to-high');
  const buildsContainerRef = useRef<HTMLDivElement>(null);

  const getSortedBuilds = () => {
    const buildsCopy = [...builds];
    switch (sortOrder) {
      case 'low-to-high':
        return buildsCopy.sort((a, b) => a.totalCost - b.totalCost);
      case 'high-to-low':
        return buildsCopy.sort((a, b) => b.totalCost - a.totalCost);
      default:
        return buildsCopy;
    }
  };
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  const sortedBuilds = getSortedBuilds();
  const displayedBuilds = sortedBuilds.slice(0, visibleBuilds);
  const hasMoreBuilds = visibleBuilds < sortedBuilds.length;

  const getPsuWattageFromName = (psu: string): number | undefined => {
  if (!psu) return undefined;
  const match = psu.match(/(\d+)\s*W/i);
  if (match) {
    const n = Number(match[1]);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

  const handleLoadMore = async () => {
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newVisibleCount = Math.min(visibleBuilds + 6, sortedBuilds.length);
    setVisibleBuilds(newVisibleCount);
    setIsLoading(false);

    // Smooth scroll to the new builds section
    setTimeout(() => {
      if (buildsContainerRef.current) {
        const newBuildsStartIndex = visibleBuilds;
        const buildsGrid = buildsContainerRef.current;
        const buildCards = buildsGrid.children;
        
        if (buildCards[newBuildsStartIndex]) {
          buildCards[newBuildsStartIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }, 100);
  };

  const handleSortChange = (newSortOrder: 'low-to-high' | 'high-to-low' | 'default') => {
    setSortOrder(newSortOrder);
    setVisibleBuilds(6); // Reset to first page when sorting changes
  };

  const getSortIcon = () => {
    switch (sortOrder) {
      case 'low-to-high':
        return <ArrowUp className="w-4 h-4" />;
      case 'high-to-low':
        return <ArrowDown className="w-4 h-4" />;
      default:
        return <ArrowUpDown className="w-4 h-4" />;
    }
  };

  const getSortLabel = () => {
    switch (sortOrder) {
      case 'low-to-high':
        return 'Price: Low to High';
      case 'high-to-low':
        return 'Price: High to Low';
      default:
        return 'Default Order';
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryDisplay = (cat: CategoryType) => {
    switch (cat) {
      case 'office': return 'Office Work';
      case 'editing': return 'Editing/AI-ML';
      case 'gaming': return 'Gaming';
    }
  };

  const getIntensityColor = (intensity: IntensityType) => {
    return intensity === 'casual' ? 'bg-green-500/20 text-green-400 border-green-500' : 'bg-orange-500/20 text-orange-400 border-orange-500';
  };
  const getBuildPower = (build: PCBuild) => {
  const psuWattage = getPsuWattageFromName(build.components?.psu?.name || '');
  return psuWattage || build.estimatedWattage || 0;
};


  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <Button
            variant="outline"
            onClick={onBackToSelection}
            className="mr-4 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
        </div>
        
        <h2 className="text-4xl font-bold text-gray-100 mb-4">
          Recommended PC Builds for You
        </h2>
        <div className="flex items-center justify-center gap-3 mb-6">
          <Badge variant="outline" className={getIntensityColor(intensity)}>
          {intensity ? intensity.charAt(0).toUpperCase() + intensity.slice(1) : ''}
          </Badge>
        </div>
        
        {/* Sort Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-sm text-gray-300">Sort by:</span>
          <div className="flex gap-2">
            <Button
              variant={sortOrder === 'low-to-high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('low-to-high')}
              className={`flex items-center gap-2 ${
                sortOrder === 'low-to-high' 
                  ? 'bg-cyan-900/50 text-cyan-300 border-cyan-500/50 hover:bg-cyan-900/60' 
                  : 'neon-button text-gray-300 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
              Low to High
            </Button>
            <Button
              variant={sortOrder === 'high-to-low' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('high-to-low')}
              className={`flex items-center gap-2 ${
                sortOrder === 'high-to-low' 
                  ? 'bg-cyan-900/50 text-cyan-300 border-cyan-500/50 hover:bg-cyan-900/60' 
                  : 'neon-button text-gray-300 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20'
              }`}
            >
              <ArrowDown className="w-4 h-4" />
              High to Low
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Build Cards */}
      <div ref={buildsContainerRef} className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
        {displayedBuilds.map((build, index) => (
          <motion.div
            key={build.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index < 6 ? index * 0.1 : (index - Math.floor(index / 6) * 6) * 0.1 + 0.3 
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <Card 
              className="h-full cyber-card card-hover cursor-pointer"
              onClick={() => onBuildSelect(build)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl text-gray-100">
                    {build.name}
                  </CardTitle>
                </div>

                <div className="text-2xl font-bold text-cyan-400 neon-text">
                  {formatCurrency(build.totalCost)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Mini Specs */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-300 mb-3">Key Components:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">CPU:</span>
                      <span className="font-medium text-right text-gray-200">{build.components?.cpu?.name||"N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">GPU:</span>
                      <span className="font-medium text-right text-gray-200">{build.components?.gpu?.name||"N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">RAM:</span>
                      <span className="font-medium text-right text-gray-200">{build.components?.ram?.name||"N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Storage:</span>
                      <span className="font-medium text-right text-gray-200">{build.components?.storage?.name||"N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">PSU:</span>
                      <span className="font-medium text-right text-gray-200">{build.components?.psu?.name||"N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Power Consumption */}
                <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium text-sm text-gray-300">Power Usage</span>
                  </div>
                  <div className="text-lg font-bold text-cyan-400">
                    {getBuildPower(build)}W
                  </div>

                  <div className="text-xs text-gray-400">
                    Estimated consumption
                  </div>
                </div>
               {/* Vendor Info Button */}
{build.vendor && (
  <Button
    size="sm"
    variant="outline"
    className="mt-3"
    onClick={(e) => {
      e.stopPropagation(); // Prevent triggering onBuildSelect
      setSelectedVendor(build.vendor);
      setIsVendorModalOpen(true);
    }}
  >
    View Vendor Info
  </Button>
)}



              </CardContent>
            </Card>
          </motion.div>
        ))}
        
      </div>

      {/* Load More Button */}
      <AnimatePresence>
        {hasMoreBuilds && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mt-12"
          >
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              size="lg"
              className="neon-button px-8 py-3 text-white hover:text-white transition-all duration-300 transform hover:scale-105 border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading More Builds...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>More Builds</span>
                  <ChevronDown className="w-5 h-5" />
                  <Badge variant="secondary" className="ml-2 bg-cyan-500/20 text-cyan-400 border-cyan-500">
                    {sortedBuilds.length - visibleBuilds} remaining
                  </Badge>
                </div>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Build Summary */}
      {!hasMoreBuilds && sortedBuilds.length > 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-8 p-6 cyber-card rounded-xl"
        >
          <div className="text-lg font-semibold text-gray-100 mb-2">
            🎉 All {sortedBuilds.length} builds loaded!
          </div>
          <div className="text-gray-300">
            Found the perfect PC for your {getCategoryDisplay(category).toLowerCase()} needs? 
            Click on any build to see detailed specs and power consumption.
          </div>
        </motion.div>
      )}

      {/* No Builds Message */}
      {sortedBuilds.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 text-lg">
            No builds available for this configuration.
            <br />
            Please try a different category or intensity level.
          </div>
        </motion.div>
      )}

      {/* Pagination Info */}
      {sortedBuilds.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="text-center mt-8 text-sm text-gray-400"
        >
          Showing {displayedBuilds.length} of {sortedBuilds.length} builds • {getSortLabel()}
        </motion.div>
      )}
      {/* Vendor Modal */}
{isVendorModalOpen && selectedVendor && (
  <VendorInfoModal
  isOpen={isVendorModalOpen} // ✅ Pass this prop
  vendor={selectedVendor!}   // Non-null assertion because we already check selectedVendor
  onClose={() => setIsVendorModalOpen(false)}
/>
)}
<footer className="mt-12 pt-6 border-t border-slate-800/50 text-center">
        <p className="text-xs text-gray-500">
          © Compfy - All Rights Reserved - Developed by Zawar Ahmed @ PureLogics
          <span className="block sm:inline sm:ml-1">(Contact: zawarlt500@gmail.com - 03277894326)</span>
        </p>
      </footer>

    </div>
  );
}
