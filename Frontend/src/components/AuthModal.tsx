import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType, token: string) => void;
  onSignup: (user: UserType, token: string) => void;
}

const API_BASE = "http://127.0.0.1:8000/api";

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
    try {
      const response = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data?.username?.[0] || data?.error || "Login failed" });
        return;
      }

      const token = data.access;

      const user: UserType = {
        id: data.user?.id || '',
        username: data.user?.username || '',
        email: data.user?.email || '',
        address: data.user?.address || '',
        createdAt: data.user?.created_at || '',
      };

      localStorage.setItem("token", token);
      onLogin(user, token);
      onClose();
    } catch (err) {
      setErrors({ general: "Login failed. Please try again." });
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
    try {
      const response = await fetch(`${API_BASE}/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupForm.username,
          email: signupForm.email,
          password: signupForm.password,
          role: signupForm.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data?.username?.[0] || data?.email?.[0] || data?.error || "Signup failed" });
        return;
      }

      const token = data.access;
      const user: UserType = {
        id: data.user?.id || '',
        username: data.user?.username || '',
        email: data.user?.email || '',
        address: '',
        createdAt: '',
      };

      localStorage.setItem("token", token);
      onSignup(user, token);
      onClose();
    } catch (err) {
      setErrors({ general: "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 rounded-2xl border border-cyan-500/40 shadow-[0_0_20px_cyan] text-gray-300">
        <motion.div className="flex flex-col space-y-4">
          <DialogTitle className="text-white">Authentication</DialogTitle>
          <DialogDescription className="text-gray-400">Login or sign up to access Compfy</DialogDescription>

          {errors.general && <p className="text-red-500">{errors.general}</p>}

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
            <TabsList className="bg-gray-800 rounded-lg border border-cyan-500/30">
              <TabsTrigger value="login" className="text-cyan-400">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-cyan-400">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="flex flex-col space-y-4">
              <Input
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="bg-gray-800 text-gray-300 placeholder-gray-500 border border-cyan-500/30"
              />
              <Input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="bg-gray-800 text-gray-300 placeholder-gray-500 border border-cyan-500/30"
              />
              <Button onClick={handleLogin} disabled={isLoading} className="bg-cyan-900/30 hover:bg-cyan-900/50 text-white">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="flex flex-col space-y-4">
              <Input
                placeholder="Username"
                value={signupForm.username}
                onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                className="bg-gray-800 text-gray-300 placeholder-gray-500 border border-cyan-500/30"
              />
              <Input
                placeholder="Email"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                className="bg-gray-800 text-gray-300 placeholder-gray-500 border border-cyan-500/30"
              />
              <Input
                type="password"
                placeholder="Password"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                className="bg-gray-800 text-gray-300 placeholder-gray-500 border border-cyan-500/30"
              />
              <Button onClick={handleSignup} disabled={isLoading} className="bg-cyan-900/30 hover:bg-cyan-900/50 text-white">
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
