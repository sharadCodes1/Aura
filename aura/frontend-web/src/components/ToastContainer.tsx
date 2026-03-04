import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore, type ToastType } from '../store/toastStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

const ToastItem = ({ id, message, type }: { id: string, message: string, type: ToastType }) => {
    const removeToast = useToastStore((state) => state.removeToast);

    useEffect(() => {
        const timer = setTimeout(() => removeToast(id), 5000);
        return () => clearTimeout(timer);
    }, [id, removeToast]);

    const icons = {
        success: <CheckCircle className="text-green-500" size={18} />,
        error: <AlertCircle className="text-red-500" size={18} />,
        info: <Info className="text-indigo-400" size={18} />,
    };

    const borders = {
        success: 'border-green-500/20',
        error: 'border-red-500/20',
        info: 'border-indigo-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className={`glass flex items-center gap-4 p-4 rounded-2xl border ${borders[type]} shadow-2xl min-w-[300px] mb-3`}
        >
            <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                {icons[type]}
            </div>
            <p className="flex-1 text-sm font-medium text-white/90">{message}</p>
            <button
                onClick={() => removeToast(id)}
                className="p-1 text-gray-500 hover:text-white transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export const ToastContainer = () => {
    const toasts = useToastStore((state) => state.toasts);

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} {...toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};
