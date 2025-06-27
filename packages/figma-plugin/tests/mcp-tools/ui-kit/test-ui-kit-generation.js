#!/usr/bin/env node

/**
 * Test Script for UI Kit Generation MCP Tools
 * Tests: generate_ui_kit, create_component_library
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
  generate_ui_kit: {
    mobile_app: {
      fileKey: CONFIG.fileKey,
      kitType: "mobile_app",
      designSystem: {
        colorPalette: {
          primary: "#007AFF",
          secondary: "#5856D6",
          success: "#34C759"
        },
        typography: {
          fontFamily: "San Francisco",
          fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 32 }
        }
      },
      components: ["buttons", "inputs", "cards", "navigation"]
    },
    
    web_app: {
      fileKey: CONFIG.fileKey,
      kitType: "web_app",
      designSystem: {
        colorPalette: {
          primary: "#3B82F6",
          secondary: "#8B5CF6"
        },
        typography: {
          fontFamily: "Inter"
        }
      },
      components: ["buttons", "inputs", "cards", "tables", "forms"]
    },
    
    dashboard: {
      fileKey: CONFIG.fileKey,
      kitType: "dashboard",
      components: ["buttons", "inputs", "cards", "tables", "charts", "badges"]
    },
    
    e_commerce: {
      fileKey: CONFIG.fileKey,
      kitType: "e_commerce",
      designSystem: {
        colorPalette: {
          primary: "#DC2626",
          secondary: "#7C3AED"
        }
      },
      components: ["buttons", "inputs", "cards", "navigation", "modals", "badges"]
    },
    
    saas: {
      fileKey: CONFIG.fileKey,
      kitType: "saas",
      components: ["buttons", "inputs", "cards", "navigation", "tables", "forms"]
    },
    
    landing_page: {
      fileKey: CONFIG.fileKey,
      kitType: "landing_page",
      components: ["buttons", "inputs", "cards", "navigation", "modals"]
    }
  },
  
  create_component_library: {
    full_library: {
      fileKey: CONFIG.fileKey,
      libraryStructure: {
        foundations: ["colors", "typography", "spacing", "icons"],
        atoms: ["buttons", "inputs", "labels", "icons"],
        molecules: ["forms", "search", "navigation_items"],
        organisms: ["headers", "footers", "sidebars", "modals"],
        templates: ["page_layouts", "dashboards", "forms"],
        pages: ["examples", "documentation"]
      }
    },
    
    minimal_library: {
      fileKey: CONFIG.fileKey,
      libraryStructure: {
        foundations: ["colors", "typography"],
        atoms: ["buttons", "inputs"],
        molecules: ["forms"]
      }
    },
    
    web_focused: {
      fileKey: CONFIG.fileKey,
      libraryStructure: {
        foundations: ["colors", "typography", "spacing"],
        atoms: ["buttons", "inputs", "labels"],
        molecules: ["forms", "search", "navigation_items"],
        organisms: ["headers", "footers", "modals"],
        templates: ["page_layouts", "forms"],
        pages: ["examples", "documentation"]
      }
    }
  }
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️', test: '🧪' };
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

function saveTestResult(testName, result) {
  const timestamp = new Date().toISOString();
  const filename = `${CONFIG.outputDir}/ui-kit-${testName.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
  
  const testResult = {
    testName,
    timestamp,
    success: result?.result ? true : false,
    result: result,
    metadata: {
      tool: testName.includes('library') ? 'create_component_library' : 'generate_ui_kit',
      fileKey: CONFIG.fileKey,
      mcpPort: CONFIG.mcpPort
    }
  };
  
  try {
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    fs.writeFileSync(filename, JSON.stringify(testResult, null, 2));
    log(`Test result saved: ${filename}`, 'info');
  } catch (error) {
    log(`Failed to save test result: ${error.message}`, 'error');
  }
}

// Test functions
async function testGenerateUIKit(kitType) {
  log(`🧪 TESTING: generate_ui_kit - ${kitType}`, 'test');
  
  const testData = TEST_DATA.generate_ui_kit[kitType];
  if (!testData) {
    log(`No test data for kit type: ${kitType}`, 'error');
    return false;
  }
  
  const result = makeRequest('generate_ui_kit', testData);
  
  if (result?.result) {
    log(`✅ ${kitType} UI kit generated successfully`, 'success');
    log(`🧩 Components: ${result.result.componentCount || 'N/A'}`, 'info');
    log(`🎨 Kit Type: ${result.result.kitType || 'N/A'}`, 'info');
    
    // Validate structure
    const validations = [
      { check: result.result.kitStructure, name: 'kitStructure' },
      { check: result.result.designSystem, name: 'designSystem' },
      { check: result.result.kitStructure?.components, name: 'components array' },
      { check: result.result.kitStructure?.foundations, name: 'foundations' }
    ];
    
    validations.forEach(({ check, name }) => {
      if (check) {
        log(`✓ ${name} present`, 'success');
      } else {
        log(`✗ ${name} missing`, 'warning');
      }
    });
    
    saveTestResult(`generate-ui-kit-${kitType}`, result);
    return true;
  } else {
    log(`❌ Failed to generate ${kitType} UI kit`, 'error');
    if (result?.error) {
      log(`Error: ${result.error.message || result.error}`, 'error');
    }
    saveTestResult(`generate-ui-kit-${kitType}`, result);
    return false;
  }
}

async function testCreateComponentLibrary(libraryType) {
  log(`🧪 TESTING: create_component_library - ${libraryType}`, 'test');
  
  const testData = TEST_DATA.create_component_library[libraryType];
  if (!testData) {
    log(`No test data for library type: ${libraryType}`, 'error');
    return false;
  }
  
  const result = makeRequest('create_component_library', testData);
  
  if (result?.result) {
    log(`✅ ${libraryType} component library created successfully`, 'success');
    log(`📚 Atomic Levels: ${result.result.atomicLevels || 'N/A'}`, 'info');
    log(`🧩 Total Elements: ${result.result.totalElements || 'N/A'}`, 'info');
    
    // Validate structure
    const validations = [
      { check: result.result.libraryStructure, name: 'libraryStructure' },
      { check: result.result.libraryPages, name: 'libraryPages' },
      { check: Array.isArray(result.result.libraryPages), name: 'libraryPages is array' },
      { check: result.result.totalElements > 0, name: 'has elements' }
    ];
    
    validations.forEach(({ check, name }) => {
      if (check) {
        log(`✓ ${name} valid`, 'success');
      } else {
        log(`✗ ${name} invalid`, 'warning');
      }
    });
    
    saveTestResult(`create-component-library-${libraryType}`, result);
    return true;
  } else {
    log(`❌ Failed to create ${libraryType} component library`, 'error');
    if (result?.error) {
      log(`Error: ${result.error.message || result.error}`, 'error');
    }
    saveTestResult(`create-component-library-${libraryType}`, result);
    return false;
  }
}

async function testInvalidInputs() {
  log('🧪 TESTING: Invalid inputs handling', 'test');
  
  const invalidTests = [
    {
      name: 'Invalid kit type',
      tool: 'generate_ui_kit',
      args: {
        fileKey: CONFIG.fileKey,
        kitType: 'invalid_type',
        components: ['buttons']
      }
    },
    {
      name: 'Missing fileKey',
      tool: 'generate_ui_kit',
      args: {
        kitType: 'web_app',
        components: ['buttons']
      }
    },
    {
      name: 'Invalid component type',
      tool: 'generate_ui_kit',
      args: {
        fileKey: CONFIG.fileKey,
        kitType: 'web_app',
        components: ['invalid_component']
      }
    },
    {
      name: 'Missing library structure',
      tool: 'create_component_library',
      args: {
        fileKey: CONFIG.fileKey
      }
    }
  ];
  
  let passed = 0;
  let total = invalidTests.length;
  
  for (const test of invalidTests) {
    const result = makeRequest(test.tool, test.args);
    
    if (result?.error || (result?.result && result.result.success === false)) {
      log(`✅ ${test.name}: Correctly rejected invalid input`, 'success');
      passed++;
    } else {
      log(`❌ ${test.name}: Should have rejected invalid input`, 'error');
    }
  }
  
  log(`Invalid input tests: ${passed}/${total} passed`, passed === total ? 'success' : 'warning');
  return passed === total;
}

async function runComprehensiveTest() {
  log('🧪 COMPREHENSIVE UI KIT GENERATION TEST', 'test');
  console.log('═'.repeat(80));
  
  const results = {
    generateUIKit: {},
    createComponentLibrary: {},
    invalidInputs: false,
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0
    }
  };
  
  // Test all UI kit types
  log('\n📱 Testing UI Kit Generation', 'info');
  for (const kitType of Object.keys(TEST_DATA.generate_ui_kit)) {
    const success = await testGenerateUIKit(kitType);
    results.generateUIKit[kitType] = success;
    results.summary.totalTests++;
    if (success) results.summary.passedTests++;
    else results.summary.failedTests++;
    console.log('─'.repeat(40));
  }
  
  // Test all component library types
  log('\n⚛️ Testing Component Library Creation', 'info');
  for (const libraryType of Object.keys(TEST_DATA.create_component_library)) {
    const success = await testCreateComponentLibrary(libraryType);
    results.createComponentLibrary[libraryType] = success;
    results.summary.totalTests++;
    if (success) results.summary.passedTests++;
    else results.summary.failedTests++;
    console.log('─'.repeat(40));
  }
  
  // Test invalid inputs
  log('\n🚫 Testing Invalid Input Handling', 'info');
  const invalidSuccess = await testInvalidInputs();
  results.invalidInputs = invalidSuccess;
  results.summary.totalTests++;
  if (invalidSuccess) results.summary.passedTests++;
  else results.summary.failedTests++;
  
  // Generate summary report
  console.log('\n' + '═'.repeat(80));
  log('📊 COMPREHENSIVE TEST SUMMARY', 'success');
  console.log('═'.repeat(80));
  
  console.log('\n📱 UI Kit Generation Results:');
  Object.entries(results.generateUIKit).forEach(([kitType, success]) => {
    const icon = success ? '✅' : '❌';
    console.log(`  ${icon} ${kitType.replace('_', ' ').toUpperCase()}: ${success ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log('\n⚛️ Component Library Results:');
  Object.entries(results.createComponentLibrary).forEach(([libraryType, success]) => {
    const icon = success ? '✅' : '❌';
    console.log(`  ${icon} ${libraryType.replace('_', ' ').toUpperCase()}: ${success ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log('\n🚫 Invalid Input Handling:');
  const invalidIcon = results.invalidInputs ? '✅' : '❌';
  console.log(`  ${invalidIcon} Input Validation: ${results.invalidInputs ? 'PASSED' : 'FAILED'}`);
  
  console.log('\n📈 Overall Statistics:');
  console.log(`  🎯 Total Tests: ${results.summary.totalTests}`);
  console.log(`  ✅ Passed: ${results.summary.passedTests}`);
  console.log(`  ❌ Failed: ${results.summary.failedTests}`);
  console.log(`  📊 Success Rate: ${((results.summary.passedTests / results.summary.totalTests) * 100).toFixed(1)}%`);
  
  const overallSuccess = results.summary.failedTests === 0;
  console.log(`\n🏆 Overall Result: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  // Save comprehensive results
  const timestamp = new Date().toISOString();
  const comprehensiveResult = {
    testSuite: 'UI Kit Generation Comprehensive Test',
    timestamp,
    results,
    conclusion: overallSuccess ? 'SUCCESS' : 'FAILURE',
    recommendations: overallSuccess 
      ? ['UI Kit Generation system is fully functional', 'All components and libraries can be created successfully']
      : ['Review failed tests', 'Check MCP server configuration', 'Verify Figma API connectivity']
  };
  
  saveTestResult('comprehensive-ui-kit-test', { result: comprehensiveResult });
  
  console.log('═'.repeat(80));
  return overallSuccess;
}

// Main execution
async function main() {
  console.log('🚀 UI KIT GENERATION TESTS STARTING');
  console.log('=====================================');
  console.log(`📁 File Key: ${CONFIG.fileKey}`);
  console.log(`🌐 MCP Server: ${CONFIG.baseUrl}:${CONFIG.mcpPort}`);
  console.log(`📁 Output Directory: ${CONFIG.outputDir}`);
  console.log('=====================================\n');
  
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      // Run comprehensive test
      const success = await runComprehensiveTest();
      process.exit(success ? 0 : 1);
    } else {
      // Run specific tests
      for (const arg of args) {
        if (arg.startsWith('kit:')) {
          const kitType = arg.substring(4);
          await testGenerateUIKit(kitType);
        } else if (arg.startsWith('library:')) {
          const libraryType = arg.substring(8);
          await testCreateComponentLibrary(libraryType);
        } else if (arg === 'invalid') {
          await testInvalidInputs();
        } else {
          log(`Unknown test type: ${arg}`, 'warning');
          log('Usage: node test-ui-kit-generation.js [kit:mobile_app] [library:full_library] [invalid]', 'info');
        }
      }
    }
    
  } catch (error) {
    log(`Test execution failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  main();
}

module.exports = {
  testGenerateUIKit,
  testCreateComponentLibrary,
  testInvalidInputs,
  runComprehensiveTest,
  CONFIG,
  TEST_DATA
}; 