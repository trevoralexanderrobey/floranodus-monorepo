import { create } from 'zustand';

interface NodeExecution {
  nodeId: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  progress?: number;
  output?: any;
  error?: string;
}

interface NodeStore {
  executions: Record<string, NodeExecution>;
  updateExecution: (nodeId: string, execution: Partial<NodeExecution>) => void;
  clearExecution: (nodeId: string) => void;
}

export const useNodeStore = create<NodeStore>((set) => ({
  executions: {},
  
  updateExecution: (nodeId, execution) => set((state) => ({
    executions: {
      ...state.executions,
      [nodeId]: {
        ...state.executions[nodeId],
        nodeId,
        status: 'idle',
        ...execution
      }
    }
  })),
  
  clearExecution: (nodeId) => set((state) => {
    const { [nodeId]: _, ...rest } = state.executions;
    return { executions: rest };
  })
})); 