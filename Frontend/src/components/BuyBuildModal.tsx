import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Phone, CreditCard, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { PCBuild, User } from '../types';

interface BuyBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  build: PCBuild;
  user: User;
}

interface PurchaseForm {
  receiverAddress: string;
  receiverPhone: string;
}

export default function BuyBuildModal({ isOpen, onClose, build, user }: BuyBuildModalProps) {
  const [form, setForm] = useState<PurchaseForm>({
    receiverAddress: user.address,
    receiverPhone: user.phone || ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.receiverAddress.trim()) {
      newErrors.receiverAddress = 'Delivery address is required';
    }

    if (!form.receiverPhone.trim()) {
      newErrors.receiverPhone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(form.receiverPhone.replace(/\s/g, ''))) {
      newErrors.receiverPhone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmPurchase = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful purchase
      setShowSuccess(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
      
    } catch (error) {
      setErrors({ general: 'Purchase failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setShowSuccess(false);
      setErrors({});
      onClose();
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md cyber-card border-green-500/30 bg-slate-900/95">
          <DialogTitle className="sr-only">Purchase Successful</DialogTitle>
          <DialogDescription className="sr-only">
            Your order has been placed successfully
          </DialogDescription>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Thanks for purchasing with Compfy!</h2>
            <p className="text-gray-300 text-sm mb-4">
              Your order has been placed successfully. You will receive delivery updates via SMS.
            </p>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md cyber-card border-cyan-500/30 bg-slate-900/95">
        <DialogTitle className="sr-only">Purchase Build</DialogTitle>
        <DialogDescription className="sr-only">
          Complete your purchase for {build.name}
        </DialogDescription>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              Buy this Build
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Build Summary */}
          <div className="mb-6 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
            <h3 className="font-semibold text-cyan-300 mb-2">{build.name}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Total Price:</span>
              <span className="font-bold text-cyan-400">{formatCurrency(build.totalCost)}</span>
            </div>
            {build.vendor && (
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>From: {build.vendor.address}</span>
              </div>
            )}
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Receiver Section */}
            <div>
                <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="receiverAddress" className="text-gray-300">Delivery Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Textarea
                      id="receiverAddress"
                      placeholder="Enter delivery address"
                      value={form.receiverAddress}
                      onChange={(e) => setForm(prev => ({ ...prev, receiverAddress: e.target.value }))}
                      className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 min-h-20"
                      disabled={isProcessing}
                    />
                  </div>
                  {errors.receiverAddress && (
                    <p className="text-red-400 text-xs">{errors.receiverAddress}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiverPhone" className="text-gray-300">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="receiverPhone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={form.receiverPhone}
                      onChange={(e) => setForm(prev => ({ ...prev, receiverPhone: e.target.value }))}
                      className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400"
                      disabled={isProcessing}
                    />
                  </div>
                  {errors.receiverPhone && (
                    <p className="text-red-400 text-xs">{errors.receiverPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-t border-slate-600/50 pt-4">
              <h3 className="font-semibold text-white mb-3">Payment Information</h3>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bank Name:</span>
                    <span className="text-white font-medium">Meezan Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Account Number:</span>
                    <span className="text-white font-mono">BBN-9988776544343</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-blue-500/30 text-xs text-blue-300">
                  <p className="mb-2">
                    <strong>Payment & Delivery Process:</strong>
                  </p>
                  <ul className="space-y-1 text-blue-200">
                    <li>• All payments are processed via Compfy</li>
                    <li>• Delivery begins after payment is confirmed</li>
                    <li>• You will receive delivery info by SMS</li>
                    <li>• For help, contact zawar.ahmed@purelogics.net</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-white border-cyan-500/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              disabled={isProcessing}
              className="flex-1 neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-white border-cyan-500/50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Purchase'
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
