import { create } from 'zustand';
import { type Message, type ExecutionStep, type AgentStep } from '@aura/shared-types';

interface ChatState {
    messages: Message[];
    isStreaming: boolean;
    addMessage: (message: Message) => void;
    updateLastMessage: (chunk: string) => void;
    updateExecutionStatus: (messageId: string, status: Message['status']) => void;
    updateExecutionStep: (messageId: string, stepId: string, status: ExecutionStep['status']) => void;
    updateAgentTrace: (messageId: string, step: AgentStep) => void;
    setStreaming: (status: boolean) => void;
    clearHistory: () => void;
}

const INITIAL_MESSAGE: Message = {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm AURA. I can help with tasks, answer questions, or visualize complex agent workflows. What's on your mind?",
    timestamp: new Date().toISOString(),
    conversationId: '',
};

export const useChatStore = create<ChatState>((set) => ({
    messages: [INITIAL_MESSAGE],
    isStreaming: false,

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    updateLastMessage: (chunk) => set((state) => {
        const newMessages = [...state.messages];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content += chunk;
        }
        return { messages: newMessages };
    }),

    updateExecutionStatus: (messageId, status) => set((state) => ({
        messages: state.messages.map(msg =>
            msg.id === messageId ? { ...msg, status } : msg
        )
    })),

    updateExecutionStep: (messageId, stepId, status) => set((state) => ({
        messages: state.messages.map(msg => {
            if (msg.id !== messageId || !msg.executionPlan) return msg;
            return {
                ...msg,
                executionPlan: msg.executionPlan.map(step =>
                    step.id === stepId ? { ...step, status } : step
                )
            };
        })
    })),

    updateAgentTrace: (messageId, step) => set((state) => ({
        messages: state.messages.map(msg => {
            if (msg.id !== messageId) return msg;
            const agentTrace = msg.agentTrace ? [...msg.agentTrace, step] : [step];
            return { ...msg, agentTrace };
        })
    })),

    setStreaming: (status) => set({ isStreaming: status }),

    clearHistory: () => set({
        messages: [{
            ...INITIAL_MESSAGE,
            id: Date.now().toString(),
            content: "Hello! I'm AURA. Session restarted. How can I help?"
        }]
    })
}));
