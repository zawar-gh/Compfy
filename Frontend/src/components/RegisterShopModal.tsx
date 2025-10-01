import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Store, Phone, MapPin, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Vendor } from '../types';

interface RegisterShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (shopData: Omit<Vendor, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
}

interface ShopForm {
  shopName: string;
  phone: string;
  city: string;
  address: string;
}

export default function RegisterShopModal({ isOpen, onClose, onSubmit }: RegisterShopModalProps) {
  const [form, setForm] = useState<ShopForm>({
    shopName: '',
    phone: '',
    city: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!form.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Full address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit({
        shopName: form.shopName.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim()
      });
      
      // Reset form
      setForm({
        shopName: '',
        phone: '',
        city: '',
        address: ''
      });
      
      onClose();
    } catch (error) {
      setErrors({ general: 'Failed to register shop. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md cyber-card border-cyan-500/30 bg-slate-900/95">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogTitle className="sr-only">Register Your Shop</DialogTitle>
          <DialogDescription className="sr-only">
            Register your shop to start selling on Compfy
          </DialogDescription>
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-cyan-400" />
              Register Your Shop
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopName" className="text-gray-300">Shop Name</Label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="shopName"
                  type="text"
                  placeholder="Enter your shop name"
                  value={form.shopName}
                  onChange={(e) => setForm(prev => ({ ...prev, shopName: e.target.value }))}
                  className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
              {errors.shopName && (
                <p className="text-red-400 text-xs">{errors.shopName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-300">City</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  value={form.city}
                  onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                  className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
              {errors.city && (
                <p className="text-red-400 text-xs">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-300">Full Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Textarea
                  id="address"
                  placeholder="Enter your complete shop address"
                  value={form.address}
                  onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                  className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 min-h-20"
                  disabled={isLoading}
                />
              </div>
              {errors.address && (
                <p className="text-red-400 text-xs">{errors.address}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-white border-cyan-500/50"
            >
              {isLoading ? 'Registering...' : 'Register Shop'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}