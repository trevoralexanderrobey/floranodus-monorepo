const http = require('http');

// Wait for auto-bridge to be ready
setTimeout(async () => {
  console.log('🎨 Creating expanded wireframe elements in Figma...');
  
  // Function to send commands to auto-bridge
  function sendCommand(nodeType, properties, description) {
    const payload = {
      nodeType: nodeType,
      properties: properties
    };
    const postData = JSON.stringify(payload);
    
    const options = {
      hostname: 'localhost',
      port: 3003,
      path: '/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${description} queued`);
      } else {
        console.log(`❌ Failed to queue ${description} (${res.statusCode})`);
      }
    });
    
    req.on('error', (error) => {
      console.log(`❌ Error sending ${description}:`, error.message);
    });
    
    req.write(postData);
    req.end();
  }
  
  // Extended wireframe elements
  const wireframes = [
    // More product cards (Row 2)
    {
      nodeType: 'rectangle',
      properties: {
        name: '🛍️ Product Card 3',
        x: 70,
        y: 510,
        width: 160,
        height: 200,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '🖼️ Product Image 3',
        x: 80,
        y: 520,
        width: 140,
        height: 120,
        fills: [{type: 'SOLID', color: {r: 0.94, g: 0.94, b: 0.94}}],
        strokes: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🏷️ Product Name 3',
        x: 80,
        y: 655,
        characters: 'Smart Watch',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '💰 Product Price 3',
        x: 80,
        y: 675,
        characters: '$299.99',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0.4, g: 0.4, b: 0.4}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '⭐ Product Rating 3',
        x: 80,
        y: 695,
        characters: '★★★★☆ (156)',
        fontSize: 12,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Product Card 4
    {
      nodeType: 'rectangle',
      properties: {
        name: '🛍️ Product Card 4',
        x: 245,
        y: 510,
        width: 160,
        height: 200,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '🖼️ Product Image 4',
        x: 255,
        y: 520,
        width: 140,
        height: 120,
        fills: [{type: 'SOLID', color: {r: 0.94, g: 0.94, b: 0.94}}],
        strokes: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🏷️ Product Name 4',
        x: 255,
        y: 655,
        characters: 'Tablet Pro',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '💰 Product Price 4',
        x: 255,
        y: 675,
        characters: '$599.99',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0.4, g: 0.4, b: 0.4}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '⭐ Product Rating 4',
        x: 255,
        y: 695,
        characters: '★★★★★ (203)',
        fontSize: 12,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Bottom Navigation Bar
    {
      nodeType: 'rectangle',
      properties: {
        name: '📱 Bottom Navigation',
        x: 50,
        y: 802,
        width: 375,
        height: 60,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    // Navigation Icons
    {
      nodeType: 'rectangle',
      properties: {
        name: '🏠 Home Icon',
        x: 90,
        y: 815,
        width: 24,
        height: 24,
        fills: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🏠 Home Label',
        x: 95,
        y: 848,
        characters: 'Home',
        fontSize: 10,
        fills: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '🔍 Search Icon',
        x: 150,
        y: 815,
        width: 24,
        height: 24,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}],
        strokes: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🔍 Search Label',
        x: 150,
        y: 848,
        characters: 'Search',
        fontSize: 10,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '❤️ Favorites Icon',
        x: 210,
        y: 815,
        width: 24,
        height: 24,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}],
        strokes: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '❤️ Favorites Label',
        x: 205,
        y: 848,
        characters: 'Favorites',
        fontSize: 10,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '🛒 Cart Icon',
        x: 270,
        y: 815,
        width: 24,
        height: 24,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}],
        strokes: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🛒 Cart Label',
        x: 275,
        y: 848,
        characters: 'Cart',
        fontSize: 10,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '👤 Profile Icon',
        x: 330,
        y: 815,
        width: 24,
        height: 24,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}],
        strokes: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '👤 Profile Label',
        x: 325,
        y: 848,
        characters: 'Profile',
        fontSize: 10,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}]
      }
    },
    // Featured Banner Section
    {
      nodeType: 'rectangle',
      properties: {
        name: '🎯 Featured Banner',
        x: 70,
        y: 730,
        width: 335,
        height: 60,
        fills: [{type: 'SOLID', color: {r: 0.95, g: 0.32, b: 0.32}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.2, b: 0.2}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🎯 Banner Text',
        x: 180,
        y: 750,
        characters: '🔥 FLASH SALE - 50% OFF',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '⏰ Banner Subtitle',
        x: 195,
        y: 770,
        characters: 'Limited time offer',
        fontSize: 12,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
    },
    // Cart Badge on Header
    {
      nodeType: 'ellipse',
      properties: {
        name: '🔴 Cart Badge',
        x: 395,
        y: 105,
        width: 20,
        height: 20,
        fills: [{type: 'SOLID', color: {r: 1, g: 0.2, b: 0.2}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🔴 Cart Count',
        x: 402,
        y: 115,
        characters: '3',
        fontSize: 12,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
    },
    // Filter/Sort Bar
    {
      nodeType: 'rectangle',
      properties: {
        name: '🎛️ Filter Bar',
        x: 280,
        y: 230,
        width: 60,
        height: 35,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🎛️ Filter Text',
        x: 300,
        y: 245,
        characters: 'Filter',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '📊 Sort Bar',
        x: 350,
        y: 230,
        width: 55,
        height: 35,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '📊 Sort Text',
        x: 365,
        y: 245,
        characters: 'Sort',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    }
  ];
  
  // Send commands with delay
  for (let i = 0; i < wireframes.length; i++) {
    setTimeout(() => {
      const element = wireframes[i];
      sendCommand(element.nodeType, element.properties, element.properties.name);
    }, i * 300); // 300ms delay between each element
  }
  
  console.log(`🎨 Queued ${wireframes.length} additional wireframe elements for creation`);
  
}, 3000); // Wait 3 seconds for auto-bridge to be ready 