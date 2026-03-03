import { motion } from 'framer-motion';
import { Target, Search, Database, Code, ShieldCheck, Zap } from 'lucide-react';
import type { AgentStep } from '@aura/shared-types';

interface AgentTraceProps {
    steps: AgentStep[];
}

const getIcon = (tool?: string) => {
    if (!tool) return <Zap size={14} />;
    if (tool.includes('search')) return <Search size={14} />;
    if (tool.includes('knowledge')) return <Database size={14} />;
    if (tool.includes('code')) return <Code size={14} />;
    if (tool.includes('auth')) return <ShieldCheck size={14} />;
    return <Target size={14} />;
};

export const AgentTrace = ({ steps }: AgentTraceProps) => {
    return (
        <div className="mt-4 ml-2 border-l border-white/5 pl-6 space-y-4">
            {steps.map((step, idx) => (
                <motion.div
                    key={step.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative"
                >
                    {/* Timeline Connector Dot */}
                    <div className={`absolute -left-[31px] top-1.5 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)] ${step.status === 'success' ? 'bg-green-500 shadow-green-500/20' :
                            step.status === 'failed' ? 'bg-red-500 shadow-red-500/20' :
                                'bg-indigo-500 animate-pulse'
                        }`} />

                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 rounded bg-white/5 border border-white/5 text-indigo-400">
                            {getIcon(step.tool)}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/80">
                            {step.tool || 'Reasoning'}
                        </span>
                    </div>

                    <p className="text-xs text-white/90 font-medium">{step.step}</p>

                    <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${step.status === 'success' ? 'bg-green-500/10 text-green-500' :
                                step.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                    'bg-indigo-500/10 text-indigo-400'
                            }`}>
                            {step.status}
                        </span>
                        <span className="text-[9px] text-gray-600 font-sans">
                            {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
