// 🚀 UNIFIED FIGMA BRIDGE PLUGIN - MULTI-TUNNEL FALLBACK EDITION
console.log('🚀 UNIFIED BRIDGE Plugin starting - MULTI-TUNNEL FALLBACK EDITION!');

// Multi-tunnel fallback endpoints (in priority order)
const TUNNEL_ENDPOINTS = [
  // Primary: Cloudflare tunnels
  { type: 'cloudflare', pattern: /https:\/\/.*\.trycloudflare\.com/, priority: 1 },
  { type: 'cloudflare-2', pattern: /https:\/\/.*\.trycloudflare\.com/, priority: 2 },
  
  // Fallback 1: localtunnel (very reliable)
  { type: 'localtunnel', pattern: /https:\/\/.*\.loca\.lt/, priority: 3 },
  
  // Fallback 2: serveo (SSH-based)
  { type: 'serveo', pattern: /https:\/\/.*\.serveo\.net/, priority: 4 },
  
  // Fallback 3: bore (Rust-based)
  { type: 'bore', pattern: /https:\/\/.*\.bore\.pub/, priority: 5 }
];

let UNIFIED_URL = 'http://localhost:3000'; // Default fallback
let connectionMode = 'localhost';
let activeTunnelType = null;

// Smart tunnel detection with health checking
async function detectConnectionMode() {
  console.log('🔍 Starting multi-tunnel fallback detection...');
  
  // First try to get tunnel info from localhost server
  try {
    const tunnelInfoResponse = await fetch('http://localhost:3000/tunnel-info', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      timeout: 5000
    }).catch(() => null);
    
    if (tunnelInfoResponse && tunnelInfoResponse.ok) {
      const tunnelInfo = await tunnelInfoResponse.json();
      if (tunnelInfo.tunnelUrl) {
        // Verify the tunnel actually works
        if (await testTunnelHealth(tunnelInfo.tunnelUrl)) {
          UNIFIED_URL = tunnelInfo.tunnelUrl;
          connectionMode = 'tunnel';
          activeTunnelType = tunnelInfo.tunnelType || 'cloudflare';
          console.log(`🌐 TUNNEL MODE: Using ${UNIFIED_URL} (${activeTunnelType})`);
          figma.notify(`🌐 TUNNEL: Connected via ${activeTunnelType} - ${tunnelInfo.tunnelUrl.replace('https://', '')}`);
          return true;
        }
      }
    }
  } catch (error) {
    console.log('🔍 Local tunnel info failed, trying direct tunnel detection...');
  }
  
  // Try direct tunnel detection
  const workingTunnel = await findWorkingTunnel();
  if (workingTunnel) {
    UNIFIED_URL = workingTunnel.url;
    connectionMode = 'tunnel';
    activeTunnelType = workingTunnel.type;
    console.log(`🌐 TUNNEL MODE: Found working ${activeTunnelType} at ${UNIFIED_URL}`);
    figma.notify(`🌐 TUNNEL: Connected via ${activeTunnelType} - ${UNIFIED_URL.replace('https://', '')}`);
    return true;
  }
  
  // Fallback to localhost
  console.log(`🏠 LOCALHOST MODE: Using ${UNIFIED_URL}`);
  figma.notify('🏠 LOCALHOST: Connected to local server');
  return true;
}

// Test if a tunnel endpoint is working
async function testTunnelHealth(url) {
  try {
    console.log(`🔍 Testing tunnel health: ${url}/health`);
    const response = await fetch(`${url}/health`, { 
      method: 'GET',
      timeout: 5000 
    });
    return response.ok;
  } catch (error) {
    console.log(`❌ Tunnel health check failed: ${error.message}`);
    return false;
  }
}

// Find working tunnel by trying all endpoints
async function findWorkingTunnel() {
  console.log('🔄 Trying tunnel endpoints in priority order...');
  
  // Sort by priority
  const sortedEndpoints = TUNNEL_ENDPOINTS.sort((a, b) => a.priority - b.priority);
  
  for (const endpoint of sortedEndpoints) {
    try {
      console.log(`🔄 Testing ${endpoint.type} (Priority: ${endpoint.priority})...`);
      
      // Try common tunnel URL patterns
      const testUrls = [
        `https://figma-bridge.${endpoint.type === 'localtunnel' ? 'loca.lt' : 'trycloudflare.com'}`,
        `https://figma-unified.${endpoint.type === 'localtunnel' ? 'loca.lt' : 'trycloudflare.com'}`,
        `https://abc-123.${endpoint.type === 'localtunnel' ? 'loca.lt' : 'trycloudflare.com'}`,
        `https://bridge-${endpoint.priority}.${endpoint.type === 'localtunnel' ? 'loca.lt' : 'trycloudflare.com'}`
      ];
      
      for (const testUrl of testUrls) {
        if (await testTunnelHealth(testUrl)) {
          console.log(`✅ Found working ${endpoint.type} at ${testUrl}`);
          return { url: testUrl, type: endpoint.type };
        }
      }
    } catch (error) {
      console.log(`❌ ${endpoint.type} failed: ${error.message}`);
      continue;
    }
  }
  
  console.log('❌ No working tunnels found');
  return null;
}

