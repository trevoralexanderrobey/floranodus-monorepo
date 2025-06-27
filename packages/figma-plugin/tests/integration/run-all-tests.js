#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Running comprehensive MCP Figma tools test suite...\n');

const testScripts = [
  {
    name: 'Create Nodes from Code',
    script: 'test-create-nodes.js',
    description: 'Testing creation of Figma nodes from React components'
  },
  {
    name: 'Set Design Variables',
    script: 'test-design-variables.js',
    description: 'Testing creation of design variables (colors, typography, spacing)'
  },
  {
    name: 'Generate Design Preview',
    script: 'test-design-preview.js',
    description: 'Testing generation of design previews from descriptions'
  },
  {
    name: 'Establish Code Connections',
    script: 'test-code-connections.js',
    description: 'Testing establishment of code-to-design connections'
  }
];

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

async function runAllTests() {
  const startTime = Date.now();
  
  // Create output directory
  const outputDir = path.join(__dirname, '../test-output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Create test summary file
  const testSummary = {
    timestamp: new Date().toISOString(),
    tests: [],
    overall: {
      passed: 0,
      failed: 0,
      total: testScripts.length
    }
  };
  
  console.log(`📋 Test Suite Overview:`);
  console.log(`   - Total tests: ${testScripts.length}`);
  console.log(`   - Output directory: ${outputDir}`);
  console.log('');
  
  for (let i = 0; i < testScripts.length; i++) {
    const test = testScripts[i];
    const scriptPath = path.join(__dirname, test.script);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 Test ${i + 1}/${testScripts.length}: ${test.name}`);
    console.log(`📝 ${test.description}`);
    console.log(`📄 Script: ${test.script}`);
    console.log(`${'='.repeat(60)}\n`);
    
    const testStartTime = Date.now();
    
    try {
      await runScript(scriptPath);
      const duration = Date.now() - testStartTime;
      
      console.log(`\n✅ Test "${test.name}" completed successfully in ${duration}ms\n`);
      
      testSummary.tests.push({
        name: test.name,
        script: test.script,
        status: 'passed',
        duration: duration,
        error: null
      });
      
      testSummary.overall.passed++;
      
    } catch (error) {
      const duration = Date.now() - testStartTime;
      
      console.log(`\n❌ Test "${test.name}" failed after ${duration}ms:`);
      console.log(`   Error: ${error.message}\n`);
      
      testSummary.tests.push({
        name: test.name,
        script: test.script,
        status: 'failed',
        duration: duration,
        error: error.message
      });
      
      testSummary.overall.failed++;
    }
    
    // Wait between tests
    if (i < testScripts.length - 1) {
      console.log('⏳ Waiting 2 seconds before next test...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const totalDuration = Date.now() - startTime;
  
  // Generate final report
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🎯 TEST SUITE COMPLETE`);
  console.log(`${'='.repeat(80)}`);
  console.log(`⏱️  Total duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
  console.log(`✅ Passed: ${testSummary.overall.passed}/${testSummary.overall.total}`);
  console.log(`❌ Failed: ${testSummary.overall.failed}/${testSummary.overall.total}`);
  console.log(`📊 Success rate: ${((testSummary.overall.passed / testSummary.overall.total) * 100).toFixed(1)}%`);
  
  if (testSummary.overall.failed > 0) {
    console.log(`\n❌ Failed Tests:`);
    testSummary.tests.filter(t => t.status === 'failed').forEach(test => {
      console.log(`   - ${test.name}: ${test.error}`);
    });
  }
  
  // Save test summary
  testSummary.overall.duration = totalDuration;
  fs.writeFileSync(
    path.join(outputDir, 'test-summary.json'),
    JSON.stringify(testSummary, null, 2)
  );
  
  console.log(`\n📁 Test results saved to: ${outputDir}`);
  console.log(`📋 Summary report: ${path.join(outputDir, 'test-summary.json')}`);
  console.log(`${'='.repeat(80)}\n`);
  
  if (testSummary.overall.failed === 0) {
    console.log('🎉 All tests passed! The MCP Figma tools are working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the individual test outputs for details.');
    process.exit(1);
  }
}

runAllTests().catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
}); 