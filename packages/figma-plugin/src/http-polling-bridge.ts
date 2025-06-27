import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

interface PluginCommand {
  id: string;
  type: 'CREATE_NODE' | 'MODIFY_NODE' | 'DELETE_NODE' | 'MODIFY_TEXT' | 'GET_SELECTION' | 'EXECUTE_COMMAND' | 'PING';
  payload: any;
  timestamp: number;
}

interface PluginResult {
  commandId: string;
  result: any;
  timestamp: number;
}

class HttpPollingBridge {
  private app: express.Application;
  private server: http.Server;
  private port: number;
  private pluginConnected: boolean = false;
  private pendingCommands: Map<string, PluginCommand> = new Map();
  private commandQueue: PluginCommand[] = [];
  private results: Map<string, PluginResult> = new Map();
  private lastPing: number = 0;

  constructor(port: number = 3001) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    
    this.setupMiddleware();
    this.setupRoutes();
    this.generatePluginFiles();
    this.startHealthCheck();
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../plugin-files')));
  }

  private startHealthCheck() {
    setInterval(() => {
      // Plugin is considered connected if it pinged in the last 10 seconds
      this.pluginConnected = (Date.now() - this.lastPing) < 10000;
      
      // Clean up old commands and results
      const now = Date.now();
      for (const [id, command] of this.pendingCommands) {
        if (now - command.timestamp > 60000) { // 1 minute timeout
          this.pendingCommands.delete(id);
        }
      }
      
      for (const [id, result] of this.results) {
        if (now - result.timestamp > 300000) { // 5 minute timeout
          this.results.delete(id);
        }
      }
    }, 5000);
  }

  private setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        pluginConnected: this.pluginConnected,
        timestamp: new Date().toISOString(),
        pendingCommands: this.commandQueue.length,
        mode: 'http-polling'
      });
    });

    // Installation guide
    this.app.get('/install', (req, res) => {
      res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Figma Write API Bridge - HTTP Polling Mode</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    .status { padding: 15px; border-radius: 8px; margin: 20px 0; }
    .success { background: #e8f5e8; border: 1px solid #4caf50; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>🚀 Figma Write API Bridge - HTTP Polling Mode</h1>
  
  <div class="status ${this.pluginConnected ? 'success' : 'warning'}">
    <strong>Status:</strong> ${this.pluginConnected ? '✅ Plugin Connected' : '⚠️ Plugin Not Connected'}
  </div>

  <h2>📦 Plugin Installation</h2>
  <ol>
    <li><strong>Download Plugin Files:</strong> 
      <a href="/code.js" download>code.js</a> | 
      <a href="/manifest.json" download>manifest.json</a>
    </li>
    <li><strong>Install in Figma:</strong>
      <ul>
        <li>Open Figma Desktop</li>
        <li>Go to <code>Plugins → Development → Import plugin from manifest...</code></li>
        <li>Select the downloaded <code>manifest.json</code> file</li>
      </ul>
    </li>
    <li><strong>Run Plugin:</strong>
      <ul>
        <li>Open any Figma file</li>
        <li>Go to <code>Plugins → Development → Figma Write API Bridge</code></li>
        <li>Plugin will start HTTP polling mode</li>
      </ul>
    </li>
  </ol>

  <h2>🔧 API Usage</h2>
  <h3>Create Rectangle</h3>
  <pre>curl -X POST http://localhost:${this.port}/api/files/any/nodes \\
  -H "Content-Type: application/json" \\
  -d '{
    "nodeType": "rectangle",
    "properties": {
      "name": "My Rectangle",
      "x": 100, "y": 100, "width": 200, "height": 100,
      "fills": [{"type": "SOLID", "color": {"r": 1, "g": 0, "b": 0}}]
    }
  }'</pre>

  <h3>Create Text</h3>
  <pre>curl -X POST http://localhost:${this.port}/api/files/any/nodes \\
  -H "Content-Type: application/json" \\
  -d '{
    "nodeType": "text",
    "properties": {"name": "My Text", "x": 100, "y": 250}
  }'</pre>

  <h2>📊 Server Status</h2>
  <ul>
    <li><strong>Plugin Connected:</strong> ${this.pluginConnected ? 'Yes' : 'No'}</li>
    <li><strong>Pending Commands:</strong> ${this.commandQueue.length}</li>
    <li><strong>Last Ping:</strong> ${this.lastPing ? new Date(this.lastPing).toLocaleTimeString() : 'Never'}</li>
  </ul>

  <p><a href="/health">🔍 Health Check JSON</a></p>
</body>
</html>
      `);
    });

    // Plugin registration
    this.app.post('/api/plugin/register', (req, res) => {
      this.lastPing = Date.now();
      this.pluginConnected = true;
      console.log('📱 Plugin registered via HTTP polling');
      res.json({ success: true, message: 'Plugin registered' });
    });

    // Plugin polling endpoint
    this.app.get('/api/plugin/poll', (req, res) => {
      this.lastPing = Date.now();
      
      const commands = this.commandQueue.splice(0, 5); // Send up to 5 commands at once
      res.json(commands);
    });

    // Plugin result submission
    this.app.post('/api/plugin/result', (req, res) => {
      const { commandId, result } = req.body;
      
      this.results.set(commandId, {
        commandId,
        result,
        timestamp: Date.now()
      });
      
      console.log('📤 Received result for command:', commandId);
      res.json({ success: true });
    });

    // API Endpoints for external use
    this.app.post('/api/files/:fileId/nodes', async (req, res) => {
      const commandId = this.generateId();
      const command: PluginCommand = {
        id: commandId,
        type: 'CREATE_NODE',
        payload: req.body,
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      this.pendingCommands.set(commandId, command);
      
      // Wait for result
      const result = await this.waitForResult(commandId, 30000);
      res.json(result);
    });

    this.app.put('/api/files/:fileId/nodes/:nodeId', async (req, res) => {
      const commandId = this.generateId();
      const command: PluginCommand = {
        id: commandId,
        type: 'MODIFY_NODE',
        payload: { nodeId: req.params.nodeId, properties: req.body },
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      this.pendingCommands.set(commandId, command);
      
      const result = await this.waitForResult(commandId, 30000);
      res.json(result);
    });

    this.app.delete('/api/files/:fileId/nodes/:nodeId', async (req, res) => {
      const commandId = this.generateId();
      const command: PluginCommand = {
        id: commandId,
        type: 'DELETE_NODE',
        payload: { nodeId: req.params.nodeId },
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      this.pendingCommands.set(commandId, command);
      
      const result = await this.waitForResult(commandId, 30000);
      res.json(result);
    });

    this.app.put('/api/files/:fileId/nodes/:nodeId/text', async (req, res) => {
      const commandId = this.generateId();
      const command: PluginCommand = {
        id: commandId,
        type: 'MODIFY_TEXT',
        payload: { nodeId: req.params.nodeId, ...req.body },
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      this.pendingCommands.set(commandId, command);
      
      const result = await this.waitForResult(commandId, 30000);
      res.json(result);
    });

    this.app.get('/api/files/:fileId/selection', async (req, res) => {
      const commandId = this.generateId();
      const command: PluginCommand = {
        id: commandId,
        type: 'GET_SELECTION',
        payload: {},
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      this.pendingCommands.set(commandId, command);
      
      const result = await this.waitForResult(commandId, 30000);
      res.json(result);
    });

    this.app.post('/api/files/:fileId/commands', async (req, res) => {
      const commandId = this.generateId();
      const command: PluginCommand = {
        id: commandId,
        type: 'EXECUTE_COMMAND',
        payload: req.body,
        timestamp: Date.now()
      };
      
      this.commandQueue.push(command);
      this.pendingCommands.set(commandId, command);
      
      const result = await this.waitForResult(commandId, 30000);
      res.json(result);
    });
  }

  private async waitForResult(commandId: string, timeout: number = 30000): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (this.results.has(commandId)) {
        const result = this.results.get(commandId)!;
        this.results.delete(commandId);
        this.pendingCommands.delete(commandId);
        return result.result;
      }
      
      // Wait 100ms before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Timeout
    this.pendingCommands.delete(commandId);
    throw new Error('Command timeout');
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generatePluginFiles() {
    const pluginDir = path.join(__dirname, '../plugin-files');
    
    if (!fs.existsSync(pluginDir)) {
      fs.mkdirSync(pluginDir, { recursive: true });
    }

    // Read the HTTP polling plugin code
    const httpPluginPath = path.join(__dirname, '../http-polling-plugin.js');
    let codeJs = '';
    
    if (fs.existsSync(httpPluginPath)) {
      codeJs = fs.readFileSync(httpPluginPath, 'utf8');
    } else {
      // Fallback code if file doesn't exist
      codeJs = `
console.log('🚀 HTTP Polling Plugin starting...');
figma.notify('🚀 Starting HTTP Bridge (polling mode)...');

const BRIDGE_URL = 'http://localhost:${this.port}';
let isConnected = false;

async function registerWithBridge() {
  try {
    const response = await fetch(BRIDGE_URL + '/api/plugin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pluginId: 'figma-write-api-bridge', timestamp: Date.now() })
    });
    
    if (response.ok) {
      isConnected = true;
      figma.notify('✅ Connected to HTTP Bridge!');
      startPolling();
    }
  } catch (error) {
    figma.notify('❌ Connection failed - retrying...');
    setTimeout(registerWithBridge, 3000);
  }
}