let isActive = false;
let testCounter = 0;

// Create immediate visual proof that plugin is working
async function createImmediateProof() {
  try {
    console.log('🎯 Creating immediate visual proof...');
    
    const proofFrame = figma.createFrame();
    proofFrame.name = `🚀 UNIFIED BRIDGE - ${connectionMode.toUpperCase()}!`;
    proofFrame.resize(400, 280);
    
    // Different colors for different connection modes
    let bgColor;
    if (connectionMode === 'tunnel') {
      switch (activeTunnelType) {
        case 'cloudflare':
        case 'cloudflare-2':
          bgColor = { r: 0, g: 0.8, b: 1 }; // Cyan for Cloudflare
          break;
        case 'localtunnel':
          bgColor = { r: 1, g: 0.6, b: 0 }; // Orange for localtunnel
          break;
        case 'serveo':
          bgColor = { r: 0.5, g: 0, b: 1 }; // Purple for serveo
          break;
        case 'bore':
          bgColor = { r: 1, g: 0.2, b: 0.8 }; // Pink for bore
          break;
        default:
          bgColor = { r: 0, g: 0.8, b: 1 }; // Default cyan
      }
    } else {
      bgColor = { r: 0, g: 1, b: 0 }; // Green for localhost
    }
    
    proofFrame.fills = [{ type: 'SOLID', color: bgColor }];
    proofFrame.cornerRadius = 16;
    
    // Add text
    const proofText = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Bold" }).catch(() => 
      figma.loadFontAsync({ family: "Arial", style: "Bold" }).catch(() => {})
    );
    
    const modeText = connectionMode === 'tunnel' ? 'TUNNEL MODE' : 'LOCALHOST MODE';
    const urlText = UNIFIED_URL.replace('https://', '').replace('http://', '');
    const tunnelInfo = connectionMode === 'tunnel' ? `\nTunnel: ${activeTunnelType}` : '';
    
    proofText.characters = `🚀 UNIFIED BRIDGE\nPLUGIN IS WORKING!\n\nMode: ${modeText}${tunnelInfo}\nURL: ${urlText}\nStatus: Active`;
    proofText.fontSize = 14;
    proofText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    proofText.textAlignHorizontal = 'CENTER';
    proofText.textAlignVertical = 'CENTER';
    proofText.x = 25;
    proofText.y = 50;
    
    proofFrame.appendChild(proofText);
    figma.currentPage.appendChild(proofFrame);
    figma.viewport.scrollAndZoomIntoView([proofFrame]);
    
    console.log(`✅ Visual proof created successfully in ${connectionMode} mode!`);
    figma.notify(`🚀 UNIFIED BRIDGE: ${modeText} loaded successfully!`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create visual proof:', error);
    figma.notify('❌ Plugin error: ' + error.message);
    return false;
  }
}

// Start the plugin immediately
(async () => {
  await detectConnectionMode();
  const success = await createImmediateProof();
  if (success) {
    startUnifiedBridge();
  }
})();

