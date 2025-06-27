#!/usr/bin/env node

/**
 * UI Kit Generation Demo Script
 * Demonstrates the new UI Kit Generation MCP tools:
 * - generate_ui_kit: Create complete UI kits with design systems
 * - create_component_library: Organize components using atomic design
 */

const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  fileKey: 'pN5u5fKsz3B3jMcaF1tMKR', // Your Figma file key
  mcpPort: 3000,
  bridgePort: 3002,
  baseUrl: 'http://localhost',
  demos: [
    'mobile_ui_kit',
    'web_app_kit', 
    'dashboard_kit',
    'e_commerce_kit',
    'component_library',
    'comprehensive_kit_system'
  ]
};

// Demo data structures
const DEMO_DATA = {
  mobile_ui_kit: {
    fileKey: CONFIG.fileKey,
    kitType: "mobile_app",
    designSystem: {
      colorPalette: {
        primary: "#007AFF",
        secondary: "#5856D6",
        success: "#34C759",
        warning: "#FF9500",
        error: "#FF3B30"
      },
      typography: {
        fontFamily: "San Francisco",
        fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 32 }
      }
    },
    components: ["buttons", "inputs", "cards", "navigation", "modals", "avatars"]
  },

  web_app_kit: {
    fileKey: CONFIG.fileKey,
    kitType: "web_app", 
    designSystem: {
      colorPalette: {
        primary: "#3B82F6",
        secondary: "#8B5CF6",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444"
      },
      typography: {
        fontFamily: "Inter",
        fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 }
      }
    },
    components: ["buttons", "inputs", "cards", "navigation", "modals", "tables", "forms"]
  },

  dashboard_kit: {
    fileKey: CONFIG.fileKey,
    kitType: "dashboard",
    designSystem: {
      colorPalette: {
        primary: "#1F2937",
        secondary: "#3B82F6", 
        neutral: ["#000000", "#111827", "#374151", "#6B7280", "#D1D5DB", "#FFFFFF"]
      },
      spacing: { baseUnit: 4, scale: [0, 2, 4, 6, 8, 12, 16, 20, 24, 32] }
    },
    components: ["buttons", "inputs", "cards", "tables", "charts", "badges"]
  },

  e_commerce_kit: {
    fileKey: CONFIG.fileKey,
    kitType: "e_commerce",
    designSystem: {
      colorPalette: {
        primary: "#DC2626",
        secondary: "#7C3AED",
        success: "#059669"
      },
      borderRadius: { none: 0, sm: 4, md: 8, lg: 12, full: 9999 }
    },
    components: ["buttons", "inputs", "cards", "navigation", "modals", "avatars", "badges", "sliders"]
  },

  component_library: {
    fileKey: CONFIG.fileKey,
    libraryStructure: {
      foundations: ["colors", "typography", "spacing", "icons"],
      atoms: ["buttons", "inputs", "labels", "icons"],
      molecules: ["forms", "search", "navigation_items"],
      organisms: ["headers", "footers", "sidebars", "modals"],
      templates: ["page_layouts", "dashboards", "forms"],
      pages: ["examples", "documentation"]
    }
  }
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
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
async function demoMobileUIKit() {
  log('📱 DEMO: Generating Mobile App UI Kit', 'info');
  
  const result = makeRequest('generate_ui_kit', DEMO_DATA.mobile_ui_kit);
  
  if (result?.result) {
    log(`✨ Generated mobile UI kit with ${result.result.componentCount} total components`, 'success');
    log(`🎨 Kit Type: ${result.result.kitType}`, 'info');
    log(`🧩 Component Types: ${result.result.kitStructure.components.length}`, 'info');
    
    // Display component breakdown
    console.log('\n📱 Mobile UI Kit Components:');
    result.result.kitStructure.components.forEach((comp, index) => {
      console.log(`  ${index + 1}. ${comp.type}: ${comp.count} variations`);
    });
    
    // Display foundations
    console.log('\n🎨 Design System Foundations:');
    console.log(`  • Colors: ${result.result.kitStructure.foundations.colors.length} definitions`);
    console.log(`  • Typography: ${result.result.kitStructure.foundations.typography.length} styles`);
    console.log(`  • Spacing: ${result.result.kitStructure.foundations.spacing.length} values`);
    console.log(`  • Effects: ${result.result.kitStructure.foundations.effects.length} definitions`);
    
  } else {
    log('Failed to generate mobile UI kit', 'error');
  }
  
  return result;
}

