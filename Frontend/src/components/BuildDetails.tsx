import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Calendar,
  TrendingUp,
  Cpu,
  Monitor,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { PCBuild, ElectricitySettings, CategoryType } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BuildDetailsProps {
  build: PCBuild;
  electricitySettings: ElectricitySettings;
  onSaveBuild: (build: PCBuild) => void;
  onBackToBuilds: () => void;
  isSaved: boolean;
  themeCategory?: CategoryType | null;
  onOpenPriceEditor?: () => void;
}

export default function BuildDetails({ 
  build, 
  electricitySettings, 
  onSaveBuild, 
  onBackToBuilds,
  isSaved,
  themeCategory,
  onOpenPriceEditor 
}: BuildDetailsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: electricitySettings.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getMaxPowerConsumption = (build: PCBuild) => {
    // For Dell OptiPlex and other pre-built systems, use PSU maximum wattage
    // For custom builds, use estimated wattage
    if (build.name.includes('Dell OptiPlex') || build.name.includes('OptiPlex')) {
      return build.components.psu.tdp || build.estimatedWattage;
    }
    
    // For other builds, use PSU wattage as maximum possible consumption
    return build.components.psu.tdp || build.estimatedWattage;
  };

  const calculatePowerCost = (hours: number, days: number = 1) => {
    const maxWattage = getMaxPowerConsumption(build);
    const kWh = (maxWattage / 1000) * hours * days;
    return kWh * electricitySettings.pricePerUnit;
  };

  const getCategoryDisplay = (cat: string) => {
    switch (cat) {
      case 'office': return 'Office Work';
      case 'editing': return 'Editing/AI-ML';
      case 'gaming': return 'Gaming';
      default: return cat;
    }
  };

  const getIntensityColor = (intensity: string) => {
    return intensity === 'casual' 
      ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
      : 'bg-orange-900/30 text-orange-400 border border-orange-500/30';
  };

  const getSpecsNeonClasses = (intensity: string) => {
    // Always use cyan/blue for specs cards to match theme
    return 'shadow-[0_0_15px_rgba(6,182,212,0.4),_0_0_30px_rgba(6,182,212,0.2)] border-cyan-500/50';
  };

  const getPowerNeonClasses = () => {
    return 'shadow-[0_0_15px_rgba(59,130,246,0.4),_0_0_30px_rgba(59,130,246,0.2)] border-blue-500/50';
  };

  const getShoppingNeonClasses = () => {
    // Always use cyan/blue for shopping cards regardless of intensity
    return 'shadow-[0_0_15px_rgba(6,182,212,0.4),_0_0_30px_rgba(6,182,212,0.2)] border-cyan-500/50';
  };

  const getUpgradeNeonClasses = () => {
    // Always use blue for upgrade cards regardless of intensity
    return 'shadow-[0_0_15px_rgba(59,130,246,0.4),_0_0_30px_rgba(59,130,246,0.2)] border-blue-500/50';
  };

  const getOptimizedSearchQuery = (build: PCBuild) => {
    let baseQuery = '';
    
    // For Dell OptiPlex builds, use very specific short terms
    if (build.name.includes('Dell OptiPlex')) {
      baseQuery = "i5 6th";
    } else {
      // Extract CPU generation and model for shorter searches
      const cpuName = build.components.cpu.name.toLowerCase();
      
      // For Intel processors
      if (cpuName.includes('i5')) {
        if (cpuName.includes('6400') || cpuName.includes('6500') || cpuName.includes('6600')) {
          baseQuery = "i5 6th";
        } else if (cpuName.includes('7400') || cpuName.includes('7500') || cpuName.includes('7600')) {
          baseQuery = "i5 7th";
        } else if (cpuName.includes('8400') || cpuName.includes('8500') || cpuName.includes('8600')) {
          baseQuery = "i5 8th";
        } else {
          baseQuery = "i5";
        }
      } else if (cpuName.includes('i7')) {
        if (cpuName.includes('7700')) {
          baseQuery = "i7 7th";
        } else if (cpuName.includes('8700')) {
          baseQuery = "i7 8th";
        } else if (cpuName.includes('9900')) {
          baseQuery = "i9 9th";
        } else {
          baseQuery = "i7";
        }
      } else if (cpuName.includes('ryzen 3')) {
        baseQuery = "ryzen 3";
      } else if (cpuName.includes('ryzen 5')) {
        baseQuery = "ryzen 5";
      } else if (cpuName.includes('ryzen 7')) {
        baseQuery = "ryzen 7";
      } else {
        baseQuery = "desktop";
      }

      // Check if build has dedicated GPU and add GPU brand for gaming builds
      const hasIntegratedGPU = build.components.gpu.name.toLowerCase().includes('integrated') || 
                              build.components.gpu.name.toLowerCase().includes('igpu') ||
                              build.components.gpu.name.toLowerCase().includes('uhd') ||
                              build.components.gpu.name.toLowerCase().includes('vega') ||
                              build.components.gpu.name.toLowerCase().includes('hd graphics');

      if (!hasIntegratedGPU && build.category === 'gaming') {
        // For builds with dedicated GPU, add simple GPU terms
        const gpuName = build.components.gpu.name.toLowerCase();
        if (gpuName.includes('gtx 1050')) {
          baseQuery = cpuName.includes('i5') ? "i5 gtx 1050" : "gtx 1050";
        } else if (gpuName.includes('gtx 1060')) {
          baseQuery = cpuName.includes('i5') ? "i5 gtx 1060" : "gtx 1060";
        } else if (gpuName.includes('gtx 1070')) {
          baseQuery = cpuName.includes('i7') ? "i7 gtx 1070" : "gtx 1070";
        } else if (gpuName.includes('gtx 1080')) {
          baseQuery = cpuName.includes('i7') ? "i7 gtx 1080" : "gtx 1080";
        } else if (gpuName.includes('rtx')) {
          baseQuery = "rtx gaming";
        } else {
          baseQuery = "gaming";
        }
      }
    }
    
    // Add "pc" at the end
    return baseQuery + " pc";
  };

  const getBuildImage = (build: PCBuild) => {
    // If build has its own specific image, use that first
    if (build.imageUrl) {
      return build.imageUrl;
    }

    // Fallback to category/intensity-based images
    const { category, intensity, name } = build;
    
    // Special case for Dell OptiPlex build
    if (name && name.includes('Dell OptiPlex')) {
      return "https://images.unsplash.com/photo-1605041197572-1dcedff5655e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEZWxsJTIwT3B0aVBsZXglMjA3MDQwJTIwU0ZGJTIwY29tcHV0ZXIlMjBkZXNrdG9wfGVufDF8fHx8MTc1ODEwODYxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
    }
    
    // HP workstations
    if (name && name.includes('HP Z')) {
      return "https://images.unsplash.com/photo-1649369180117-3d62e1805acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIUCUyMFoyNDAlMjBTRkYlMjB3b3Jrc3RhdGlvbiUyMGNvbXB1dGVyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1ODEwODYyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
    }
    
    // Dell Precision workstations
    if (name && name.includes('Dell Precision')) {
      return "https://images.unsplash.com/photo-1732789953074-383034041056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEZWxsJTIwUHJlY2lzaW9uJTIwMzQzMCUyMHdvcmtzdGF0aW9uJTIwZGVza3RvcHxlbnwxfHx8fDE3NTgxMDg2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
    }
    
    // HP EliteDesk
    if (name && name.includes('HP EliteDesk')) {
      return "https://images.unsplash.com/photo-1716062890647-60feae0609d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIUCUyMEVsaXRlRGVzayUyMDgwMCUyMEczJTIwU0ZGJTIwYnVzaW5lc3MlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTgxMDg2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
    }
    
    // Lenovo ThinkCentre
    if (name && name.includes('Lenovo ThinkCentre')) {
      return "https://images.unsplash.com/photo-1710768625231-a3be8d57c58f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMZW5vdm8lMjBUaGlua0NlbnRyZSUyME03MjBzJTIwU0ZGJTIwZGVza3RvcCUyMFBDfGVufDF8fHx8MTc1ODEwODYyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
    }
    
    // Return appropriate image URL based on build category and intensity
    if (category === 'gaming') {
      return intensity === 'heavy' 
        ? "https://images.unsplash.com/photo-1733945761533-727f49908d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBQQyUyMGJ1aWxkJTIwUkdCJTIwbGlnaHRpbmclMjBjb21wb25lbnRzJTIwdmlzaWJsZXxlbnwxfHx8fDE3NTgxMDg2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        : "https://images.unsplash.com/photo-1660855551550-2696677aaf28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOWlhUJTIwSDUxMCUyMGdhbWluZyUyMFBDJTIwY2FzZSUyMGJ1aWxkfGVufDF8fHx8MTc1ODEwODYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
    } else if (category === 'editing') {
      return intensity === 'heavy'
        ? "https://images.unsplash.com/photo-1591238372358-dbbb7a59f22c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjByYWNrJTIwd29ya3N0YXRpb24lMjBwcm9mZXNzaW9uYWwlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTgxMDg2NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        : "https://images.unsplash.com/photo-1629662370200-8b6a4ffa406f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3RhdGlvbiUyMGNvbXB1dGVyJTIwdG93ZXIlMjBibGFja3xlbnwxfHx8fDE3NTgxMDg2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
    } else {
      return intensity === 'heavy'
        ? "https://images.unsplash.com/photo-1756576630197-875e7632b19c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGRlc2t0b3AlMjBjb21wdXRlciUyMHRvd2VyJTIwb2ZmaWNlfGVufDF8fHx8MTc1ODEwODcwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        : "https://images.unsplash.com/photo-1605041197572-1dcedff5655e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEZWxsJTIwT3B0aVBsZXglMjA3MDQwJTIwU0ZGJTIwY29tcHV0ZXIlMjBkZXNrdG9wfGVufDF8fHx8MTc1ODEwODYxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
    }
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    const buildData = {
      name: build.name,
      totalCost: build.totalCost,
      components: build.components,
      powerUsage: build.estimatedWattage,
      electricityRate: electricitySettings.pricePerUnit,
      currency: electricitySettings.currency
    };
    
    const dataStr = JSON.stringify(buildData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${build.name.replace(/\s+/g, '_')}_build.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={onBackToBuilds}
            className="flex items-center gap-2 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Builds
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant={isSaved ? "default" : "outline"}
              onClick={() => onSaveBuild(build)}
              disabled={isSaved}
              className={`flex items-center gap-2 ${
                isSaved 
                  ? 'bg-green-900/50 text-green-300 border-green-500/50 hover:bg-green-900/60' 
                  : 'neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20'
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaved ? 'Saved' : 'Save Build'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
            >
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            {onOpenPriceEditor && (
              <Button
                variant="outline"
                onClick={onOpenPriceEditor}
                className="flex items-center gap-2 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
              >
                <Monitor className="w-4 h-4" />
                Edit Prices
              </Button>
            )}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-3">
            Build Details
          </h1>
          <div className="flex items-center justify-center gap-4 mb-3">
            <Badge className={getIntensityColor(build.intensity)}>
              {getCategoryDisplay(build.category)} - {build.intensity.charAt(0).toUpperCase() + build.intensity.slice(1)}
            </Badge>
            <Badge variant={build.compatibility === 'optimized' ? 'default' : 'secondary'} 
                   className="bg-slate-800/50 text-gray-300 border border-slate-600/50">
              {build.compatibility === 'optimized' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                  Optimized
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-1 text-yellow-400" />
                  Warning
                </>
              )}
            </Badge>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            {formatCurrency(build.totalCost)}
          </div>
          
          {/* AI Generated PC Build Image - Smaller */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-lg mx-auto mb-6"
          >
            <Card className={`overflow-hidden cyber-card ${getSpecsNeonClasses(build.intensity)}`}>
              <div className="relative">
                <ImageWithFallback
                  src={getBuildImage(build)}
                  alt={`${build.name} - ${getCategoryDisplay(build.category)} setup`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs font-medium opacity-90">
                    Suggested Setup Visualization
                  </div>
                  <div className="text-xs opacity-75">
                    {getCategoryDisplay(build.category)} - {build.intensity.charAt(0).toUpperCase() + build.intensity.slice(1)} Usage
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Detailed Specs - Now in 2 columns and more compact */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className={`cyber-card ${getSpecsNeonClasses(build.intensity)}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Cpu className="w-5 h-5 text-cyan-400" />
                Detailed Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(build.components).map(([component, details]) => (
                  <div key={component} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-200 capitalize">
                        {component === 'cpu' ? 'Processor (CPU)' :
                         component === 'gpu' ? 'Graphics Card (GPU)' :
                         component === 'ram' ? 'Memory (RAM)' :
                         component === 'psu' ? 'Power Supply (PSU)' :
                         component.charAt(0).toUpperCase() + component.slice(1)}
                      </h4>
                      {details.tdp && (
                        <Badge variant="outline" className="text-xs bg-slate-800/50 text-gray-300 border-slate-600/50">
                          {details.tdp}W
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-300">
                      <strong>{details.name}</strong>
                    </div>
                    <div className="text-xs text-gray-400">
                      {details.details}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Power Consumption and Monthly Costs - Side by side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Power Usage Card */}
          <Card className={`cyber-card ${getPowerNeonClasses()}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Zap className="w-4 h-4 text-blue-400" />
                Power Consumption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-300">
                  {getMaxPowerConsumption(build)}W
                </div>
                <div className="text-xs text-gray-300">
                  Maximum Power Consumption
                </div>
                {getMaxPowerConsumption(build) !== build.estimatedWattage && (
                  <div className="text-xs text-gray-400 mt-1">
                    (Est: {build.estimatedWattage}W)
                  </div>
                )}
              </div>
              
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-2 mt-3">
                <div className="text-xs text-blue-300">
                  <strong>Power Calculation:</strong>
                  <br />
                  Monthly cost = (Max Wattage ÷ 1000) × Hours/day × 30 days × Rate per kWh
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Costs */}
          <Card className={`cyber-card ${getPowerNeonClasses()}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Calendar className="w-4 h-4 text-blue-400" />
                Monthly Electricity Cost
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-gray-300 mb-2">
                Rate: {formatCurrency(electricitySettings.pricePerUnit)}/kWh
              </div>
              
              {[1, 4, 8].map((hours) => (
                <div key={hours} className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">{hours}h daily:</span>
                  <span className="font-bold text-sm text-blue-300">
                    {formatCurrency(calculatePowerCost(hours, 30))}
                  </span>
                </div>
              ))}
              
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-2 mt-3">
                <div className="text-xs text-blue-300">
                  <strong>Note:</strong> Costs calculated using LESCO formula based on PSU maximum capacity
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Find Similar Builds and Future Upgrade Options - Side by side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Find Similar Builds */}
          <Card className={`cyber-card ${getShoppingNeonClasses()}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                Find Similar Builds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-cyan-900/10 hover:bg-cyan-900/20"
                  onClick={() => window.open(`https://www.daraz.pk/catalog/?q=${encodeURIComponent(getOptimizedSearchQuery(build))}`, '_blank')}
                >
                  <div className="w-4 h-4 bg-orange-500 rounded text-white flex items-center justify-center text-xs mr-2">
                    D
                  </div>
                  Search on Daraz
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-cyan-900/10 hover:bg-cyan-900/20"
                  onClick={() => window.open(`https://www.olx.com.pk/items/q-${encodeURIComponent(getOptimizedSearchQuery(build).replace(/\s+/g, '-'))}`, '_blank')}
                >
                  <div className="w-4 h-4 bg-blue-600 rounded text-white flex items-center justify-center text-xs mr-2">
                    O
                  </div>
                  Search on OLX
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-cyan-900/10 hover:bg-cyan-900/20"
                  onClick={() => window.open(`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(getOptimizedSearchQuery(build))}`, '_blank')}
                >
                  <div className="w-4 h-4 bg-red-500 rounded text-white flex items-center justify-center text-xs mr-2">
                    A
                  </div>
                  Search on AliExpress
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-400">
                Optimized search terms: "{getOptimizedSearchQuery(build)}"
              </div>
            </CardContent>
          </Card>

          {/* Future Upgrade Suggestions */}
          <Card className={`cyber-card ${getUpgradeNeonClasses()}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Future Upgrade Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {build.upgradesSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-blue-400"></div>
                    <span className="text-xs text-gray-300">{suggestion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}