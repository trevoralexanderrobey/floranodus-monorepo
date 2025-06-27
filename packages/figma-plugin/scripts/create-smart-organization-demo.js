#!/usr/bin/env node

/**
 * Smart Organization Demo Script
 * Demonstrates the new Smart Organization MCP tools:
 * - create_responsive_layouts: Create responsive layouts with auto layout
 * - organize_layers_as_containers: Intelligent layer grouping and organization
 */

const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  fileKey: 'pN5u5fKsz3B3jMcaF1tMKR', // Your Figma file key
  mcpPort: 3000,
  bridgePort: 3002,
  baseUrl: 'http://localhost',
  demos: [
    'responsive_flex_layout',
    'responsive_grid_layout',
    'responsive_stack_layout',
    'proximity_organization',
    'similarity_organization',
    'functional_organization',
    'comprehensive_organization'
  ]
};

// Demo data structures
const DEMO_DATA = {
  responsive_layouts: {
    flex_row: {
      fileKey: CONFIG.fileKey,
      layoutType: "flex_row",
      responsive: {
        breakpoints: ["mobile", "tablet", "desktop"],
        constraints: {
          horizontal: "left_right",
          vertical: "center"
        },
        autoLayout: {
          direction: "horizontal",
          spacing: 16,
          padding: { top: 24, right: 24, bottom: 24, left: 24 },
          alignment: "center",
          wrap: true
        }
      },
      content: [
        { type: "text", properties: { content: "Header Title", fontSize: 24 } },
        { type: "button", properties: { content: "Primary CTA", variant: "primary" } },
        { type: "button", properties: { content: "Secondary", variant: "secondary" } }
      ]
    },

    flex_column: {
      fileKey: CONFIG.fileKey,
      layoutType: "flex_column",
      responsive: {
        breakpoints: ["mobile", "tablet", "desktop", "xl"],
        constraints: {
          horizontal: "center",
          vertical: "top_bottom"
        },
        autoLayout: {
          direction: "vertical",
          spacing: 20,
          padding: { top: 32, right: 24, bottom: 32, left: 24 },
          alignment: "center"
        }
      },
      content: [
        { type: "text", properties: { content: "Page Title", fontSize: 32, weight: "bold" } },
        { type: "text", properties: { content: "Subtitle description", fontSize: 16 } },
        { type: "container", properties: { content: "Content Area", height: 400 } },
        { type: "button", properties: { content: "Call to Action", variant: "primary" } }
      ]
    },

    grid: {
      fileKey: CONFIG.fileKey,
      layoutType: "grid",
      responsive: {
        breakpoints: ["mobile", "tablet", "desktop"],
        constraints: {
          horizontal: "left_right",
          vertical: "top_bottom"
        },
        autoLayout: {
          direction: "vertical",
          spacing: 24,
          padding: { top: 24, right: 24, bottom: 24, left: 24 }
        }
      },
      content: [
        { type: "card", properties: { title: "Card 1", content: "Grid item 1" } },
        { type: "card", properties: { title: "Card 2", content: "Grid item 2" } },
        { type: "card", properties: { title: "Card 3", content: "Grid item 3" } },
        { type: "card", properties: { title: "Card 4", content: "Grid item 4" } },
        { type: "card", properties: { title: "Card 5", content: "Grid item 5" } },
        { type: "card", properties: { title: "Card 6", content: "Grid item 6" } }
      ]
    },

    stack: {
      fileKey: CONFIG.fileKey,
      layoutType: "stack",
      responsive: {
        breakpoints: ["mobile", "desktop"],
        constraints: {
          horizontal: "center",
          vertical: "center"
        },
        autoLayout: {
          direction: "vertical",
          spacing: 12,
          padding: { top: 20, right: 20, bottom: 20, left: 20 },
          alignment: "center"
        }
      },
      content: [
        { type: "image", properties: { width: 200, height: 150, alt: "Hero image" } },
        { type: "text", properties: { content: "Overlay Title", fontSize: 20, color: "white" } },
        { type: "text", properties: { content: "Subtitle", fontSize: 14, color: "white" } }
      ]
    }
  },

  layer_organization: {
    proximity_based: {
      fileKey: CONFIG.fileKey,
      organizationRules: {
        groupBy: ["proximity"],
        containerTypes: ["frame", "auto_layout"],
        namingConvention: "Proximity Group {number}",
        preserveHierarchy: true,
        createComponents: false
      },
      analysisOptions: {
        proximityThreshold: 100,
        minGroupSize: 2,
        maxGroupSize: 8
      }
    },

    similarity_based: {
      fileKey: CONFIG.fileKey,
      organizationRules: {
        groupBy: ["similarity"],
        containerTypes: ["auto_layout", "component"],
        namingConvention: "Similar {type} Group",
        preserveHierarchy: false,
        createComponents: true
      },
      analysisOptions: {
        similarityThreshold: 0.8,
        minGroupSize: 3,
        maxGroupSize: 6
      }
    },

    functional_based: {
      fileKey: CONFIG.fileKey,
      organizationRules: {
        groupBy: ["function"],
        containerTypes: ["section", "frame"],
        namingConvention: "Section {number} - {type}",
        preserveHierarchy: true,
        createComponents: false
      },
      analysisOptions: {
        minGroupSize: 2,
        maxGroupSize: 12
      }
    },

    comprehensive: {
      fileKey: CONFIG.fileKey,
      organizationRules: {
        groupBy: ["proximity", "similarity", "hierarchy", "function"],
        containerTypes: ["section", "frame", "auto_layout", "component"],
        namingConvention: "Smart Container {number}",
        preserveHierarchy: true,
        createComponents: true
      },
      analysisOptions: {
        proximityThreshold: 75,
        similarityThreshold: 0.7,
        minGroupSize: 2,
        maxGroupSize: 10
      }
    }
  }
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️', demo: '🎪' };
  console.log(`${icons[type]} [${timestamp}] ${message}`);
}

