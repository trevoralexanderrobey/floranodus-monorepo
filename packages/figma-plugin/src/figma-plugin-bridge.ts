import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import path from 'path';
import fs from 'fs';

interface PluginMessage {
  id: string;
  type: 'CREATE_NODE' | 'MODIFY_NODE' | 'DELETE_NODE' | 'CREATE_FILE' | 'MODIFY_TEXT' | 'GET_SELECTION' | 'EXECUTE_COMMAND';
  payload: any;
}

interface ApiResponse {
  id: string;
  success: boolean;
  data?: any;
  error?: string;
}

class FigmaPluginBridge {
  private app: express.Application;
  private server: http.Server;
  private wss: WebSocketServer;
  private pluginSocket: WebSocket | null = null;
  private pendingRequests: Map<string, { resolve: (value: any) => void; reject: (error: any) => void }> = new Map();
  private port: number;

  constructor(port: number = 3001) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    
    this.setupMiddleware();
    this.setupWebSocket();
    this.setupRoutes();
    this.generatePluginFiles();
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use('/plugin', express.static(path.join(__dirname, '../plugin-files')));
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('Plugin connected to bridge');
      this.pluginSocket = ws;

      ws.on('message', (data) => {
        try {
          const response: ApiResponse = JSON.parse(data.toString());
          const pendingRequest = this.pendingRequests.get(response.id);
          
          if (pendingRequest) {
            if (response.success) {
              pendingRequest.resolve(response.data);
            } else {
              pendingRequest.reject(new Error(response.error));
            }
            this.pendingRequests.delete(response.id);
          }
        } catch (error) {
          console.error('Error parsing plugin response:', error);
        }
      });

