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

class PollingBridge {
  private app: express.Application;
  private server: http.Server;
  private port: number;
  private pluginConnected: boolean = false;
  private pendingCommands: Map<string, PluginCommand> = new Map();
  private commandQueue: PluginCommand[] = [];
  private results: Map<string, any> = new Map();
  private lastPing: number = 0;
  private commandCounter: number = 0;

  constructor(port: number = 3002) {
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
      // Plugin is connected if it pinged in the last 15 seconds
      this.pluginConnected = (Date.now() - this.lastPing) < 15000;
      
      // Clean up old commands and results
      const now = Date.now();
      for (const [id, command] of this.pendingCommands) {
        if (now - command.timestamp > 120000) { // 2 minute timeout
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
        mode: 'http-polling-v2',
        lastPing: this.lastPing,
        uptimeSeconds: Math.floor((Date.now() - this.lastPing) / 1000)
      });
    });

    // Plugin ping endpoint (heartbeat)
    this.app.post('/plugin/ping', (req, res) => {
      this.lastPing = Date.now();
      this.pluginConnected = true;
      res.json({ 
        success: true, 
        timestamp: this.lastPing,
        pendingCommands: this.commandQueue.length
      });
    });

    // Plugin polls for commands
    this.app.get('/plugin/commands', (req, res) => {
      this.lastPing = Date.now();
      
      // Send up to 3 commands at once
      const commands = this.commandQueue.splice(0, 3);
      res.json({ commands });
    });

    // Plugin submits results
    this.app.post('/plugin/results', (req, res) => {
      const { results } = req.body;
      
      if (Array.isArray(results)) {
        for (const result of results) {
          this.results.set(result.commandId, {
            ...result,
            timestamp: Date.now()
          });
          this.pendingCommands.delete(result.commandId);
          console.log(`📤 Received result for command: ${result.commandId}`);
        }
      }
      
      res.json({ success: true, received: results?.length || 0 });
    });

    // Installation guide
    this.app.get('/install', (req, res) => {
      res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Figma Write API Bridge v2 - HTTP Polling</title>
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
  <h1>🚀 Figma Write API Bridge v2</h1>
  <h2>📡 HTTP Polling Mode (Bypasses Sandbox Restrictions)</h2>
  
  <div class="status ${this.pluginConnected ? 'success' : 'warning'}">
    <strong>Plugin Status:</strong> ${this.pluginConnected ? '✅ Connected & Polling' : '⚠️ Not Connected'}
    <br><strong>Mode:</strong> HTTP Polling (No WebSocket needed)
    <br><strong>Last Ping:</strong> ${this.lastPing ? new Date(this.lastPing).toLocaleTimeString() : 'Never'}
  </div>

  <h2>🔧 Test the API</h2>
  <button onclick="testAPI()">🧪 Test Create Rectangle</button>
  
  <script>
  async function testAPI() {
    try {
      const response = await fetch('/api/files/test/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeType: 'rectangle',
          properties: {
            name: 'Test Rectangle',
            x: 100, y: 100, width: 200, height: 100,
            fills: [{"type": "SOLID", "color": {"r": 0, "g": 1, "b": 0}}]
          }
        })
      });
      
      const result = await response.json();
      alert('API Test Result: ' + JSON.stringify(result, null, 2));
    } catch (error) {
      alert('API Test Failed: ' + error.message);
    }
  }
  </script>

  <h2>📊 Live Status</h2>
  <div id="liveStatus">Loading...</div>
  
  <script>
  setInterval(async () => {
    try {
      const response = await fetch('/health');
      const health = await response.json();
      document.getElementById('liveStatus').innerHTML = 
        '<pre>' + JSON.stringify(health, null, 2) + '</pre>';
    } catch (error) {
      document.getElementById('liveStatus').innerHTML = 
        '<span style="color: red;">Connection Error: ' + error.message + '</span>';
    }
  }, 2000);
  </script>
