import { NodeProps } from '@xyflow/react';
import { Brain, Loader2 } from 'lucide-react';
import BaseNode, { BaseNodeData } from './BaseNode';
import { useState } from 'react';

export interface AINodeData extends BaseNodeData {
  model?: string;
  prompt?: string;
  parameters?: Record<string, any>;
}

interface AIProcessingNodeProps extends NodeProps {
  data: AINodeData;
}

const AIProcessingNode = (props: AIProcessingNodeProps) => {
  const { id, data, selected } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProcess = async () => {
    setIsProcessing(true);
    // TODO: Implement AI processing logic
    console.log('Processing AI node:', id, data);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        icon: Brain,
        type: 'ai',
        status: isProcessing ? 'processing' : data.status
      }}
    >
      <div className="space-y-2">
        <select
          className="w-full bg-floranodus-bg-tertiary border border-floranodus-border rounded p-1 text-xs"
          value={data.model || ''}
          onChange={(e) => console.log('Model changed:', e.target.value)}
        >
          <option value="">Select model...</option>
          <option value="llama3.3">Llama 3.3</option>
          <option value="llava">LLaVA (Vision)</option>
          <option value="qwen2.5-vl">Qwen 2.5 VL</option>
        </select>

        <textarea
          className="w-full bg-floranodus-bg-tertiary border border-floranodus-border rounded p-1 text-xs"
          placeholder="Enter prompt..."
          rows={3}
          value={data.prompt || ''}
        />

        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full bg-floranodus-accent-primary hover:bg-floranodus-accent-primary/80 rounded p-1 text-xs transition-colors"
        >
          {isProcessing ? (
            <>
              <Loader2 size={14} className="animate-spin inline mr-1" />
              Processing...
            </>
          ) : (
            'Process'
          )}
        </button>
      </div>
    </BaseNode>
  );
};

export default AIProcessingNode; 