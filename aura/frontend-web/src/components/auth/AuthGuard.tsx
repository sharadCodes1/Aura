import { type ReactNode, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

interface AuthGuardProps {
    children: ReactNode;
    onUnauthorized: () => void;
}

export const AuthGuard = ({ children, onUnauthorized }: AuthGuardProps) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            onUnauthorized();
        }
    }, [isAuthenticated, onUnauthorized]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
