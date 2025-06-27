#!/usr/bin/env node

/**
 * Test Script for Page Organization MCP Tools
 * Tests: create_organized_pages, manage_design_status, create_scratchpad_system
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Test configuration
const CONFIG = {
  fileKey: 'pN5u5fKsz3B3jMcaF1tMKR',
  mcpPort: 3000,
  baseUrl: 'http://localhost',
  outputDir: 'tests'
};

// Test data
const TEST_DATA = {
  organized_pages: {
    fileKey: CONFIG.fileKey,
    pageStructure: {
      categories: ["wireframes", "components"],
      milestones: ["sprint_1", "launch"],
      projects: ["mobile_app", "web_app"]
    }
  },
  
  design_status: {
    fileKey: CONFIG.fileKey,
    statusSystem: {
      statuses: ["todo", "in_progress", "review", "approved"],
      priority: "high",
      assignee: "Test User",
      currentStatus: "in_progress"
    }
  },
  
  scratchpad_system: {
    fileKey: CONFIG.fileKey,
    scratchpadTypes: ["quick_ideas", "experiments"],
    organizationMethod: "by_date"
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
    const startTime = Date.now();
    const response = execSync(command, { encoding: 'utf8' });
    const endTime = Date.now();
    
    const result = JSON.parse(response);
    result._testMetadata = {
      executionTime: endTime - startTime,
      timestamp: new Date().toISOString()
    };
    
    return result;
  } catch (error) {
    log(`Request failed: ${error.message}`, 'error');
    return { error: error.message };
  }
}

function saveTestResult(testName, result) {
  const filename = `${CONFIG.outputDir}/test-page-organization-${testName}.json`;
  try {
    fs.writeFileSync(filename, JSON.stringify(result, null, 2));
    log(`Test result saved: ${filename}`, 'info');
  } catch (error) {
    log(`Failed to save test result: ${error.message}`, 'error');
  }
}

// Test functions
async function testOrganizedPages() {
  log('🧪 Testing create_organized_pages...', 'info');
  
  const result = makeRequest('create_organized_pages', TEST_DATA.organized_pages);
  
  // Validate response
  if (result.error) {
    log(`❌ create_organized_pages failed: ${result.error}`, 'error');
    return { success: false, error: result.error };
  }
  
  if (!result.result) {
    log('❌ create_organized_pages: No result returned', 'error');
    return { success: false, error: 'No result returned' };
  }
  
  // Validate structure
  const data = result.result;
  const validations = [
    { check: data.success === true, message: 'Success flag is true' },
    { check: Array.isArray(data.pagesToCreate), message: 'Pages array exists' },
    { check: data.totalPages > 0, message: 'Total pages count is positive' },
    { check: data.pagesToCreate.length === data.totalPages, message: 'Page count matches array length' },
    { check: data.fileKey === CONFIG.fileKey, message: 'File key matches input' }
  ];
  
  const passed = validations.filter(v => v.check).length;
  const total = validations.length;
  
  if (passed === total) {
    log(`✅ create_organized_pages: ${passed}/${total} validations passed (${result._testMetadata.executionTime}ms)`, 'success');
    
    // Log page structure
    console.log('📋 Created Page Structure:');
    data.pagesToCreate.forEach((page, index) => {
      const indent = '  '.repeat(page.organizationLevel || 0);
      console.log(`${indent}${index + 1}. ${page.name} (${page.type})`);
    });
    
    saveTestResult('organized-pages', result);
    return { success: true, data, executionTime: result._testMetadata.executionTime };
  } else {
    log(`❌ create_organized_pages: ${passed}/${total} validations passed`, 'error');
    validations.forEach(v => {
      if (!v.check) log(`  • ${v.message}`, 'error');
    });
    return { success: false, validations };
  }
}

async function testDesignStatus() {
  log('🧪 Testing manage_design_status...', 'info');
  
  const result = makeRequest('manage_design_status', TEST_DATA.design_status);
  
  // Validate response
  if (result.error) {
    log(`❌ manage_design_status failed: ${result.error}`, 'error');
    return { success: false, error: result.error };
  }
  
  if (!result.result) {
    log('❌ manage_design_status: No result returned', 'error');
    return { success: false, error: 'No result returned' };
  }
  
  // Validate structure
  const data = result.result;
  const validations = [
    { check: data.success === true, message: 'Success flag is true' },
    { check: data.statusConfig && typeof data.statusConfig === 'object', message: 'Status config exists' },
    { check: Array.isArray(data.statusConfig.availableStatuses), message: 'Available statuses array exists' },
    { check: Array.isArray(data.statusConfig.priorityLevels), message: 'Priority levels array exists' },
    { check: Array.isArray(data.dashboardElements), message: 'Dashboard elements array exists' },
    { check: data.fileKey === CONFIG.fileKey, message: 'File key matches input' }
  ];
  
  const passed = validations.filter(v => v.check).length;
  const total = validations.length;
  
  if (passed === total) {
    log(`✅ manage_design_status: ${passed}/${total} validations passed (${result._testMetadata.executionTime}ms)`, 'success');
    
    // Log status system
    console.log('📊 Status System Created:');
    console.log(`  • Statuses: ${data.statusConfig.availableStatuses.join(', ')}`);
    console.log(`  • Priority Levels: ${data.statusConfig.priorityLevels.join(', ')}`);
    console.log(`  • Dashboard Elements: ${data.dashboardElements.length}`);
    
    saveTestResult('design-status', result);
    return { success: true, data, executionTime: result._testMetadata.executionTime };
  } else {
    log(`❌ manage_design_status: ${passed}/${total} validations passed`, 'error');
    validations.forEach(v => {
      if (!v.check) log(`  • ${v.message}`, 'error');
    });
    return { success: false, validations };
  }
}

async function testScratchpadSystem() {
  log('🧪 Testing create_scratchpad_system...', 'info');
  
  const result = makeRequest('create_scratchpad_system', TEST_DATA.scratchpad_system);
  
  // Validate response
  if (result.error) {
    log(`❌ create_scratchpad_system failed: ${result.error}`, 'error');
    return { success: false, error: result.error };
  }
  
  if (!result.result) {
    log('❌ create_scratchpad_system: No result returned', 'error');
    return { success: false, error: 'No result returned' };
  }
  
  // Validate structure
  const data = result.result;
  const validations = [
    { check: data.success === true, message: 'Success flag is true' },
    { check: Array.isArray(data.scratchpadPages), message: 'Scratchpad pages array exists' },
    { check: data.totalPages > 0, message: 'Total pages count is positive' },
    { check: data.scratchpadPages.length === data.totalPages, message: 'Page count matches array length' },
    { check: data.organizationMethod === TEST_DATA.scratchpad_system.organizationMethod, message: 'Organization method matches' },
    { check: data.fileKey === CONFIG.fileKey, message: 'File key matches input' }
  ];
  
  const passed = validations.filter(v => v.check).length;
  const total = validations.length;
  
  if (passed === total) {
    log(`✅ create_scratchpad_system: ${passed}/${total} validations passed (${result._testMetadata.executionTime}ms)`, 'success');
    
    // Log scratchpad pages
    console.log('💡 Scratchpad Pages Created:');
    data.scratchpadPages.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page.name} (${page.type})`);
      if (page.pageStructure && page.pageStructure.sections) {
        page.pageStructure.sections.forEach(section => {
          console.log(`     • ${section}`);
        });
      }
    });
    
    saveTestResult('scratchpad-system', result);
    return { success: true, data, executionTime: result._testMetadata.executionTime };
  } else {
    log(`❌ create_scratchpad_system: ${passed}/${total} validations passed`, 'error');
    validations.forEach(v => {
      if (!v.check) log(`  • ${v.message}`, 'error');
    });
    return { success: false, validations };
  }
}

// Main test execution
async function runAllTests() {
  console.log('🚀 PAGE ORGANIZATION TESTS STARTING');
  console.log('=====================================');
  console.log(`📁 File Key: ${CONFIG.fileKey}`);
  console.log(`🌐 MCP Server: ${CONFIG.baseUrl}:${CONFIG.mcpPort}`);
  console.log('=====================================\n');
  
  const testResults = [];
  
  try {
    // Test 1: Organized Pages
    const organizedPagesResult = await testOrganizedPages();
    testResults.push({
      test: 'create_organized_pages',
      ...organizedPagesResult
    });
    
    console.log('\n' + '─'.repeat(50) + '\n');
    
    // Test 2: Design Status  
    const designStatusResult = await testDesignStatus();
    testResults.push({
      test: 'manage_design_status',
      ...designStatusResult
    });
    
    console.log('\n' + '─'.repeat(50) + '\n');
    
    // Test 3: Scratchpad System
    const scratchpadResult = await testScratchpadSystem();
    testResults.push({
      test: 'create_scratchpad_system',
      ...scratchpadResult
    });
    
    // Test Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 PAGE ORGANIZATION TEST SUMMARY');
    console.log('='.repeat(50));
    
    const passedTests = testResults.filter(r => r.success).length;
    const totalTests = testResults.length;
    const totalTime = testResults.reduce((sum, r) => sum + (r.executionTime || 0), 0);
    
    testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const time = result.executionTime ? `(${result.executionTime}ms)` : '';
      console.log(`${status} ${result.test} ${time}`);
    });
    
    console.log('─'.repeat(50));
    console.log(`📈 Success Rate: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);
    console.log(`⏱️ Total Execution Time: ${totalTime}ms`);
    
    // Save comprehensive results
    const comprehensiveResults = {
      timestamp: new Date().toISOString(),
      summary: {
        passedTests,
        totalTests,
        successRate: Math.round(passedTests/totalTests*100),
        totalExecutionTime: totalTime
      },
      tests: testResults
    };
    
    saveTestResult('comprehensive', { result: comprehensiveResults });
    
    if (passedTests === totalTests) {
      log('🎉 All Page Organization tests passed!', 'success');
      process.exit(0);
    } else {
      log(`⚠️ ${totalTests - passedTests} test(s) failed`, 'warning');
      process.exit(1);
    }
    
  } catch (error) {
    log(`Test execution failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testOrganizedPages,
  testDesignStatus,
  testScratchpadSystem,
  runAllTests,
  CONFIG,
  TEST_DATA
}; 