import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { Sparkles, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import type { AuthResponse } from '@aura/shared-types';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await api.post<AuthResponse>('/api/auth/login/', {
                email,
                password,
            });

            // The backend returns { access, refresh, user }
            // and we also receive the refresh token via HttpOnly cookie if configured.
            // We pass user and access to the store.
            setAuth(data.user, data.access);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-6 font-sans">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-aura-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
                        <Sparkles size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Welcome to AURA</h1>
                    <p className="text-gray-400 font-medium tracking-wide">Enter your credentials to access the platform</p>
                </div>

                <div className="glass-dark p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-shake">
                                <AlertCircle size={18} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-aura-gradient text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Sign In to AURA"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 mt-8 text-xs font-bold uppercase tracking-widest">
                    AURA v1.0.2 • Secure Cloud Environment
                </p>
            </div>
        </div>
    );
};
