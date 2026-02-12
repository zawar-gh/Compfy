import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User as UserType } from '../types';
import client from '../api/client'; // ✅ Use your centralized client

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType, token: string) => void;
  onSignup: (user: UserType, token: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin, onSignup }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '', role: 'customer' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ----------- LOGIN -----------
  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      setErrors({ general: "Username and password required" });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      // ✅ Use client instead of fetch
      const response = await client.post("/api/auth/login/", {
        username: loginForm.username,
        password: loginForm.password,
      });

      const data = response.data;
      const token = data.access;

      const user: UserType = {
        id: data.user?.id || '',
        username: data.user?.username || '',
        email: data.user?.email || '',
        address: data.user?.address || '',
        createdAt: data.user?.created_at || '',
      };

      // ✅ Use "access_token" to match App.tsx logic
      localStorage.setItem("access_token", token);
      onLogin(user, token);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.error || "Login failed";
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  // ----------- SIGNUP -----------
  const handleSignup = async () => {
    if (!signupForm.username || !signupForm.password || !signupForm.email) {
      setErrors({ general: "All fields required" });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      // ✅ Use client instead of fetch
      const response = await client.post("/api/auth/signup/", {
        username: signupForm.username,
        email: signupForm.email,
        password: signupForm.password,
        role: signupForm.role,
      });

      const data = response.data;
      const token = data.access;
      
      const user: UserType = {
        id: data.user?.id || '',
        username: data.user?.username || '',
        email: data.user?.email || '',
        address: '',
        createdAt: '',
      };

      // ✅ Synchronize key name
      localStorage.setItem("access_token", token);
      onSignup(user, token);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || "Signup failed";
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 rounded-2xl border border-cyan-500/40 shadow-[0_0_20px_cyan] text-gray-300">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="flex flex-col space-y-4"
            >
              <DialogTitle className="text-white text-2xl font-mono">Authentication</DialogTitle>

              {errors.general && (
                <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                  {errors.general}
                </div>
              )}

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
                <TabsList className="bg-gray-800/50 w-full mb-6">
                  <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <Input
                    placeholder="Username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="bg-gray-800/50 border-cyan-500/30 focus:border-cyan-400"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="bg-gray-800/50 border-cyan-500/30 focus:border-cyan-400"
                  />
                  <Button onClick={handleLogin} disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-500">
                    {isLoading ? "Validating..." : "Enter System"}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <Input
                    placeholder="Username"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    className="bg-gray-800/50 border-cyan-500/30"
                  />
                  <Input
                    placeholder="Email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="bg-gray-800/50 border-cyan-500/30"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="bg-gray-800/50 border-cyan-500/30"
                  />
                  <Button onClick={handleSignup} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-500">
                    {isLoading ? "Initializing..." : "Create Account"}
                  </Button>
                </TabsContent>
              </Tabs>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}