#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Known file key from conversation summary
const FILE_KEY = 'pN5u5fKsz3B3jMcaF1tMKR';

console.log('🔗 Testing establish_code_connections tool...\n');

async function testEstablishCodeConnections() {
  const baseUrl = 'http://localhost:3000/tools';
  
  // First, get the file to see what nodes exist
  console.log('📋 Getting file information first...');
  
  const getFilePayload = {
    tool: 'get_figma_file',
    args: {
      fileKey: FILE_KEY
    }
  };
  
  let fileInfo;
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getFilePayload)
    });
    
    fileInfo = await response.json();
    
    if (!response.ok) {
      console.log('❌ Failed to get file info:', fileInfo.error);
      return;
    }
    
    console.log('✅ File info retrieved');
    console.log(`   - File name: ${fileInfo.name}`);
    console.log(`   - Pages: ${fileInfo.document ? fileInfo.document.children.length : 0}`);
    
  } catch (error) {
    console.log('❌ Network Error getting file info:', error.message);
    return;
  }
  
  // Define test code connections
  const testConnections = [
    {
      nodeId: 'mock-button-node-1',
      codeInfo: {
        componentName: 'PrimaryButton',
        filePath: 'src/components/Button/PrimaryButton.tsx',
        repository: 'https://github.com/myorg/design-system',
        framework: 'React'
      }
    },
    {
      nodeId: 'mock-card-node-2',
      codeInfo: {
        componentName: 'UserCard',
        filePath: 'src/components/UserCard/UserCard.tsx',
        repository: 'https://github.com/myorg/design-system',
        framework: 'React'
      }
    },
    {
      nodeId: 'mock-nav-node-3',
      codeInfo: {
        componentName: 'NavigationBar',
        filePath: 'src/components/Navigation/NavigationBar.tsx',
        repository: 'https://github.com/myorg/design-system',
        framework: 'React'
      }
    },
    {
      nodeId: 'mock-form-node-4',
      codeInfo: {
        componentName: 'FormInput',
        filePath: 'src/components/Form/FormInput.vue',
        repository: 'https://github.com/myorg/design-system',
        framework: 'Vue'
      }
    },
    {
      nodeId: 'mock-dashboard-node-5',
      codeInfo: {
        componentName: 'Dashboard',
        filePath: 'src/views/Dashboard/Dashboard.tsx',
        repository: 'https://github.com/myorg/app',
        framework: 'React'
      }
    }
  ];
  
  console.log('🔗 Testing code connections...\n');
  
  for (let i = 0; i < testConnections.length; i++) {
    const connection = testConnections[i];
    
    console.log(`🔗 Testing Connection ${i + 1}: ${connection.codeInfo.componentName}`);
    console.log(`Node ID: ${connection.nodeId}`);
    console.log(`File Path: ${connection.codeInfo.filePath}`);
    console.log(`Framework: ${connection.codeInfo.framework}`);
    
    const payload = {
      tool: 'establish_code_connections',
      args: {
        fileKey: FILE_KEY,
        nodeId: connection.nodeId,
        codeInfo: connection.codeInfo
      }
    };
    
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Success!');
        console.log(`   - Component: ${result.codeInfo.componentName}`);
        console.log(`   - File: ${result.codeInfo.filePath}`);
        console.log(`   - Repository: ${result.codeInfo.repository}`);
        console.log(`   - Framework: ${result.codeInfo.framework}`);
        
        // Save result for analysis
        fs.writeFileSync(
          path.join(__dirname, `../test-output/code-connection-${connection.codeInfo.componentName.toLowerCase()}.json`),
          JSON.stringify(result, null, 2)
        );
      } else {
        console.log('❌ Failed:', result.error);
      }
    } catch (error) {
      console.log('❌ Network Error:', error.message);
    }
    
    console.log('');
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Create output directory
if (!fs.existsSync(path.join(__dirname, '../test-output'))) {
  fs.mkdirSync(path.join(__dirname, '../test-output'), { recursive: true });
}

testEstablishCodeConnections().then(() => {
  console.log('🎉 Code connections test completed! Check test-output directory for results.');
}).catch(console.error); 