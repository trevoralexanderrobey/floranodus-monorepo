import { FigmaMCPConnection } from '@/types/figma'

class FigmaService {
  private mcpConnection: FigmaMCPConnection = {
    isConnected: false,
    bridgeUrl: 'http://localhost:3002', // Default MCP bridge URL
  };

  async connectToFigmaMCP() {
    try {
      // Check if the floranodus-figma-write MCP server is running
      const response = await fetch(`${this.mcpConnection.bridgeUrl}/status`);
      if (response.ok) {
        this.mcpConnection.isConnected = true;
        console.log('🎨 Connected to Figma MCP Bridge');
        return true;
      }
    } catch (error) {
      console.error('Failed to connect to Figma MCP:', error);
    }
    return false;
  }

  async createDesignNode(nodeData: any) {
    if (!this.mcpConnection.isConnected) {
      throw new Error('Figma MCP not connected');
    }

    const response = await fetch(`${this.mcpConnection.bridgeUrl}/create-node`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodeData)
    });

    return response.json();
  }

  async syncFromFigma(fileKey: string) {
    // Implementation for syncing from Figma using MCP tools
    console.log('Syncing from Figma file:', fileKey);
  }
}

export const figmaService = new FigmaService(); 