function makeRequest(tool, args) {
  const payload = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: "tools/call",
    params: {
      name: tool,
      arguments: args
    }
  };

  const command = `curl -s -X POST \\
    -H "Content-Type: application/json" \\
    -d '${JSON.stringify(payload)}' \\
    ${CONFIG.baseUrl}:${CONFIG.mcpPort}/`;

  try {
    const response = execSync(command, { encoding: 'utf8' });
    return JSON.parse(response);
  } catch (error) {
    log(`Request failed: ${error.message}`, 'error');
    return null;
  }
}

// Demo functions
async function demoResponsiveLayout() {
  log('📱 DEMO: Creating Responsive Layout', 'demo');
  
  const result = makeRequest('create_responsive_layouts', DEMO_DATA.responsive_layouts.flex_row);
  
  if (result?.result) {
    log(`✨ Created responsive layout for ${result.result.breakpointCount} breakpoints`, 'success');
    log(`📐 Layout Type: ${result.result.layoutType}`, 'info');
  } else {
    log('Failed to create responsive layout', 'error');
  }
  
  return result;
}

async function demoLayerOrganization() {
  log('🔍 DEMO: Organizing Layers by Proximity', 'demo');
  
  const result = makeRequest('organize_layers_as_containers', DEMO_DATA.layer_organization.proximity_based);
  
  if (result?.result) {
    log(`✨ Organized ${result.result.organizationStats?.totalLayers || 0} layers`, 'success');
  } else {
    log('Failed to organize layers', 'error');
  }
  
  return result;
}

// Main execution
async function main() {
  console.log('🚀 SMART ORGANIZATION DEMO STARTING');
  console.log('====================================');
  
  try {
    await demoResponsiveLayout();
    console.log('\n' + '─'.repeat(80) + '\n');
    await demoLayerOrganization();
    
    log('🎉 Smart Organization demos completed!', 'success');
    
  } catch (error) {
    log(`Demo execution failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the demo
if (require.main === module) {
  main();
}

module.exports = { demoResponsiveLayout, demoLayerOrganization, CONFIG, DEMO_DATA }; 