import { Calendar, Clock, Check, Loader2, AlertCircle } from 'lucide-react';
import type { ExecutionStep } from '@aura/shared-types';

interface TaskCardProps {
    title: string;
    details: string;
    status: 'pending' | 'confirmed' | 'executing' | 'completed' | 'failed';
    executionPlan?: ExecutionStep[];
    onConfirm?: () => void;
    onCancel?: () => void;
}

export const TaskCard = ({ title, details, status, executionPlan, onConfirm, onCancel }: TaskCardProps) => {
    return (
        <div className="w-full glass rounded-2xl border border-white/10 overflow-hidden shadow-xl my-4">
            <div className="bg-white/5 px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {status === 'executing' ? (
                        <Loader2 size={16} className="animate-spin text-indigo-400" />
                    ) : status === 'completed' ? (
                        <Check size={16} className="text-green-500" />
                    ) : status === 'failed' ? (
                        <AlertCircle size={16} className="text-red-500" />
                    ) : (
                        <Calendar size={16} className="text-gray-400" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">{title}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            status === 'executing' ? 'bg-indigo-500/20 text-indigo-400' :
                                'bg-white/10 text-gray-400'
                    }`}>
                    {status}
                </span>
            </div>

            <div className="p-5">
                <div className="flex flex-col gap-4 mb-5">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Clock size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-white/90 font-medium">Plan of Action</p>
                            <p className="text-xs text-gray-500 mt-0.5">{details}</p>
                        </div>
                    </div>
                </div>

                {executionPlan && executionPlan.length > 0 && (
                    <div className="space-y-3 mb-6 border-l border-white/5 ml-4 pl-6 py-2">
                        {executionPlan.map((step, idx) => (
                            <div key={step.id || idx} className="relative">
                                <div className={`absolute -left-[31px] top-1.5 w-2 h-2 rounded-full border ${step.status === 'completed' ? 'bg-green-500 border-green-500' :
                                        step.status === 'executing' ? 'bg-indigo-500 border-indigo-500 animate-pulse' :
                                            'bg-transparent border-white/20'
                                    }`} />
                                <p className={`text-xs ${step.status === 'completed' ? 'text-gray-400 line-through' : 'text-white/80'}`}>
                                    {step.action}
                                </p>
                                <p className="text-[10px] text-gray-500">{step.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {status === 'pending' && (
                    <div className="flex gap-3">
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Confirm Execution
                        </button>
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold rounded-xl border border-white/10 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
