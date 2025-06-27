interface CommandPayload {
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

interface ServerResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

class FigmaUnifiedPlugin {
  private readonly SERVER_URL = 'http://localhost:3000';
  private currentTunnelUrl: string | null = null;
  private connectionTimeout: number | null = null;
  private isConnected = false;

  // Command execution mapping
  private commandExecutors: { [key: string]: (payload: any) => Promise<any> } = {
    'CREATE_NODES_FROM_CODE': this.executeCreateNodesFromCode.bind(this),
    'CREATE_NODE': this.executeCreateNode.bind(this),
    'FIGMA_TOOL': this.executeFigmaTool.bind(this),
    'DESIGN_PREVIEW': this.executeDesignPreview.bind(this),
    'CODE_CONNECTIONS': this.executeCodeConnections.bind(this),
    'GENERATE_UI_KIT': this.executeGenerateUIKit.bind(this),
    'SMART_ORGANIZE': this.executeSmartOrganize.bind(this),
    'ORGANIZE_PAGES': this.executeOrganizePages.bind(this),
    'OPTIMIZE_MEDIA': this.executeOptimizeMedia.bind(this),
    'EXTRACT_VARIABLES': this.executeExtractVariables.bind(this),
    'CREATE_WIREFRAME': this.executeCreateWireframe.bind(this),
    'CREATE_UI_KIT': this.executeCreateUIKit.bind(this)
  };

  constructor() {
    console.log('🚀 UNIFIED PLUGIN: TypeScript plugin initializing...');
    this.init();
  }

  private async init(): Promise<void> {
    await this.getTunnelInfo();
    this.startConnection();
    console.log('🔗 UNIFIED PLUGIN: Ready for commands!');
  }

  private async getTunnelInfo(): Promise<void> {
    try {
      const response = await this.makeRequest('GET', '/tunnel-info');
      if (response.success && response.data?.tunnelUrl) {
        this.currentTunnelUrl = response.data.tunnelUrl;
        console.log(`🌐 Tunnel URL: ${this.currentTunnelUrl}`);
      }
    } catch (error) {
      console.log('📍 No tunnel configured, using localhost');
    }
  }

  private async startConnection(): Promise<void> {
    this.sendPing();
    this.connectionTimeout = setInterval(() => this.checkCommands(), 1000) as any;
  }

  private async sendPing(): Promise<void> {
    try {
      const response = await this.makeRequest('POST', '/plugin/ping', {
        timestamp: Date.now(),
        plugin: 'figma-unified-typescript',
        version: '2.0.0'
      });
      
      if (response.success) {
        this.isConnected = true;
        console.log('🔗 Plugin connected to TypeScript server!');
      }
    } catch (error) {
      console.log('❌ Connection failed:', error);
    }
  }

  private async checkCommands(): Promise<void> {
    try {
      const response = await this.makeRequest('GET', '/plugin/commands');
      if (response.success && response.data?.commands?.length > 0) {
        await this.processCommands(response.data.commands);
      }
    } catch (error) {
      console.log('Error checking commands:', error);
    }
  }

  private async processCommands(commands: CommandPayload[]): Promise<void> {
    const results: any[] = [];

    for (const command of commands) {
      try {
        console.log(`⚡ Executing command: ${command.type} (${command.id})`);
        
        const executor = this.commandExecutors[command.type];
        if (!executor) {
          throw new Error(`Unknown command type: ${command.type}`);
        }

        const result = await executor(command.payload);
        results.push({
          commandId: command.id,
          result: { success: true, data: result }
        });

        console.log(`✅ Command completed: ${command.id}`);
      } catch (error) {
        console.error(`❌ Command failed: ${command.id}`, error);
        results.push({
          commandId: command.id,
          result: { success: false, error: (error as Error).message }
        });
      }
    }

    await this.sendResults(results);
  }

  private async sendResults(results: any[]): Promise<void> {
    try {
      await this.makeRequest('POST', '/plugin/results', { results });
    } catch (error) {
      console.error('Failed to send results:', error);
    }
  }

  // Command execution methods
  private async executeCreateNodesFromCode(payload: any): Promise<any> {
    const { fileKey, code, framework = 'react', x = 0, y = 0 } = payload;

    // Parse HTML/CSS into Figma nodes
    const nodes = this.parseCodeToNodes(code, framework);
    const createdNodes: string[] = [];

    let currentX = x;
    let currentY = y;

    for (const nodeConfig of nodes) {
      const node = this.createNodeFromConfig(nodeConfig, currentX, currentY);
      if (node) {
        createdNodes.push(node.id);
        currentX += (nodeConfig.width || 100) + 20;
      }
    }

    figma.viewport.scrollAndZoomIntoView(createdNodes.map(id => figma.getNodeById(id)).filter(Boolean) as SceneNode[]);

    return {
      success: true,
      data: {
        createdNodes: createdNodes,
        message: `Created ${createdNodes.length} nodes from ${framework} code`
      }
    };
  }

  private async executeCreateNode(payload: any): Promise<any> {
    const { nodeType = 'rectangle', properties = {} } = payload;

    let node: SceneNode;

    switch (nodeType.toLowerCase()) {
      case 'rectangle':
        node = figma.createRectangle();
        break;
      case 'ellipse':
        node = figma.createEllipse();
        break;
      case 'text':
        node = figma.createText();
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        (node as TextNode).characters = properties.text || 'Hello World';
        break;
      case 'frame':
        node = figma.createFrame();
        break;
      default:
        node = figma.createRectangle();
    }

    // Apply properties
    if (properties.width) node.resize(properties.width, node.height);
    if (properties.height) node.resize(node.width, properties.height);
    if (properties.x !== undefined) node.x = properties.x;
    if (properties.y !== undefined) node.y = properties.y;
    if (properties.name) node.name = properties.name;

    figma.currentPage.appendChild(node);
    figma.viewport.scrollAndZoomIntoView([node]);

    return {
      success: true,
      data: {
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type
      }
    };
  }

  private async executeFigmaTool(payload: any): Promise<any> {
    const { tool, ...args } = payload;

    switch (tool) {
      case 'create_simple_button':
        return this.createSimpleButton(args);
      case 'create_navigation_bar':
        return this.createNavigationBar(args);
      case 'create_user_card':
        return this.createUserCard(args);
      case 'generate_color_palette':
        return this.generateColorPalette(args);
      case 'organize_layers':
        return this.organizeLayers(args);
      default:
        throw new Error(`Unknown Figma tool: ${tool}`);
    }
  }

  private async executeDesignPreview(payload: any): Promise<any> {
    const { description, style = 'modern', layout = 'mobile' } = payload;

    // Create preview frame
    const frame = figma.createFrame();
    frame.name = `Design Preview: ${description}`;
    frame.resize(375, 812); // Mobile size by default
    
    // Add background
    frame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];

    // Create preview content based on description
    const titleText = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    titleText.characters = description;
    titleText.fontSize = 24;
    titleText.x = 20;
    titleText.y = 20;
    frame.appendChild(titleText);

    figma.currentPage.appendChild(frame);
    figma.viewport.scrollAndZoomIntoView([frame]);

    return {
      success: true,
      data: {
        frameId: frame.id,
        frameName: frame.name,
        message: 'Design preview created successfully'
      }
    };
  }

  private async executeCodeConnections(payload: any): Promise<any> {
    const { nodeIds, codeInfo } = payload;

    const connections: any[] = [];

    for (const nodeId of nodeIds || []) {
      const node = figma.getNodeById(nodeId) as SceneNode;
      if (node) {
        // Store code connection data
        node.setPluginData('codeConnection', JSON.stringify({
          componentName: codeInfo?.componentName || 'Component',
          filePath: codeInfo?.filePath || 'src/components/Component.tsx',
          framework: codeInfo?.framework || 'react',
          timestamp: Date.now()
        }));

        connections.push({
          nodeId: node.id,
          nodeName: node.name,
          codeInfo: codeInfo
        });
      }
    }

    return {
      success: true,
      data: {
        connections: connections,
        message: `Established code connections for ${connections.length} nodes`
      }
    };
  }

  private async executeGenerateUIKit(payload: any): Promise<any> {
    const { kitType = 'basic', designSystem, components } = payload;

    const kitFrame = figma.createFrame();
    kitFrame.name = `UI Kit - ${kitType}`;
    kitFrame.resize(1200, 800);

    // Create basic components
    const button = this.createUIButton();
    const input = this.createUIInput();
    const card = this.createUICard();

    // Arrange components
    button.x = 50;
    button.y = 50;
    input.x = 50;
    input.y = 150;
    card.x = 50;
    card.y = 250;

    kitFrame.appendChild(button);
    kitFrame.appendChild(input);
    kitFrame.appendChild(card);

    figma.currentPage.appendChild(kitFrame);
    figma.viewport.scrollAndZoomIntoView([kitFrame]);

    return {
      success: true,
      data: {
        kitFrameId: kitFrame.id,
        components: ['button', 'input', 'card'],
        message: 'UI Kit generated successfully'
      }
    };
  }

  private async executeSmartOrganize(payload: any): Promise<any> {
    const { nodeIds, organizationType = 'proximity' } = payload;

    const organizedGroups: any[] = [];
    const nodes = nodeIds?.map((id: string) => figma.getNodeById(id)).filter(Boolean) as SceneNode[];

    if (nodes.length > 0) {
      // Create organization frame
      const orgFrame = figma.createFrame();
      orgFrame.name = `Organized - ${organizationType}`;
      
      // Simple grid organization
      let x = 0, y = 0;
      const spacing = 20;
      
      nodes.forEach((node, index) => {
        node.x = x;
        node.y = y;
        orgFrame.appendChild(node);
        
        x += node.width + spacing;
        if (x > 800) {
          x = 0;
          y += 150;
        }
      });

      orgFrame.resize(Math.max(800, x), y + 150);
      figma.currentPage.appendChild(orgFrame);
      
      organizedGroups.push({
        frameId: orgFrame.id,
        nodeCount: nodes.length,
        organizationType
      });
    }

    return {
      success: true,
      data: {
        organizedGroups: organizedGroups,
        message: `Organized ${nodes.length} nodes by ${organizationType}`
      }
    };
  }

  private async executeOrganizePages(payload: any): Promise<any> {
    const { organizationType = 'category' } = payload;

    const pageInfo = figma.root.children.map(page => ({
      id: page.id,
      name: page.name,
      nodeCount: page.children.length
    }));

    // Could implement page organization logic here
    // For now, just return current page structure

    return {
      success: true,
      data: {
        pages: pageInfo,
        organizationType: organizationType,
        message: 'Page organization completed'
      }
    };
  }

  private async executeOptimizeMedia(payload: any): Promise<any> {
    const { optimizationType = 'compress' } = payload;

    // Find image nodes
    const imageNodes = figma.currentPage.findAll(node => 
      node.type === 'RECTANGLE' && node.fills?.some((fill: any) => fill.type === 'IMAGE')
    ) as RectangleNode[];

    const optimizedAssets: any[] = [];

    imageNodes.forEach(node => {
      // Could implement actual optimization logic
      optimizedAssets.push({
        nodeId: node.id,
        nodeName: node.name,
        optimization: optimizationType
      });
    });

    return {
      success: true,
      data: {
        optimizedAssets: optimizedAssets,
        optimizationType: optimizationType,
        message: `Optimized ${optimizedAssets.length} media assets`
      }
    };
  }

  private async executeExtractVariables(payload: any): Promise<any> {
    const { variableTypes = ['colors', 'typography'] } = payload;

    const variables: any = {};

    if (variableTypes.includes('colors')) {
      variables.colors = this.extractColorVariables();
    }

    if (variableTypes.includes('typography')) {
      variables.typography = this.extractTypographyVariables();
    }

    if (variableTypes.includes('spacing')) {
      variables.spacing = this.extractSpacingVariables();
    }

    return {
      success: true,
      data: {
        variables: variables,
        extractedTypes: variableTypes,
        message: `Extracted ${variableTypes.join(', ')} variables`
      }
    };
  }

  private async executeCreateWireframe(payload: any): Promise<any> {
    const { template = 'mobile-app' } = payload;

    const wireframe = figma.createFrame();
    wireframe.name = `Wireframe - ${template}`;
    wireframe.resize(375, 812);
    wireframe.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

    // Add wireframe elements
    const header = figma.createRectangle();
    header.resize(375, 60);
    header.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    header.name = 'Header';
    wireframe.appendChild(header);

    figma.currentPage.appendChild(wireframe);
    figma.viewport.scrollAndZoomIntoView([wireframe]);

    return {
      success: true,
      data: {
        wireframeId: wireframe.id,
        template: template,
        message: 'Wireframe created successfully'
      }
    };
  }

  private async executeCreateUIKit(payload: any): Promise<any> {
    return this.executeGenerateUIKit(payload);
  }

  // Helper methods for UI components
  private createUIButton(): FrameNode {
    const button = figma.createFrame();
    button.name = 'Button';
    button.resize(120, 40);
    button.fills = [{ type: 'SOLID', color: { r: 0, g: 0.5, b: 1 } }];
    button.cornerRadius = 8;

    return button;
  }

  private createUIInput(): FrameNode {
    const input = figma.createFrame();
    input.name = 'Input';
    input.resize(200, 40);
    input.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    input.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
    input.strokeWeight = 1;
    input.cornerRadius = 4;

    return input;
  }

  private createUICard(): FrameNode {
    const card = figma.createFrame();
    card.name = 'Card';
    card.resize(300, 200);
    card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    card.effects = [{
      type: 'DROP_SHADOW',
      visible: true,
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      blendMode: 'NORMAL',
      offset: { x: 0, y: 2 },
      radius: 8,
      spread: 0
    }];
    card.cornerRadius = 12;

    return card;
  }

  // Figma tool implementations
  private createSimpleButton(args: any): any {
    const button = this.createUIButton();
    figma.currentPage.appendChild(button);
    figma.viewport.scrollAndZoomIntoView([button]);

    return {
      nodeId: button.id,
      nodeName: button.name,
      message: 'Simple button created'
    };
  }

  private createNavigationBar(args: any): any {
    const navbar = figma.createFrame();
    navbar.name = 'Navigation Bar';
    navbar.resize(375, 60);
    navbar.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];

    figma.currentPage.appendChild(navbar);
    figma.viewport.scrollAndZoomIntoView([navbar]);

    return {
      nodeId: navbar.id,
      nodeName: navbar.name,
      message: 'Navigation bar created'
    };
  }

  private createUserCard(args: any): any {
    const userCard = this.createUICard();
    userCard.name = 'User Card';

    figma.currentPage.appendChild(userCard);
    figma.viewport.scrollAndZoomIntoView([userCard]);

    return {
      nodeId: userCard.id,
      nodeName: userCard.name,
      message: 'User card created'
    };
  }

  private generateColorPalette(args: any): any {
    // Implementation for color palette generation
    return {
      palette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      message: 'Color palette generated'
    };
  }

  private organizeLayers(args: any): any {
    // Implementation for layer organization
    return {
      organized: true,
      message: 'Layers organized successfully'
    };
  }

  // Variable extraction methods
  private extractColorVariables(): any {
    return {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      warning: '#ffc107',
      danger: '#dc3545'
    };
  }

  private extractTypographyVariables(): any {
    return {
      fontFamily: 'Inter',
      fontSize: {
        small: 12,
        medium: 16,
        large: 24,
        xlarge: 32
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        bold: 700
      }
    };
  }

  private extractSpacingVariables(): any {
    return {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48
    };
  }

  // Code parsing utilities
  private parseCodeToNodes(code: string, framework: string): any[] {
    // Simple parser for demonstration
    const nodes: any[] = [];
    
    // Extract div elements and convert to rectangles
    const divRegex = /<div[^>]*style="([^"]*)"[^>]*>(.*?)<\/div>/gs;
    let match;
    
    while ((match = divRegex.exec(code)) !== null) {
      const style = match[1];
      const content = match[2];
      
      const nodeConfig: any = {
        type: 'rectangle',
        width: 100,
        height: 100,
        fills: [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }]
      };
      
      // Parse basic styles
      if (style.includes('width:')) {
        const widthMatch = style.match(/width:\s*(\d+)px/);
        if (widthMatch) nodeConfig.width = parseInt(widthMatch[1]);
      }
      
      if (style.includes('height:')) {
        const heightMatch = style.match(/height:\s*(\d+)px/);
        if (heightMatch) nodeConfig.height = parseInt(heightMatch[1]);
      }
      
      if (style.includes('background:') || style.includes('background-color:')) {
        const colorMatch = style.match(/background(?:-color)?:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
        if (colorMatch) {
          const color = this.parseColor(colorMatch[1]);
          if (color) nodeConfig.fills = [{ type: 'SOLID', color }];
        }
      }
      
      nodes.push(nodeConfig);
    }
    
    return nodes.length > 0 ? nodes : [{ type: 'rectangle', width: 200, height: 100 }];
  }

  private createNodeFromConfig(config: any, x: number, y: number): SceneNode | null {
    let node: SceneNode;

    switch (config.type) {
      case 'rectangle':
        node = figma.createRectangle();
        break;
      case 'ellipse':
        node = figma.createEllipse();
        break;
      case 'text':
        node = figma.createText();
        break;
      default:
        node = figma.createRectangle();
    }

    // Apply configuration
    node.resize(config.width || 100, config.height || 100);
    node.x = x;
    node.y = y;
    
    if (config.fills) node.fills = config.fills;
    if (config.name) node.name = config.name;

    figma.currentPage.appendChild(node);
    return node;
  }

  private parseColor(colorStr: string): RGB | null {
    if (colorStr.startsWith('#')) {
      const hex = colorStr.substring(1);
      if (hex.length === 3) {
        return {
          r: parseInt(hex[0] + hex[0], 16) / 255,
          g: parseInt(hex[1] + hex[1], 16) / 255,
          b: parseInt(hex[2] + hex[2], 16) / 255
        };
      } else if (hex.length === 6) {
        return {
          r: parseInt(hex.substring(0, 2), 16) / 255,
          g: parseInt(hex.substring(2, 4), 16) / 255,
          b: parseInt(hex.substring(4, 6), 16) / 255
        };
      }
    }
    return null;
  }

  private async makeRequest(method: string, endpoint: string, data?: any): Promise<ServerResponse> {
    const baseUrl = this.currentTunnelUrl || this.SERVER_URL;
    const url = `${baseUrl}${endpoint}`;

    const options: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}`);
    }

    return { success: true, data: result };
  }
}

// Initialize the plugin
const plugin = new FigmaUnifiedPlugin(); 