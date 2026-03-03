import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, Paperclip, MoreHorizontal, RotateCcw, BrainCircuit, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';
import { VoiceAssistant } from '../voice/VoiceAssistant';
import { TaskCard } from '../tasks/TaskCard';
import { AgentTrace } from './AgentTrace';
import { useChat } from '../../hooks/useChat';

export const ChatInterface = () => {
    const messages = useChatStore((state) => state.messages);
    const isStreaming = useChatStore((state) => state.isStreaming);
    const clearHistory = useChatStore((state) => state.clearHistory);

    const { sendMessage, confirmExecution, cancelGeneration, isLoading } = useChat();
    const [input, setInput] = useState('');
    const [showVoice, setShowVoice] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isStreaming, scrollToBottom]);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;
        const text = input.trim();
        setInput('');
        await sendMessage(text);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0f172a] relative overflow-hidden">
            <AnimatePresence>
                {showVoice && (
                    <VoiceAssistant onClose={() => setShowVoice(false)} />
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-white/80">AURA-v1 • GPT-4o</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                    <BrainCircuit size={18} className="hover:text-indigo-400 cursor-pointer transition-colors" />
                    <RotateCcw size={18} className="hover:text-white cursor-pointer transition-colors" onClick={() => clearHistory()} />
                    <MoreHorizontal size={18} className="hover:text-white cursor-pointer transition-colors" />
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-lg ${msg.role === 'user'
                                    ? 'bg-aura-gradient text-white rounded-tr-none'
                                    : 'bg-white/10 text-white/90 glass border border-white/5 rounded-tl-none'
                                    }`}
                            >
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                    {msg.role === 'assistant' && msg.content === '' && (
                                        <div className="flex gap-1 py-1">
                                            <div className="w-1.5 h-1.5 bg-indigo-400/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="w-1.5 h-1.5 bg-indigo-400/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-1.5 h-1.5 bg-indigo-400/50 rounded-full animate-bounce" />
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'assistant' && msg.agentTrace && msg.agentTrace.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <AgentTrace steps={msg.agentTrace} />
                                    </div>
                                )}

                                <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>

                        {/* Execution Trace / Task Card (Phase 4 & 8) */}
                        {msg.role === 'assistant' && (msg.requiresConfirmation || msg.executionPlan) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-[500px]"
                            >
                                <TaskCard
                                    title="AURA Automation"
                                    details="Review the execution plan"
                                    status={msg.status || 'pending'}
                                    executionPlan={msg.executionPlan}
                                    onConfirm={() => confirmExecution(msg.id)}
                                    onCancel={() => { }} // Handle if needed
                                />
                            </motion.div>
                        )}
                    </div>
                ))}

                {isLoading && !isStreaming && (
                    <div className="flex justify-start">
                        <div className="glass px-5 py-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-2 items-center">
                            <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <span className="text-xs text-indigo-400 font-medium tracking-wide uppercase">AURA is thinking...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 pt-0">
                <div className="relative glass-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-2">
                    <div className="flex items-end gap-2 px-2 py-1">
                        <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <Paperclip size={20} />
                        </button>
                        <textarea
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask AURA anything..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-white/90 placeholder-gray-500 py-2.5 resize-none max-h-48 scrollbar-hide"
                        />
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setShowVoice(true)}
                                className="p-2.5 text-gray-400 hover:text-aura-gradient hover:bg-white/5 rounded-xl transition-all group"
                            >
                                <Mic size={20} className="group-hover:scale-110 transition-transform" />
                            </button>

                            {isStreaming ? (
                                <button
                                    onClick={cancelGeneration}
                                    className="p-2.5 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all shadow-lg shadow-red-500/10"
                                >
                                    <StopCircle size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className={`p-2.5 rounded-xl transition-all ${input.trim() && !isLoading
                                        ? 'bg-aura-gradient text-white shadow-lg shadow-indigo-500/40'
                                        : 'text-gray-600 bg-white/5'
                                        }`}
                                >
                                    <Send size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-center text-gray-500 mt-3 uppercase tracking-widest font-bold">
                    AURA v1.0.2 • Powered by LangGraph & GPT-4o
                </p>
            </div>
        </div>
    );
};
