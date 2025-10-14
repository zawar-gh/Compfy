import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Monitor, Server, Gamepad2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CategoryType, IntensityType } from '../types';
import { categories } from '../data/mockData';

interface RequirementSelectionProps {
  onSelect: (category: CategoryType, intensity: IntensityType) => void;
  selectedCategory?: CategoryType | null;
  onBackToSelection: () => void; 
}

export default function RequirementSelection({ onSelect, selectedCategory: propSelectedCategory, onBackToSelection }: RequirementSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(propSelectedCategory || null);
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityType | null>(null);

  const getIcon = (categoryId: CategoryType) => {
    switch (categoryId) {
      case 'office':
        return <Monitor className="w-16 h-16 mb-4 text-cyan-400" />;
      case 'editing':
        return <Server className="w-16 h-16 mb-4 text-fuchsia-400" />;
      case 'gaming':
        return <Gamepad2 className="w-16 h-16 mb-4 text-green-400" />;
    }
  };

  const handleCategorySelect = (categoryId: CategoryType) => {
    setSelectedCategory(categoryId);
    setSelectedIntensity(null);
    setTimeout(() => {
      const intensitySection = document.getElementById('intensity-selection');
      if (intensitySection) {
        intensitySection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }, 500);
  };

  const handleIntensitySelect = (intensity: IntensityType) => {
    setSelectedIntensity(intensity);
    setTimeout(() => {
      const continueButton = document.getElementById('continue-button-section');
      if (continueButton) {
        continueButton.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }, 400);
  };

  const handleNext = () => {
    if (selectedCategory && selectedIntensity) {
      onSelect(selectedCategory, selectedIntensity);
    }
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-12">
      <div className="w-full max-w-6xl">
        {/* Main Question */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-gray-100 mb-4">
            What do you need your PC for?
          </h2>
          <p className="text-xl text-gray-300">
            Choose your primary use case
          </p>
        </motion.div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer cyber-card card-hover h-full ${
                  selectedCategory === category.id ? 'ring-2 ring-cyan-400 border-cyan-400' : ''
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                  <div className="flex justify-center">{getIcon(category.id)}</div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{category.name}</h3>
                  <p className="text-gray-300 mb-4">{category.subtitle}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Intensity Selection */}
        {selectedCategory && selectedCategoryData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="cyber-card rounded-2xl p-8 mb-8 shadow-[0_0_15px_rgba(6,182,212,0.4),_0_0_30px_rgba(6,182,212,0.2)] border-cyan-500/50"
            id="intensity-selection"
          >
            <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">
              Choose your intensity level
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Casual Usage */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card 
                  className={`cursor-pointer cyber-card card-hover h-full shadow-[0_0_30px_rgba(34,197,94,0.6),_0_0_60px_rgba(34,197,94,0.3)] border-green-500/50 ${
                    selectedIntensity === 'casual' ? 'ring-2 ring-green-400 border-green-400' : ''
                  }`}
                  onClick={() => handleIntensitySelect('casual')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-100">Casual Usage</h4>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">Budget Friendly</Badge>
                    </div>
                    <p className="text-gray-300 mb-4">{selectedCategoryData.casual.description}</p>
                    <ul className="space-y-2">
                      {selectedCategoryData.casual.tasks.map((task, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Heavy Usage */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card 
                  className={`cursor-pointer cyber-card card-hover h-full shadow-[0_0_30px_rgba(251,146,60,0.6),_0_0_60px_rgba(251,146,60,0.3)] border-orange-500/50 ${
                    selectedIntensity === 'heavy' ? 'ring-2 ring-orange-400 border-orange-400' : ''
                  }`}
                  onClick={() => handleIntensitySelect('heavy')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-100">Heavy Usage</h4>
                      <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500">High Performance</Badge>
                    </div>
                    <p className="text-gray-300 mb-4">{selectedCategoryData.heavy.description}</p>
                    <ul className="space-y-2">
                      {selectedCategoryData.heavy.tasks.map((task, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-300">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            

            {/* Next Button */}
            {selectedIntensity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mt-8"
                id="continue-button-section"
              >
                <Button 
                  onClick={handleNext}
                  size="lg"
                  className="neon-button px-8 py-3 text-white hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
                >
                  Continue to Power Settings
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
        {/* Back to Role Selection */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6, delay: 0.5 }}
  className="text-center mt-8"
>
  <Button
  variant="outline"
  onClick={() => {
    const container = document.querySelector('.requirement-container');
    if (container) {
      container.classList.add('fade-out');
      setTimeout(() => {
        setSelectedCategory(null);
        setSelectedIntensity(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
        onBackToSelection();
      }, 500); // matches fade duration
    } else {
      onBackToSelection();
    }
  }}
  className="neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
>
  Back to Role Selection
</Button>

</motion.div>

      </div>
    </div>
  );
}
