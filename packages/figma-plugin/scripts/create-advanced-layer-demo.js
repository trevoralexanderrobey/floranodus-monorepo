#!/usr/bin/env node

// 🎨 ADVANCED LAYER TYPES DEMONSTRATION
// Complete showcase of enhanced Figma plugin capabilities

const http = require('http');

const BRIDGE_URL = 'http://localhost:3003';

console.log('🎨 ADVANCED LAYER TYPES DEMONSTRATION');
console.log('🚀 Showcasing: Auto Layout, GIFs, Videos, Advanced Components');
console.log('📡 Connecting to bridge at:', BRIDGE_URL);

// Advanced element creation helper
function createAdvancedElement(nodeType, properties) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      advanced: true,
      nodeType: nodeType,
      properties: properties
    });

    const options = {
      hostname: 'localhost',
      port: 3003,
      path: '/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          console.log(`✅ Created: ${nodeType} - ${properties.name || 'unnamed'}`);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error creating ${nodeType}:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createAdvancedLayerDemo() {
  console.log('\n🎭 CREATING ADVANCED LAYER SHOWCASE...\n');

  try {
    // === AUTO LAYOUT & CONTAINERS ===
    console.log('🔧 AUTO LAYOUT & CONTAINERS:');
    
    await createAdvancedElement('auto_layout_frame', {
      name: '🔧 Auto Layout - Main Container',
      x: 50,
      y: 50,
      layoutMode: 'VERTICAL',
      itemSpacing: 24,
      paddingTop: 32,
      paddingRight: 32,
      paddingBottom: 32,
      paddingLeft: 32
    });
    
    await delay(300);
    
    await createAdvancedElement('sticky_note', {
      name: '📝 Sticky Note - Design Feedback',
      x: 400,
      y: 50,
      text: '💡 Great design!\nLove the color scheme.\nConsider adding more spacing.'
    });
    
    await delay(300);
    
    await createAdvancedElement('code_block', {
      name: '💻 Code Block - React Component',
      x: 650,
      y: 50,
      code: 'const Button = ({ children }) => {\n  return (\n    <button className="btn-primary">\n      {children}\n    </button>\n  );\n};'
    });
    
    await delay(300);
    
    await createAdvancedElement('table', {
      name: '📊 Data Table - User Analytics',
      x: 50,
      y: 300,
      rows: 5,
      cols: 4,
      cellWidth: 120,
      cellHeight: 40
    });
    
    await delay(500);
    
    // === MEDIA & ASSETS ===
    console.log('🎬 MEDIA & ASSETS:');
    
    await createAdvancedElement('gif', {
      name: '🎬 Animated GIF - Loading Animation',
      x: 600,
      y: 300,
      width: 300,
      height: 200,
      url: 'loading-spinner.gif'
    });
    
    await delay(300);
    
    await createAdvancedElement('video', {
      name: '📹 Video Embed - Product Demo',
      x: 950,
      y: 300,
      width: 400,
      height: 225,
      title: 'Advanced Features Demo'
    });
    
    await delay(300);
    
    await createAdvancedElement('image', {
      name: '🖼️ Image Placeholder - Hero Banner',
      x: 50,
      y: 550,
      width: 500,
      height: 280,
      url: 'hero-banner.jpg'
    });
    
    await delay(300);
    
    await createAdvancedElement('mask', {
      name: '🎭 Mask Layer - Profile Picture',
      x: 600,
      y: 550,
      width: 150,
      height: 150
    });
    
    await delay(500);
    
    // === UI COMPONENTS ===
    console.log('🔘 UI COMPONENTS:');
    
    await createAdvancedElement('button', {
      name: '🔘 Primary Button - CTA',
      x: 50,
      y: 880,
      width: 160,
      height: 52,
      text: 'Get Started',
      cornerRadius: 12
    });
    
    await delay(200);
    
    await createAdvancedElement('button', {
      name: '🔘 Secondary Button',
      x: 230,
      y: 880,
      width: 140,
      height: 52,
      text: 'Learn More',
      cornerRadius: 8
    });
    
    await delay(300);
    
    await createAdvancedElement('input_field', {
      name: '📝 Email Input Field',
      x: 400,
      y: 880,
      width: 280,
      height: 52,
      placeholder: 'Enter your email address'
    });
    
    await delay(300);
    
    await createAdvancedElement('dropdown', {
      name: '📋 Country Dropdown',
      x: 700,
      y: 880,
      width: 200,
      height: 52,
      selectedValue: 'United States'
    });
    
    await delay(500);
    
    // === FORM CONTROLS ===
    console.log('☑️ FORM CONTROLS:');
    
    await createAdvancedElement('checkbox', {
      name: '☑️ Newsletter Checkbox - Checked',
      x: 50,
      y: 960,
      checked: true
    });
    
    await delay(200);
    
    await createAdvancedElement('checkbox', {
      name: '☐ Terms Checkbox - Unchecked',
      x: 100,
      y: 960,
      checked: false
    });
    
    await delay(200);
    
    await createAdvancedElement('radio_button', {
      name: '🔘 Option A - Selected',
      x: 150,
      y: 960,
      selected: true
    });
    
    await delay(200);
    
    await createAdvancedElement('radio_button', {
      name: '🔘 Option B - Unselected',
      x: 200,
      y: 960,
      selected: false
    });
    
    await delay(500);
    
    // === LAYOUT SYSTEMS ===
    console.log('📐 LAYOUT SYSTEMS:');
    
    await createAdvancedElement('flex_container', {
      name: '📐 Flex Container - Row Layout',
      x: 50,
      y: 1020,
      width: 400,
      height: 120,
      direction: 'row',
      justifyContent: 'SPACE_BETWEEN',
      alignItems: 'CENTER',
      gap: 16
    });
    
    await delay(300);
    
    await createAdvancedElement('flex_container', {
      name: '📐 Flex Container - Column Layout',
      x: 480,
      y: 1020,
      width: 150,
      height: 300,
      direction: 'column',
      justifyContent: 'CENTER',
      alignItems: 'CENTER',
      gap: 12
    });
    
    await delay(300);
    
    await createAdvancedElement('grid_system', {
      name: '🗂️ Grid System - 6x3 Layout',
      x: 660,
      y: 1020,
      cols: 6,
      rows: 3,
      colWidth: 70,
      rowHeight: 50,
      gutter: 8
    });
    
    await delay(300);
    
    await createAdvancedElement('absolute_container', {
      name: '🎯 Absolute Container - Free Positioning',
      x: 1100,
      y: 1020,
      width: 300,
      height: 200
    });
    
    await delay(500);
    
    // === ADVANCED SHAPES ===
    console.log('🎨 ADVANCED SHAPES:');
    
    await createAdvancedElement('arrow', {
      name: '➡️ Arrow Shape - Flow Indicator',
      x: 50,
      y: 1380
    });
    
    await delay(300);
    
    await createAdvancedElement('connector', {
      name: '🔗 Connector Line - Process Flow',
      x: 300,
      y: 1380
    });
    
    await delay(500);
    
    // === FINAL SHOWCASE FRAME ===
    console.log('🎭 FINAL SHOWCASE:');
    
    await createAdvancedElement('auto_layout_frame', {
      name: '🎯 SHOWCASE COMPLETE - Summary Frame',
      x: 50,
      y: 1500,
      layoutMode: 'HORIZONTAL',
      itemSpacing: 20,
      paddingTop: 24,
      paddingRight: 24,
      paddingBottom: 24,
      paddingLeft: 24
    });
    
    console.log('\n🎉 ADVANCED LAYER DEMONSTRATION COMPLETE!');
    console.log('📊 Created elements showcase:');
    console.log('   🔧 Auto Layout Frames');
    console.log('   📝 Sticky Notes & Code Blocks');  
    console.log('   🎬 GIFs & Video Embeds');
    console.log('   🖼️ Images & Masks');
    console.log('   🔘 Buttons & Form Controls');
    console.log('   📐 Flex & Grid Systems');
    console.log('   ➡️ Arrows & Connectors');
    console.log('   📊 Data Tables');
    console.log('\n✨ All advanced layer types successfully demonstrated!');
    
  } catch (error) {
    console.error('❌ Error in demonstration:', error.message);
  }
}

// Run the demonstration
createAdvancedLayerDemo(); 