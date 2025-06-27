// Media & Asset Support Demo Script
const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const FILE_KEY = 'pN5u5fKsz3B3jMcaF1tMKR';

// Demo functions for Media & Asset Support tools
async function demoCreateMediaAssets() {
  console.log('\n🎬 Testing Create Media Assets...');
  
  const demos = [
    {
      name: "AI Generated Image",
      args: {
        fileKey: FILE_KEY,
        mediaType: "image",
        source: {
          generate: {
            prompt: "Modern minimalist dashboard interface with clean typography and subtle shadows",
            style: "ui_design",
            dimensions: { width: 1200, height: 800 }
          }
        },
        optimization: {
          format: "webp",
          quality: 85,
          dimensions: { width: 1200, height: 800, maintainAspectRatio: true }
        },
        placement: {
          x: 100,
          y: 100,
          autoLayout: false
        }
      }
    },
    {
      name: "Lottie Animation",
      args: {
        fileKey: FILE_KEY,
        mediaType: "lottie",
        source: {
          url: "https://assets.lottiefiles.com/packages/lf20_loading.json"
        },
        optimization: {
          format: "json",
          quality: 100,
          compression: { lossless: true }
        },
        placement: {
          x: 300,
          y: 300,
          autoLayout: true
        }
      }
    },
    {
      name: "Optimized Image Upload",
      args: {
        fileKey: FILE_KEY,
        mediaType: "image",
        source: {
          upload: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        },
        optimization: {
          format: "webp",
          quality: 70,
          dimensions: { width: 400, height: 300 },
          compression: { lossless: false, progressive: true }
        },
        placement: {
          x: 500,
          y: 100,
          containerName: "Media Container"
        }
      }
    }
  ];
  
  for (const demo of demos) {
    try {
      console.log(`\n📸 ${demo.name}:`);
      console.log('Request:', JSON.stringify(demo.args, null, 2));
      
      const response = await axios.post(`${API_BASE}/api/mcp/tools/call`, {
        name: 'create_media_assets',
        arguments: demo.args
      });
      
      console.log('✅ Success:', response.data.content[0].text);
      
      // Log key results
      const result = JSON.parse(response.data.content[0].text);
      if (result.assetMetadata) {
        console.log(`📊 Asset: ${result.assetMetadata.type} (${result.assetMetadata.format})`);
        console.log(`📏 Dimensions: ${result.assetMetadata.dimensions.width}x${result.assetMetadata.dimensions.height}`);
        console.log(`💾 File Size: ${(result.assetMetadata.fileSize / 1000).toFixed(1)}KB`);
        console.log(`⚡ Load Time: ${result.assetAnalytics.estimatedLoadTime.toFixed(2)}s`);
      }
      
    } catch (error) {
      console.error(`❌ Error in ${demo.name}:`, error.response?.data || error.message);
    }
  }
}

async function demoManageAssetLibrary() {
  console.log('\n📚 Testing Manage Asset Library...');
  
  const demos = [
    {
      name: "Create Asset Library",
      args: {
        fileKey: FILE_KEY,
        operation: "create",
        assetCategories: ["icons", "illustrations", "photos", "animations"],
        assets: [
          {
            name: "Home Icon",
            category: "icons",
            tags: ["navigation", "home", "ui"],
            metadata: {
              description: "Home navigation icon",
              author: "Design Team",
              license: "Internal Use"
            }
          },
          {
            name: "Hero Illustration",
            category: "illustrations",
            tags: ["hero", "landing", "banner"],
            metadata: {
              description: "Main hero illustration for landing page",
              author: "Illustration Team"
            }
          },
          {
            name: "Product Photo",
            category: "photos",
            tags: ["product", "showcase", "marketing"],
            metadata: {
              description: "Product showcase photography"
            }
          }
        ],
        libraryStructure: {
          createPages: true,
          namingConvention: "Assets - {category}",
          groupByCategory: true,
          includeMetadata: true
        }
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
          tags: ["navigation", "ui"]
        }
      }
    },
    {
      name: "Organize Asset Library",
      args: {
        fileKey: FILE_KEY,
        operation: "organize",
        assetCategories: ["icons", "illustrations", "photos", "animations", "logos"],
        libraryStructure: {
          createPages: true,
          namingConvention: "📁 {category}",
          groupByCategory: true,
          includeMetadata: true
        }
      }
    },
    {
      name: "Update Assets with Version Control",
      args: {
        fileKey: FILE_KEY,
        operation: "update",
        assets: [
          {
            id: "asset_1",
            name: "Updated Home Icon",
            category: "icons",
            tags: ["navigation", "home", "ui", "updated"]
          }
        ],
        versionControl: {
          enableVersioning: true,
          versionStrategy: "semantic",
          backupOriginals: true,
          changeTracking: true
        }
      }
    }
  ];
  
  for (const demo of demos) {
    try {
      console.log(`\n🗂️ ${demo.name}:`);
      console.log('Request:', JSON.stringify(demo.args, null, 2));
      
      const response = await axios.post(`${API_BASE}/api/mcp/tools/call`, {
        name: 'manage_asset_library',
        arguments: demo.args
      });
      
      console.log('✅ Success:', response.data.content[0].text);
      
      // Log key results
      const result = JSON.parse(response.data.content[0].text);
      if (result.libraryStructure) {
        console.log(`📊 Library: ${result.libraryStructure.pages?.length || 0} pages`);
        console.log(`📁 Assets: ${result.libraryStructure.totalAssets || 0} total`);
      }
      
      if (result.results) {
        console.log(`🔍 Search: ${result.results.length} results found`);
      }
      
    } catch (error) {
      console.error(`❌ Error in ${demo.name}:`, error.response?.data || error.message);
    }
  }
}

// Utility functions
async function makeApiRequest(toolName, args) {
  try {
    const response = await axios.post(`${API_BASE}/api/mcp/tools/call`, {
      name: toolName,
      arguments: args
    });
    return JSON.parse(response.data.content[0].text);
  } catch (error) {
    console.error(`API Error for ${toolName}:`, error.response?.data || error.message);
    throw error;
  }
}

function logToolResult(toolName, result) {
  console.log(`\n🔧 ${toolName} Result:`);
  console.log(`✅ ${result.message}`);
  
  if (result.recommendations && result.recommendations.length > 0) {
    console.log(`💡 Recommendations:`);
    result.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. [${rec.priority}] ${rec.title}: ${rec.suggestion}`);
    });
  }
}

// Main execution
async function runMediaAssetDemo() {
  console.log('🎬 Starting Media & Asset Support Demo...');
  console.log('=' .repeat(60));
  
  try {
    await demoCreateMediaAssets();
    await demoManageAssetLibrary();
    
    console.log('\n✅ Media & Asset Support Demo completed successfully!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runMediaAssetDemo();
}

module.exports = {
  demoCreateMediaAssets,
  demoManageAssetLibrary,
  makeApiRequest,
  logToolResult
}; 