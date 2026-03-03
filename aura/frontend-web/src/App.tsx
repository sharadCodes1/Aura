import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './features/chat/ChatInterface';
import { LoginPage } from './features/auth/LoginPage';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import { AuthGuard } from './components/auth/AuthGuard';
import { KnowledgeBase } from './features/knowledge/KnowledgeBase';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ToastContainer';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const activeView = useUIStore((state) => state.activeView);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AuthGuard onUnauthorized={() => { }}>
      <div className="flex h-screen w-screen bg-[#0f172a] text-white overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Background Decorative Blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />

          {activeView === 'chat' && <ChatInterface />}
          {activeView === 'knowledge' && <KnowledgeBase />}
          {activeView !== 'chat' && activeView !== 'knowledge' && (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 text-gray-500">
              <Sparkles size={48} className="opacity-20" />
              <p className="font-medium uppercase tracking-[0.3em] text-xs">Module under construction</p>
            </div>
          )}
        </main>
      </div>
      <ToastContainer />
    </AuthGuard>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