</body>
</html>
      `);
    });

    // API Endpoints - These bypass Figma's restrictions!
    this.app.post('/api/files/:fileId/nodes', async (req, res) => {
      const command = this.createCommand('CREATE_NODE', req.body);
      const result = await this.executeCommand(command);
      res.json(result);
    });

    this.app.put('/api/files/:fileId/nodes/:nodeId', async (req, res) => {
      const command = this.createCommand('MODIFY_NODE', { 
        nodeId: req.params.nodeId, 
        properties: req.body 
      });
      const result = await this.executeCommand(command);
      res.json(result);
    });

    this.app.delete('/api/files/:fileId/nodes/:nodeId', async (req, res) => {
      const command = this.createCommand('DELETE_NODE', { 
        nodeId: req.params.nodeId 
      });
      const result = await this.executeCommand(command);
      res.json(result);
    });

    this.app.put('/api/files/:fileId/nodes/:nodeId/text', async (req, res) => {
      const command = this.createCommand('MODIFY_TEXT', { 
        nodeId: req.params.nodeId, 
        ...req.body 
      });
      const result = await this.executeCommand(command);
      res.json(result);
    });

    this.app.get('/api/files/:fileId/selection', async (req, res) => {
      const command = this.createCommand('GET_SELECTION', {});
      const result = await this.executeCommand(command);
      res.json(result);
    });

    this.app.post('/api/files/:fileId/commands', async (req, res) => {
      const command = this.createCommand('EXECUTE_COMMAND', req.body);
      const result = await this.executeCommand(command);
      res.json(result);
    });
  }

  private createCommand(type: PluginCommand['type'], payload: any): PluginCommand {
    return {
      id: `cmd_${++this.commandCounter}_${Date.now()}`,
      type,
      payload,
      timestamp: Date.now()
    };
  }

  private async executeCommand(command: PluginCommand): Promise<any> {
    if (!this.pluginConnected) {
      return {
        success: false,
        error: 'Plugin not connected. Make sure the Figma plugin is running.',
        commandId: command.id
      };
    }

    this.commandQueue.push(command);
    this.pendingCommands.set(command.id, command);
    
    console.log(`📨 Queued command: ${command.type} (${command.id})`);
    
    // Wait for result with longer timeout for HTTP polling
    return await this.waitForResult(command.id, 60000); // 60 second timeout
  }

  private async waitForResult(commandId: string, timeout: number): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (this.results.has(commandId)) {
        const result = this.results.get(commandId);
        this.results.delete(commandId);
        this.pendingCommands.delete(commandId);
        console.log(`✅ Command completed: ${commandId}`);
        return result.result;
      }
      
      // Check more frequently for HTTP polling
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Timeout
    this.pendingCommands.delete(commandId);
    return {
      success: false,
      error: `Command timeout after ${timeout/1000} seconds. Plugin may not be responding.`,
      commandId
    };
  }

  private generatePluginFiles() {
    const pluginDir = path.join(__dirname, '../plugin-files');
    
    if (!fs.existsSync(pluginDir)) {
      fs.mkdirSync(pluginDir, { recursive: true });
    }

    // Generate working HTTP polling plugin
    const pluginCode = `
// Figma Write API Bridge v2 - HTTP Polling Plugin
// Bypasses WebSocket sandbox restrictions using HTTP requests
console.log('🚀 HTTP Polling Bridge v2 starting...');
figma.notify('🚀 Starting HTTP Bridge v2...');

const BRIDGE_URL = 'http://localhost:${this.port}';
let isRunning = false;
let pollInterval = null;

// Create test shape to verify plugin works
try {
  const testRect = figma.createRectangle();
  testRect.name = 'HTTP Bridge v2 Test';
  testRect.resize(80, 40);
  testRect.fills = [{ type: 'SOLID', color: { r: 0, g: 0.7, b: 1 } }];
  figma.currentPage.appendChild(testRect);
  console.log('✅ Plugin can create shapes');
  figma.notify('✅ Plugin functionality verified');
} catch (error) {
  console.error('❌ Plugin error:', error);
  figma.notify('❌ Plugin error: ' + error.message);
}

