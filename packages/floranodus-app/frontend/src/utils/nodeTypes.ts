import { Node, Edge } from '@xyflow/react';
import AIProcessingNode from '@/components/nodes/AIProcessingNode';
import DesignNode from '@/components/nodes/DesignNode';
import DataNode from '@/components/nodes/DataNode';
import FlowiseNode from '@/components/nodes/FlowiseNode';
import ComfyUINode from '@/components/nodes/ComfyUINode';
import OllamaNode from '@/components/nodes/OllamaNode';

export const nodeTypes = {
  aiProcessing: AIProcessingNode,
  design: DesignNode,
  data: DataNode,
  flowise: FlowiseNode,
  comfyui: ComfyUINode,
  ollama: OllamaNode,
};

// Node templates for the node menu
export const nodeTemplates = [
  {
    category: 'AI Processing',
    nodes: [
      {
        type: 'ollama',
        label: 'Local LLM',
        description: 'Process with Ollama models',
        defaultData: { model: 'llama3.3' }
      },
      {
        type: 'flowise',
        label: 'AI Workflow',
        description: 'Flowise chain execution',
        defaultData: {}
      },
      {
        type: 'aiProcessing',
        label: 'AI Processor',
        description: 'Generic AI processing',
        defaultData: {}
      }
    ]
  },
  {
    category: 'Creative',
    nodes: [
      {
        type: 'comfyui',
        label: 'Image Generation',
        description: 'Generate images with ComfyUI',
        defaultData: { model: 'sd_xl_base_1.0.safetensors' }
      },
      {
        type: 'design',
        label: 'Figma Design',
        description: 'Sync with Figma',
        defaultData: {}
      }
    ]
  },
  {
    category: 'Data',
    nodes: [
      {
        type: 'data',
        label: 'Data Input',
        description: 'Load and transform data',
        defaultData: { dataType: 'json' }
      }
    ]
  }
];

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'aiProcessing',
    position: { x: 100, y: 100 },
    data: {
      label: 'AI Processor',
      description: 'Process data with local LLMs',
      model: 'llama3.3'
    }
  },
  {
    id: '2',
    type: 'design',
    position: { x: 400, y: 100 },
    data: {
      label: 'Figma Design',
      description: 'Sync with Figma designs'
    }
  },
  {
    id: '3',
    type: 'data',
    position: { x: 250, y: 300 },
    data: {
      label: 'Data Input',
      description: 'Load and transform data',
      dataType: 'json'
    }
  }
];

export const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e3-1', source: '3', target: '1', animated: true },
]; 