async function demoWebAppKit() {
  log('💻 DEMO: Generating Web App UI Kit', 'info');
  
  const result = makeRequest('generate_ui_kit', DEMO_DATA.web_app_kit);
  
  if (result?.result) {
    log(`✨ Generated web app UI kit with ${result.result.componentCount} total components`, 'success');
    log(`🌐 Kit Type: ${result.result.kitType}`, 'info');
    
    // Display design system
    console.log('\n🎨 Web App Design System:');
    console.log(`  • Primary Color: ${result.result.designSystem.colorPalette.primary}`);
    console.log(`  • Font Family: ${result.result.designSystem.typography.fontFamily}`);
    console.log(`  • Base Spacing: ${result.result.designSystem.spacing.baseUnit}px`);
    
    // Display layouts
    console.log('\n📐 Layout Templates:');
    result.result.kitStructure.layouts.forEach((layout, index) => {
      console.log(`  ${index + 1}. ${layout.name} - ${layout.description}`);
    });
    
  } else {
    log('Failed to generate web app UI kit', 'error');
  }
  
  return result;
}

async function demoDashboardKit() {
  log('📊 DEMO: Generating Dashboard UI Kit', 'info');
  
  const result = makeRequest('generate_ui_kit', DEMO_DATA.dashboard_kit);
  
  if (result?.result) {
    log(`✨ Generated dashboard UI kit with ${result.result.componentCount} total components`, 'success');
    
    // Display component focus
    console.log('\n📊 Dashboard-Specific Components:');
    const dashboardComponents = result.result.kitStructure.components.filter(comp => 
      ['charts', 'tables', 'badges'].includes(comp.type)
    );
    dashboardComponents.forEach(comp => {
      console.log(`  • ${comp.type}: ${comp.count} variations`);
    });
    
    // Display design principles
    console.log('\n🎯 Design Principles:');
    result.result.kitStructure.documentation.designPrinciples.forEach(principle => {
      console.log(`  • ${principle}`);
    });
    
  } else {
    log('Failed to generate dashboard UI kit', 'error');
  }
  
  return result;
}

async function demoECommerceKit() {
  log('🛒 DEMO: Generating E-Commerce UI Kit', 'info');
  
  const result = makeRequest('generate_ui_kit', DEMO_DATA.e_commerce_kit);
  
  if (result?.result) {
    log(`✨ Generated e-commerce UI kit with ${result.result.componentCount} total components`, 'success');
    
    // Display e-commerce specific features
    console.log('\n🛒 E-Commerce Features:');
    console.log(`  • Product Cards: Enhanced for shopping`);
    console.log(`  • Action Buttons: Conversion-optimized`);
    console.log(`  • Trust Indicators: Badges and reviews`);
    console.log(`  • Visual Appeal: Customer-focused design`);
    
    // Display color scheme
    console.log('\n🎨 E-Commerce Color Scheme:');
    console.log(`  • Primary (CTA): ${result.result.designSystem.colorPalette.primary}`);
    console.log(`  • Secondary: ${result.result.designSystem.colorPalette.secondary}`);
    console.log(`  • Success: ${result.result.designSystem.colorPalette.success}`);
    
  } else {
    log('Failed to generate e-commerce UI kit', 'error');
  }
  
  return result;
}