// Start HTTP polling system
async function startPolling() {
  if (isRunning) return;
  isRunning = true;
  
  console.log('🔄 Starting HTTP polling...');
  figma.notify('🔄 Starting HTTP polling...');
  
  // Send initial ping
  await sendPing();
  
  // Poll for commands every 2 seconds
  pollInterval = setInterval(async () => {
    try {
      await sendPing(); // Heartbeat
      await pollForCommands(); // Check for work
    } catch (error) {
      console.error('❌ Polling error:', error);
    }
  }, 2000);
  
  console.log('✅ HTTP polling active');
  figma.notify('✅ HTTP polling active!');
}

async function sendPing() {
  try {
    const response = await fetch(BRIDGE_URL + '/plugin/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: Date.now() })
    });
    
    if (!response.ok) {
      throw new Error('Ping failed: ' + response.status);
    }
  } catch (error) {
    console.error('❌ Ping failed:', error);
  }
}

async function pollForCommands() {
  try {
    const response = await fetch(BRIDGE_URL + '/plugin/commands');
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.commands && data.commands.length > 0) {
        console.log('📨 Received commands:', data.commands.length);
        figma.notify('📨 Processing ' + data.commands.length + ' commands');
        
        const results = [];
        
        for (const command of data.commands) {
          const result = await executeCommand(command);
          results.push(result);
        }
        
        // Send all results back
        await submitResults(results);
      }
    }
  } catch (error) {
    console.error('❌ Poll error:', error);
  }
}

async function submitResults(results) {
  try {
    const response = await fetch(BRIDGE_URL + '/plugin/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ results })
    });
    
    if (response.ok) {
      console.log('✅ Submitted ' + results.length + ' results');
    }
  } catch (error) {
    console.error('❌ Submit error:', error);
  }
}

async function executeCommand(command) {
  const { id, type, payload } = command;
  
  try {
    let result;
    
    switch (type) {
      case 'CREATE_NODE':
        result = await createNode(payload);
        break;
      case 'MODIFY_NODE':
        result = await modifyNode(payload);
        break;
      case 'DELETE_NODE':
        result = await deleteNode(payload);
        break;
      case 'MODIFY_TEXT':
        result = await modifyText(payload);
        break;
      case 'GET_SELECTION':
        result = await getSelection();
        break;
      case 'EXECUTE_COMMAND':
        result = await executeCustomCommand(payload);
        break;
      case 'PING':
        result = { pong: true, timestamp: Date.now() };
        break;
      default:
        throw new Error('Unknown command type: ' + type);
    }
    
    figma.notify('✅ Executed: ' + type);
    
    return {
      commandId: id,
      result: {
        success: true,
        data: result
      }
    };
  } catch (error) {
    console.error('❌ Command error:', error);
    figma.notify('❌ Failed: ' + type);
    
    return {
      commandId: id,
      result: {
        success: false,
        error: error.message
      }
    };
  }
}

async function createNode(payload) {
  const { nodeType, properties } = payload;
  
  let newNode;
  
  switch (nodeType.toLowerCase()) {
    case 'rectangle':
      newNode = figma.createRectangle();
      break;
    case 'ellipse':
      newNode = figma.createEllipse();
      break;
    case 'text':
      newNode = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      break;
    case 'frame':
      newNode = figma.createFrame();
      break;
    default:
      throw new Error('Unsupported node type: ' + nodeType);
  }
  
  // Apply properties
  if (properties) {
    for (const [key, value] of Object.entries(properties)) {
      try {
        switch (key) {
          case 'name': newNode.name = value; break;
          case 'x': newNode.x = value; break;
          case 'y': newNode.y = value; break;
          case 'width': if (newNode.resize) newNode.resize(value, newNode.height); break;
          case 'height': if (newNode.resize) newNode.resize(newNode.width, value); break;
          case 'fills': if ('fills' in newNode) newNode.fills = value; break;
          case 'strokes': if ('strokes' in newNode) newNode.strokes = value; break;
          case 'strokeWeight': if ('strokeWeight' in newNode) newNode.strokeWeight = value; break;
          case 'opacity': newNode.opacity = value; break;
          case 'visible': newNode.visible = value; break;
          case 'rotation': newNode.rotation = value; break;
        }
      } catch (error) {
        console.warn('Property error:', key, error.message);
      }
    }
  }
  
  figma.currentPage.appendChild(newNode);
  figma.viewport.scrollAndZoomIntoView([newNode]);
  
  return {
    id: newNode.id,
    type: newNode.type,
    name: newNode.name,
    x: newNode.x,
    y: newNode.y,
    width: newNode.width,
    height: newNode.height
  };
}