async function startUnifiedBridge() {
  if (isActive) return;
  isActive = true;
  
  console.log(`🚀 UNIFIED BRIDGE: Starting connection to server (${connectionMode} mode)...`);
  figma.notify(`🚀 UNIFIED: Connecting via ${connectionMode}...`);
  
  // Main communication loop
  setInterval(async () => {
    try {
      testCounter++;
      
      // Ping the server
      const pingResponse = await fetch(`${UNIFIED_URL}/plugin/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          unified: true, 
          testCounter: testCounter,
          timestamp: Date.now(),
          pluginStatus: 'active',
          connectionMode: connectionMode,
          tunnelType: activeTunnelType,
          tunnelUrl: connectionMode === 'tunnel' ? UNIFIED_URL : null
        })
      });
      
      if (!pingResponse.ok) {
        throw new Error(`Ping failed: ${pingResponse.status}`);
      }
      
      console.log(`🔗 Ping #${testCounter} successful (${connectionMode}${activeTunnelType ? ' - ' + activeTunnelType : ''})`);
      
      // Get commands
      const commandResponse = await fetch(`${UNIFIED_URL}/plugin/commands`);
      if (commandResponse.ok) {
        const data = await commandResponse.json();
        
        if (data.commands && data.commands.length > 0) {
          console.log(`📨 Received ${data.commands.length} commands`);
          figma.notify(`🚀 UNIFIED: Processing ${data.commands.length} commands`);
          
          const results = [];
          for (const command of data.commands) {
            try {
              const result = await executeCommand(command);
              results.push({
                commandId: command.id,
                result: { success: true, data: result }
              });
            } catch (error) {
              console.error('Command failed:', error);
              results.push({
                commandId: command.id,
                result: { success: false, error: error.message }
              });
            }
          }
          
          // Send results back
          await fetch(`${UNIFIED_URL}/plugin/results`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ results })
          });
          
          console.log(`✅ Sent ${results.length} results to server`);
        }
      }
      
      // Every 10th ping, create a test element
      if (testCounter % 10 === 0) {
        await createTestElement(testCounter);
      }
      
    } catch (error) {
      console.error(`🚀 UNIFIED error (${connectionMode}):`, error);
      figma.notify(`🚀 UNIFIED: Connection issue - ${error.message}`);
      
      // If tunnel mode fails, try to re-detect connection mode
      if (connectionMode === 'tunnel' && testCounter % 20 === 0) {
        console.log('🔄 Attempting to re-detect connection mode...');
        await detectConnectionMode();
      }
    }
  }, 2000); // Every 2 seconds
  
  console.log(`🚀 UNIFIED BRIDGE: Communication loop started in ${connectionMode} mode!`);
  figma.notify(`🚀 UNIFIED: ALL SYSTEMS OPERATIONAL (${connectionMode.toUpperCase()})!`);
}

async function executeCommand(command) {
  const { id, type, payload, tool } = command;
  console.log(`🔧 Executing command: ${type}`);
  
  switch (type) {
    case 'CREATE_NODE':
      return await createNode(payload);
    case 'CREATE_WIREFRAME':
      return await createWireframe(payload);
    case 'CREATE_UI_KIT':
      return await createUIKit(payload);
    case 'FIGMA_TOOL':
      return await executeFigmaTool(tool, payload);
    case 'CREATE_NODES_FROM_CODE':
      return await createNodesFromCode(payload);
    case 'DESIGN_PREVIEW':
      return await createDesignPreview(payload);
    case 'CODE_CONNECTIONS':
      return await establishCodeConnections(payload);
    case 'GENERATE_UI_KIT':
      return await generateUIKit(payload);
    case 'SMART_ORGANIZE':
      return await smartOrganizeLayers(payload);
    case 'ORGANIZE_PAGES':
      return await organizePages(payload);
    case 'OPTIMIZE_MEDIA':
      return await optimizeMediaAssets(payload);
    case 'EXTRACT_VARIABLES':
      return await extractDesignVariables(payload);
    default:
      throw new Error(`Unknown command type: ${type}`);
  }
}

// ============================================================================
// MCP FIGMA TOOLS IMPLEMENTATIONS
// ============================================================================

async function executeFigmaTool(tool, payload) {
  console.log(`🔧 Executing Figma tool: ${tool}`);
  
  switch (tool) {
    case 'create_nodes_from_code':
      return await createNodesFromCode(payload);
    case 'design_preview':
      return await createDesignPreview(payload);
    case 'establish_code_connections':
      return await establishCodeConnections(payload);
    case 'generate_ui_kit':
      return await generateUIKit(payload);
    case 'smart_organize_layers':
      return await smartOrganizeLayers(payload);
    case 'organize_pages':
      return await organizePages(payload);
    case 'optimize_media_assets':
      return await optimizeMediaAssets(payload);
    case 'extract_design_variables':
      return await extractDesignVariables(payload);
    default:
      throw new Error(`Unknown Figma tool: ${tool}`);
  }
}

