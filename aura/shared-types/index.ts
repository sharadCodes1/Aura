export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
}

export interface AuthResponse {
    user: User;
    access: string;
    refresh: string;
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    url: string;
    size?: number;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    attachments?: Attachment[];
    conversationId: string;
    agentTrace?: AgentStep[];
    executionPlan?: ExecutionStep[];
    requiresConfirmation?: boolean;
    status?: 'pending' | 'confirmed' | 'executing' | 'completed' | 'failed';
}

export interface AgentStep {
    id: string;
    step: string;
    tool?: string;
    status: 'pending' | 'success' | 'failed';
    timestamp: string;
}

export interface ExecutionStep {
    id: string;
    action: string;
    description: string;
    status: 'pending' | 'confirmed' | 'executing' | 'completed' | 'failed';
}

export interface Conversation {
    id: string;
    title: string;
    updatedAt: string;
    preview: string;
}

export interface MemoryEntry {
    id: string;
    content: string;
    source?: string;
    createdAt: string;
}

export interface UploadProgress {
    fileId: string;
    progress: number;
    status: 'uploading' | 'processing' | 'indexed';
}
