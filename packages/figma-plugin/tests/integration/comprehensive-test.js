#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const FILE_KEY = 'pN5u5fKsz3B3jMcaF1tMKR';
const BASE_URL = 'http://localhost:3000';

console.log('🚀 Running Comprehensive MCP Figma Tools Test\n');
console.log('============================================\n');

// Create output directory
const outputDir = path.join(__dirname, '../test-output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const testResults = {
  timestamp: new Date().toISOString(),
  fileKey: FILE_KEY,
  tests: [],
  summary: { passed: 0, failed: 0, total: 0 }
};

async function runTest(testName, testFunction) {
  console.log(`🧪 ${testName}`);
  console.log('-'.repeat(50));
  
  const startTime = Date.now();
  
  try {
    const result = await testFunction();
    const duration = Date.now() - startTime;
    
    console.log(`✅ PASSED (${duration}ms)\n`);
    
    testResults.tests.push({
      name: testName,
      status: 'passed',
      duration,
      result,
      error: null
    });
    testResults.summary.passed++;
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.log(`❌ FAILED (${duration}ms)`);
    console.log(`   Error: ${error.message}\n`);
    
    testResults.tests.push({
      name: testName,
      status: 'failed',
      duration,
      result: null,
      error: error.message
    });
    testResults.summary.failed++;
    
    throw error;
  } finally {
    testResults.summary.total++;
  }
}

// Test 1: Create Nodes from Code
async function testCreateNodesFromCode() {
  const testCases = [
    {
      name: 'Simple Button',
      code: '<button className="btn btn-primary" onClick={() => alert("Hello!")}>Click Me</button>',
      framework: 'react'
    },
    {
      name: 'User Card',
      code: `<div className="user-card">
        <img src="/avatar.jpg" alt="User Avatar" className="avatar" />
        <div className="user-info">
          <h3 className="username">John Doe</h3>
          <p className="email">john@example.com</p>
          <span className="status active">Online</span>
        </div>
      </div>`,
      framework: 'react'
    },
    {
      name: 'Navigation Bar',
      code: `<nav className="navbar">
        <div className="nav-brand">
          <img src="/logo.svg" alt="Logo" className="logo" />
          <span className="brand-text">MyApp</span>
        </div>
        <ul className="nav-links">
          <li><a href="/home">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>`,
      framework: 'react'
    }
  ];
  
  const results = [];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`  📦 Creating: ${testCase.name}`);
    
    const payload = {
      fileKey: FILE_KEY,
      code: testCase.code,
      framework: testCase.framework,
      x: i * 400,
      y: 0
    };
    
    const response = await fetch(`${BASE_URL}/tools/create_nodes_from_code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to create ${testCase.name}: ${result.error}`);
    }
    
    console.log(`     ✓ Parsed ${result.result.parsedNodes.length} nodes`);
    results.push({ testCase: testCase.name, result: result.result });
    
    // Save individual result
    fs.writeFileSync(
      path.join(outputDir, `create-nodes-${testCase.name.toLowerCase().replace(/\s+/g, '-')}.json`),
      JSON.stringify(result.result, null, 2)
    );
  }
  
  return { testCases: testCases.length, results };
}

// Test 2: Set Design Variables
async function testSetDesignVariables() {
  const variableGroups = [
    {
      name: 'Colors',
      variables: {
        'primary': '#3B82F6',
        'secondary': '#8B5CF6',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'gray-50': '#F9FAFB',
        'gray-900': '#111827'
      }
    },
    {
      name: 'Typography',
      variables: {
        'font-family-sans': 'Inter, system-ui, sans-serif',
        'font-size-sm': '14px',
        'font-size-base': '16px',
        'font-size-lg': '18px',
        'font-size-xl': '20px',
        'font-weight-normal': '400',
        'font-weight-bold': '700'
      }
    },
    {
      name: 'Spacing',
      variables: {
        'space-1': '4px',
        'space-2': '8px',
        'space-4': '16px',
        'space-6': '24px',
        'space-8': '32px',
        'space-12': '48px'
      }
    }
  ];
  
  const results = [];
  
  for (const group of variableGroups) {
    console.log(`  🎨 Setting: ${group.name} (${Object.keys(group.variables).length} variables)`);
    
    const payload = {
      fileKey: FILE_KEY,
      variables: group.variables,
      variableCollection: `Test Collection - ${group.name}`
    };
    
    const response = await fetch(`${BASE_URL}/tools/set_design_variables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to set ${group.name} variables: ${result.error}`);
    }
    
    console.log(`     ✓ Created collection: ${result.result.variableCollection}`);
    results.push({ group: group.name, result: result.result });
    
    // Save individual result
    fs.writeFileSync(
      path.join(outputDir, `design-variables-${group.name.toLowerCase()}.json`),
      JSON.stringify(result.result, null, 2)
    );
  }
  
  return { groups: variableGroups.length, results };
}

