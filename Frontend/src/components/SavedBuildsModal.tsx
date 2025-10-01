import React from 'react';
import { motion } from 'motion/react';
import { X, Heart, Cpu, Zap, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { SavedBuild, PCBuild } from '../types';

interface SavedBuildsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedBuilds: SavedBuild[];
  onSelectBuild: (build: PCBuild) => void;
}

export default function SavedBuildsModal({ 
  isOpen, 
  onClose, 
  savedBuilds, 
  onSelectBuild 
}: SavedBuildsModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gaming':
        return 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30';
      case 'editing':
        return 'bg-purple-900/30 text-purple-400 border-purple-500/30';
      case 'office':
        return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
    }
  };

  const handleBuildClick = (savedBuild: SavedBuild) => {
    if (savedBuild.build) {
      onSelectBuild(savedBuild.build);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl cyber-card border-cyan-500/30 bg-slate-900/95 max-h-[80vh] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >
          <DialogTitle className="sr-only">Saved Builds</DialogTitle>
          <DialogDescription className="sr-only">
            View and manage your saved PC builds
          </DialogDescription>
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-cyan-400" />
              Saved Builds ({savedBuilds.length})
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {savedBuilds.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No saved builds yet</p>
                <p className="text-gray-500 text-sm">
                  Save builds from the build details page to see them here
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedBuilds.map((savedBuild) => {
                  if (!savedBuild.build) return null;
                  
                  return (
                    <motion.div
                      key={savedBuild.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card 
                        className="cyber-card card-hover cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3),_0_0_30px_rgba(6,182,212,0.1)] border-cyan-500/30"
                        onClick={() => handleBuildClick(savedBuild)}
                      >
                        <CardContent className="p-4">
                          <div className="mb-3">
                            <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                              {savedBuild.build.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getCategoryColor(savedBuild.build.category)}>
                                {savedBuild.build.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-slate-800/50 text-gray-300 border-slate-600/50">
                                {savedBuild.build.intensity}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Cpu className="w-3 h-3" />
                              <span className="truncate">{savedBuild.build.components.cpu.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Zap className="w-3 h-3" />
                              <span>{savedBuild.build.estimatedWattage}W</span>
                            </div>
                            {savedBuild.build.city && (
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <MapPin className="w-3 h-3" />
                                <span>{savedBuild.build.city}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-cyan-400">
                              {formatCurrency(savedBuild.build.totalCost)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Saved {new Date(savedBuild.savedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-600/50">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full text-gray-200 hover:text-white border-slate-600/50 hover:border-slate-500"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}