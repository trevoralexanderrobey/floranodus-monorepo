export interface ComfyUIWorkflow {
  id: string;
  name: string;
  workflow: any;
  outputs?: string[];
}

export interface ComfyUINode {
  type: string;
  inputs: Record<string, any>;
  outputs: string[];
}

class ComfyUIService {
  private baseUrl: string;
  private wsUrl: string;
  private ws: WebSocket | null = null;
  private abortController: AbortController | null = null;

  constructor() {
    this.baseUrl = (import.meta as any).env.VITE_COMFYUI_URL || 'http://localhost:8188';
    this.wsUrl = (import.meta as any).env.VITE_COMFYUI_WS || 'ws://localhost:8188';
  }

  async getNodeTypes(): Promise<Record<string, any>> {
    const response = await fetch(`${this.baseUrl}/object_info`);
    return response.json();
  }

  async listModels(): Promise<string[]> {
    try {
      const nodeTypes = await this.getNodeTypes();
      const checkpointLoader = nodeTypes['CheckpointLoaderSimple'];
      if (checkpointLoader && checkpointLoader.input && checkpointLoader.input.required) {
        return checkpointLoader.input.required.ckpt_name[0] || [];
      }
      return ['sd_xl_base_1.0.safetensors', 'sd_xl_turbo_1.0.safetensors', 'dreamshaper_8.safetensors'];
    } catch (error) {
      console.error('Failed to load models:', error);
      return ['sd_xl_base_1.0.safetensors', 'sd_xl_turbo_1.0.safetensors', 'dreamshaper_8.safetensors'];
    }
  }

  async queueWorkflow(workflow: any): Promise<{ prompt_id: string }> {
    const response = await fetch(`${this.baseUrl}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow }),
    });

    return response.json();
  }

  async getHistory(promptId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/history/${promptId}`);
    return response.json();
  }

  async getImage(filename: string, subfolder: string = '', type: string = 'output'): Promise<Blob> {
    const params = new URLSearchParams({
      filename,
      subfolder,
      type,
    });

    const response = await fetch(`${this.baseUrl}/view?${params}`);
    return response.blob();
  }

  async embeddings(model: string, prompt: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt }),
    });

    const data = await response.json();
    return data.embedding;
  }

  // Build a simple text-to-image workflow
  buildText2ImageWorkflow(prompt: string, model: string = 'sd_xl_base_1.0.safetensors'): any {
    return {
      "3": {
        "inputs": {
          "seed": Math.floor(Math.random() * 1000000),
          "steps": 20,
          "cfg": 8,
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 1,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler"
      },
      "4": {
        "inputs": {
          "ckpt_name": model
        },
        "class_type": "CheckpointLoaderSimple"
      },
      "5": {
        "inputs": {
          "width": 512,
          "height": 512,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage"
      },
      "6": {
        "inputs": {
          "text": prompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "inputs": {
          "text": "text, watermark",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "8": {
        "inputs": {
          "samples": ["3", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEDecode"
      },
      "9": {
        "inputs": {
          "filename_prefix": "Floranodus",
          "images": ["8", 0]
        },
        "class_type": "SaveImage"
      }
    };
  }

  connectWebSocket(onMessage: (data: any) => void): void {
    this.ws = new WebSocket(`${this.wsUrl}/ws`);

    this.ws.onopen = () => {
      console.log('Connected to ComfyUI WebSocket');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.ws.onerror = (error) => {
      console.error('ComfyUI WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('ComfyUI WebSocket closed');
      this.ws = null;
    };
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  cancelGeneration(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export const comfyuiService = new ComfyUIService(); 