import { useEffect, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { socketService } from '@/services/socketService';
import { useCanvasStore } from '@/stores/canvasStore';
import { useCollaborationStore } from '@/stores/collaborationStore';

export const useWebSocket = (canvasId: string, userId: string) => {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const updateNode = useCanvasStore((state) => state.updateNode);
  const { addUser, removeUser, updateCursor, setConnected } = useCollaborationStore();

  useEffect(() => {
    // Connect to WebSocket server
    socketService.connect();
    socketService.joinCanvas(canvasId, userId);

    // Handle canvas events from other users
    const handleCanvasEvent = (event: any) => {
      switch (event.type) {
        case 'node-update':
          if (event.userId !== userId) {
            updateNode(event.payload.nodeId, event.payload.changes);
          }
          break;
        
        case 'edge-update':
          if (event.userId !== userId) {
            setEdges((edges) =>
              edges.map((edge) =>
                edge.id === event.payload.edgeId
                  ? { ...edge, ...event.payload.changes }
                  : edge
              )
            );
          }
          break;
        
        case 'cursor-move':
          if (event.userId !== userId) {
            updateCursor(event.userId, event.payload.position);
          }
          break;
        
        case 'user-joined':
          console.log(`User ${event.userId} joined the canvas`);
          addUser(event.payload.user);
          break;
        
        case 'user-left':
          console.log(`User ${event.userId} left the canvas`);
          removeUser(event.userId);
          break;
      }
    };

    socketService.onCanvasEvent(handleCanvasEvent);

    return () => {
      socketService.offCanvasEvent(handleCanvasEvent);
      socketService.leaveCanvas();
      socketService.disconnect();
    };
  }, [canvasId, userId, updateNode, setEdges, addUser, removeUser, updateCursor]);

  const broadcastNodeUpdate = useCallback((nodeId: string) => {
    const node = getNodes().find((n) => n.id === nodeId);
    if (node) {
      socketService.emitNodeUpdate(node);
    }
  }, [getNodes]);

  const broadcastEdgeUpdate = useCallback((edgeId: string) => {
    const edge = getEdges().find((e) => e.id === edgeId);
    if (edge) {
      socketService.emitEdgeUpdate(edge);
    }
  }, [getEdges]);

  const broadcastCursorMove = useCallback((position: { x: number; y: number }) => {
    socketService.emitCursorMove(position);
  }, []);

  return {
    broadcastNodeUpdate,
    broadcastEdgeUpdate,
    broadcastCursorMove,
  };
}; 