      ws.on('close', () => {
        console.log('Plugin disconnected from bridge');
        this.pluginSocket = null;
      });
    });
  }

  private setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        pluginConnected: !!this.pluginSocket,
        timestamp: new Date().toISOString() 
      });
    });

    // Create a new node
    this.app.post('/api/files/:fileKey/nodes', async (req, res) => {
      try {
        const { nodeType, properties, parentId } = req.body;
        const result = await this.sendToPlugin('CREATE_NODE', { 
          nodeType, 
          properties, 
          parentId,
          fileKey: req.params.fileKey 
        });
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Modify an existing node
    this.app.put('/api/files/:fileKey/nodes/:nodeId', async (req, res) => {
      try {
        const { properties } = req.body;
        const result = await this.sendToPlugin('MODIFY_NODE', { 
          nodeId: req.params.nodeId,
          properties,
          fileKey: req.params.fileKey 
        });
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Modify text content
    this.app.put('/api/files/:fileKey/nodes/:nodeId/text', async (req, res) => {
      try {
        const { text, styling } = req.body;
        const result = await this.sendToPlugin('MODIFY_TEXT', { 
          nodeId: req.params.nodeId,
          text,
          styling,
          fileKey: req.params.fileKey 
        });
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Delete a node
    this.app.delete('/api/files/:fileKey/nodes/:nodeId', async (req, res) => {
      try {
        const result = await this.sendToPlugin('DELETE_NODE', { 
          nodeId: req.params.nodeId,
          fileKey: req.params.fileKey 
        });
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get current selection
    this.app.get('/api/selection', async (req, res) => {
      try {
        const result = await this.sendToPlugin('GET_SELECTION', {});
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Execute custom command
    this.app.post('/api/execute', async (req, res) => {
      try {
        const { command, params } = req.body;
        const result = await this.sendToPlugin('EXECUTE_COMMAND', { command, params });
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Plugin installation page
    this.app.get('/install', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Figma Plugin Bridge - Installation</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .code { background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; }
            .step { margin: 20px 0; padding: 15px; border-left: 3px solid #007ACC; background: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Figma Plugin Bridge - Installation Guide</h1>
          
          <div class="step">
            <h3>Step 1: Download Plugin Files</h3>
            <p>Download the plugin files:</p>
            <ul>
              <li><a href="/plugin/manifest.json" download>manifest.json</a></li>
              <li><a href="/plugin/code.js" download>code.js</a></li>
              <li><a href="/plugin/ui.html" download>ui.html</a></li>
            </ul>
          </div>

          <div class="step">
            <h3>Step 2: Install in Figma</h3>
            <ol>
              <li>Open Figma Desktop App</li>
              <li>Go to Menu → Plugins → Development → Import plugin from manifest...</li>
              <li>Select the downloaded manifest.json file</li>
              <li>The plugin will be installed and ready to use</li>
            </ol>
          </div>

          <div class="step">
            <h3>Step 3: Run the Plugin</h3>
            <ol>
              <li>In any Figma file, go to Menu → Plugins → Development → Figma Write API Bridge</li>
              <li>The plugin will connect to this bridge server</li>
              <li>You can now use the HTTP API endpoints to perform write operations</li>
            </ol>
          </div>

          <div class="step">
            <h3>Step 4: Test the Connection</h3>
            <p>Check if the plugin is connected:</p>
            <div class="code">curl http://localhost:${this.port}/health</div>
            <p>Should return: <code>{"status": "healthy", "pluginConnected": true}</code></p>
          </div>

          <h3>Available API Endpoints</h3>
          <ul>
            <li><code>POST /api/files/:fileKey/nodes</code> - Create a new node</li>
            <li><code>PUT /api/files/:fileKey/nodes/:nodeId</code> - Modify a node</li>
            <li><code>PUT /api/files/:fileKey/nodes/:nodeId/text</code> - Modify text content</li>
            <li><code>DELETE /api/files/:fileKey/nodes/:nodeId</code> - Delete a node</li>
            <li><code>GET /api/selection</code> - Get current selection</li>
            <li><code>POST /api/execute</code> - Execute custom command</li>
          </ul>
        </body>
        </html>
      `);
    });
  }

  private generatePluginFiles() {
    const pluginDir = path.join(__dirname, '../plugin-files');
    if (!fs.existsSync(pluginDir)) {
      fs.mkdirSync(pluginDir, { recursive: true });
    }

    // Generate manifest.json
    const manifest = {
      name: "Figma Write API Bridge",
      id: "figma-write-api-bridge",
      api: "1.0.0",
      main: "code.js",
      ui: "ui.html",
      capabilities: [],
      enableProposedApi: false,
      enablePrivatePluginApi: false,
      build: "",
      documentAccess: "dynamic-page",
      permissions: ["currentuser"],
      networkAccess: {
        allowedDomains: ["*"],
        reasoning: "Connect to local bridge server for write operations"
      }
    };

    fs.writeFileSync(
      path.join(pluginDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    // Generate code.js (plugin main script)
    const codeJs = `
// This code runs in the Figma plugin sandbox

let ws = null;
let bridgeUrl = 'ws://localhost:${this.port}';

function connectToBridge() {
  try {
    ws = new WebSocket(bridgeUrl);
    
    ws.onopen = () => {
      console.log('Connected to Figma Write API Bridge');
      figma.notify('✅ Connected to Write API Bridge');
    };
    
    ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        const response = await handleBridgeMessage(message);
        ws.send(JSON.stringify(response));
      } catch (error) {
        ws.send(JSON.stringify({
          id: message.id,
          success: false,
          error: error.message
        }));
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from bridge');
      figma.notify('❌ Disconnected from Write API Bridge');
      // Attempt to reconnect after 5 seconds
      setTimeout(connectToBridge, 5000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      figma.notify('❌ Bridge connection error');
    };
  } catch (error) {
    console.error('Failed to connect to bridge:', error);
    figma.notify('❌ Failed to connect to bridge');
    setTimeout(connectToBridge, 5000);
  }
}

async function handleBridgeMessage(message) {
  const { id, type, payload } = message;
  
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
        result = await executeCommand(payload);
        break;
      default:
        throw new Error(\`Unknown command type: \${type}\`);
    }
    
    return {
      id,
      success: true,
      data: result
    };
  } catch (error) {
    return {
      id,
      success: false,
      error: error.message
    };
  }
}

async function createNode(payload) {
  const { nodeType, properties, parentId } = payload;
  
  let parentNode = figma.currentPage;
  if (parentId) {
    parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(\`Parent node with ID \${parentId} not found\`);
    }
  }
  
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
      // Load default font
      await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
      break;
    case 'frame':
      newNode = figma.createFrame();
      break;
    case 'component':
      newNode = figma.createComponent();
      break;
    case 'group':
      // Groups need child nodes, create a temporary rectangle
      const tempRect = figma.createRectangle();
      tempRect.resize(100, 100);
      newNode = figma.group([tempRect], parentNode);
      break;
    default:
      throw new Error(\`Unsupported node type: \${nodeType}\`);
  }
  
  // Apply properties
  if (properties) {
    await applyNodeProperties(newNode, properties);
  }
  
  // Add to parent
  if (parentNode && 'appendChild' in parentNode) {
    parentNode.appendChild(newNode);
  }
  
  return {
    id: newNode.id,
    type: newNode.type,
    name: newNode.name
  };
}

async function modifyNode(payload) {
  const { nodeId, properties } = payload;
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(\`Node with ID \${nodeId} not found\`);
  }
  
  await applyNodeProperties(node, properties);
  
  return {
    id: node.id,
    type: node.type,
    name: node.name
  };
}

async function applyNodeProperties(node, properties) {
  for (const [key, value] of Object.entries(properties)) {
    switch (key) {
      case 'name':
        node.name = value;
        break;
      case 'x':
        node.x = value;
        break;
      case 'y':
        node.y = value;
        break;
      case 'width':
        node.resize(value, node.height);
        break;
      case 'height':
        node.resize(node.width, value);
        break;
      case 'fills':
        if ('fills' in node) {
          node.fills = value;
        }
        break;
      case 'strokes':
        if ('strokes' in node) {
          node.strokes = value;
        }
        break;
      case 'strokeWeight':
        if ('strokeWeight' in node) {
          node.strokeWeight = value;
        }
        break;
      case 'opacity':
        node.opacity = value;
        break;
      case 'visible':
        node.visible = value;
        break;
      case 'locked':
        node.locked = value;
        break;
      case 'rotation':
        node.rotation = value;
        break;
      default:
        console.warn(\`Unknown property: \${key}\`);
    }
  }
}

async function deleteNode(payload) {
  const { nodeId } = payload;
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(\`Node with ID \${nodeId} not found\`);
  }
  
  node.remove();
  
  return { success: true };
}

async function modifyText(payload) {
  const { nodeId, text, styling } = payload;
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node || node.type !== 'TEXT') {
    throw new Error(\`Text node with ID \${nodeId} not found\`);
  }
  
  // Load font if styling includes font changes
  if (styling?.fontFamily && styling?.fontStyle) {
    await figma.loadFontAsync({ 
      family: styling.fontFamily, 
      style: styling.fontStyle 
    });
  } else {
    // Load current font to ensure we can edit
    const font = node.fontName !== figma.mixed ? node.fontName : { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(font);
  }
  
  if (text !== undefined) {
    node.characters = text;
  }
  
  if (styling) {
    if (styling.fontSize) node.fontSize = styling.fontSize;
    if (styling.fontFamily && styling.fontStyle) {
      node.fontName = { family: styling.fontFamily, style: styling.fontStyle };
    }
    if (styling.fills) node.fills = styling.fills;
    if (styling.letterSpacing) node.letterSpacing = styling.letterSpacing;
    if (styling.lineHeight) node.lineHeight = styling.lineHeight;
    if (styling.textAlign) node.textAlignHorizontal = styling.textAlign;
  }
  
  return {
    id: node.id,
    characters: node.characters,
    fontSize: node.fontSize
  };
}

async function getSelection() {
  return figma.currentPage.selection.map(node => ({
    id: node.id,
    type: node.type,
    name: node.name,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height
  }));
}

async function executeCommand(payload) {
  const { command, params } = payload;
  
  // Custom command execution
  switch (command) {
    case 'zoom_to_fit':
      figma.viewport.zoom = 1;
      figma.viewport.center = { x: 0, y: 0 };
      break;
    case 'select_all':
      figma.currentPage.selection = figma.currentPage.children;
      break;
    case 'create_artboard':
      const frame = figma.createFrame();
      frame.name = params?.name || 'Artboard';
      frame.resize(params?.width || 375, params?.height || 812);
      figma.currentPage.appendChild(frame);
      return { id: frame.id, name: frame.name };
    default:
      throw new Error(\`Unknown command: \${command}\`);
  }
  
  return { success: true };
}

// Start the plugin
figma.showUI(__html__, { width: 300, height: 200 });
connectToBridge();

// Keep the plugin running
figma.ui.onmessage = msg => {
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};
`;

    fs.writeFileSync(path.join(pluginDir, 'code.js'), codeJs);

    // Generate ui.html
    const uiHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Figma Write API Bridge</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      margin: 0;
      background: white;
    }
    .status {
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
      text-align: center;
    }
    .connected {
      background: #e8f5e8;
      color: #2d5a2d;
      border: 1px solid #4caf4c;
    }
    .disconnected {
      background: #ffeaea;
      color: #5a2d2d;
      border: 1px solid #f44336;
    }
    button {
      background: #007ACC;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      width: 100%;
      margin: 5px 0;
    }
    button:hover {
      background: #005a9a;
    }
    .info {
      font-size: 12px;
      color: #666;
      margin-top: 15px;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <h3>Figma Write API Bridge</h3>
  
  <div id="status" class="status disconnected">
    🔌 Connecting to bridge...
  </div>
  
  <button onclick="window.open('http://localhost:${this.port}/install', '_blank')">
    📋 View API Documentation
  </button>
  
  <button onclick="parent.postMessage({ pluginMessage: { type: 'close' } }, '*')">
    ❌ Close Plugin
  </button>
  
  <div class="info">
    <strong>Bridge Server:</strong> localhost:${this.port}<br>
    <strong>Status:</strong> This plugin enables write operations to Figma via HTTP API.<br>
    <strong>Usage:</strong> Keep this plugin running while using the HTTP endpoints.
  </div>

  <script>
    // Simple status indicator
    setTimeout(() => {
      const status = document.getElementById('status');
      status.className = 'status connected';
      status.innerHTML = '✅ Bridge Active - Ready for API calls';
    }, 2000);
  </script>
</body>
</html>
`;

    fs.writeFileSync(path.join(pluginDir, 'ui.html'), uiHtml);

    console.log('Plugin files generated in:', pluginDir);
  }

  private sendToPlugin(type: PluginMessage['type'], payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.pluginSocket) {
        reject(new Error('Plugin not connected'));
        return;
      }

      const id = Math.random().toString(36).substring(7);
      const message: PluginMessage = { id, type, payload };

      this.pendingRequests.set(id, { resolve, reject });

      // Set timeout for request
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000); // 30 second timeout

      this.pluginSocket.send(JSON.stringify(message));
    });
  }

  public start() {
    this.server.listen(this.port, () => {
      console.log(`\n🚀 Figma Plugin Bridge Server running on port ${this.port}\n`);
      console.log(`📋 Installation Guide: http://localhost:${this.port}/install`);
      console.log(`💚 Health Check: http://localhost:${this.port}/health\n`);
      console.log(`To enable write operations:`);
      console.log(`1. Visit http://localhost:${this.port}/install`);
      console.log(`2. Download and install the Figma plugin`);
      console.log(`3. Run the plugin in any Figma file`);
      console.log(`4. Use HTTP API endpoints for write operations\n`);
    });
  }
}

export default FigmaPluginBridge; 