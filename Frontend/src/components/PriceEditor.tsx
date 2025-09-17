import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Save, 
  ChevronLeft, 
  ChevronRight,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { PCBuild } from '../types';
import { pcBuilds } from '../data/mockData';
import { bulkUpdateBuilds, fetchBuilds } from '../api';

interface PriceEditorProps {
  onBackToApp: () => void;
  onSaveBuilds: (builds: PCBuild[]) => void;
}

export default function PriceEditor({ onBackToApp, onSaveBuilds }: PriceEditorProps) {
  const [builds, setBuilds] = useState<PCBuild[]>(pcBuilds);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const fromApi = await fetchBuilds();
        if (fromApi.length > 0) setBuilds(fromApi);
      } catch {}
    })();
  }, []);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingCell, setEditingCell] = useState<{row: number, field: 'name' | 'ram' | 'storage' | 'totalCost'} | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  
  const buildsPerPage = 15; // Small font size allows more builds per page
  const totalPages = Math.ceil(builds.length / buildsPerPage);
  const startIndex = currentPage * buildsPerPage;
  const endIndex = Math.min(startIndex + buildsPerPage, builds.length);
  const currentBuilds = builds.slice(startIndex, endIndex);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCellEdit = (buildIndex: number, field: 'name' | 'ram' | 'storage' | 'totalCost') => {
    const actualIndex = startIndex + buildIndex;
    const build = builds[actualIndex];
    
    let currentValue = '';
    switch (field) {
      case 'name':
        currentValue = build.name;
        break;
      case 'ram':
        currentValue = build.components.ram.name;
        break;
      case 'storage':
        currentValue = build.components.storage.name;
        break;
      case 'totalCost':
        currentValue = build.totalCost.toString();
        break;
    }
    
    setEditingCell({ row: buildIndex, field });
    setTempValue(currentValue);
  };

  const handleSaveCell = () => {
    if (!editingCell) return;
    
    const actualIndex = startIndex + editingCell.row;
    const updatedBuilds = [...builds];
    
    switch (editingCell.field) {
      case 'name':
        updatedBuilds[actualIndex].name = tempValue;
        break;
      case 'ram':
        updatedBuilds[actualIndex].components.ram.name = tempValue;
        break;
      case 'storage':
        updatedBuilds[actualIndex].components.storage.name = tempValue;
        break;
      case 'totalCost':
        const newCost = parseFloat(tempValue);
        if (!isNaN(newCost) && newCost > 0) {
          updatedBuilds[actualIndex].totalCost = newCost;
        }
        break;
    }
    
    setBuilds(updatedBuilds);
    setEditingCell(null);
    setTempValue('');
    setHasChanges(true);
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setTempValue('');
  };

  const handleSaveAllBuilds = async () => {
    try {
      setSaving(true);
      await bulkUpdateBuilds(builds);
      onSaveBuilds(builds);
      setHasChanges(false);
      alert('All builds have been updated successfully!');
    } catch (e) {
      alert('Failed to save builds to backend. Make sure the server is running.');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case 'office': return 'Office';
      case 'editing': return 'Editing';
      case 'gaming': return 'Gaming';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'office': return 'bg-cyan-900/30 text-cyan-300 border-cyan-500/50';
      case 'editing': return 'bg-blue-900/30 text-blue-300 border-blue-500/50';
      case 'gaming': return 'bg-green-900/30 text-green-300 border-green-500/50';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-500/50';
    }
  };

  const getIntensityColor = (intensity: string) => {
    return intensity === 'casual' 
      ? 'bg-green-900/30 text-green-300 border-green-500/50' 
      : 'bg-orange-900/30 text-orange-300 border-orange-500/50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 relative overflow-hidden">
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
      
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={onBackToApp}
                className="flex items-center gap-2 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to App
              </Button>
              <h1 className="text-3xl font-bold text-white">PC Builds Price Editor</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {hasChanges && (
                <Badge variant="destructive" className="animate-pulse bg-red-900/50 text-red-300 border-red-500/50">
                  Unsaved Changes
                </Badge>
              )}
              <Button
                onClick={handleSaveAllBuilds}
                disabled={!hasChanges || saving}
                className="flex items-center gap-2 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Builds'}
              </Button>
            </div>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-300">
              Showing builds {startIndex + 1}-{endIndex} of {builds.length} total
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-1 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded text-sm border border-cyan-500/50">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-1 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20 disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Excel-style Table */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <Card className="overflow-hidden cyber-card shadow-[0_0_15px_rgba(6,182,212,0.4),_0_0_30px_rgba(6,182,212,0.2)] border-cyan-500/50">
            <CardHeader className="bg-slate-900/80 border-b border-cyan-500/30">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                Build Configuration Table
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/80 border-b-2 border-cyan-500/30">
                    <tr className="text-xs">
                      <th className="px-3 py-2 text-left font-semibold w-8 text-gray-200">#</th>
                      <th className="px-3 py-2 text-left font-semibold min-w-[200px] text-gray-200">Build Name</th>
                      <th className="px-3 py-2 text-left font-semibold min-w-[150px] text-gray-200">CPU Model</th>
                      <th className="px-3 py-2 text-left font-semibold min-w-[150px] text-gray-200">GPU Model</th>
                      <th className="px-3 py-2 text-left font-semibold min-w-[120px] text-gray-200">RAM</th>
                      <th className="px-3 py-2 text-left font-semibold min-w-[120px] text-gray-200">Storage</th>
                      <th className="px-3 py-2 text-left font-semibold min-w-[100px] text-gray-200">Price (PKR)</th>
                      <th className="px-3 py-2 text-left font-semibold w-20 text-gray-200">Category</th>
                      <th className="px-3 py-2 text-left font-semibold w-16 text-gray-200">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBuilds.map((build, index) => {
                      const actualIndex = startIndex + index;
                      return (
                        <tr 
                          key={build.id} 
                          className={`border-b border-gray-700/50 hover:bg-cyan-900/10 transition-colors ${
                            index % 2 === 0 ? 'bg-slate-900/50' : 'bg-slate-800/50'
                          }`}
                        >
                          {/* Row Number */}
                          <td className="px-3 py-2 text-xs text-gray-400 font-mono">
                            {actualIndex + 1}
                          </td>
                          
                          {/* Build Name - Editable */}
                          <td className="px-3 py-2">
                            {editingCell?.row === index && editingCell?.field === 'name' ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveCell();
                                    if (e.key === 'Escape') handleCancelEdit();
                                  }}
                                  className="text-xs h-7 bg-slate-800 border-cyan-500/50 text-white"
                                  autoFocus
                                />
                                <Button size="sm" variant="ghost" onClick={handleSaveCell} className="h-7 w-7 p-0 hover:bg-green-900/20">
                                  <Check className="w-3 h-3 text-green-400" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-7 w-7 p-0 hover:bg-red-900/20">
                                  <X className="w-3 h-3 text-red-400" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="text-xs cursor-pointer hover:bg-cyan-900/20 p-1 rounded border-2 border-transparent hover:border-cyan-500/50 text-gray-200"
                                onClick={() => handleCellEdit(index, 'name')}
                              >
                                {build.name}
                              </div>
                            )}
                          </td>
                          
                          {/* CPU Model - Read Only */}
                          <td className="px-3 py-2 text-xs text-gray-300">
                            {build.components.cpu.name}
                          </td>
                          
                          {/* GPU Model - Read Only */}
                          <td className="px-3 py-2 text-xs text-gray-300">
                            {build.components.gpu.name}
                          </td>
                          
                          {/* RAM - Editable */}
                          <td className="px-3 py-2">
                            {editingCell?.row === index && editingCell?.field === 'ram' ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveCell();
                                    if (e.key === 'Escape') handleCancelEdit();
                                  }}
                                  className="text-xs h-7 bg-slate-800 border-cyan-500/50 text-white"
                                  autoFocus
                                />
                                <Button size="sm" variant="ghost" onClick={handleSaveCell} className="h-7 w-7 p-0 hover:bg-green-900/20">
                                  <Check className="w-3 h-3 text-green-400" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-7 w-7 p-0 hover:bg-red-900/20">
                                  <X className="w-3 h-3 text-red-400" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="text-xs cursor-pointer hover:bg-cyan-900/20 p-1 rounded border-2 border-transparent hover:border-cyan-500/50 text-gray-200"
                                onClick={() => handleCellEdit(index, 'ram')}
                              >
                                {build.components.ram.name}
                              </div>
                            )}
                          </td>
                          
                          {/* Storage - Editable */}
                          <td className="px-3 py-2">
                            {editingCell?.row === index && editingCell?.field === 'storage' ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveCell();
                                    if (e.key === 'Escape') handleCancelEdit();
                                  }}
                                  className="text-xs h-7 bg-slate-800 border-cyan-500/50 text-white"
                                  autoFocus
                                />
                                <Button size="sm" variant="ghost" onClick={handleSaveCell} className="h-7 w-7 p-0 hover:bg-green-900/20">
                                  <Check className="w-3 h-3 text-green-400" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-7 w-7 p-0 hover:bg-red-900/20">
                                  <X className="w-3 h-3 text-red-400" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="text-xs cursor-pointer hover:bg-cyan-900/20 p-1 rounded border-2 border-transparent hover:border-cyan-500/50 text-gray-200"
                                onClick={() => handleCellEdit(index, 'storage')}
                              >
                                {build.components.storage.name}
                              </div>
                            )}
                          </td>
                          
                          {/* Price - Editable */}
                          <td className="px-3 py-2">
                            {editingCell?.row === index && editingCell?.field === 'totalCost' ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveCell();
                                    if (e.key === 'Escape') handleCancelEdit();
                                  }}
                                  className="text-xs h-7 bg-slate-800 border-cyan-500/50 text-white"
                                  type="number"
                                  autoFocus
                                />
                                <Button size="sm" variant="ghost" onClick={handleSaveCell} className="h-7 w-7 p-0 hover:bg-green-900/20">
                                  <Check className="w-3 h-3 text-green-400" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-7 w-7 p-0 hover:bg-red-900/20">
                                  <X className="w-3 h-3 text-red-400" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="text-xs cursor-pointer hover:bg-cyan-900/20 p-1 rounded border-2 border-transparent hover:border-cyan-500/50 font-mono text-gray-200"
                                onClick={() => handleCellEdit(index, 'totalCost')}
                              >
                                ₨{build.totalCost.toLocaleString()}
                              </div>
                            )}
                          </td>
                          
                          {/* Category */}
                          <td className="px-3 py-2">
                            <Badge variant="outline" className={`${getCategoryColor(build.category)} text-xs`}>
                              {getCategoryDisplay(build.category)}
                            </Badge>
                          </td>
                          
                          {/* Intensity */}
                          <td className="px-3 py-2">
                            <Badge variant="outline" className={`${getIntensityColor(build.intensity)} text-xs`}>
                              {build.intensity.charAt(0).toUpperCase() + build.intensity.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
          >
            <Card className="cyber-card shadow-[0_0_15px_rgba(59,130,246,0.4),_0_0_30px_rgba(59,130,246,0.2)] border-blue-500/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{builds.length}</div>
                <div className="text-xs text-gray-300">Total Builds</div>
              </CardContent>
            </Card>
            <Card className="cyber-card shadow-[0_0_15px_rgba(34,197,94,0.4),_0_0_30px_rgba(34,197,94,0.2)] border-green-500/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  ₨{Math.min(...builds.map(b => b.totalCost)).toLocaleString()}
                </div>
                <div className="text-xs text-gray-300">Lowest Price</div>
              </CardContent>
            </Card>
            <Card className="cyber-card shadow-[0_0_15px_rgba(251,146,60,0.4),_0_0_30px_rgba(251,146,60,0.2)] border-orange-500/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">
                  ₨{Math.max(...builds.map(b => b.totalCost)).toLocaleString()}
                </div>
                <div className="text-xs text-gray-300">Highest Price</div>
              </CardContent>
            </Card>
            <Card className="cyber-card shadow-[0_0_15px_rgba(6,182,212,0.4),_0_0_30px_rgba(6,182,212,0.2)] border-cyan-500/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  ₨{Math.round(builds.reduce((sum, b) => sum + b.totalCost, 0) / builds.length).toLocaleString()}
                </div>
                <div className="text-xs text-gray-300">Average Price</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-6 p-4 bg-cyan-900/20 border border-cyan-500/50 rounded-lg cyber-card"
          >
            <h3 className="font-semibold text-cyan-300 mb-2">How to Edit:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Click on any <strong className="text-cyan-400">Build Name</strong>, <strong className="text-cyan-400">RAM</strong>, <strong className="text-cyan-400">Storage</strong>, or <strong className="text-cyan-400">Price</strong> cell to edit</li>
              <li>• Press <kbd className="bg-slate-700 text-cyan-300 px-1 rounded">Enter</kbd> to save changes or <kbd className="bg-slate-700 text-cyan-300 px-1 rounded">Escape</kbd> to cancel</li>
              <li>• Use the checkmark ✓ and X buttons to save or cancel edits</li>
              <li>• Click <strong className="text-cyan-400">"Save Builds"</strong> to apply all changes across the website</li>
              <li>• Use pagination to navigate through all {builds.length} builds</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}