async function startPolling() {
  setInterval(async () => {
    if (!isConnected) return;
    try {
      const response = await fetch(BRIDGE_URL + '/api/plugin/poll');
      if (response.ok) {
        const commands = await response.json();
        // Process commands...
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 1000);
}

registerWithBridge();
`;
    }

    fs.writeFileSync(path.join(pluginDir, 'code.js'), codeJs);

    // Generate manifest.json
    const manifest = {
      name: "Figma Write API Bridge",
      id: "figma-write-api-bridge-http",
      api: "1.0.0",
      main: "code.js",
      capabilities: [],
      enableProposedApi: false,
      enablePrivatePluginApi: false,
      build: "",
      documentAccess: "dynamic-page",
      permissions: ["currentuser"],
      networkAccess: {
        allowedDomains: ["*"],
        reasoning: "Connect to local bridge server for write operations via HTTP polling"
      }
    };

    fs.writeFileSync(path.join(pluginDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

    console.log('HTTP Polling plugin files generated in:', pluginDir);
  }

  public start() {
    this.server.listen(this.port, () => {
      console.log(`\n🚀 HTTP Polling Bridge Server running on port ${this.port}\n`);
      console.log(`📋 Installation Guide: http://localhost:${this.port}/install`);
      console.log(`💚 Health Check: http://localhost:${this.port}/health\n`);
      console.log(`🔄 Mode: HTTP Polling (no WebSocket dependency)`);
      console.log(`To enable write operations:`);
      console.log(`1. Visit http://localhost:${this.port}/install`);
      console.log(`2. Download and install the Figma plugin`);
      console.log(`3. Run the plugin in any Figma file`);
      console.log(`4. Use HTTP API endpoints for write operations\n`);
    });
  }
}

// Start the server
if (require.main === module) {
  const bridge = new HttpPollingBridge(3001);
  bridge.start();
}

export default HttpPollingBridge; 