import { io, Socket } from 'socket.io-client';

class SocketManager {
  private static instance: SocketManager | null = null;
  private socket: Socket | null = null;
  private userId: string | null = null;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(url: string, userId: string): void {
    if (this.socket && this.userId === userId) {
      console.log('Already connected with the same user ID');
      return;
    }

    if (this.socket) {
      this.disconnect();
    }

    this.userId = userId;
    this.socket = io(url, {
      auth: {
        userId: this.userId
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket is not connected. Call connect() first.');
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn('Socket is not connected. Call connect() first.');
    }
  }

  off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    } else {
      console.warn('Socket is not connected. Call connect() first.');
    }
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.connected;
  }

  getCurrentUserId(): string | null {
    return this.userId;
  }
}

export default SocketManager;