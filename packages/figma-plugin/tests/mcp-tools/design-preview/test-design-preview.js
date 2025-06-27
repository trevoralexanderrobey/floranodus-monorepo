#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Known file key from conversation summary
const FILE_KEY = 'pN5u5fKsz3B3jMcaF1tMKR';

// Load test data
const testData = JSON.parse(fs.readFileSync(path.join(__dirname, '../test-data/test-design-descriptions.json'), 'utf8'));

console.log('🖼️ Testing generate_design_preview tool...\n');

async function testGenerateDesignPreview() {
  const baseUrl = 'http://localhost:3000/tools';
  
  for (let i = 0; i < testData.testDesigns.length; i++) {
    const design = testData.testDesigns[i];
    
    console.log(`🖼️ Testing Design ${i + 1}: ${design.name}`);
    console.log(`Description: ${design.description}`);
    console.log(`Style: ${design.style}`);
    console.log(`Dimensions: ${design.width}x${design.height}`);
    
    const payload = {
      tool: 'generate_design_preview',
      args: {
        fileKey: FILE_KEY,
        designDescription: design.description,
        width: design.width,
        height: design.height,
        style: design.style,
        format: 'png'
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
        console.log(`   - Generated ${result.designNodes ? result.designNodes.length : 0} design nodes`);
        console.log(`   - Dimensions: ${result.dimensions.width}x${result.dimensions.height}`);
        console.log(`   - Style: ${result.style}`);
        console.log(`   - Format: ${result.format}`);
        console.log(`   - Timestamp: ${result.timestamp}`);
        
        // Save result for analysis
        fs.writeFileSync(
          path.join(__dirname, `../test-output/design-preview-${design.name.toLowerCase().replace(/\s+/g, '-')}.json`),
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

testGenerateDesignPreview().then(() => {
  console.log('🎉 Design preview test completed! Check test-output directory for results.');
}).catch(console.error); 