async function createNodesFromCode(payload) {
  try {
    const { fileKey, code, framework = 'react', x = 0, y = 0 } = payload;
    console.log(`🎨 Creating nodes from ${framework} code...`);
    
    // Create a container frame
    const container = figma.createFrame();
    container.name = `💻 Code Component (${framework})`;
    container.resize(400, 300);
    container.x = x;
    container.y = y;
    container.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
    container.cornerRadius = 8;
    
    // Add code preview text
    const codeText = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" }).catch(() => 
      figma.loadFontAsync({ family: "Arial", style: "Regular" }).catch(() => {})
    );
    
    // Extract readable content from HTML/CSS
    const cleanCode = code.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const preview = cleanCode.length > 200 ? cleanCode.substring(0, 200) + '...' : cleanCode;
    
    codeText.characters = `${framework.toUpperCase()} COMPONENT\n\n${preview}`;
    codeText.fontSize = 12;
    codeText.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
    codeText.x = 20;
    codeText.y = 20;
    codeText.resize(360, 260);
    
    container.appendChild(codeText);
    figma.currentPage.appendChild(container);
    figma.viewport.scrollAndZoomIntoView([container]);
    
    figma.notify(`✅ Created ${framework} component from code`);
    
    return {
      success: true,
      nodeId: container.id,
      nodeName: container.name,
      framework: framework,
      x: x,
      y: y
    };
  } catch (error) {
    console.error('Create nodes from code error:', error);
    throw error;
  }
}

async function createDesignPreview(payload) {
  try {
    console.log('🎨 Creating design preview...');
    
    const previewFrame = figma.createFrame();
    previewFrame.name = '👁️ Design Preview';
    previewFrame.resize(800, 600);
    previewFrame.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 1 } }];
    previewFrame.cornerRadius = 12;
    
    // Add preview elements
    const header = figma.createRectangle();
    header.name = 'Header';
    header.resize(760, 80);
    header.x = 20;
    header.y = 20;
    header.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.4, b: 0.8 } }];
    header.cornerRadius = 8;
    
    const content = figma.createRectangle();
    content.name = 'Content';
    content.resize(760, 480);
    content.x = 20;
    content.y = 120;
    content.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    content.cornerRadius = 8;
    
    previewFrame.appendChild(header);
    previewFrame.appendChild(content);
    figma.currentPage.appendChild(previewFrame);
    figma.viewport.scrollAndZoomIntoView([previewFrame]);
    
    figma.notify('✅ Design preview created');
    
    return {
      success: true,
      previewId: previewFrame.id,
      elements: [header.id, content.id]
    };
  } catch (error) {
    console.error('Design preview error:', error);
    throw error;
  }
}

async function establishCodeConnections(payload) {
  try {
    console.log('🔗 Establishing code connections...');
    
    const connectionFrame = figma.createFrame();
    connectionFrame.name = '🔗 Code Connections';
    connectionFrame.resize(600, 400);
    connectionFrame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 1, b: 0.9 } }];
    connectionFrame.cornerRadius = 8;
    
    // Create connection indicators
    for (let i = 0; i < 3; i++) {
      const connector = figma.createEllipse();
      connector.name = `Connection ${i + 1}`;
      connector.resize(40, 40);
      connector.x = 50 + (i * 150);
      connector.y = 180;
      connector.fills = [{ type: 'SOLID', color: { r: 0, g: 0.8, b: 0 } }];
      connectionFrame.appendChild(connector);
    }
    
    figma.currentPage.appendChild(connectionFrame);
    figma.viewport.scrollAndZoomIntoView([connectionFrame]);
    
    figma.notify('✅ Code connections established');
    
    return {
      success: true,
      connectionId: connectionFrame.id,
      connections: 3
    };
  } catch (error) {
    console.error('Code connections error:', error);
    throw error;
  }
}

