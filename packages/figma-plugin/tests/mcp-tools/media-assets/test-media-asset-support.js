// Media & Asset Support Test Suite
const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const FILE_KEY = 'pN5u5fKsz3B3jMcaF1tMKR';

// Test cases for create_media_assets
const createMediaAssetsTests = [
  {
    name: "Create AI Generated Image",
    args: {
      fileKey: FILE_KEY,
      mediaType: "image",
      source: {
        generate: {
          prompt: "Elegant user interface design with modern typography",
          style: "minimalist",
          dimensions: { width: 800, height: 600 }
        }
      },
      optimization: {
        format: "webp",
        quality: 85
      },
      placement: {
        x: 100,
        y: 100
      }
    },
    validate: (result) => {
      return result.success &&
             result.mediaType === "image" &&
             result.assetMetadata &&
             result.assetMetadata.type === "image" &&
             result.assetAnalytics &&
             result.recommendations;
    }
  },
  {
    name: "Create Video Asset",
    args: {
      fileKey: FILE_KEY,
      mediaType: "video",
      source: {
        url: "https://example.com/demo-video.mp4"
      },
      optimization: {
        format: "mp4",
        quality: 75,
        dimensions: { width: 1280, height: 720 }
      },
      placement: {
        x: 200,
        y: 200,
        autoLayout: true
      }
    },
    validate: (result) => {
      return result.success &&
             result.mediaType === "video" &&
             result.assetMetadata.format === "mp4" &&
             result.placement.method === "auto_layout";
    }
  },
  {
    name: "Create Lottie Animation",
    args: {
      fileKey: FILE_KEY,
      mediaType: "lottie",
      source: {
        url: "https://assets.lottiefiles.com/packages/lf20_loading.json"
      },
      optimization: {
        format: "json",
        quality: 100
      },
      placement: {
        x: 300,
        y: 300
      }
    },
    validate: (result) => {
      return result.success &&
             result.mediaType === "lottie" &&
             result.assetMetadata.format === "json";
    }
  }
];

// Test cases for manage_asset_library
const manageAssetLibraryTests = [
  {
    name: "Create Asset Library",
    args: {
      fileKey: FILE_KEY,
      operation: "create",
      assetCategories: ["icons", "illustrations", "photos"],
      assets: [
        {
          name: "Home Icon",
          category: "icons",
          tags: ["navigation", "home"],
          metadata: { description: "Home navigation icon" }
        },
        {
          name: "Hero Illustration",
          category: "illustrations",
          tags: ["hero", "banner"],
          metadata: { description: "Main hero illustration" }
        }
      ],
      libraryStructure: {
        createPages: true,
        groupByCategory: true
      }
    },
    validate: (result) => {
      return result.success &&
             result.operation === "create" &&
             result.libraryStructure &&
             result.libraryStructure.pages &&
             result.libraryStructure.totalAssets === 2;
    }
  },
  {
    name: "Search Asset Library",
    args: {
      fileKey: FILE_KEY,
      operation: "search",
      searchCriteria: {
        query: "icon",
        category: "icons",
        tags: ["navigation"]
      }
    },
    validate: (result) => {
      return result.success &&
             result.operation === "search" &&
             result.results &&
             Array.isArray(result.results);
    }
  },
  {
    name: "Organize Asset Library",
    args: {
      fileKey: FILE_KEY,
      operation: "organize",
      assetCategories: ["icons", "illustrations", "photos", "animations"],
      libraryStructure: {
        createPages: true,
        namingConvention: "Assets - {category}",
        groupByCategory: true
      }
    },
    validate: (result) => {
      return result.success &&
             result.operation === "organize" &&
             result.organization &&
             result.organization.categories.length === 4;
    }
  },
  {
    name: "Update Assets with Versioning",
    args: {
      fileKey: FILE_KEY,
      operation: "update",
      assets: [
        {
          id: "asset_1",
          name: "Updated Home Icon",
          category: "icons"
        }
      ],
      versionControl: {
        enableVersioning: true,
        versionStrategy: "semantic",
        backupOriginals: true
      }
    },
    validate: (result) => {
      return result.success &&
             result.operation === "update" &&
             result.updates &&
             result.versioningEnabled === true;
    }
  },
  {
    name: "Delete Assets",
    args: {
      fileKey: FILE_KEY,
      operation: "delete",
      assets: [
        {
          id: "asset_1",
          name: "Old Asset",
          category: "icons"
        }
      ]
    },
    validate: (result) => {
      return result.success &&
             result.operation === "delete" &&
             result.deletions &&
             result.deletions.length === 1;
    }
  }
];

// Test execution functions
async function runCreateMediaAssetsTests() {
  console.log('\n🎬 Testing create_media_assets tool...');
  const results = [];
  
  for (const test of createMediaAssetsTests) {
    try {
      console.log(`\n📸 Test: ${test.name}`);
      
      const response = await axios.post(`${API_BASE}/api/mcp/tools/call`, {
        name: 'create_media_assets',
        arguments: test.args
      });
      
      const result = JSON.parse(response.data.content[0].text);
      const isValid = test.validate(result);
      
      results.push({
        name: test.name,
        passed: isValid,
        result: result
      });
      
      if (isValid) {
        console.log('✅ PASSED');
        console.log(`   📊 Created ${result.mediaType} asset`);
        console.log(`   📏 Size: ${result.assetMetadata.dimensions.width}x${result.assetMetadata.dimensions.height}`);
        console.log(`   💾 File Size: ${(result.assetMetadata.fileSize / 1000).toFixed(1)}KB`);
        
        if (result.recommendations && result.recommendations.length > 0) {
          console.log(`   💡 Recommendations: ${result.recommendations.length}`);
        }
      } else {
        console.log('❌ FAILED - Validation failed');
        console.log('   Result:', JSON.stringify(result, null, 2));
      }
      
    } catch (error) {
      console.log('❌ FAILED - API Error');
      console.log('   Error:', error.response?.data || error.message);
      results.push({
        name: test.name,
        passed: false,
        error: error.message
      });
    }
  }
  
  return results;
}