// Test 3: Generate Design Previews
async function testGenerateDesignPreviews() {
  const designs = [
    {
      name: 'Modern Login Page',
      description: 'A clean, modern login page with a centered card containing email/password fields, a sign-in button, and forgot password link. Use a gradient background from blue to purple.',
      style: 'modern',
      width: 400,
      height: 600
    },
    {
      name: 'Mobile App Settings',
      description: 'A mobile settings screen with user profile at top, followed by grouped settings options like account, notifications, privacy, help. Include toggle switches and forward arrows.',
      style: 'minimal',
      width: 375,
      height: 812
    },
    {
      name: 'Data Dashboard',
      description: 'A data dashboard with charts and graphs. Include a top navigation, sidebar menu, and main content area with bar chart, line graph, and data table.',
      style: 'professional',
      width: 1200,
      height: 800
    }
  ];
  
  const results = [];
  
  for (const design of designs) {
    console.log(`  🖼️ Generating: ${design.name} (${design.width}x${design.height})`);
    
    const payload = {
      fileKey: FILE_KEY,
      designDescription: design.description,
      width: design.width,
      height: design.height,
      style: design.style,
      format: 'png'
    };
    
    const response = await fetch(`${BASE_URL}/tools/generate_design_preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to generate ${design.name}: ${result.error}`);
    }
    
    console.log(`     ✓ Generated ${result.result.designNodes.length} design nodes`);
    results.push({ design: design.name, result: result.result });
    
    // Save individual result
    fs.writeFileSync(
      path.join(outputDir, `design-preview-${design.name.toLowerCase().replace(/\s+/g, '-')}.json`),
      JSON.stringify(result.result, null, 2)
    );
  }
  
  return { designs: designs.length, results };
}

// Test 4: Establish Code Connections
async function testEstablishCodeConnections() {
  const connections = [
    {
      nodeId: 'mock-button-node-1',
      componentName: 'PrimaryButton',
      filePath: 'src/components/Button/PrimaryButton.tsx',
      repository: 'https://github.com/myorg/design-system',
      framework: 'React'
    },
    {
      nodeId: 'mock-card-node-2',
      componentName: 'UserCard',
      filePath: 'src/components/UserCard/UserCard.tsx',
      repository: 'https://github.com/myorg/design-system',
      framework: 'React'
    },
    {
      nodeId: 'mock-nav-node-3',
      componentName: 'NavigationBar',
      filePath: 'src/components/Navigation/NavigationBar.tsx',
      repository: 'https://github.com/myorg/design-system',
      framework: 'React'
    }
  ];
  
  const results = [];
  
  for (const connection of connections) {
    console.log(`  🔗 Connecting: ${connection.componentName} -> ${connection.nodeId}`);
    
    const payload = {
      fileKey: FILE_KEY,
      nodeId: connection.nodeId,
      codeInfo: {
        componentName: connection.componentName,
        filePath: connection.filePath,
        repository: connection.repository,
        framework: connection.framework
      }
    };
    
    const response = await fetch(`${BASE_URL}/tools/establish_code_connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to establish connection for ${connection.componentName}: ${result.error}`);
    }
    
    console.log(`     ✓ Connected to: ${result.result.codeInfo.filePath}`);
    results.push({ connection: connection.componentName, result: result.result });
    
    // Save individual result
    fs.writeFileSync(
      path.join(outputDir, `code-connection-${connection.componentName.toLowerCase()}.json`),
      JSON.stringify(result.result, null, 2)
    );
  }
  
  return { connections: connections.length, results };
}

// Main test execution
async function runAllTests() {
  const startTime = Date.now();
  
  try {
    // Run all tests
    await runTest('Test 1: Create Nodes from Code', testCreateNodesFromCode);
    await runTest('Test 2: Set Design Variables', testSetDesignVariables);
    await runTest('Test 3: Generate Design Previews', testGenerateDesignPreviews);
    await runTest('Test 4: Establish Code Connections', testEstablishCodeConnections);
    
    const totalDuration = Date.now() - startTime;
    
    // Generate final report
    console.log('🎯 TEST SUITE COMPLETE');
    console.log('='.repeat(50));
    console.log(`⏱️  Total Duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
    console.log(`✅ Passed: ${testResults.summary.passed}/${testResults.summary.total}`);
    console.log(`❌ Failed: ${testResults.summary.failed}/${testResults.summary.total}`);
    console.log(`📊 Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);
    
    // Save comprehensive test results
    testResults.duration = totalDuration;
    fs.writeFileSync(
      path.join(outputDir, 'comprehensive-test-results.json'),
      JSON.stringify(testResults, null, 2)
    );
    
    console.log(`\n📁 Results saved to: ${outputDir}`);
    console.log(`📋 Main report: ${path.join(outputDir, 'comprehensive-test-results.json')}`);
    
    if (testResults.summary.failed === 0) {
      console.log('\n🎉 All tests passed! The MCP Figma creation tools are working perfectly!');
    } else {
      console.log('\n⚠️  Some tests failed. Check individual test files for details.');
    }
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

runAllTests(); 