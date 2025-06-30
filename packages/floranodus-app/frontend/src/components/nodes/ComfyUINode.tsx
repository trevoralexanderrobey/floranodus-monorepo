import { NodeProps, Handle, Position } from '@xyflow/react';
import { Image, Wand2, Download, Loader2, StopCircle } from 'lucide-react';
import BaseNode, { BaseNodeData } from './BaseNode';
import { useState, useEffect } from 'react';
import { comfyuiService } from '@/services/comfyuiService';

export interface ComfyUINodeData extends BaseNodeData {
  workflow?: any;
  model?: string;
  prompt?: string;
  outputImage?: string;
}

interface ComfyUINodeProps extends NodeProps {
  data: ComfyUINodeData;
}

const ComfyUINode = (props: ComfyUINodeProps) => {
  const { id, data } = props;
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [models, setModels] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const availableModels = await comfyuiService.listModels();
      setModels(availableModels);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const handleGenerate = async () => {
    if (!data.prompt || !data.model) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      // Build and queue workflow
      const workflow = comfyuiService.buildText2ImageWorkflow(
        data.prompt,
        data.model || 'sd_xl_base_1.0_0.9vae.safetensors'
      );

      const { prompt_id } = await comfyuiService.queueWorkflow(workflow);

      // Poll for completion
      let completed = false;
      while (!completed) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const history = await comfyuiService.getHistory(prompt_id);
        
        if (history[prompt_id] && history[prompt_id].outputs) {
          const outputs = history[prompt_id].outputs;
          if (outputs['9'] && outputs['9'].images && outputs['9'].images.length > 0) {
            const imageData = outputs['9'].images[0];
            const imageBlob = await comfyuiService.getImage(imageData.filename);
            const url = URL.createObjectURL(imageBlob);
            setImageUrl(url);
            completed = true;
          }
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
    
    setIsGenerating(false);
    setProgress(0);
  };

  const handleStop = () => {
    comfyuiService.cancelGeneration();
    setIsGenerating(false);
  };

  const modelSupportsImages = data.model?.includes('llava') || data.model?.includes('vision');

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        icon: Image,
        type: 'ai',
        status: isGenerating ? 'processing' : imageUrl ? 'success' : 'idle'
      }}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-floranodus-text-secondary">Image Generation</span>
          <Wand2 size={12} className="text-floranodus-accent-primary" />
        </div>

        <select
          className="flex-1 bg-floranodus-bg-tertiary border border-floranodus-border rounded p-1 text-xs"
          value={data.model || ''}
          onChange={(e) => console.log('Model changed:', e.target.value)}
        >
          <option value="">Select model...</option>
          <option value="sd_xl_base_1.0.safetensors">SDXL Base</option>
          <option value="sd_xl_turbo_1.0.safetensors">SDXL Turbo</option>
          <option value="dreamshaper_8.safetensors">DreamShaper v8</option>
        </select>

        <textarea
          className="w-full bg-floranodus-bg-tertiary border border-floranodus-border rounded p-1 text-xs"
          placeholder="Describe the image..."
          rows={2}
          value={data.prompt || ''}
        />

        {modelSupportsImages && (
          <div className="flex items-center gap-2 p-2 bg-floranodus-bg-tertiary rounded">
            <Image size={14} className="text-floranodus-text-secondary" />
            <span className="text-xs text-floranodus-text-secondary">
              Connect image input
            </span>
          </div>
        )}

        {imageUrl && (
          <div className="relative group">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full rounded border border-floranodus-border"
            />
            <button className="absolute top-2 right-2 p-1 bg-floranodus-bg-secondary/80 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <Download size={12} />
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-floranodus-text-secondary">Generating...</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full bg-floranodus-bg-tertiary rounded-full h-2">
              <div
                className="bg-floranodus-accent-primary rounded-full h-full transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={isGenerating ? handleStop : handleGenerate}
          disabled={!data.model || !data.prompt}
          className="w-full bg-floranodus-accent-primary hover:bg-floranodus-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded p-1 text-xs transition-colors"
        >
          {isGenerating ? (
            <>
              <StopCircle size={14} className="inline mr-1" />
              Stop
            </>
          ) : (
            <>
              <Wand2 size={14} className="inline mr-1" />
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
        id="image"
        className="!bg-floranodus-accent-secondary !w-3 !h-3"
      />
    </BaseNode>
  );
};

export default ComfyUINode; 