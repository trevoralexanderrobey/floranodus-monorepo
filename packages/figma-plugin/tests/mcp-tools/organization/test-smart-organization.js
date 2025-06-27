#!/usr/bin/env node

/**
 * Smart Organization Test Suite
 * Tests the new Smart Organization MCP tools:
 * - create_responsive_layouts
 * - organize_layers_as_containers
 */

const { execSync } = require('child_process');

// Test configuration
const TEST_CONFIG = {
  fileKey: 'pN5u5fKsz3B3jMcaF1tMKR',
  mcpPort: 3000,
  baseUrl: 'http://localhost',
  maxRetries: 3,
  retryDelay: 1000
};

// Test cases for responsive layouts
const RESPONSIVE_LAYOUT_TESTS = [
  {
    name: 'Flex Row Layout',
    tool: 'create_responsive_layouts',
    args: {
      fileKey: TEST_CONFIG.fileKey,
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
          padding: { top: 20, right: 20, bottom: 20, left: 20 },
          alignment: "center"
        }
      },
      content: [
        { type: "text", properties: { content: "Test Header" } },
        { type: "button", properties: { content: "Test Button" } }
      ]
    },
    expectedFields: ['layoutType', 'breakpointCount', 'layoutFrames', 'responsiveDesignSystem']
  },

  {
    name: 'Flex Column Layout',
    tool: 'create_responsive_layouts',
    args: {
      fileKey: TEST_CONFIG.fileKey,
      layoutType: "flex_column",
      responsive: {
        breakpoints: ["mobile", "desktop"],
        constraints: {
          horizontal: "center",
          vertical: "top_bottom"
        },
        autoLayout: {
          direction: "vertical",
          spacing: 24,
          alignment: "center"
        }
      }
    },
    expectedFields: ['layoutType', 'breakpointCount', 'responsiveDesignSystem']
  },

  {
    name: 'Grid Layout',
    tool: 'create_responsive_layouts',
    args: {
      fileKey: TEST_CONFIG.fileKey,
      layoutType: "grid",
      responsive: {
        breakpoints: ["mobile", "tablet", "desktop"],
        autoLayout: {
          direction: "vertical",
          spacing: 20
        }
      },
      content: [
        { type: "card", properties: { title: "Card 1" } },
        { type: "card", properties: { title: "Card 2" } }
      ]
    },
    expectedFields: ['layoutType', 'breakpointCount', 'layoutFrames']
  },

  {
    name: 'Stack Layout',
    tool: 'create_responsive_layouts',
    args: {
      fileKey: TEST_CONFIG.fileKey,
      layoutType: "stack",
      responsive: {
        breakpoints: ["mobile", "desktop"],
        constraints: {
          horizontal: "center",
          vertical: "center"
        }
      }
    },
    expectedFields: ['layoutType', 'breakpointCount']
  },

  {
    name: 'Absolute Layout',
    tool: 'create_responsive_layouts',
    args: {
      fileKey: TEST_CONFIG.fileKey,
      layoutType: "absolute",
      responsive: {
        breakpoints: ["desktop"],
        constraints: {
          horizontal: "left",
          vertical: "top"
        }
      }
    },
    expectedFields: ['layoutType', 'responsiveDesignSystem']
  }
];

