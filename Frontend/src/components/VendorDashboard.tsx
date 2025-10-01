import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store, Upload, List, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Vendor } from '../types';
import RegisterShopModal from './RegisterShopModal';
import InventoryUploadModal from './InventoryUploadModal';
import CheckInventoryPage from './CheckInventoryPage';

interface VendorDashboardProps {
  vendor: Vendor | null;
  onRegisterShop: (shopData: Omit<Vendor, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onBackToSelection: () => void;
}

type DashboardView = 'main' | 'inventory';

export default function VendorDashboard({ vendor, onRegisterShop, onBackToSelection }: VendorDashboardProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentView, setCurrentView] = useState<DashboardView>('main');

  const isShopRegistered = !!vendor;

  const handleFeatureClick = (action: 'upload' | 'inventory') => {
    if (!isShopRegistered) {
      // Show tooltip or alert
      return;
    }

    if (action === 'upload') {
      setShowUploadModal(true);
    } else if (action === 'inventory') {
      setCurrentView('inventory');
    }
  };

  const handleInventoryUploaded = () => {
    setShowUploadModal(false);
    setCurrentView('inventory');
  };

  if (currentView === 'inventory') {
    return (
      <CheckInventoryPage 
        vendor={vendor!}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-white mb-4">
          Hello vendor, this is your virtual store
        </h1>
        
        {isShopRegistered && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-green-900/30 text-green-400 border border-green-500/30">
              <CheckCircle className="w-4 h-4 mr-1" />
              Shop Registered
            </Badge>
            <span className="text-gray-300">•</span>
            <span className="text-cyan-400 font-medium">{vendor.shopName}</span>
            <span className="text-gray-400">in {vendor.city}</span>
          </div>
        )}
        
        <p className="text-gray-300">
          Manage your inventory and reach more customers through Compfy
        </p>
      </motion.div>

      {/* Dashboard Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Register Shop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className={`cyber-card h-full ${
            isShopRegistered 
              ? 'shadow-[0_0_15px_rgba(34,197,94,0.4),_0_0_30px_rgba(34,197,94,0.2)] border-green-500/50' 
              : 'shadow-[0_0_15px_rgba(6,182,212,0.4),_0_0_30px_rgba(6,182,212,0.2)] border-cyan-500/50'
          }`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Store className={`w-5 h-5 ${isShopRegistered ? 'text-green-400' : 'text-cyan-400'}`} />
                Register Your Shop
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                {isShopRegistered 
                  ? 'Your shop is registered and ready to accept inventory.'
                  : 'Register your shop details to start selling on Compfy.'}
              </p>
              
              {isShopRegistered ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shop Name:</span>
                    <span className="text-white">{vendor.shopName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">City:</span>
                    <span className="text-white">{vendor.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{vendor.phone}</span>
                  </div>
                </div>
              ) : (
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Shop name and contact details</li>
                  <li>• Business address and city</li>
                  <li>• Required for inventory upload</li>
                </ul>
              )}
              
              <Button
                onClick={() => setShowRegisterModal(true)}
                disabled={isShopRegistered}
                className={`w-full ${
                  isShopRegistered
                    ? 'bg-green-900/30 text-green-300 border-green-500/50 cursor-not-allowed'
                    : 'neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-white border-cyan-500/50'
                }`}
              >
                {isShopRegistered ? 'Shop Registered' : 'Register Shop'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className={`cyber-card h-full ${
            isShopRegistered 
              ? 'shadow-[0_0_15px_rgba(147,51,234,0.4),_0_0_30px_rgba(147,51,234,0.2)] border-purple-500/50' 
              : 'shadow-[0_0_15px_rgba(75,85,99,0.4),_0_0_30px_rgba(75,85,99,0.2)] border-gray-500/30'
          }`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Upload className={`w-5 h-5 ${isShopRegistered ? 'text-purple-400' : 'text-gray-400'}`} />
                Add Inventory
                {!isShopRegistered && (
                  <AlertCircle className="w-4 h-4 text-yellow-400 ml-auto" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                {isShopRegistered 
                  ? 'Upload your PC builds using our Excel template.'
                  : 'Register your shop first to upload inventory.'}
              </p>
              
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Download Excel template</li>
                <li>• Fill in your PC builds</li>
                <li>• Upload and validate data</li>
                <li>• Instant inventory update</li>
              </ul>
              
              <Button
                onClick={() => handleFeatureClick('upload')}
                disabled={!isShopRegistered}
                className={`w-full ${
                  isShopRegistered
                    ? 'neon-button bg-purple-900/30 hover:bg-purple-900/50 text-white border-purple-500/50'
                    : 'bg-gray-700/30 text-gray-500 border-gray-600/30 cursor-not-allowed'
                }`}
              >
                {isShopRegistered ? 'Manage Inventory' : 'Register Shop First'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Check Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className={`cyber-card h-full ${
            isShopRegistered 
              ? 'shadow-[0_0_15px_rgba(59,130,246,0.4),_0_0_30px_rgba(59,130,246,0.2)] border-blue-500/50' 
              : 'shadow-[0_0_15px_rgba(75,85,99,0.4),_0_0_30px_rgba(75,85,99,0.2)] border-gray-500/30'
          }`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <List className={`w-5 h-5 ${isShopRegistered ? 'text-blue-400' : 'text-gray-400'}`} />
                Check Inventory
                {!isShopRegistered && (
                  <AlertCircle className="w-4 h-4 text-yellow-400 ml-auto" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                {isShopRegistered 
                  ? 'View and edit your current inventory in a spreadsheet-like interface.'
                  : 'Register your shop first to manage inventory.'}
              </p>
              
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• View all your builds</li>
                <li>• Edit prices and details</li>
                <li>• Sort and filter options</li>
                <li>• Bulk delete operations</li>
              </ul>
              
              <Button
                onClick={() => handleFeatureClick('inventory')}
                disabled={!isShopRegistered}
                className={`w-full ${
                  isShopRegistered
                    ? 'neon-button bg-blue-900/30 hover:bg-blue-900/50 text-white border-blue-500/50'
                    : 'bg-gray-700/30 text-gray-500 border-gray-600/30 cursor-not-allowed'
                }`}
              >
                {isShopRegistered ? 'View Inventory' : 'Register Shop First'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Back to Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mt-8"
      >
        <Button
          variant="outline"
          onClick={onBackToSelection}
          className="neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
        >
          Back to Role Selection
        </Button>
      </motion.div>

      {/* Modals */}
      <RegisterShopModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSubmit={onRegisterShop}
      />

      <InventoryUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onInventoryUploaded={handleInventoryUploaded}
        vendor={vendor!}
      />
    </div>
  );
}