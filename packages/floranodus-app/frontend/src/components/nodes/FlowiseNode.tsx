import { NodeProps, Handle, Position } from '@xyflow/react';
import { Workflow, Play, Settings, Loader2 } from 'lucide-react';
import BaseNode, { BaseNodeData } from './BaseNode';
import { useState, useEffect } from 'react';
import { flowiseService } from '@/services/flowiseService';

export interface FlowiseNodeData extends BaseNodeData {
  chainId?: string;
  chainName?: string;
  deployed?: boolean;
  endpoint?: string;
}

interface FlowiseNodeProps extends NodeProps {
  data: FlowiseNodeData;
}

const FlowiseNode = (props: FlowiseNodeProps) => {
  const { id, data } = props;
  const [isExecuting, setIsExecuting] = useState(false);
  const [chains, setChains] = useState<any[]>([]);
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    loadChains();
  }, []);

  const loadChains = async () => {
    try {
      const availableChains = await flowiseService.getChains();
      setChains(availableChains);
    } catch (error) {
      console.error('Failed to load Flowise chains:', error);
    }
  };

  const handleExecute = async () => {
    if (!data.chainId) return;

    setIsExecuting(true);
    try {
      const result = await flowiseService.executeChain(data.chainId, 'Test input');
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Execution failed:', error);
      setOutput('Execution failed');
    }
    setIsExecuting(false);
  };

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        icon: Workflow,
        type: 'ai',
        status: isExecuting ? 'processing' : data.deployed ? 'success' : 'idle'
      }}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-floranodus-text-secondary">Flowise Chain</span>
          <button className="p-1 hover:bg-floranodus-bg-tertiary rounded">
            <Settings size={12} />
          </button>
        </div>

        <select
          className="w-full bg-floranodus-bg-tertiary border border-floranodus-border rounded p-1 text-xs"
          value={data.chainId || ''}
          onChange={(e) => console.log('Chain selected:', e.target.value)}
        >
          <option value="">Select chain...</option>
          {chains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>

        {data.chainId && (
          <>
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="w-full bg-floranodus-accent-primary hover:bg-floranodus-accent-primary/80 rounded p-1 text-xs transition-colors flex items-center justify-center gap-1"
            >
              {isExecuting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play size={14} />
                  Execute
                </>
              )}
            </button>

            {output && (
              <div className="bg-floranodus-bg-tertiary rounded p-2 text-xs max-h-32 overflow-auto">
                <pre className="whitespace-pre-wrap">{output}</pre>
              </div>
            )}
          </>
        )}
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-floranodus-accent-primary !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-floranodus-accent-secondary !w-3 !h-3"
      />
    </BaseNode>
  );
};

export default FlowiseNode; 