type MessageCallback = (data: any) => void;

class WebSocketService {
    private socket: WebSocket | null = null;
    private url: string = '';
    private callbacks: Map<string, MessageCallback[]> = new Map();
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;

    connect(conversationId: string, token: string) {
        const baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
        this.url = `${baseUrl}/ws/chat/${conversationId}/?token=${token}`;

        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log('WebSocket Connected');
            this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const type = data.type || 'message';
            this.emit(type, data);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket Closed:', event.reason);
            if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnect();
            }
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };
    }

    private reconnect() {
        this.reconnectAttempts++;
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        // Extract conversation ID from URL if possible
        const conversationIdMatch = this.url.match(/chat\/([^/?]+)/);
        const conversationId = conversationIdMatch ? conversationIdMatch[1] : '';
        setTimeout(() => this.connect(conversationId, ''), 2000 * this.reconnectAttempts);
    }

    on(type: string, callback: MessageCallback) {
        if (!this.callbacks.has(type)) {
            this.callbacks.set(type, []);
        }
        this.callbacks.get(type)?.push(callback);
    }

    off(type: string, callback: MessageCallback) {
        const list = this.callbacks.get(type);
        if (!list) return;
        this.callbacks.set(type, list.filter(cb => cb !== callback));
    }

    private emit(type: string, data: any) {
        this.callbacks.get(type)?.forEach(cb => cb(data));
    }

    send(data: any) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export const wsService = new WebSocketService();