// Test cases for layer organization
const LAYER_ORGANIZATION_TESTS = [
  {
    name: 'Proximity-based Organization',
    tool: 'organize_layers_as_containers',
    args: {
      fileKey: TEST_CONFIG.fileKey,
      organizationRules: {
        groupBy: ["proximity"],
        containerTypes: ["frame", "auto_layout"],
        namingConvention: "Proximity Group {number}",
        preserveHierarchy: true,
        createComponents: false
      },
      analysisOptions: {
        proximityThreshold: 50,
        minGroupSize: 2,
        maxGroupSize: 6
      }
    },
    expectedFields: ['organizationStats', 'organizedContainers', 'analysisResults']
  },

  {
    name: 'Similarity-based Organization',
    tool: 'organize_layers_as_containers',
    args: {
      fileKey: TEST_CONFIG.fileKey,
      organizationRules: {
        groupBy: ["similarity"],
        containerTypes: ["auto_layout", "component"],
        namingConvention: "Similar {type} Group",
        createComponents: true
      },
      analysisOptions: {
        similarityThreshold: 0.8,
        minGroupSize: 3,
        maxGroupSize: 8
      }
    },
    expectedFields: ['organizationStats', 'organizedContainers', 'recommendations']
  },

  {
    name: 'Hierarchy-based Organization',
    tool: 'organize_layers_as_containers',
    args: {
      fileKey: TEST_CONFIG.fileKey,
      organizationRules: {
        groupBy: ["hierarchy"],
        containerTypes: ["section", "frame"],
        namingConvention: "Section {number}",
        preserveHierarchy: true
      },
      analysisOptions: {
        minGroupSize: 2,
        maxGroupSize: 10
      }
    },
    expectedFields: ['organizationStats', 'organizedContainers']
  },

  {
    name: 'Function-based Organization',
    tool: 'organize_layers_as_containers',
    args: {
      fileKey: TEST_CONFIG.fileKey,
      organizationRules: {
        groupBy: ["function"],
        containerTypes: ["section", "auto_layout"],
        namingConvention: "Functional {type} Container",
        createComponents: false
      },
      analysisOptions: {
        minGroupSize: 2,
        maxGroupSize: 12
      }
    },
    expectedFields: ['organizationStats', 'organizedContainers', 'analysisResults']
  },

  {
    name: 'Comprehensive Multi-criteria Organization',
    tool: 'organize_layers_as_containers',
    args: {
      fileKey: TEST_CONFIG.fileKey,
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
    },
    expectedFields: ['organizationStats', 'organizedContainers', 'analysisResults', 'recommendations']
  }
];

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const icons = { 
    info: 'ℹ️', 
    success: '✅', 
    error: '❌', 
    warning: '⚠️', 
    test: '🧪',
    pass: '✅',
    fail: '❌'
  };
  console.log(`${icons[type]} [${timestamp}] ${message}`);
}

