import { io, Socket } from 'socket.io-client';
import { Node, Edge } from '@xyflow/react';

interface CanvasEvent {
  type: 'node-update' | 'edge-update' | 'cursor-move' | 'user-joined' | 'user-left';
  payload: any;
  userId: string;
  timestamp: number;
}

class SocketService {
  private socket: Socket | null = null;
  private canvasId: string | null = null;

  connect(url: string = 'ws://localhost:8000') {
    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  joinCanvas(canvasId: string, userId: string) {
    if (!this.socket) return;

    this.canvasId = canvasId;
    this.socket.emit('join-canvas', { canvasId, userId });
  }

  leaveCanvas() {
    if (!this.socket || !this.canvasId) return;

    this.socket.emit('leave-canvas', { canvasId: this.canvasId });
    this.canvasId = null;
  }

  emitNodeUpdate(node: Node) {
    if (!this.socket || !this.canvasId) return;

    this.socket.emit('node-update', {
      canvasId: this.canvasId,
      nodeId: node.id,
      changes: node,
    });
  }

  emitEdgeUpdate(edge: Edge) {
    if (!this.socket || !this.canvasId) return;

    this.socket.emit('edge-update', {
      canvasId: this.canvasId,
      edgeId: edge.id,
      changes: edge,
    });
  }

  emitCursorMove(position: { x: number; y: number }) {
    if (!this.socket || !this.canvasId) return;

    this.socket.emit('cursor-move', {
      canvasId: this.canvasId,
      position,
    });
  }

  onCanvasEvent(callback: (event: CanvasEvent) => void) {
    if (!this.socket) return;

    this.socket.on('canvas-event', callback);
  }

  offCanvasEvent(callback: (event: CanvasEvent) => void) {
    if (!this.socket) return;

    this.socket.off('canvas-event', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService(); 