async function demoComponentLibrary() {
  log('⚛️ DEMO: Creating Atomic Design Component Library', 'info');
  
  const result = makeRequest('create_component_library', DEMO_DATA.component_library);
  
  if (result?.result) {
    log(`✨ Created component library with ${result.result.atomicLevels} atomic design levels`, 'success');
    log(`🧩 Total Elements: ${result.result.totalElements}`, 'info');
    
    // Display atomic design structure
    console.log('\n⚛️ Atomic Design Structure:');
    result.result.libraryPages.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page.name} (${page.elements.length} elements)`);
      console.log(`     ${page.description}`);
    });
    
    // Display detailed breakdown
    console.log('\n📋 Detailed Breakdown:');
    console.log(`  🎨 Foundations: ${result.result.libraryStructure.foundations.length} elements`);
    console.log(`  ⚛️ Atoms: ${result.result.libraryStructure.atoms.length} elements`);
    console.log(`  🧬 Molecules: ${result.result.libraryStructure.molecules.length} elements`);
    console.log(`  🦠 Organisms: ${result.result.libraryStructure.organisms.length} elements`);
    console.log(`  📐 Templates: ${result.result.libraryStructure.templates.length} elements`);
    console.log(`  📄 Pages: ${result.result.libraryStructure.pages.length} elements`);
    
  } else {
    log('Failed to create component library', 'error');
  }
  
  return result;
}

async function demoComprehensiveKitSystem() {
  log('🏗️ DEMO: Comprehensive UI Kit System', 'info');
  
  // Create a complete design system scenario
  const designSystemScenario = {
    project: "Modern SaaS Platform",
    scope: "Complete design system with multiple kit types",
    deliverables: ["Mobile app", "Web dashboard", "Marketing site"]
  };
  
  log(`🎯 Project: ${designSystemScenario.project}`, 'info');
  log(`🎯 Scope: ${designSystemScenario.scope}`, 'info');
  log(`📋 Deliverables: ${designSystemScenario.deliverables.join(', ')}`, 'info');
  
  // 1. Generate multiple UI kits
  log('\n1️⃣ Generating mobile app UI kit...', 'info');
  const mobileResult = await demoMobileUIKit();
  
  log('\n2️⃣ Generating web app UI kit...', 'info');
  const webResult = await demoWebAppKit();
  
  log('\n3️⃣ Generating dashboard UI kit...', 'info');
  const dashboardResult = await demoDashboardKit();
  
  // 4. Create component library
  log('\n4️⃣ Creating atomic design component library...', 'info');
  const libraryResult = await demoComponentLibrary();
  
  // 5. Generate specialized kit
  log('\n5️⃣ Creating specialized e-commerce kit...', 'info');
  const ecommerceResult = await demoECommerceKit();
  
  // 6. Summary
  log('\n📊 COMPREHENSIVE UI KIT SYSTEM SUMMARY:', 'success');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const results = [mobileResult, webResult, dashboardResult, ecommerceResult].filter(r => r?.result);
  const libraryResults = libraryResult?.result ? [libraryResult.result] : [];
  
  if (results.length > 0) {
    const totalComponents = results.reduce((sum, result) => sum + (result.result.componentCount || 0), 0);
    console.log(`🧩 Total Components Generated: ${totalComponents}`);
    console.log(`📱 UI Kit Types: ${results.length}`);
    
    results.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.result.kitType.replace('_', ' ').toUpperCase()}: ${result.result.componentCount} components`);
    });
  }
  
  if (libraryResults.length > 0) {
    console.log(`⚛️ Component Library: ${libraryResults[0].atomicLevels} atomic levels`);
    console.log(`📚 Library Elements: ${libraryResults[0].totalElements} total elements`);
  }
  
  console.log(`🎨 Design Systems: ${results.length} complete systems`);
  console.log(`📐 Layout Templates: Multiple responsive layouts`);
  console.log(`🎯 Coverage: Mobile, Web, Dashboard, E-Commerce`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  return {
    uiKits: results,
    componentLibrary: libraryResults,
    totalKits: results.length + libraryResults.length,
    scenario: designSystemScenario
  };
}

// Main execution
async function main() {
  console.log('🚀 UI KIT GENERATION DEMO STARTING');
  console.log('=====================================');
  console.log(`📁 File Key: ${CONFIG.fileKey}`);
  console.log(`🌐 MCP Server: ${CONFIG.baseUrl}:${CONFIG.mcpPort}`);
  console.log(`🔗 Bridge Server: ${CONFIG.baseUrl}:${CONFIG.bridgePort}`);
  console.log('=====================================\n');
  
  try {
    const demos = process.argv.slice(2);
    const selectedDemos = demos.length > 0 ? demos : CONFIG.demos;
    
    for (const demo of selectedDemos) {
      switch (demo) {
        case 'mobile_ui_kit':
          await demoMobileUIKit();
          break;
        case 'web_app_kit':
          await demoWebAppKit();
          break;
        case 'dashboard_kit':
          await demoDashboardKit();
          break;
        case 'e_commerce_kit':
          await demoECommerceKit();
          break;
        case 'component_library':
          await demoComponentLibrary();
          break;
        case 'comprehensive_kit_system':
          await demoComprehensiveKitSystem();
          break;
        default:
          log(`Unknown demo: ${demo}`, 'warning');
      }
      console.log('\n' + '─'.repeat(80) + '\n');
    }
    
    log('🎉 All UI Kit Generation demos completed successfully!', 'success');
    console.log('\n💡 Next Steps:');
    console.log('1. Check your Figma file for the new UI kit structures');
    console.log('2. Use the component library for consistent design patterns');
    console.log('3. Customize the design systems for your brand requirements'); 
    console.log('4. Scale the component variations for your specific needs');
    console.log('5. Document usage guidelines for team collaboration');
    
  } catch (error) {
    log(`Demo execution failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the demo
if (require.main === module) {
  main();
}

module.exports = {
  demoMobileUIKit,
  demoWebAppKit,
  demoDashboardKit,
  demoECommerceKit,
  demoComponentLibrary,
  demoComprehensiveKitSystem,
  CONFIG,
  DEMO_DATA
}; 