async function makeRequest(tool, args, retries = TEST_CONFIG.maxRetries) {
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
    ${TEST_CONFIG.baseUrl}:${TEST_CONFIG.mcpPort}/`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = execSync(command, { encoding: 'utf8' });
      const result = JSON.parse(response);
      
      if (result.error) {
        throw new Error(`MCP Error: ${result.error.message}`);
      }
      
      return result;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      log(`Attempt ${attempt} failed, retrying...`, 'warning');
      await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.retryDelay));
    }
  }
}

function validateTestResult(result, expectedFields, testName) {
  const errors = [];
  
  if (!result || !result.result) {
    errors.push('Missing result data');
    return errors;
  }
  
  const data = result.result;
  
  // Check required fields
  for (const field of expectedFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate common fields
  if (data.success !== true) {
    errors.push('Success field is not true');
  }
  
  return errors;
}

async function runTest(test) {
  log(`Running test: ${test.name}`, 'test');
  
  try {
    const startTime = Date.now();
    const result = await makeRequest(test.tool, test.args);
    const duration = Date.now() - startTime;
    
    const errors = validateTestResult(result, test.expectedFields, test.name);
    
    if (errors.length === 0) {
      log(`✅ PASS: ${test.name} (${duration}ms)`, 'pass');
      return { success: true, errors: [], duration };
    } else {
      log(`❌ FAIL: ${test.name} - ${errors.join(', ')}`, 'fail');
      return { success: false, errors, duration };
    }
  } catch (error) {
    log(`❌ ERROR: ${test.name} - ${error.message}`, 'fail');
    return { success: false, errors: [error.message], duration: 0 };
  }
}

async function runTestSuite(tests, suiteName) {
  log(`🧪 Starting ${suiteName} Test Suite`, 'test');
  console.log('━'.repeat(60));
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push({ test: test.name, ...result });
    
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
    
    // Add delay between tests
    if (tests.indexOf(test) < tests.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('━'.repeat(60));
  log(`${suiteName} Results: ${passed} passed, ${failed} failed`, passed === tests.length ? 'success' : 'warning');
  
  return { results, passed, failed, total: tests.length };
}

function generateTestReport(responsiveResults, organizationResults) {
  const allResults = [...responsiveResults.results, ...organizationResults.results];
  const totalPassed = responsiveResults.passed + organizationResults.passed;
  const totalFailed = responsiveResults.failed + organizationResults.failed;
  const totalTests = responsiveResults.total + organizationResults.total;
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 SMART ORGANIZATION TEST REPORT');
  console.log('='.repeat(80));
  
  console.log(`\n📈 Overall Results:`);
  console.log(`  • Total Tests: ${totalTests}`);
  console.log(`  • Passed: ${totalPassed} (${((totalPassed / totalTests) * 100).toFixed(1)}%)`);
  console.log(`  • Failed: ${totalFailed} (${((totalFailed / totalTests) * 100).toFixed(1)}%)`);
  
  console.log(`\n🎯 Test Suite Breakdown:`);
  console.log(`  • Responsive Layouts: ${responsiveResults.passed}/${responsiveResults.total} passed`);
  console.log(`  • Layer Organization: ${organizationResults.passed}/${organizationResults.total} passed`);
  
  // Performance analysis
  const durations = allResults.filter(r => r.duration > 0).map(r => r.duration);
  if (durations.length > 0) {
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);
    
    console.log(`\n⚡ Performance:`);
    console.log(`  • Average Test Duration: ${avgDuration.toFixed(0)}ms`);
    console.log(`  • Fastest Test: ${minDuration}ms`);
    console.log(`  • Slowest Test: ${maxDuration}ms`);
  }
  
  // Failed tests details
  const failedTests = allResults.filter(r => !r.success);
  if (failedTests.length > 0) {
    console.log(`\n❌ Failed Tests:`);
    failedTests.forEach((test, index) => {
      console.log(`  ${index + 1}. ${test.test}:`);
      test.errors.forEach(error => {
        console.log(`     • ${error}`);
      });
    });
  }
  
  // Feature coverage
  console.log(`\n🔧 Feature Coverage:`);
  console.log(`  • Layout Types: flex_row, flex_column, grid, stack, absolute`);
  console.log(`  • Responsive Breakpoints: mobile, tablet, desktop, xl`);
  console.log(`  • Organization Criteria: proximity, similarity, hierarchy, function`);
  console.log(`  • Container Types: section, frame, auto_layout, component`);
  
  console.log('\n' + '='.repeat(80));
  
  return {
    totalTests,
    totalPassed,
    totalFailed,
    successRate: (totalPassed / totalTests) * 100,
    avgDuration: durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0,
    failedTests: failedTests.map(t => ({ name: t.test, errors: t.errors }))
  };
}

async function main() {
  console.log('🚀 SMART ORGANIZATION TEST SUITE');
  console.log('================================');
  console.log(`📁 File Key: ${TEST_CONFIG.fileKey}`);
  console.log(`🌐 MCP Server: ${TEST_CONFIG.baseUrl}:${TEST_CONFIG.mcpPort}`);
  console.log('================================\n');
  
  try {
    // Run responsive layout tests
    const responsiveResults = await runTestSuite(RESPONSIVE_LAYOUT_TESTS, 'Responsive Layout');
    
    console.log('\n');
    
    // Run layer organization tests
    const organizationResults = await runTestSuite(LAYER_ORGANIZATION_TESTS, 'Layer Organization');
    
    // Generate comprehensive report
    const report = generateTestReport(responsiveResults, organizationResults);
    
    // Exit with appropriate code
    if (report.totalFailed === 0) {
      log('🎉 All tests passed successfully!', 'success');
      process.exit(0);
    } else {
      log(`⚠️ ${report.totalFailed} tests failed`, 'warning');
      process.exit(1);
    }
    
  } catch (error) {
    log(`💥 Test suite execution failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Export for use in other modules
module.exports = {
  runTest,
  runTestSuite,
  validateTestResult,
  makeRequest,
  RESPONSIVE_LAYOUT_TESTS,
  LAYER_ORGANIZATION_TESTS,
  TEST_CONFIG
};

// Run tests if this file is executed directly
if (require.main === module) {
  main();
} 