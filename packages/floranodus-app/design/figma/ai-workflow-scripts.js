#!/usr/bin/env node

/**
 * 🚀 Floranodus AI Figma Workflow Scripts
 * Automate Figma design creation using MCP tools
 */

const axios = require('axios');

const FIGMA_BRIDGE_URL = 'http://localhost:3000';
const FIGMA_FILE_ID = 'LbrzdzgGO3hn6mZv8OAQzy';

class FloranodusAIWorkflow {
  constructor() {
    this.bridgeUrl = FIGMA_BRIDGE_URL;
    this.fileId = FIGMA_FILE_ID;
  }

  // 🎨 Generate AI-powered UI components
  async generateAIComponents(components) {
    console.log('🎨 Generating AI components:', components);
    
    try {
      const response = await axios.post(`${this.bridgeUrl}/figma-tools`, {
        name: 'create_nodes_from_code',
        arguments: {
          components: components,
          fileId: this.fileId,
          framework: 'react'
        }
      });
      
      console.log('✅ AI components generated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to generate AI components:', error.message);
      throw error;
    }
  }

  // 🚀 Create Floranodus canvas nodes
  async createCanvasNodes(nodeSpecs) {
    console.log('🚀 Creating canvas nodes:', nodeSpecs.length);
    
    const results = [];
    for (const nodeSpec of nodeSpecs) {
      try {
        const response = await axios.post(`${this.bridgeUrl}/create-node`, {
          nodeType: nodeSpec.type || 'frame',
          properties: {
            name: `🔮 ${nodeSpec.name || 'AI Node'}`,
            x: nodeSpec.x || Math.random() * 400,
            y: nodeSpec.y || Math.random() * 400,
            width: nodeSpec.width || 200,
            height: nodeSpec.height || 150,
            fills: nodeSpec.fills || [{ 
              type: 'SOLID', 
              color: { r: 0.1, g: 0.1, b: 0.1 } 
            }],
            cornerRadius: 8,
            ...nodeSpec.properties
          }
        });
        
        results.push(response.data);
        console.log(`✅ Created node: ${nodeSpec.name}`);
      } catch (error) {
        console.error(`❌ Failed to create node ${nodeSpec.name}:`, error.message);
      }
    }
    
    return results;
  }

  // 🎯 Generate complete Floranodus interface
  async generateFloranodusInterface() {
    console.log('🎯 Generating complete Floranodus interface...');
    
    const interfaceComponents = [
      {
        name: 'Canvas Container',
        type: 'frame',
        x: 0,
        y: 0,
        width: 1200,
        height: 800,
        fills: [{ type: 'SOLID', color: { r: 0.04, g: 0.04, b: 0.04 } }]
      },
      {
        name: 'AI Node - Text Generation',
        type: 'auto_layout_frame',
        x: 100,
        y: 100,
        width: 250,
        height: 150,
        fills: [{ type: 'SOLID', color: { r: 0.12, g: 0.12, b: 0.12 } }],
        properties: {
          layoutMode: 'VERTICAL',
          itemSpacing: 8,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16
        }
      },
      {
        name: 'AI Node - Image Generation',
        type: 'auto_layout_frame',
        x: 400,
        y: 100,
        width: 250,
        height: 150,
        fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.1, b: 0.3 } }]
      },
      {
        name: 'AI Node - Code Generation',
        type: 'auto_layout_frame',
        x: 700,
        y: 100,
        width: 250,
        height: 150,
        fills: [{ type: 'SOLID', color: { r: 0.1, g: 0.3, b: 0.2 } }]
      },
      {
        name: 'Connection Line',
        type: 'line',
        x: 350,
        y: 175,
        width: 50,
        height: 0
      }
    ];
    
    return await this.createCanvasNodes(interfaceComponents);
  }

  // 📱 Bulk create UI elements from data
  async bulkCreateFromData(data) {
    console.log('📱 Bulk creating UI elements from data:', data.length, 'items');
    
    const elements = data.map((item, index) => ({
      name: item.name || `Element ${index + 1}`,
      type: item.type || 'rectangle',
      x: (index % 5) * 220 + 50,
      y: Math.floor(index / 5) * 120 + 50,
      width: item.width || 200,
      height: item.height || 100,
      fills: item.color ? [{ 
        type: 'SOLID', 
        color: item.color 
      }] : [{ 
        type: 'SOLID', 
        color: { 
          r: Math.random(), 
          g: Math.random(), 
          b: Math.random() 
        } 
      }],
      properties: item.properties || {}
    }));
    
    return await this.createCanvasNodes(elements);
  }

  // 🔍 Check bridge status
  async checkBridgeStatus() {
    try {
      const response = await axios.get(`${this.bridgeUrl}/health`);
      console.log('🔍 Bridge status:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Bridge not accessible:', error.message);
      throw error;
    }
  }
}

// Export for use in other scripts
module.exports = FloranodusAIWorkflow;

// CLI usage
if (require.main === module) {
  const workflow = new FloranodusAIWorkflow();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'status':
      workflow.checkBridgeStatus();
      break;
    case 'generate-interface':
      workflow.generateFloranodusInterface();
      break;
    case 'test-ai':
      workflow.generateAIComponents(['button', 'input', 'card']);
      break;
    default:
      console.log(`
🚀 Floranodus AI Figma Workflow

Usage:
  node ai-workflow-scripts.js status              # Check bridge status
  node ai-workflow-scripts.js generate-interface  # Generate full interface
  node ai-workflow-scripts.js test-ai            # Test AI generation
      `);
  }
} 