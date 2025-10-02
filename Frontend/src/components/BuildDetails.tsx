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

  // Safely parse numeric TDP values (strings like "650W" or numbers)
  const parseTdp = (val: any): number | undefined => {
    if (val == null) return undefined;
    if (typeof val === 'number') return val;
    const digits = String(val).replace(/[^\d.]/g, '');
    const n = Number(digits);
    return Number.isFinite(n) ? n : undefined;
  };

  // Return reasonable maximum power consumption
  const getMaxPowerConsumption = (b: PCBuild) => {
    const psuTdp = parseTdp((b as any)?.components?.psu?.tdp);
    // prefer PSU tdp, otherwise estimatedWattage, otherwise 0
    return psuTdp || Number(b.estimatedWattage || 0);
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

    if (name.includes('Dell OptiPlex') || name.includes('OptiPlex')) {
      return 'https://images.unsplash.com/photo-1605041197572-1dcedff5655e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEZWxsJTIwT3B0aVBsZXglMjA3MDQwJTIwU0ZGJTIwY29tcHV0ZXIlMjBkZXNrdG9wfGVufDF8fHx8MTc1ODEwODYxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }

    if (name.includes('HP Z')) {
      return 'https://images.unsplash.com/photo-1649369180117-3d62e1805acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIUCUyMFoyNDAlMjBTRkYlMjB3b3Jrc3RhdGlvbiUyMGNvbXB1dGVyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1ODEwODYyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }

    if (name.includes('Dell Precision')) {
      return 'https://images.unsplash.com/photo-1732789953074-383034041056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEZWxsJTIwUHJlY2lzaW9uJTIwMzQzMCUyMHdvcmtzdGF0aW9uJTIwZGVza3RvcHxlbnwxfHx8fDE3NTgxMDg2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }

    if (name.includes('HP EliteDesk')) {
      return 'https://images.unsplash.com/photo-1716062890647-60feae0609d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIUCUyMEVsaXRlRGVzayUyMDgwMCUyMEczJTIwU0ZGJTIwYnVzaW5lc3MlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTgxMDg2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }

    if (name.includes('Lenovo ThinkCentre')) {
      return 'https://images.unsplash.com/photo-1710768625231-a3be8d57c58f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMZW5vdm8lMjBUaGlua0NlbnRyZSUyME03MjBzJTIwU0ZGJTIwZGVza3RvcCUyMFBDfGVufDF8fHx8MTc1ODEwODYyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }

    if (category === 'gaming') {
      return intensity === 'heavy'
        ? 'https://images.unsplash.com/photo-1733945761533-727f49908d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBQQyUyMGJ1aWxkJTIwUkdCJTIwbGlnaHRpbmclMjBjb21wb25lbnRzJTIwdmlzaWJsZXxlbnwxfHx8fDE3NTgxMDg2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        : 'https://images.unsplash.com/photo-1660855551550-2696677aaf28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOWlhUJTIwSDUxMCUyMGdhbWluZyUyMFBDJTIwY2FzZSUyMGJ1aWxkfGVufDF8fHx8MTc1ODEwODYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    } else if (category === 'editing') {
      return intensity === 'heavy'
        ? 'https://images.unsplash.com/photo-1591238372358-dbbb7a59f22c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjByYWNrJTIwd29ya3N0YXRpb24lMjBwcm9mZXNzaW9uYWwlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTgxMDg2NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        : 'https://images.unsplash.com/photo-1629662370200-8b6a4ffa406f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3RhdGlvbiUyMGNvbXB1dGVyJTIwdG93ZXIlMjBibGFja3xlbnwxfHx8fDE3NTgxMDg2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    } else {
      return intensity === 'heavy'
        ? 'https://images.unsplash.com/photo-1756576630197-875e7632b19c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGRlc2t0b3AlMjBjb21wdXRlciUyMHRvd2VyJTIwb2ZmaWNlfGVufDF8fHx8MTc1ODEwODcwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        : 'https://images.unsplash.com/photo-1605041197572-1dcedff5655e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEZWxsJTIwT3B0aVBsZXglMjA3MDQwJTIwU0ZGJTIwY29tcHV0ZXIlMjBkZXNrdG9wfGVufDF8fHx8MTc1ODEwODYxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }
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

Cooling: ${comp?.cooling?.name || 'Unknown Cooling'}
${comp?.cooling?.details || ''}

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
              variant={build.compatibility === 'optimized' ? 'default' : 'secondary'}
              className="bg-slate-800/50 text-gray-300 border border-slate-600/50"
            >
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

          {/* Vendor Information */}
          {build.vendor && (build as any).city && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">Available in {(build as any).city}</span>
            </div>
          )}

          {/* AI Generated PC Build Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-lg mx-auto mb-6"
          >
            <Card className={`overflow-hidden cyber-card ${getSpecsNeonClasses(normalizedIntensity)}`}>
              <div className="relative">
                <ImageWithFallback
                  src={getBuildImage()}
                  alt={`${build.name} - ${getCategoryDisplay(normalizedCategory)} setup`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs font-medium opacity-90">Suggested Setup Visualization</div>
                  <div className="text-xs opacity-75">
                    {getCategoryDisplay(normalizedCategory)} -{' '}
                    {normalizedIntensity.charAt(0).toUpperCase() + normalizedIntensity.slice(1)} Usage
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
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
                {getMaxPowerConsumption(build) !== Number(build.estimatedWattage || 0) && (
                  <div className="text-xs text-gray-400 mt-1">
                    (Est: {build.estimatedWattage || 0}W)
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

        {/* Future Upgrade Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:col-span-4"
        >
          <Card className={`cyber-card ${getUpgradeNeonClasses()}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Future Upgrade Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {build.upgradesSuggestions?.length ? (
                build.upgradesSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-blue-400" />
                    <span className="text-xs text-gray-300">{suggestion}</span>
                  </div>
                ))
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
