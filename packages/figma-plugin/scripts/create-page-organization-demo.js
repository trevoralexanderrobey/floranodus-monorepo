#!/usr/bin/env node

/**
 * Page Organization Demo Script
 * Demonstrates the new Page Organization MCP tools:
 * - create_organized_pages: Create structured page hierarchies
 * - manage_design_status: Status tracking and project management
 * - create_scratchpad_system: Organized scratchpad pages for ideation
 */

const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  fileKey: 'pN5u5fKsz3B3jMcaF1tMKR', // Your Figma file key
  mcpPort: 3000,
  bridgePort: 3002,
  baseUrl: 'http://localhost',
  demos: [
    'organized_pages',
    'status_tracking', 
    'scratchpad_system',
    'comprehensive_organization'
  ]
};

// Demo data structures
const DEMO_DATA = {
  organized_pages: {
    pageStructure: {
      categories: ["wireframes", "components", "prototypes", "assets"],
      milestones: ["sprint_1", "sprint_2", "launch", "iteration"],
      projects: ["mobile_app", "web_app", "design_system"]
    }
  },
  
  status_tracking: {
    statusSystem: {
      statuses: ["todo", "in_progress", "review", "approved", "archived"],
      priority: "high",
      assignee: "Design Team",
      dueDate: "2024-02-15T00:00:00.000Z",
      currentStatus: "in_progress"
    }
  },

  scratchpad_system: [
    {
      scratchpadTypes: ["quick_ideas", "experiments"],
      organizationMethod: "by_date"
    },
    {
      scratchpadTypes: ["mood_boards", "inspiration"],
      organizationMethod: "by_project"
    },
    {
      scratchpadTypes: ["quick_ideas", "mood_boards"],
      organizationMethod: "by_theme"
    },
    {
      scratchpadTypes: ["experiments", "inspiration"],
      organizationMethod: "by_status"
    }
  ]
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
async function demoOrganizedPages() {
  log('🗂️ DEMO: Creating Organized Page Structure', 'info');
  
  const result = makeRequest('create_organized_pages', {
    fileKey: CONFIG.fileKey,
    ...DEMO_DATA.organized_pages
  });
  
  if (result?.result) {
    log(`✨ Created ${result.result.totalPages} organized pages`, 'success');
    log(`📁 Categories: ${DEMO_DATA.organized_pages.pageStructure.categories.join(', ')}`, 'info');
    log(`🎯 Milestones: ${DEMO_DATA.organized_pages.pageStructure.milestones.join(', ')}`, 'info');
    log(`🚀 Projects: ${DEMO_DATA.organized_pages.pageStructure.projects.join(', ')}`, 'info');
    
    // Display page structure
    console.log('\n📋 Page Structure Created:');
    result.result.pagesToCreate.forEach((page, index) => {
      const indent = '  '.repeat(page.organizationLevel);
      console.log(`${indent}${index + 1}. ${page.name}`);
    });
  } else {
    log('Failed to create organized pages', 'error');
  }
  
  return result;
}

async function demoStatusTracking() {
  log('📊 DEMO: Setting Up Status Tracking System', 'info');
  
  const result = makeRequest('manage_design_status', {
    fileKey: CONFIG.fileKey,
    ...DEMO_DATA.status_tracking
  });
  
  if (result?.result) {
    log('✨ Status tracking system created', 'success');
    log(`📈 Available statuses: ${result.result.statusConfig.availableStatuses.join(', ')}`, 'info');
    log(`⚡ Priority levels: ${result.result.statusConfig.priorityLevels.join(', ')}`, 'info');
    
    // Display dashboard elements
    console.log('\n📊 Status Dashboard Elements:');
    result.result.dashboardElements.forEach((element, index) => {
      console.log(`  ${index + 1}. ${element.name} (${element.type})`);
    });
    
    // Display status colors
    console.log('\n🎨 Status Color Coding:');
    Object.entries(result.result.statusConfig.statusColors).forEach(([status, color]) => {
      const icon = result.result.dashboardElements[0].statuses.find(s => s.name === status)?.icon || '⭕';
      console.log(`  ${icon} ${status}: RGB(${Math.round(color.r*255)}, ${Math.round(color.g*255)}, ${Math.round(color.b*255)})`);
    });
  } else {
    log('Failed to create status tracking system', 'error');
  }
  
  return result;
}

async function demoScratchpadSystem() {
  log('💡 DEMO: Creating Scratchpad Organization System', 'info');
  
  const allResults = [];
  
  for (const [index, scratchpadConfig] of DEMO_DATA.scratchpad_system.entries()) {
    log(`Creating scratchpad set ${index + 1}: ${scratchpadConfig.organizationMethod}`, 'info');
    
    const result = makeRequest('create_scratchpad_system', {
      fileKey: CONFIG.fileKey,
      ...scratchpadConfig
    });
    
    if (result?.result) {
      log(`✨ Created ${result.result.totalPages} scratchpad pages (${scratchpadConfig.organizationMethod})`, 'success');
      
      // Display pages created
      console.log(`\n📝 Scratchpad Pages (${scratchpadConfig.organizationMethod}):`);
      result.result.scratchpadPages.forEach((page, pageIndex) => {
        console.log(`  ${pageIndex + 1}. ${page.name}`);
        if (page.pageStructure && page.pageStructure.sections) {
          page.pageStructure.sections.forEach(section => {
            console.log(`     • ${section}`);
          });
        }
      });
      
      allResults.push(result);
    } else {
      log(`Failed to create scratchpad system: ${scratchpadConfig.organizationMethod}`, 'error');
    }
  }
  
  return allResults;
}

async function demoComprehensiveOrganization() {
  log('🏗️ DEMO: Comprehensive Project Organization', 'info');
  
  // Create a realistic project scenario
  const projectScenario = {
    projectName: "E-Commerce Mobile App",
    timeline: "8-week sprint cycle",
    team: ["UX Designer", "UI Designer", "Developer", "Product Manager"]
  };
  
  log(`🎯 Scenario: ${projectScenario.projectName}`, 'info');
  log(`⏱️ Timeline: ${projectScenario.timeline}`, 'info');
  log(`👥 Team: ${projectScenario.team.join(', ')}`, 'info');
  
  // 1. Create organized page structure
  log('\n1️⃣ Setting up page organization...', 'info');
  const pagesResult = await demoOrganizedPages();
  
  // 2. Set up status tracking
  log('\n2️⃣ Implementing status tracking...', 'info');
  const statusResult = await demoStatusTracking();
  
  // 3. Create scratchpad systems
  log('\n3️⃣ Creating scratchpad systems...', 'info');
  const scratchpadResults = await demoScratchpadSystem();
  
  // 4. Create project timeline with specific status updates
  log('\n4️⃣ Creating project timeline...', 'info');
  
  const milestoneStatuses = [
    { milestone: "Sprint 1", status: "approved", priority: "high" },
    { milestone: "Sprint 2", status: "in_progress", priority: "high" },
    { milestone: "Launch", status: "todo", priority: "urgent" },
    { milestone: "Iteration", status: "todo", priority: "medium" }
  ];
  
  for (const milestone of milestoneStatuses) {
    const result = makeRequest('manage_design_status', {
      fileKey: CONFIG.fileKey,
      statusSystem: {
        currentStatus: milestone.status,
        priority: milestone.priority,
        assignee: "Project Team",
        dueDate: "2024-02-29T00:00:00.000Z"
      }
    });
    
    if (result?.result) {
      log(`📌 ${milestone.milestone}: ${milestone.status} (${milestone.priority} priority)`, 'success');
    }
  }
  
  // 5. Summary
  log('\n📊 COMPREHENSIVE ORGANIZATION SUMMARY:', 'success');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (pagesResult?.result) {
    console.log(`📁 Pages Created: ${pagesResult.result.totalPages}`);
  }
  
  if (statusResult?.result) {
    console.log(`📊 Status System: ${statusResult.result.statusConfig.availableStatuses.length} statuses`);
    console.log(`⚡ Priority Levels: ${statusResult.result.statusConfig.priorityLevels.length} levels`);
  }
  
  if (scratchpadResults.length > 0) {
    const totalScratchpadPages = scratchpadResults.reduce((sum, result) => 
      sum + (result?.result?.totalPages || 0), 0
    );
    console.log(`💡 Scratchpad Pages: ${totalScratchpadPages} across ${scratchpadResults.length} organization methods`);
  }
  
  console.log(`🎯 Project Milestones: ${milestoneStatuses.length} tracked`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  return {
    pages: pagesResult,
    status: statusResult,
    scratchpads: scratchpadResults,
    milestones: milestoneStatuses
  };
}

// Main execution
async function main() {
  console.log('🚀 PAGE ORGANIZATION DEMO STARTING');
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
        case 'organized_pages':
          await demoOrganizedPages();
          break;
        case 'status_tracking':
          await demoStatusTracking();
          break;
        case 'scratchpad_system':
          await demoScratchpadSystem();
          break;
        case 'comprehensive_organization':
          await demoComprehensiveOrganization();
          break;
        default:
          log(`Unknown demo: ${demo}`, 'warning');
      }
      console.log('\n' + '─'.repeat(50) + '\n');
    }
    
    log('🎉 All Page Organization demos completed successfully!', 'success');
    console.log('\n💡 Next Steps:');
    console.log('1. Check your Figma file for the new organized structure');
    console.log('2. Use the status tracking system for project management');
    console.log('3. Utilize scratchpad pages for ideation and experimentation');
    console.log('4. Customize the organization methods for your workflow');
    
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
  demoOrganizedPages,
  demoStatusTracking,
  demoScratchpadSystem,
  demoComprehensiveOrganization,
  CONFIG,
  DEMO_DATA
}; 