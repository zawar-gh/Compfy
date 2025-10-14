// src/components/BuildDetails.tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertTriangle,
  Zap,
  Calendar,
  TrendingUp,
  Cpu,
  MapPin,
  CreditCard,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { PCBuild, ElectricitySettings, CategoryType, User } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import BuyBuildModal from './BuyBuildModal';

interface BuildDetailsProps {
  build: PCBuild;
  electricitySettings: ElectricitySettings;
  onSaveBuild: (build: PCBuild) => void;
  onBackToBuilds: () => void;
  isSaved: boolean;
  themeCategory?: CategoryType | null;
  onOpenPriceEditor?: () => void;
  user?: User | null;
}

export default function BuildDetails({
  build,
  electricitySettings,
  onSaveBuild,
  onBackToBuilds,
  isSaved,
  themeCategory,
  onOpenPriceEditor,
  user,
}: BuildDetailsProps) {
  const [showBuyModal, setShowBuyModal] = useState(false);

  // ---- Normalizations / Guards ----
  // Backend sometimes returns category/intensity as objects {id,name} or as plain strings.
  const normalizedIntensity: string =
    typeof build.intensity === 'string'
      ? build.intensity
      : (build.intensity && (build.intensity as any).id) || 'casual';

  const normalizedCategory: string =
    typeof build.category === 'string'
      ? build.category
      : (build.category && (build.category as any).id) || 'gaming';

  // Ensure electricity currency has a fallback
  const currency = electricitySettings?.currency || 'PKR';

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(typeof amount === 'number' ? amount : Number(amount || 0));
  };

  // Extract numeric wattage from PSU name string, e.g. "Cooler Master 500W 80+ Bronze" => 500
