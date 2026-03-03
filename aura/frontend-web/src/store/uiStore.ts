import { create } from 'zustand';

type View = 'chat' | 'knowledge' | 'tasks' | 'memory' | 'settings';

interface UIState {
    activeView: View;
    setActiveView: (view: View) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    activeView: 'chat',
    setActiveView: (view) => set({ activeView: view }),
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
