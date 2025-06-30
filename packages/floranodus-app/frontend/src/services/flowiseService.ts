// Extend ImportMeta for Vite environment variables
declare global {
  interface ImportMetaEnv {
    VITE_FLOWISE_URL?: string;
    VITE_FLOWISE_API_KEY?: string;
  }
}

interface FlowiseChain {
  id: string;
  name: string;
  flowData: string;
  deployed: boolean;
  apiEndpoint?: string;
}

interface FlowiseNode {
  id: string;
  type: string;
  position?: { x: number; y: number };
  data: {
    label: string;
    name: string;
    category: string;
    inputParams: Record<string, any>;
    outputParams: Record<string, any>;
  };
}

class FlowiseService {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = (import.meta as any).env.VITE_FLOWISE_URL || 'http://localhost:3001';
    this.apiKey = (import.meta as any).env.VITE_FLOWISE_API_KEY;
  }

  async getAvailableNodes(): Promise<FlowiseNode[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/nodes`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createChain(name: string, nodes: FlowiseNode[], edges: any[]): Promise<FlowiseChain> {
    const flowData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        data: node.data,
        position: node.position,
      })),
      edges,
    };

    const response = await fetch(`${this.baseUrl}/api/v1/chains`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name,
        flowData: JSON.stringify(flowData),
      }),
    });

    return response.json();
  }

  async deployChain(chainId: string): Promise<{ success: boolean; endpoint: string }> {
    const response = await fetch(`${this.baseUrl}/api/v1/chains/${chainId}/deploy`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  async executeChain(chainId: string, input: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/prediction/${chainId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ question: input }),
    });

    return response.json();
  }

  async getChains(): Promise<FlowiseChain[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/chains`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }
}

export const flowiseService = new FlowiseService(); 