#!/usr/bin/env node

import express, { Request, Response } from 'express';
import cors from 'cors';

interface CommandResult {
  commandId: string;
  result: {
    success: boolean;
    data?: any;
    error?: string;
  };
}

interface QueuedCommand {
  id: string;
  type: string;
  tool?: string;
  payload: any;
  timestamp: number;
}

interface TunnelInfo {
  tunnelUrl: string | null;
  hasTunnel: boolean;
  timestamp: number;
}

interface HealthResponse {
  status: string;
  unified: boolean;
  timestamp: number;
  message: string;
  tunnelUrl: string | null;
}

interface StatusResponse {
  server: string;
  status: string;
  mode: string;
  tunnelUrl: string | null;
  timestamp: number;
  uptime: number;
  endpoints: string[];
}

class UnifiedBridgeServer {
  private app: express.Application;
  private readonly PORT = 3000;
  private currentTunnelUrl: string | null = null;
  private commandQueue: QueuedCommand[] = [];
  private resultStore: { [key: string]: any } = {};

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  }

  private setupRoutes(): void {
    // Core endpoints
    this.app.get('/health', this.handleHealth.bind(this));
    this.app.get('/tunnel-info', this.handleTunnelInfo.bind(this));
    this.app.post('/set-tunnel-url', this.handleSetTunnelUrl.bind(this));
    
    // Plugin communication
    this.app.post('/plugin/ping', this.handlePluginPing.bind(this));
    this.app.get('/plugin/commands', this.handlePluginCommands.bind(this));
    this.app.post('/plugin/results', this.handlePluginResults.bind(this));
    
    // MCP Tool endpoints
    this.app.post('/figma-tools', this.handleFigmaTools.bind(this));
    this.app.post('/create-nodes-from-code', this.handleCreateNodesFromCode.bind(this));
    this.app.post('/create-node', this.handleCreateNode.bind(this));
    this.app.post('/design-preview', this.handleDesignPreview.bind(this));
    this.app.post('/establish-code-connections', this.handleCodeConnections.bind(this));
    this.app.post('/generate-ui-kit', this.handleGenerateUIKit.bind(this));
    this.app.post('/smart-organize-layers', this.handleSmartOrganize.bind(this));
    this.app.post('/organize-pages', this.handleOrganizePages.bind(this));
    this.app.post('/optimize-media-assets', this.handleOptimizeMedia.bind(this));
    this.app.post('/extract-design-variables', this.handleExtractVariables.bind(this));
    
    // Status and demo endpoints
    this.app.get('/status', this.handleStatus.bind(this));
    this.app.post('/demo/wireframe', this.handleDemoWireframe.bind(this));
    this.app.post('/demo/ui-kit', this.handleDemoUIKit.bind(this));
  }

  // Core handlers
  private handleHealth(req: Request, res: Response): void {
    const response: HealthResponse = {
      status: 'healthy',
      unified: true,
      timestamp: Date.now(),
      message: '🚀 UNIFIED BRIDGE: TypeScript server operational',
      tunnelUrl: this.currentTunnelUrl
    };
    res.json(response);
  }

  private handleTunnelInfo(req: Request, res: Response): void {
    const response: TunnelInfo = {
      tunnelUrl: this.currentTunnelUrl,
      hasTunnel: !!this.currentTunnelUrl,
      timestamp: Date.now()
    };
    res.json(response);
  }

  private handleSetTunnelUrl(req: Request, res: Response): void {
    const { tunnelUrl } = req.body;
    this.currentTunnelUrl = tunnelUrl;
    console.log(`🌐 TUNNEL URL SET: ${tunnelUrl}`);
    res.json({ success: true, tunnelUrl: this.currentTunnelUrl });
  }

  private handlePluginPing(req: Request, res: Response): void {
    console.log('🔗 Plugin ping received:', req.body);
    res.json({
      success: true,
      message: 'Unified TypeScript bridge connected!',
      timestamp: Date.now(),
      tunnelUrl: this.currentTunnelUrl
    });
  }

  private handlePluginCommands(req: Request, res: Response): void {
    const commands = [...this.commandQueue];
    this.commandQueue = []; // Clear the queue
    res.json({ commands });
    if (commands.length > 0) {
      console.log(`📨 Sending commands to plugin: ${commands.length}`);
    }
  }

  private handlePluginResults(req: Request, res: Response): void {
    console.log('📨 Plugin results received:', req.body);
    const { results } = req.body;
    if (results) {
      results.forEach((result: CommandResult) => {
        this.resultStore[result.commandId] = result.result;
      });
    }
    res.json({ success: true });
  }

  // MCP Tool handlers
  private async handleFigmaTools(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔧 Figma tools request:', req.body);
      const { tool, ...args } = req.body;
      
      const commandId = 'cmd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const command: QueuedCommand = {
        id: commandId,
        type: 'FIGMA_TOOL',
        tool: tool,
        payload: args,
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      
      const result = await this.waitForResult(commandId, 10000);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Figma tools error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private async handleCreateNodesFromCode(req: Request, res: Response): Promise<void> {
    try {
      console.log('🎨 Create nodes from code:', req.body);
      const { fileKey, code, framework = 'react', x = 0, y = 0 } = req.body;
      
      const commandId = 'create_nodes_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const command: QueuedCommand = {
        id: commandId,
        type: 'CREATE_NODES_FROM_CODE',
        payload: { fileKey, code, framework, x, y },
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      
      const result = await this.waitForResult(commandId, 15000);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Create nodes from code error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private async handleCreateNode(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔧 Create node:', req.body);
      const { nodeType = 'rectangle', properties = {} } = req.body;
      
      const commandId = 'node_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const command: QueuedCommand = {
        id: commandId,
        type: 'CREATE_NODE',
        payload: { nodeType, properties },
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      
      const result = await this.waitForResult(commandId, 10000);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Create node error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private async handleDesignPreview(req: Request, res: Response): Promise<void> {
    try {
      const commandId = 'preview_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const command: QueuedCommand = {
        id: commandId,
        type: 'DESIGN_PREVIEW',
        payload: req.body,
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      
      const result = await this.waitForResult(commandId, 10000);
      res.json(result.success ? result.data : { error: result.error });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private async handleCodeConnections(req: Request, res: Response): Promise<void> {
    try {
      const commandId = 'connections_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const command: QueuedCommand = {
        id: commandId,
        type: 'CODE_CONNECTIONS',
        payload: req.body,
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      
      const result = await this.waitForResult(commandId, 15000);
      res.json(result.success ? result.data : { error: result.error });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private async handleGenerateUIKit(req: Request, res: Response): Promise<void> {
    try {
      const commandId = 'uikit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const command: QueuedCommand = {
        id: commandId,
        type: 'GENERATE_UI_KIT',
        payload: req.body,
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      
      const result = await this.waitForResult(commandId, 20000);
      res.json(result.success ? result.data : { error: result.error });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private async handleSmartOrganize(req: Request, res: Response): Promise<void> {
    try {
      const commandId = 'organize_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const command: QueuedCommand = {
        id: commandId,
        type: 'SMART_ORGANIZE',
        payload: req.body,
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      
      const result = await this.waitForResult(commandId, 15000);
      res.json(result.success ? result.data : { error: result.error });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private async handleOrganizePages(req: Request, res: Response): Promise<void> {
    try {
      const commandId = 'pages_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const command: QueuedCommand = {
        id: commandId,
        type: 'ORGANIZE_PAGES',
        payload: req.body,
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      
      const result = await this.waitForResult(commandId, 10000);
      res.json(result.success ? result.data : { error: result.error });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private async handleOptimizeMedia(req: Request, res: Response): Promise<void> {
    try {
      const commandId = 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const command: QueuedCommand = {
        id: commandId,
        type: 'OPTIMIZE_MEDIA',
        payload: req.body,
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      
      const result = await this.waitForResult(commandId, 20000);
      res.json(result.success ? result.data : { error: result.error });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private async handleExtractVariables(req: Request, res: Response): Promise<void> {
    try {
      const commandId = 'variables_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const command: QueuedCommand = {
        id: commandId,
        type: 'EXTRACT_VARIABLES',
        payload: req.body,
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      
      const result = await this.waitForResult(commandId, 10000);
      res.json(result.success ? result.data : { error: result.error });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private handleStatus(req: Request, res: Response): void {
    const response: StatusResponse = {
      server: 'unified-bridge-typescript',
      status: 'operational',
      mode: this.currentTunnelUrl ? 'tunnel' : 'localhost',
      tunnelUrl: this.currentTunnelUrl,
      timestamp: Date.now(),
      uptime: process.uptime(),
      endpoints: [
        '/figma-tools',
        '/create-nodes-from-code',
        '/create-node',
        '/design-preview',
        '/establish-code-connections',
        '/generate-ui-kit',
        '/smart-organize-layers',
        '/organize-pages',
        '/optimize-media-assets',
        '/extract-design-variables'
      ]
    };
    res.json(response);
  }

  private handleDemoWireframe(req: Request, res: Response): void {
    const commandId = 'wireframe_' + Date.now();
    this.commandQueue.push({
      id: commandId,
      type: 'CREATE_WIREFRAME',
      payload: { template: 'mobile-app' },
      timestamp: Date.now()
    });
    res.json({
      success: true,
      commandId: commandId,
      message: 'Wireframe creation queued'
    });
  }

  private handleDemoUIKit(req: Request, res: Response): void {
    const commandId = 'uikit_' + Date.now();
    this.commandQueue.push({
      id: commandId,
      type: 'CREATE_UI_KIT',
      payload: { style: 'modern' },
      timestamp: Date.now()
    });
    res.json({
      success: true,
      commandId: commandId,
      message: 'UI Kit creation queued'
    });
  }

  // Utility methods
  private async waitForResult(commandId: string, timeout: number = 10000): Promise<any> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this.resultStore[commandId]) {
          const result = this.resultStore[commandId];
          delete this.resultStore[commandId];
          clearInterval(checkInterval);
          resolve(result);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          resolve({ success: false, error: 'Command timeout' });
        }
      }, 100);
    });
  }

  public start(): void {
    this.app.listen(this.PORT, () => {
      console.log('🚀 UNIFIED BRIDGE TYPESCRIPT SERVER RUNNING!');
      console.log(`📍 Port: ${this.PORT}`);
      console.log(`🌐 Health: http://localhost:${this.PORT}/health`);
      console.log(`🔗 Plugin Ready: Waiting for Figma plugin connection...`);
      console.log('✨ All systems operational with TypeScript type safety!');
      console.log('');
      console.log('🔧 Available MCP Endpoints:');
      console.log('   • POST /figma-tools - Main MCP tools interface');
      console.log('   • POST /create-nodes-from-code - HTML/CSS to Figma nodes');
      console.log('   • POST /create-node - Simple node creation');
      console.log('   • POST /design-preview - Design preview generation');
      console.log('   • POST /establish-code-connections - Code connections');
      console.log('   • POST /generate-ui-kit - UI kit generation');
      console.log('   • POST /smart-organize-layers - Smart layer organization');
      console.log('   • POST /organize-pages - Page organization');
      console.log('   • POST /optimize-media-assets - Media optimization');
      console.log('   • POST /extract-design-variables - Design variables');
      console.log('');
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🚀 UNIFIED BRIDGE: Shutting down TypeScript server gracefully...');
      process.exit(0);
    });
  }
}

export default UnifiedBridgeServer; 