async function runManageAssetLibraryTests() {
  console.log('\n📚 Testing manage_asset_library tool...');
  const results = [];
  
  for (const test of manageAssetLibraryTests) {
    try {
      console.log(`\n🗂️ Test: ${test.name}`);
      
      const response = await axios.post(`${API_BASE}/api/mcp/tools/call`, {
        name: 'manage_asset_library',
        arguments: test.args
      });
      
      const result = JSON.parse(response.data.content[0].text);
      const isValid = test.validate(result);
      
      results.push({
        name: test.name,
        passed: isValid,
        result: result
      });
      
      if (isValid) {
        console.log('✅ PASSED');
        console.log(`   🔧 Operation: ${result.operation}`);
        
        if (result.libraryStructure) {
          console.log(`   📊 Library: ${result.libraryStructure.pages?.length || 0} pages`);
          console.log(`   📁 Assets: ${result.libraryStructure.totalAssets || 0} total`);
        }
        
        if (result.results) {
          console.log(`   🔍 Search: ${result.results.length} results found`);
        }
        
        if (result.updates) {
          console.log(`   🔄 Updates: ${result.updates.length} assets updated`);
        }
        
        if (result.deletions) {
          console.log(`   🗑️ Deletions: ${result.deletions.length} assets deleted`);
        }
        
      } else {
        console.log('❌ FAILED - Validation failed');
        console.log('   Result:', JSON.stringify(result, null, 2));
      }
      
    } catch (error) {
      console.log('❌ FAILED - API Error');
      console.log('   Error:', error.response?.data || error.message);
      results.push({
        name: test.name,
        passed: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Generate test summary
function generateTestSummary(allResults) {
  const totalTests = allResults.length;
  const passedTests = allResults.filter(result => result.passed).length;
  const failedTests = totalTests - passedTests;
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 MEDIA & ASSET SUPPORT TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} ✅`);
  console.log(`Failed: ${failedTests} ❌`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests > 0) {
    console.log('\n❌ Failed Tests:');
    allResults.filter(result => !result.passed).forEach(result => {
      console.log(`   - ${result.name}: ${result.error || 'Validation failed'}`);
    });
  }
  
  console.log('\n✨ Media & Asset Support Tools Status:');
  console.log(`   🎬 create_media_assets: ${allResults.filter(r => r.name.includes('Create')).every(r => r.passed) ? '✅ Working' : '❌ Issues'}`);
  console.log(`   📚 manage_asset_library: ${allResults.filter(r => r.name.includes('Asset Library') || r.name.includes('Search') || r.name.includes('Organize') || r.name.includes('Update') || r.name.includes('Delete')).every(r => r.passed) ? '✅ Working' : '❌ Issues'}`);
  
  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    successRate: (passedTests / totalTests) * 100
  };
}

// Export test data for external analysis
function exportTestResults(results) {
  const testData = {
    timestamp: new Date().toISOString(),
    suite: 'Media & Asset Support',
    tools: ['create_media_assets', 'manage_asset_library'],
    summary: {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length
    },
    results: results.map(result => ({
      name: result.name,
      tool: result.name.includes('Create') || result.name.includes('Video') || result.name.includes('Lottie') ? 'create_media_assets' : 'manage_asset_library',
      passed: result.passed,
      error: result.error || null,
      hasRecommendations: result.result?.recommendations?.length > 0,
      performance: {
        responseTime: result.result?.timestamp ? 'Available' : 'N/A',
        dataSize: JSON.stringify(result.result || {}).length
      }
    }))
  };
  
  return testData;
}

// Main test runner
async function runAllMediaAssetTests() {
  console.log('🎬 Starting Media & Asset Support Test Suite...');
  console.log('=' .repeat(60));
  
  try {
    const createMediaResults = await runCreateMediaAssetsTests();
    const manageLibraryResults = await runManageAssetLibraryTests();
    
    const allResults = [...createMediaResults, ...manageLibraryResults];
    const summary = generateTestSummary(allResults);
    const testData = exportTestResults(allResults);
    
    // Save test results
    const fs = require('fs');
    fs.writeFileSync(
      'tests/media-asset-support-results.json',
      JSON.stringify(testData, null, 2)
    );
    
    console.log('\n💾 Test results saved to: tests/media-asset-support-results.json');
    console.log('🎬 Media & Asset Support testing completed!');
    
    return summary;
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllMediaAssetTests();
}

module.exports = {
  runCreateMediaAssetsTests,
  runManageAssetLibraryTests,
  runAllMediaAssetTests,
  createMediaAssetsTests,
  manageAssetLibraryTests,
  generateTestSummary,
  exportTestResults
}; 