import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  isConnectedToFigma: boolean;
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: Partial<Node>) => void;
  removeNode: (nodeId: string) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setFigmaConnection: (connected: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isConnectedToFigma: false,
  
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node]
  })),
  
  updateNode: (nodeId, data) => set((state) => ({
    nodes: state.nodes.map(node => 
      node.id === nodeId ? { ...node, ...data } : node
    )
  })),
  
  removeNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter(node => node.id !== nodeId),
    edges: state.edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    )
  })),
  
  setEdges: (edges) => set({ edges }),
  
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  
  setFigmaConnection: (connected) => set({ isConnectedToFigma: connected })
})); 