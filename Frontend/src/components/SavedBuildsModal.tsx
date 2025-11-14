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
  onSelectBuild: (build: PCBuild, fromSaved?: boolean) => void;
  onRemoveSavedBuild: (savedBuildId: string) => void;
}

export default function SavedBuildsModal({
  isOpen,
  onClose,
  savedBuilds,
  onSelectBuild,
  onRemoveSavedBuild,
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
        return 'bg-cyan-900/30 text-cyan-400';
      case 'editing':
        return 'bg-purple-900/30 text-purple-400';
      case 'office':
        return 'bg-blue-900/30 text-blue-400';
      default:
        return 'bg-gray-900/30 text-gray-400';
    }
  };

  const handleBuildClick = (savedBuild: SavedBuild) => {
    if (savedBuild.build) {
      onSelectBuild(savedBuild.build, true);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-slate-900/95 max-h-[80vh] overflow-hidden p-6 rounded-2xl flex flex-col justify-between">
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

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-cyan-400" />
              Saved Builds ({savedBuilds.length})
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-6 h-6 rounded-full text-gray-400 hover:text-cyan-400 hover:bg-slate-800/70 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto pr-1">
            {savedBuilds.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No saved builds yet</p>
                <p className="text-gray-500 text-sm">
                  Save builds from the build details page to see them here
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                        className="cursor-pointer bg-slate-800/70 rounded-md border border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-all"
                        onClick={() => handleBuildClick(savedBuild)}
                      >
                        <CardContent className="p-3">
                          <div className="mb-3">
                            <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                              {savedBuild.build.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                className={getCategoryColor(
                                  typeof savedBuild.build.category === 'string'
                                    ? savedBuild.build.category
                                    : savedBuild.build.category.id
                                )}
                              >
                                {typeof savedBuild.build.category === 'string'
                                  ? savedBuild.build.category
                                  : savedBuild.build.category.name}
                              </Badge>

                              <Badge variant="outline" className="text-xs bg-slate-800/50 text-gray-300">
                                {savedBuild.build.intensity.name}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Cpu className="w-3 h-3" />
                              <span className="truncate">{savedBuild.build.components.cpu.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Cpu className="w-3 h-3" />
                              <span>{savedBuild.build.components.gpu.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Zap className="w-3 h-3" />
                              <span>{savedBuild.build.components.ram.name}</span>
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
  <div className="flex items-center gap-2">
    <span className="text-xs text-white">
      Saved {new Date(savedBuild.savedAt).toLocaleDateString()}
    </span>
    <button
  onClick={(e) => {
    e.stopPropagation(); // prevent card click
    onRemoveSavedBuild(savedBuild.id); // ✅ Call prop from App
  }}
  className="px-2 py-1 text-xs font-semibold text-red-400 bg-slate-800/50 border border-red-400 rounded-md hover:bg-red-400/20 hover:shadow-[0_0_10px_rgba(255,0,0,0.5)] transition-all"
>
  Remove
</button>


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

          {/* Footer */}
          <div className="mt-5 pt-3 border-t border-slate-700/50">
            <Button
              onClick={onClose}
              className="mx-auto block text-xs px-4 py-1 bg-slate-800/70 hover:bg-cyan-600/30 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-md transition-all"
              
            >
              Close
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
