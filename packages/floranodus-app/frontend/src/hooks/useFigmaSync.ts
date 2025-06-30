import { useEffect, useState, useCallback } from 'react';
import { figmaService } from '@/services/figmaService';
import { useCanvasStore } from '@/stores/canvasStore';

export const useFigmaSync = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { addNode, updateNode } = useCanvasStore();

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await figmaService.connectToFigmaMCP();
      setIsConnected(connected);
      
      if (connected) {
        console.log('✅ Figma MCP Bridge connected - ready for bidirectional sync');
      }
    };

    checkConnection();
    
    // Poll connection status every 5 seconds
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const syncFromFigma = useCallback(async (fileKey: string, nodeId?: string) => {
    if (!isConnected) {
      console.error('Figma MCP not connected');
      return;
    }

    setIsSyncing(true);
    try {
      const figmaData = await figmaService.syncFromFigma(fileKey, nodeId);
      
      // Convert Figma nodes to canvas nodes
      if (figmaData.nodes) {
        figmaData.nodes.forEach((figmaNode: any, index: number) => {
          const canvasNode = {
            id: `figma-${figmaNode.id}`,
            type: 'design',
            position: {
              x: 100 + (index % 4) * 250,
              y: 100 + Math.floor(index / 4) * 200
            },
            data: {
              label: figmaNode.name,
              description: `Type: ${figmaNode.type}`,
              figmaNodeId: figmaNode.id,
              figmaFileKey: fileKey,
              lastSynced: new Date()
            }
          };
          
          addNode(canvasNode);
        });
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected, addNode]);

  const syncToFigma = useCallback(async (nodeId: string, designData: any) => {
    if (!isConnected) {
      console.error('Figma MCP not connected');
      return;
    }

    setIsSyncing(true);
    try {
      const result = await figmaService.createDesignNode(designData);
      
      // Update the canvas node with Figma reference
      updateNode(nodeId, {
        data: {
          figmaNodeId: result.nodeId,
          figmaFileKey: result.fileKey,
          lastSynced: new Date()
        }
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected, updateNode]);

  return {
    isConnected,
    isSyncing,
    syncFromFigma,
    syncToFigma
  };
}; 