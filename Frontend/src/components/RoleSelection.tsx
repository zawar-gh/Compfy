import React from 'react';
import { motion } from 'motion/react';
import { Users, Store } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { UserRole } from '../types';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          How can we help you today?
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Customer Role */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="cyber-card card-hover h-full shadow-[0_0_15px_rgba(6,182,212,0.4),_0_0_30px_rgba(6,182,212,0.2)] border-cyan-500/50">
            <CardContent className="p-8 text-center h-full flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Customer</h3>
                  <p className="text-gray-300 mb-6">Build a PC for me</p>
                  <div className="text-sm text-gray-400 space-y-2">
                    <p>• Browse recommended builds</p>
                    <p>• Get personalized PC suggestions</p>
                    <p>• Compare prices and specifications</p>
                    <p>• Save and purchase builds</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onSelectRole('customer')}
                className="w-full neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-white border-cyan-500/50"
                size="lg"
              >
                I'm a Customer
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Retailer Role */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="cyber-card card-hover h-full shadow-[0_0_15px_rgba(147,51,234,0.4),_0_0_30px_rgba(147,51,234,0.2)] border-purple-500/50">
            <CardContent className="p-8 text-center h-full flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Retailer</h3>
                  <p className="text-gray-300 mb-6">Add my builds to Compfy</p>
                  <div className="text-sm text-gray-400 space-y-2">
                    <p>• Register your shop</p>
                    <p>• Upload inventory via Excel</p>
                    <p>• Manage your PC builds</p>
                    <p>• Reach more customers</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onSelectRole('vendor')}
                className="w-full neon-button bg-purple-900/30 hover:bg-purple-900/50 text-white border-purple-500/50"
                size="lg"
              >
                I'm a Retailer
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}