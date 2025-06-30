interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    families: string[];
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
  eval_count?: number;
}

class OllamaService {
  private baseUrl: string;
  private abortController: AbortController | null = null;

  constructor() {
    this.baseUrl = (import.meta as any).env.VITE_OLLAMA_URL || 'http://localhost:11434';
  }

  async listModels(): Promise<OllamaModel[]> {
    const response = await fetch(`${this.baseUrl}/api/tags`);
    const data = await response.json();
    return data.models || [];
  }

  async pullModel(modelName: string, onProgress?: (progress: number) => void): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName, stream: true }),
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let totalSize = 0;
    let downloadedSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.total) totalSize = data.total;
          if (data.completed) downloadedSize = data.completed;
          
          if (onProgress && totalSize > 0) {
            onProgress(downloadedSize / totalSize);
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
    }
  }

  async generate(
    model: string,
    prompt: string,
    options?: {
      temperature?: number;
      top_k?: number;
      top_p?: number;
      num_predict?: number;
      stop?: string[];
      format?: 'json';
      system?: string;
      template?: string;
      context?: number[];
      stream?: boolean;
      images?: string[];
    },
    onToken?: (token: string) => void
  ): Promise<OllamaResponse> {
    this.abortController = new AbortController();

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: this.abortController.signal,
      body: JSON.stringify({
        model,
        prompt,
        ...options,
        stream: options?.stream ?? true,
      }),
    });

    if (!options?.stream) {
      return response.json();
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let fullResponse = '';
    let lastResponse: OllamaResponse | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data: OllamaResponse = JSON.parse(line);
          if (data.response && onToken) {
            onToken(data.response);
            fullResponse += data.response;
          }
          lastResponse = data;
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
    }

    if (!lastResponse) throw new Error('No response received');

    return {
      ...lastResponse,
      response: fullResponse,
    };
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

  cancelGeneration(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export const ollamaService = new OllamaService(); 