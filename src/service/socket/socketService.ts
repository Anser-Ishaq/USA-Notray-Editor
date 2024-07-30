// services/socketService.ts
import { io, Socket } from 'socket.io-client';

import {
  AddNewPageEventData,
  PageSyncEventData,
} from '@/service/shared/Request/socket';

class SocketService {
  private socket: Socket | null = null;

  connect(url: string): void {
    if (!this.socket) {
      this.socket = io(url, {
        transports: ['websocket'],
      });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string): void {
    this.socket?.emit('joinRoom', roomId);
  }

  onAddNewPage(callback: (data: any) => void): void {
    this.socket?.on('ADD_NEW_PAGE', callback);
  }

  onPageSync(callback: (data: any) => void): void {
    this.socket?.on('PAGE_SYNC', callback);
  }

  sendAddNewPage(data: AddNewPageEventData): void {
    this.socket?.emit('ADD_NEW_PAGE', data);
  }

  sendPageSync(data: PageSyncEventData): void {
    this.socket?.emit('PAGE_SYNC', data);
  }
}

const socketService = new SocketService();
export default socketService;
