import {
    Plus,
    MessageSquare,
    CheckSquare,
    BrainCircuit,
    Settings,
    Link as LinkIcon,
    LogOut,
    Sparkles
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

export const Sidebar = () => {
    const activeView = useUIStore((state) => state.activeView);
    const setActiveView = useUIStore((state) => state.setActiveView);

    const menuItems = [
        { icon: <MessageSquare size={20} />, label: 'Chat History', id: 'chat' as const },
        { icon: <CheckSquare size={20} />, label: 'Tasks', id: 'tasks' as const },
        { icon: <BrainCircuit size={20} />, label: 'Memory', id: 'memory' as const },
        { icon: <LinkIcon size={20} />, label: 'Knowledge Base', id: 'knowledge' as const },
    ];

    return (
        <aside className="w-64 h-full glass-dark flex flex-col p-4 z-10 border-r border-white/5">
            <div className="flex items-center gap-3 mb-8 px-2 transition-transform hover:scale-105 cursor-pointer" onClick={() => setActiveView('chat')}>
                <div className="w-8 h-8 rounded-lg bg-aura-gradient flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">AURA</h1>
            </div>

            <button
                onClick={() => setActiveView('chat')}
                className="flex items-center justify-center gap-2 w-full py-3 mb-6 rounded-xl bg-aura-gradient text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
                <Plus size={18} />
                <span>New Chat</span>
            </button>

            <div className="flex-1 space-y-1.5">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${activeView === item.id
                            ? 'bg-indigo-600/20 text-indigo-400 shadow-sm border border-indigo-500/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className={`${activeView === item.id ? 'text-indigo-400' : 'text-gray-500 group-hover:text-white'} transition-colors`}>
                            {item.icon}
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer transition-all group">
                    <Settings size={20} className="group-hover:rotate-45 transition-transform" />
                    <span className="font-medium text-sm">Settings</span>
                </div>
                <div
                    onClick={() => useAuthStore.getState().logout()}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium text-sm">Logout</span>
                </div>
            </div>
        </aside>
    );
};
