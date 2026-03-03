import { useState, useCallback, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { api } from '../services/api';
import { wsService } from '../services/websocket';
import { useAuthStore } from '../store/authStore';
import type { Message } from '@aura/shared-types';

export const useChat = () => {
    const { messages, addMessage, updateLastMessage, setStreaming } = useChatStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = useAuthStore((state) => state.accessToken);
    const abortControllerRef = useRef<AbortController | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || !token) return;

        setIsLoading(true);
        setError(null);

        // 1. Add user message to store
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
            conversationId: '', // Will be updated
        };
        addMessage(userMessage);

        try {
            // 2. Start conversation via POST
            abortControllerRef.current = new AbortController();
            const { data } = await api.post('/api/chat/', { content }, {
                signal: abortControllerRef.current.signal
            });

            const conversationId = data.conversation_id;
            setStreaming(true);

            // 3. Add initial empty assistant message
            const assistantMessage: Message = {
                id: 'assistant-' + Date.now(),
                role: 'assistant',
                content: '',
                timestamp: new Date().toISOString(),
                conversationId,
            };
            addMessage(assistantMessage);

            // 4. Connect WebSocket for streaming
            wsService.connect(conversationId, token);

            // 5. Listen for tokens
            const handleToken = (data: any) => {
                if (data.token) {
                    updateLastMessage(data.token);
                }
                if (data.done) {
                    setStreaming(false);
                    wsService.off('token', handleToken);
                    wsService.close();
                }
            };

            wsService.on('token', handleToken);

            wsService.on('trace', (data) => {
                if (data.message_id) {
                    useChatStore.getState().updateAgentTrace(data.message_id, data.step);
                }
            });

            wsService.on('execution_plan', (data) => {
                if (data.message_id) {
                    useChatStore.setState((state) => {
                        const newMessages = state.messages.map(msg =>
                            msg.id === data.message_id ? { ...msg, ...data.plan } : msg
                        );
                        return { messages: newMessages };
                    });
                }
            });

            wsService.on('execution_status', (data) => {
                if (data.message_id) {
                    useChatStore.getState().updateExecutionStatus(data.message_id, data.status);
                }
            });

            wsService.on('execution_step', (data) => {
                if (data.message_id && data.step_id) {
                    useChatStore.getState().updateExecutionStep(data.message_id, data.step_id, data.status);
                }
            });

        } catch (err: any) {
            if (err.name === 'CanceledError') return;
            setError(err.response?.data?.error || 'Failed to send message');
            setStreaming(false);
        } finally {
            setIsLoading(false);
        }
    }, [token, addMessage, updateLastMessage, setStreaming]);

    const confirmExecution = useCallback(async (messageId: string) => {
        try {
            await api.post(`/api/task/execute/`, { message_id: messageId });
            useChatStore.getState().updateExecutionStatus(messageId, 'confirmed');
        } catch (err) {
            console.error('Failed to confirm execution:', err);
        }
    }, []);

    const cancelGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        wsService.close();
        setStreaming(false);
    }, [setStreaming]);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        confirmExecution,
        cancelGeneration
    };
};
