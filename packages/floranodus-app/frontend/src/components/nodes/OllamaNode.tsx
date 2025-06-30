import { NodeProps, Handle, Position } from '@xyflow/react';
import { Bot, Download, StopCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import BaseNode, { BaseNodeData } from './BaseNode';
import { useState, useEffect, useRef } from 'react';
import { ollamaService } from '@/services/ollamaService';

export interface OllamaNodeData extends BaseNodeData {
  model?: string;
  prompt?: string;
  systemPrompt?: string;
  temperature?: number;
  imageInput?: string;
}

interface OllamaNodeProps extends NodeProps {
  data: OllamaNodeData;
}

const OllamaNode = (props: OllamaNodeProps) => {
  const { id, data } = props;
  const [models, setModels] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [response, setResponse] = useState('');
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    // Auto-scroll response
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  const loadModels = async () => {
    try {
      const availableModels = await ollamaService.listModels();
      setModels(availableModels);
    } catch (error) {
      console.error('Failed to load Ollama models:', error);
    }
  };

  const handlePullModel = async () => {
    if (!data.model) return;

    setIsPulling(true);
    setPullProgress(0);

    try {
      await ollamaService.pullModel(data.model, (progress: number) => {
        setPullProgress(progress);
      });
      await loadModels();
    } catch (error) {
      console.error('Failed to pull model:', error);
    }

    setIsPulling(false);
    setPullProgress(0);
  };

  const handleGenerate = async () => {
    if (!data.prompt || !data.model) return;

    setIsGenerating(true);
    setResponse('');

    try {
      const options: any = {
        temperature: data.temperature || 0.7,
        system: data.systemPrompt,
      };

      if (data.imageInput) {
        options.images = [data.imageInput];
      }

      await ollamaService.generate(
        data.model,
        data.prompt,
        options,
        (token: string) => {
          setResponse(prev => prev + token);
        }
      );
    } catch (error) {
      console.error('Generation failed:', error);
      setResponse('Generation failed: ' + error);
    }

    setIsGenerating(false);
  };

  const handleStop = () => {
    ollamaService.cancelGeneration();
    setIsGenerating(false);
  };

  const modelSupportsImages = data.model?.includes('llava') || data.model?.includes('vision');

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        icon: Bot,
        type: 'ai',
        status: isGenerating ? 'processing' : response ? 'success' : 'idle'
      }}
    >
      <div className="space-y-2">
        <div className="flex gap-2">
          <select
            className="flex-1 bg-floranodus-bg-tertiary border border-floranodus-border rounded p-1 text-xs"
            value={data.model || ''}
            onChange={(e) => console.log('Model changed:', e.target.value)}
          >
            <option value="">Select model...</option>
            {models.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
          
          {data.model && !models.find(m => m.name === data.model) && (
            <button
              onClick={handlePullModel}
              disabled={isPulling}
              className="p-1 bg-floranodus-bg-tertiary hover:bg-floranodus-bg-tertiary/80 border border-floranodus-border rounded"
              title="Pull model"
            >
              <Download size={14} />
            </button>
          )}
        </div>

        {isPulling && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-floranodus-text-secondary">Pulling model...</span>
              <span>{Math.round(pullProgress * 100)}%</span>
            </div>
            <div className="w-full bg-floranodus-bg-tertiary rounded-full h-2">
              <div
                className="bg-floranodus-accent-primary rounded-full h-full transition-all"
                style={{ width: `${pullProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        <textarea
          className="w-full bg-floranodus-bg-tertiary border border-floranodus-border rounded p-1 text-xs"
          placeholder="System prompt (optional)..."
          rows={2}
          value={data.systemPrompt || ''}
        />

        <textarea
          className="w-full bg-floranodus-bg-tertiary border border-floranodus-border rounded p-1 text-xs"
          placeholder="Enter prompt..."
          rows={3}
          value={data.prompt || ''}
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-floranodus-text-secondary">Temperature:</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={data.temperature || 0.7}
            className="flex-1"
          />
          <span className="text-xs">{data.temperature || 0.7}</span>
        </div>

        {modelSupportsImages && (
          <div className="flex items-center gap-2 p-2 bg-floranodus-bg-tertiary rounded">
            <ImageIcon size={14} className="text-floranodus-text-secondary" />
            <span className="text-xs text-floranodus-text-secondary">
              Connect image input
            </span>
          </div>
        )}

        {response && (
          <div
            ref={responseRef}
            className="bg-floranodus-bg-tertiary rounded p-2 text-xs max-h-48 overflow-y-auto"
          >
            <pre className="whitespace-pre-wrap text-floranodus-text-primary">
              {response}
            </pre>
          </div>
        )}

        <button
          onClick={isGenerating ? handleStop : handleGenerate}
          disabled={!data.model || !data.prompt || isPulling}
          className="w-full bg-floranodus-accent-primary hover:bg-floranodus-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded p-1 text-xs transition-colors"
        >
          {isGenerating ? (
            <>
              <StopCircle size={14} className="inline mr-1" />
              Stop
            </>
          ) : (
            <>
              <Bot size={14} className="inline mr-1" />
              Generate
            </>
          )}
        </button>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        id="prompt"
        className="!bg-floranodus-accent-primary !w-3 !h-3"
      />
      {modelSupportsImages && (
        <Handle
          type="target"
          position={Position.Left}
          id="image"
          style={{ top: '70%' }}
          className="!bg-floranodus-accent-secondary !w-3 !h-3"
        />
      )}
      <Handle
        type="source"
        position={Position.Right}
        id="response"
        className="!bg-floranodus-accent-secondary !w-3 !h-3"
      />
    </BaseNode>
  );
};

export default OllamaNode; 