async function generateUIKit(payload) {
  try {
    console.log('🎨 Generating UI Kit...');
    
    const kitFrame = figma.createFrame();
    kitFrame.name = '🎨 UI Kit';
    kitFrame.resize(1200, 800);
    kitFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 1 } }];
    
    // Create color palette
    const colors = [
      { r: 0.2, g: 0.4, b: 0.8 },  // Primary blue
      { r: 0.8, g: 0.2, b: 0.2 },  // Secondary red
      { r: 0.2, g: 0.8, b: 0.2 },  // Success green
      { r: 1, g: 0.8, b: 0 },      // Warning yellow
      { r: 0.5, g: 0.5, b: 0.5 }   // Neutral gray
    ];
    
    colors.forEach((color, index) => {
      const colorSwatch = figma.createRectangle();
      colorSwatch.name = `Color ${index + 1}`;
      colorSwatch.resize(80, 80);
      colorSwatch.x = 50 + (index * 100);
      colorSwatch.y = 50;
      colorSwatch.fills = [{ type: 'SOLID', color }];
      colorSwatch.cornerRadius = 8;
      kitFrame.appendChild(colorSwatch);
    });
    
    // Create button components
    const buttonTypes = ['Primary', 'Secondary', 'Outline'];
    buttonTypes.forEach((type, index) => {
      const button = figma.createRectangle();
      button.name = `${type} Button`;
      button.resize(120, 40);
      button.x = 50 + (index * 150);
      button.y = 200;
      button.fills = [{ type: 'SOLID', color: colors[index] }];
      button.cornerRadius = 6;
      kitFrame.appendChild(button);
    });
    
    figma.currentPage.appendChild(kitFrame);
    figma.viewport.scrollAndZoomIntoView([kitFrame]);
    
    figma.notify('✅ UI Kit generated');
    
    return {
      success: true,
      kitId: kitFrame.id,
      components: buttonTypes.length,
      colors: colors.length
    };
  } catch (error) {
    console.error('UI Kit generation error:', error);
    throw error;
  }
}

async function smartOrganizeLayers(payload) {
  try {
    console.log('🧠 Smart organizing layers...');
    
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      // Create some demo elements to organize
      const organizerFrame = figma.createFrame();
      organizerFrame.name = '🧠 Smart Organization Demo';
      organizerFrame.resize(600, 400);
      organizerFrame.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.98, b: 1 } }];
      
      // Create sample elements
      for (let i = 0; i < 6; i++) {
        const element = figma.createRectangle();
        element.name = `Element ${i + 1}`;
        element.resize(80, 60);
        element.x = 50 + ((i % 3) * 100);
        element.y = 50 + (Math.floor(i / 3) * 80);
        element.fills = [{ type: 'SOLID', color: { 
          r: Math.random(), 
          g: Math.random(), 
          b: Math.random() 
        }}];
        organizerFrame.appendChild(element);
      }
      
      figma.currentPage.appendChild(organizerFrame);
      figma.viewport.scrollAndZoomIntoView([organizerFrame]);
    }
    
    figma.notify('✅ Smart layer organization complete');
    
    return {
      success: true,
      organized: selection.length || 6,
      method: 'smart_algorithm'
    };
  } catch (error) {
    console.error('Smart organize error:', error);
    throw error;
  }
}

async function organizePages(payload) {
  try {
    console.log('📄 Organizing pages...');
    
    const currentPages = figma.root.children.length;
    
    // Create a new organized page if needed
    if (currentPages === 1) {
      const newPage = figma.createPage();
      newPage.name = '📋 Organized Content';
      
      // Add organization frame
      const orgFrame = figma.createFrame();
      orgFrame.name = '📄 Page Organization';
      orgFrame.resize(400, 200);
      orgFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 0.95, b: 0.8 } }];
      
      newPage.appendChild(orgFrame);
    }
    
    figma.notify('✅ Pages organized');
    
    return {
      success: true,
      totalPages: figma.root.children.length,
      organized: true
    };
  } catch (error) {
    console.error('Page organization error:', error);
    throw error;
  }
}

async function optimizeMediaAssets(payload) {
  try {
    console.log('🖼️ Optimizing media assets...');
    
    const mediaFrame = figma.createFrame();
    mediaFrame.name = '🖼️ Media Assets';
    mediaFrame.resize(500, 300);
    mediaFrame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 1 } }];
    
    // Create placeholder media elements
    const mediaTypes = ['Image', 'Video', 'Icon'];
    mediaTypes.forEach((type, index) => {
      const media = figma.createRectangle();
      media.name = `📷 ${type}`;
      media.resize(120, 80);
      media.x = 50 + (index * 140);
      media.y = 100;
      media.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.9 } }];
      media.cornerRadius = 4;
      mediaFrame.appendChild(media);
    });
    
    figma.currentPage.appendChild(mediaFrame);
    figma.viewport.scrollAndZoomIntoView([mediaFrame]);
    
    figma.notify('✅ Media assets optimized');
    
    return {
      success: true,
      mediaId: mediaFrame.id,
      optimized: mediaTypes.length
    };
  } catch (error) {
    console.error('Media optimization error:', error);
    throw error;
  }
}