async function modifyNode(payload) {
  const { nodeId, properties } = payload;
  const node = await figma.getNodeByIdAsync(nodeId);
  
  if (!node) {
    throw new Error('Node not found: ' + nodeId);
  }
  
  // Apply modifications (same logic as createNode)
  for (const [key, value] of Object.entries(properties)) {
    try {
      switch (key) {
        case 'name': node.name = value; break;
        case 'x': node.x = value; break;
        case 'y': node.y = value; break;
        case 'width': if (node.resize) node.resize(value, node.height); break;
        case 'height': if (node.resize) node.resize(node.width, value); break;
        case 'fills': if ('fills' in node) node.fills = value; break;
        case 'opacity': node.opacity = value; break;
        case 'visible': node.visible = value; break;
      }
    } catch (error) {
      console.warn('Modify error:', key, error.message);
    }
  }
  
  return { id: node.id, modified: true };
}

async function deleteNode(payload) {
  const { nodeId } = payload;
  const node = await figma.getNodeByIdAsync(nodeId);
  
  if (!node) {
    throw new Error('Node not found: ' + nodeId);
  }
  
  node.remove();
  return { deleted: nodeId };
}

async function modifyText(payload) {
  const { nodeId, text, styling } = payload;
  const node = await figma.getNodeByIdAsync(nodeId);
  
  if (!node || node.type !== 'TEXT') {
    throw new Error('Text node not found: ' + nodeId);
  }
  
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  if (text !== undefined) {
    node.characters = text;
  }
  
  return { id: node.id, characters: node.characters };
}

async function getSelection() {
  return figma.currentPage.selection.map(node => ({
    id: node.id,
    type: node.type,
    name: node.name,
    x: node.x,
    y: node.y
  }));
}

async function executeCustomCommand(payload) {
  const { command, params } = payload;
  
  switch (command) {
    case 'create_artboard':
      const frame = figma.createFrame();
      frame.name = params?.name || 'Artboard';
      frame.resize(params?.width || 375, params?.height || 812);
      figma.currentPage.appendChild(frame);
      return { id: frame.id, name: frame.name };
    default:
      throw new Error('Unknown command: ' + command);
  }
}

// Start the HTTP polling system
startPolling();

console.log('✅ HTTP Polling Bridge v2 initialized');
`;

    fs.writeFileSync(path.join(pluginDir, 'code.js'), pluginCode);

    // Generate manifest
    const manifest = {
      name: "Figma Write API Bridge v2",
      id: "figma-write-api-bridge-v2",
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
        reasoning: "HTTP polling communication with local bridge server"
      }
    };

    fs.writeFileSync(path.join(pluginDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

    console.log(`📁 HTTP Polling plugin files generated in: ${pluginDir}`);
  }

  public start() {
    this.server.listen(this.port, () => {
      console.log(`\n🚀 HTTP Polling Bridge v2 running on port ${this.port}`);
      console.log(`📡 Mode: HTTP Polling (Bypasses Figma sandbox restrictions)`);
      console.log(`📋 Installation Guide: http://localhost:${this.port}/install`);
      console.log(`💚 Health Check: http://localhost:${this.port}/health\n`);
      console.log(`🎯 This bridge bypasses Figma's WebSocket restrictions!`);
      console.log(`✅ Ready for HTTP API requests\n`);
    });
  }
}

// Start the server
if (require.main === module) {
  const bridge = new PollingBridge(3002);
  bridge.start();
}

export default PollingBridge; 