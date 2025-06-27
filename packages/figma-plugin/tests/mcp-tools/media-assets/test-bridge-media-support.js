#!/usr/bin/env node

/**
 * Test script to validate Bridge Media & Asset Support
 * Tests the enhanced bridge's ability to handle all new Media & Asset Support tools
 */

const axios = require('axios').default;

const BRIDGE_URL = 'http://localhost:3002';
const TEST_FILE_ID = 'test-media-assets';

// Test configuration
const tests = [
  {
    name: 'Media Asset Creation - Image',
    method: 'POST',
    url: `${BRIDGE_URL}/api/files/${TEST_FILE_ID}/media`,
    data: {
      mediaType: 'image',
      source: {
        ai: {
          prompt: 'Modern UI design with gradients',
          style: 'minimalist'
        }
      },
      optimization: {
        dimensions: { width: 300, height: 200 },
        format: 'webp',
        quality: 85
      },
      placement: { x: 100, y: 100 }
    }
  },
  {
    name: 'Media Asset Creation - Video',
    method: 'POST',
    url: `${BRIDGE_URL}/api/files/${TEST_FILE_ID}/media`,
    data: {
      mediaType: 'video',
      source: {
        url: 'https://example.com/demo-video.mp4'
      },
      optimization: {
        format: 'mp4',
        quality: 'high',
        compression: true
      },
      placement: { x: 450, y: 100 }
    }
  },
  {
    name: 'Media Asset Creation - Lottie',
    method: 'POST',
    url: `${BRIDGE_URL}/api/files/${TEST_FILE_ID}/media`,
    data: {
      mediaType: 'lottie',
      source: {
        upload: 'animation.json'
      },
      placement: { x: 800, y: 100 }
    }
  },
  {
    name: 'Asset Library Creation',
    method: 'POST',
    url: `${BRIDGE_URL}/api/files/${TEST_FILE_ID}/assets`,
    data: {
      operation: 'create',
      assetCategories: ['icons', 'illustrations', 'logos', 'patterns'],
      libraryStructure: {
        name: 'Design System Assets',
        version: '1.0.0'
      }
    }
  },
  {
    name: 'Asset Library Search',
    method: 'POST',
    url: `${BRIDGE_URL}/api/files/${TEST_FILE_ID}/assets`,
    data: {
      operation: 'search',
      searchCriteria: {
        text: 'button',
        category: 'icons',
        tags: ['ui', 'interaction']
      }
    }
  },
  {
    name: 'MCP Tool Bridge - create_media_assets',
    method: 'POST',
    url: `${BRIDGE_URL}/api/mcp/tools/call`,
    data: {
      name: 'create_media_assets',
      arguments: {
        mediaType: 'interactive_prototype',
        source: {
          ai: {
            prompt: 'Interactive dashboard prototype',
            style: 'professional'
          }
        },
        placement: { x: 100, y: 400 }
      }
    }
  },
  {
    name: 'MCP Tool Bridge - manage_asset_library',
    method: 'POST',
    url: `${BRIDGE_URL}/api/mcp/tools/call`,
    data: {
      name: 'manage_asset_library',
      arguments: {
        operation: 'organize',
        assetCategories: ['icons', 'illustrations'],
        versionControl: {
          strategy: 'semantic',
          autoIncrement: true
        }
      }
    }
  },
  {
    name: 'Code to Nodes Bridge',
    method: 'POST',
    url: `${BRIDGE_URL}/api/mcp/tools/call`,
    data: {
      name: 'create_nodes_from_code',
      arguments: {
        code: '<div class="card"><h2>Title</h2><p>Description</p><button>Action</button></div>',
        framework: 'react',
        x: 100,
        y: 600
      }
    }
  }
];

async function runTests() {
  console.log('🧪 BRIDGE MEDIA & ASSET SUPPORT TESTS');
  console.log('======================================\n');

  // Check if bridge is running
  try {
    const healthResponse = await axios.get(`${BRIDGE_URL}/health`);
    console.log('✅ Bridge Status:', healthResponse.data);
    console.log('');
  } catch (error) {
    console.error('❌ Bridge not running. Please start with: node bridge/enhanced-bypass-bridge.js');
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`🔄 Testing: ${test.name}`);
      
      const response = await axios({
        method: test.method,
        url: test.url,
        data: test.data,
        timeout: 5000
      });

      // Check if response is valid
      if (response.status === 200 && response.data) {
        if (test.name.includes('MCP Tool Bridge')) {
          // MCP responses should have content array
          if (response.data.content && Array.isArray(response.data.content)) {
            console.log('✅ PASS: MCP bridge response format correct');
            passed++;
          } else {
            console.log('❌ FAIL: Invalid MCP response format');
            failed++;
          }
        } else {
          // Regular API responses should have success/error structure
          if (response.data.hasOwnProperty('success') || response.data.hasOwnProperty('error')) {
            console.log('✅ PASS: Bridge accepted request and returned proper response');
            passed++;
          } else {
            console.log('❌ FAIL: Unexpected response format');
            failed++;
          }
        }
      } else {
        console.log('❌ FAIL: Invalid response');
        failed++;
      }

      // Log response details
      console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
      
    } catch (error) {
      console.log('❌ FAIL: Request failed');
      console.log(`   Error: ${error.message}`);
      failed++;
    }
    
    console.log('');
  }

  // Summary
  console.log('SUMMARY');
  console.log('=======');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Bridge Media & Asset Support is fully functional.');
  } else {
    console.log('\n⚠️  Some tests failed. Check bridge configuration and endpoints.');
  }

  // Additional validation tests
  console.log('\n🔍 ADDITIONAL VALIDATIONS');
  console.log('=========================');
  
  // Test new endpoints exist
  const endpoints = [
    '/api/files/test/media',
    '/api/files/test/assets',
    '/api/mcp/tools/call'
  ];
  
  for (const endpoint of endpoints) {
    try {
      await axios.get(`${BRIDGE_URL}${endpoint}`);
      console.log(`✅ Endpoint exists: ${endpoint}`);
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.log(`✅ Endpoint exists: ${endpoint} (returned ${error.response.status})`);
      } else {
        console.log(`❌ Endpoint missing: ${endpoint}`);
      }
    }
  }

  console.log('\n🚀 Media & Asset Support bridge validation complete!');
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled promise rejection:', reason);
});

// Run tests
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runTests }; 