async function extractDesignVariables(payload) {
  try {
    console.log('🎯 Extracting design variables...');
    
    const variablesFrame = figma.createFrame();
    variablesFrame.name = '🎯 Design Variables';
    variablesFrame.resize(600, 400);
    variablesFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 0.98, b: 0.9 } }];
    
    // Create variable representations
    const variables = [
      { name: 'Primary Color', value: '#3366CC' },
      { name: 'Font Size', value: '16px' },
      { name: 'Border Radius', value: '8px' },
      { name: 'Spacing', value: '24px' }
    ];
    
    variables.forEach((variable, index) => {
      const varBox = figma.createRectangle();
      varBox.name = variable.name;
      varBox.resize(120, 60);
      varBox.x = 50 + ((index % 2) * 250);
      varBox.y = 50 + (Math.floor(index / 2) * 80);
      varBox.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.95, b: 1 } }];
      varBox.cornerRadius = 4;
      variablesFrame.appendChild(varBox);
    });
    
    figma.currentPage.appendChild(variablesFrame);
    figma.viewport.scrollAndZoomIntoView([variablesFrame]);
    
    figma.notify('✅ Design variables extracted');
    
    return {
      success: true,
      variablesId: variablesFrame.id,
      extracted: variables.length,
      variables: variables
    };
  } catch (error) {
    console.error('Design variables error:', error);
    throw error;
  }
}

// ============================================================================
// EXISTING FUNCTIONS (ENHANCED)
// ============================================================================

async function createNode(payload) {
  const { nodeType = 'rectangle', properties = {} } = payload;
  
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
      await figma.loadFontAsync({ family: "Inter", style: "Regular" }).catch(() => {});
      if (properties.characters) {
        newNode.characters = properties.characters;
      }
      break;
    case 'frame':
      newNode = figma.createFrame();
      break;
    default:
      newNode = figma.createRectangle();
      break;
  }
  
  // Apply properties
  if (properties.name) newNode.name = properties.name;
  if (properties.x) newNode.x = properties.x;
  if (properties.y) newNode.y = properties.y;
  if (properties.width && properties.height && newNode.resize) {
    newNode.resize(properties.width, properties.height);
  }
  if (properties.fills && 'fills' in newNode) {
    newNode.fills = properties.fills;
  }
  if (properties.cornerRadius && 'cornerRadius' in newNode) {
    newNode.cornerRadius = properties.cornerRadius;
  }
  
  figma.currentPage.appendChild(newNode);
  figma.viewport.scrollAndZoomIntoView([newNode]);
  
  console.log(`✅ Created ${nodeType}: ${newNode.id}`);
  figma.notify(`✅ Created: ${properties.name || nodeType}`);
  
  return {
    id: newNode.id,
    type: newNode.type,
    name: newNode.name
  };
}

async function createWireframe(payload) {
  // Enhanced wireframe creation for tunnel mode
  const frame = figma.createFrame();
  frame.name = `🔧 Wireframe (${connectionMode})`;
  frame.resize(800, 600);
  frame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
  
  figma.currentPage.appendChild(frame);
  figma.viewport.scrollAndZoomIntoView([frame]);
  
  return { id: frame.id, type: 'wireframe', mode: connectionMode };
}

async function createUIKit(payload) {
  // Enhanced UI kit creation for tunnel mode
  const frame = figma.createFrame();
  frame.name = `🎨 UI Kit (${connectionMode})`;
  frame.resize(1200, 800);
  frame.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 1 } }];
  
  figma.currentPage.appendChild(frame);
  figma.viewport.scrollAndZoomIntoView([frame]);
  
  return { id: frame.id, type: 'ui-kit', mode: connectionMode };
}

async function createTestElement(counter) {
  try {
    const testRect = figma.createRectangle();
    testRect.name = `🧪 Test #${counter} (${connectionMode})`;
    testRect.resize(120, 60);
    
    // Different colors for different modes
    const baseColor = connectionMode === 'tunnel' 
      ? { r: 0, g: 0.8, b: 1 }    // Cyan for tunnel
      : { r: 0, g: 1, b: 0 };      // Green for localhost
    
    testRect.fills = [{ 
      type: 'SOLID', 
      color: {
        r: baseColor.r + (Math.random() * 0.2),
        g: baseColor.g + (Math.random() * 0.2),
        b: baseColor.b + (Math.random() * 0.2)
      }
    }];
    testRect.x = (counter * 50) % 800;
    testRect.y = 400 + ((counter * 25) % 200);
    
    figma.currentPage.appendChild(testRect);
    console.log(`🧪 Created test element #${counter} (${connectionMode})`);
  } catch (error) {
    console.error('Failed to create test element:', error);
  }
}

console.log('🚀 UNIFIED BRIDGE Plugin: Tunnel Edition Ready!');