const getPsuWattageFromName = (psu: string): number | undefined => {
  if (!psu) return undefined;

  // Match first number followed by optional space and "W" (case-insensitive)
  const match = psu.match(/(\d+)\s*W/i);
  if (match) {
    const n = Number(match[1]);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

  // Safely parse numeric TDP values (strings like "650W" or numbers)
  const parseTdp = (val: any): number | undefined => {
    if (val == null) return undefined;
    if (typeof val === 'number') return val;
    const digits = String(val).replace(/[^\d.]/g, '');
    const n = Number(digits);
    return Number.isFinite(n) ? n : undefined;
  };

  

  const getMaxPowerConsumption = (b: PCBuild) => {
  const psuWattage = getPsuWattageFromName(b.components?.psu?.name || '');
  const psuTdp = parseTdp(b.components?.psu?.tdp);

  // Priority: PSU name wattage > PSU tdp > estimatedWattage
  return psuWattage || psuTdp || Number(b.estimatedWattage || 0);
};

  const calculatePowerCost = (hours: number, days: number = 1) => {
    const maxWattage = getMaxPowerConsumption(build);
    const kWh = (maxWattage / 1000) * hours * days;
    return kWh * (electricitySettings?.pricePerUnit || 0);
  };

  const getCategoryDisplay = (cat: string) => {
    switch (cat) {
      case 'office':
        return 'Office Work';
      case 'editing':
        return 'Editing/AI-ML';
      case 'gaming':
        return 'Gaming';
      default:
        return cat;
    }
  };

  const getIntensityColor = (intensity: string) => {
    return intensity === 'casual'
      ? 'bg-green-900/30 text-green-400 border border-green-500/30'
      : 'bg-orange-900/30 text-orange-400 border border-orange-500/30';
  };

  const getSpecsNeonClasses = (_intensity: string) => {
    // intensity could be used later for variations; keep signature
    return 'shadow-[0_0_15px_rgba(6,182,212,0.4),_0_0_30px_rgba(6,182,212,0.2)] border-cyan-500/50';
  };

  const getPowerNeonClasses = () => {
    return 'shadow-[0_0_15px_rgba(59,130,246,0.4),_0_0_30px_rgba(59,130,246,0.2)] border-blue-500/50';
  };

  const getUpgradeNeonClasses = () => {
    return 'shadow-[0_0_15px_rgba(59,130,246,0.4),_0_0_30px_rgba(59,130,246,0.2)] border-blue-500/50';
  };

  // Use normalizedCategory & normalizedIntensity for image selection
  const getBuildImage = () => {
    if ((build as any).imageUrl) {
      return (build as any).imageUrl;
    }

    const category = normalizedCategory;
    const intensity = normalizedIntensity;
    const name = build.name || '';
  };

  const handlePrintDetails = () => {
    const categoryLabel = getCategoryDisplay(normalizedCategory);
    const intensityLabel =
      normalizedIntensity.charAt(0).toUpperCase() + normalizedIntensity.slice(1);

    const comp = build.components || {};

    const buildDetails = `
COMPFY PC BUILD DETAILS
=====================

Build Name: ${build.name}
Category: ${categoryLabel} - ${intensityLabel}
Total Cost: ${formatCurrency(build.totalCost)}
Power Consumption: ${build.estimatedWattage || 0}W
${build.vendor ? `Vendor City: ${build.city || 'Unknown'}` : ''}

COMPONENTS:
-----------
Processor (CPU): ${comp?.cpu?.name || 'Unknown CPU'}
${comp?.cpu?.details || ''}

Graphics Card (GPU): ${comp?.gpu?.name || 'Unknown GPU'}
${comp?.gpu?.details || ''}

Memory (RAM): ${comp?.ram?.name || 'Unknown RAM'}
${comp?.ram?.details || ''}

Storage: ${comp?.storage?.name || 'Unknown Storage'}
${comp?.storage?.details || ''}

Motherboard: ${comp?.motherboard?.name || 'Unknown Motherboard'}
${comp?.motherboard?.details || ''}

Power Supply (PSU): ${comp?.psu?.name || 'Unknown PSU'}
${comp?.psu?.details || ''}


POWER & ELECTRICITY:
------------------
Electricity Rate: ${formatCurrency(electricitySettings.pricePerUnit)}/kWh
Monthly Cost (1h daily): ${formatCurrency(calculatePowerCost(1, 30))}
Monthly Cost (4h daily): ${formatCurrency(calculatePowerCost(4, 30))}
Monthly Cost (8h daily): ${formatCurrency(calculatePowerCost(8, 30))}

Generated by Compfy - comfortably build your pc
    `;

    const dataBlob = new Blob([buildDetails], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(build.name || 'build').replace(/\s+/g, '_')}_build_details.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // For rendering component details safely
  const componentsEntries = Object.entries(build.components || {});

  const [hasClickedSave, setHasClickedSave] = useState(false);

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
  variant={isSaved ? 'default' : 'outline'}
  onClick={() => {
    if (!hasClickedSave) {
      setHasClickedSave(true); // disable immediately
      onSaveBuild(build);
    }
  }}
  disabled={isSaved || hasClickedSave}
  className={`flex items-center gap-2 ${
    isSaved || hasClickedSave
      ? 'bg-green-900/50 text-green-300 border-green-500/50 hover:bg-green-900/60'
      : 'neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20'
  }`}
>
  <Save className="w-4 h-4" />
  {isSaved || hasClickedSave ? 'Saved' : 'Save Build'}
</Button>

            <Button
              variant="outline"
              onClick={handlePrintDetails}
              className="flex items-center gap-2 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
            >
              <Printer className="w-4 h-4" />
              Print Details
            </Button>

            {build.vendor && user && (
              <Button
                variant="outline"
                onClick={() => setShowBuyModal(true)}
                className="flex items-center gap-2 neon-button bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-500/50 hover:border-green-400"
              >
                <CreditCard className="w-4 h-4" />
                Buy this Build
              </Button>
            )}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Build Details</h1>

          <div className="flex items-center justify-center gap-4 mb-3">
            <Badge className={getIntensityColor(normalizedIntensity)}>
              {getCategoryDisplay(normalizedCategory)} -{' '}
              {normalizedIntensity.charAt(0).toUpperCase() + normalizedIntensity.slice(1)}
            </Badge>

           <Badge
  variant={build.vendor ? 'secondary' : 'default'}
  className="bg-slate-800/50 text-gray-300 border border-slate-600/50"
>
  {build.vendor ? (
    <>
      <AlertTriangle className="w-4 h-4 mr-1 text-yellow-400" />
      Warning: Not verified
    </>
  ) : (
    <>
      <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
      Optimized
    </>
  )}
</Badge>
          </div>

          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            {formatCurrency(build.totalCost)}
          </div>

          {/* Vendor Information */}
          {build.vendor && (build as any).city && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">Available in {(build as any).city}</span>
            </div>
          )}

          {/* AI Generated PC Build Image */}
        
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Detailed Specs */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className={`cyber-card ${getSpecsNeonClasses(normalizedIntensity)}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Cpu className="w-5 h-5 text-cyan-400" />
                Detailed Specifications
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {componentsEntries.map(([component, details]) => {
                  const d: any = details || {};
                  return (
                    <div key={component} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-200 capitalize">
                          {component === 'cpu'
                            ? 'Processor (CPU)'
                            : component === 'gpu'
                            ? 'Graphics Card (GPU)'
                            : component === 'ram'
                            ? 'Memory (RAM)'
                            : component === 'psu'
                            ? 'Power Supply (PSU)'
                            : component.charAt(0).toUpperCase() + component.slice(1)}
                        </h4>
                        {d?.tdp && (
                          <Badge variant="outline" className="text-xs bg-slate-800/50 text-gray-300 border-slate-600/50">
                            {d.tdp}W
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-300">
                        <strong>{d?.name || 'Unknown'}</strong>
                      </div>
                      <div className="text-xs text-gray-400">{d?.details || ''}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Power Consumption & Monthly Costs */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card className={`cyber-card ${getPowerNeonClasses()}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Zap className="w-4 h-4 text-blue-400" />
                Power Consumption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-300">{getMaxPowerConsumption(build)}W</div>
                <div className="text-xs text-gray-300">Maximum Power Consumption</div>
                {getMaxPowerConsumption(build) !== Number(build.estimatedWattage || 0)}
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

      {/* Search on Marketplaces + Future Upgrade Suggestions side by side */}
{/* Search on Marketplaces + Future Upgrade Suggestions side by side */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.5 }}
  className="lg:col-span-4 grid md:grid-cols-2 gap-6"
>
  {/* Search on Marketplaces */}
  <Card className={`cyber-card ${getPowerNeonClasses()} p-5`}>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-sm font-semibold text-white">
        <MapPin className="w-4 h-4 text-cyan-400" />
        Search on Marketplaces
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-2">
      {build?.components?.cpu?.name ? (
        <>
          <div className="flex flex-col gap-2">
            {/* Daraz */}
            <a
              href={`https://www.daraz.pk/catalog/?q=${encodeURIComponent(build.components.cpu.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border border-orange-500/40 rounded-md hover:bg-slate-800/80 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-600 text-white font-bold text-xs">
                  D
                </div>
                <span className="text-orange-300 text-xs font-medium">Search on Daraz</span>
              </div>
              <ChevronRight className="w-3 h-3 text-orange-300" />
            </a>

            {/* OLX */}
            <a
              href={`https://www.olx.com.pk/items/q-${encodeURIComponent(build.components.cpu.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border border-cyan-500/40 rounded-md hover:bg-slate-800/80 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-600 text-white font-bold text-xs">
                  O
                </div>
                <span className="text-cyan-300 text-xs font-medium">Search on OLX</span>
              </div>
              <ChevronRight className="w-3 h-3 text-cyan-300" />
            </a>

            {/* AliExpress */}
            <a
              href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(build.components.cpu.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border border-red-500/40 rounded-md hover:bg-slate-800/80 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white font-bold text-xs">
                  A
                </div>
                <span className="text-red-300 text-xs font-medium">Search on AliExpress</span>
              </div>
              <ChevronRight className="w-3 h-3 text-red-300" />
            </a>
          </div>

          
        </>
      ) : (
        <div className="text-xs text-gray-500 italic">
          CPU name not available — cannot generate search links.
        </div>
      )}
    </CardContent>
  </Card>

  {/* Future Upgrade Suggestions */}
  <Card className={`cyber-card ${getUpgradeNeonClasses()} p-5`}>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-sm font-semibold text-white">
        <TrendingUp className="w-4 h-4 text-blue-400" />
        Future Upgrade Suggestions
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-2">
      {build.upgradesSuggestions?.length ? (
        <div className="space-y-1.5">
          {build.upgradesSuggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0 bg-blue-400" />
              <span className="text-xs text-gray-300">{suggestion}</span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-xs text-gray-500 italic">No upgrade suggestions available</span>
      )}
    </CardContent>
  </Card>
</motion.div>
</div>

      {/* Buy Build Modal */}
      {build.vendor && user && (
        <BuyBuildModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} build={build} user={user} />
      )}
    </div>
  );
}
