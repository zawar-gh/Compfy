import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ElectricitySettings } from '../types';

interface ElectricityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (settings: ElectricitySettings) => void;
}

const currencies = [
  { value: 'PKR', label: 'Pakistani Rupee (PKR)', symbol: '₨' },
  { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (GBP)', symbol: '£' },
  { value: 'INR', label: 'Indian Rupee (INR)', symbol: '₹' },
];

export default function ElectricityModal({ isOpen, onClose, onSubmit }: ElectricityModalProps) {
  const [pricePerUnit, setPricePerUnit] = useState<string>('25'); // Default LESCO rate
  const [currency, setCurrency] = useState<string>('PKR');
  const [errors, setErrors] = useState<{ pricePerUnit?: string; currency?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: { pricePerUnit?: string; currency?: string } = {};
    
    if (!pricePerUnit || parseFloat(pricePerUnit) <= 0) {
      newErrors.pricePerUnit = 'Please enter a valid price per unit';
    }
    
    if (!currency) {
      newErrors.currency = 'Please select a currency';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      pricePerUnit: parseFloat(pricePerUnit),
      currency
    });
  };

  const selectedCurrency = currencies.find(c => c.value === currency);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md cyber-card border-cyan-500/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-gray-100">
            <Zap className="w-6 h-6 text-yellow-400" />
            Power Consumption Settings
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your electricity rate and currency for accurate power consumption calculations.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 pt-4"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Electricity Price Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-gray-100">Electricity Rate</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit" className="text-sm font-medium text-gray-200">
                  Price per unit (kWh) {selectedCurrency && `(${selectedCurrency.symbol})`}
                </Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  placeholder="Enter electricity rate"
                  className={`bg-slate-800/50 border-cyan-500/30 text-gray-100 ${errors.pricePerUnit ? 'border-red-500' : ''}`}
                />
                {errors.pricePerUnit && (
                  <p className="text-sm text-red-400">{errors.pricePerUnit}</p>
                )}
                <p className="text-xs text-gray-400">
                  Default rate is based on LESCO (Pakistan) pricing. Adjust according to your local rate.
                </p>
              </div>
            </div>

            {/* Currency Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium text-gray-200">
                  Currency
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className={`bg-slate-800/50 border-cyan-500/30 text-gray-100 ${errors.currency ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select your currency" />
                  </SelectTrigger>
                  <SelectContent className="cyber-card border-cyan-500/50">
                    {currencies.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value} className="text-gray-100 hover:bg-cyan-500/20">
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-red-400">{errors.currency}</p>
                )}
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="font-medium text-cyan-400 mb-2">How we calculate costs:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Daily cost = (PC wattage ÷ 1000) × hours used × rate per kWh</li>
                <li>• Monthly cost = Daily cost × 30 days</li>
                <li>• Based on actual component power consumption</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 neon-button text-white hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
              >
                Continue
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}