const http = require('http');

// Wait for auto-bridge to be ready
setTimeout(async () => {
  console.log('🎨 Creating Product Detail Page wireframe in Figma...');
  
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
  
  // Product Detail Page wireframe elements (positioned at x: 500 to be next to the main screen)
  const wireframes = [
    // Mobile Frame for Product Detail
    {
      nodeType: 'rectangle',
      properties: {
        name: '📱 Product Detail Frame',
        x: 500,
        y: 50,
        width: 375,
        height: 812,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}],
        strokeWeight: 2
      }
    },
    // Header Section
    {
      nodeType: 'rectangle',
      properties: {
        name: '🔙 Detail Header',
        x: 520,
        y: 90,
        width: 335,
        height: 60,
        fills: [{type: 'SOLID', color: {r: 0.98, g: 0.98, b: 0.98}}],
        strokes: [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}],
        strokeWeight: 1
      }
    },
    // Back Button
    {
      nodeType: 'rectangle',
      properties: {
        name: '🔙 Back Button',
        x: 530,
        y: 105,
        width: 30,
        height: 30,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}],
        strokes: [{type: 'SOLID', color: {r: 0.7, g: 0.7, b: 0.7}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🔙 Back Arrow',
        x: 540,
        y: 120,
        characters: '←',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Product Detail Title
    {
      nodeType: 'text',
      properties: {
        name: '📄 Detail Title',
        x: 640,
        y: 115,
        characters: 'Product Detail',
        fontSize: 18,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Favorite Heart
    {
      nodeType: 'rectangle',
      properties: {
        name: '❤️ Favorite Button',
        x: 815,
        y: 105,
        width: 30,
        height: 30,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}],
        strokes: [{type: 'SOLID', color: {r: 0.7, g: 0.7, b: 0.7}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '❤️ Heart Icon',
        x: 825,
        y: 120,
        characters: '♡',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Large Product Image Gallery
    {
      nodeType: 'rectangle',
      properties: {
        name: '🖼️ Product Gallery',
        x: 520,
        y: 170,
        width: 335,
        height: 280,
        fills: [{type: 'SOLID', color: {r: 0.95, g: 0.95, b: 0.95}}],
        strokes: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🖼️ Gallery Label',
        x: 650,
        y: 320,
        characters: 'PRODUCT IMAGE',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0.5, g: 0.5, b: 0.5}}]
      }
    },
    // Image Indicator
    {
      nodeType: 'rectangle',
      properties: {
        name: '📊 Image Indicator',
        x: 790,
        y: 420,
        width: 50,
        height: 20,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0, a: 0.7}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '📊 Indicator Text',
        x: 808,
        y: 430,
        characters: '1/4',
        fontSize: 12,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
    },
    // Product Info Section
    {
      nodeType: 'text',
      properties: {
        name: '🏷️ Product Title',
        x: 520,
        y: 480,
        characters: 'Premium Wireless Headphones',
        fontSize: 20,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Price Section
    {
      nodeType: 'text',
      properties: {
        name: '💰 Main Price',
        x: 520,
        y: 510,
        characters: '$149.99',
        fontSize: 24,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.2, b: 0.2}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '💰 Original Price',
        x: 620,
        y: 515,
        characters: '$199.99',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}]
      }
    },
    // Discount Badge
    {
      nodeType: 'rectangle',
      properties: {
        name: '🏷️ Discount Badge',
        x: 720,
        y: 505,
        width: 60,
        height: 20,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.2, b: 0.2}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🏷️ Discount Text',
        x: 735,
        y: 515,
        characters: '25% OFF',
        fontSize: 10,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
    },
    // Rating Section
    {
      nodeType: 'text',
      properties: {
        name: '⭐ Product Stars',
        x: 520,
        y: 540,
        characters: '★★★★☆',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 1, g: 0.8, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '⭐ Rating Details',
        x: 600,
        y: 540,
        characters: '4.2 (248 reviews)',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}]
      }
    },
    // Color Selection
    {
      nodeType: 'text',
      properties: {
        name: '🎨 Color Label',
        x: 520,
        y: 580,
        characters: 'Color:',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Color Options
    {
      nodeType: 'ellipse',
      properties: {
        name: '⚫ Black Color',
        x: 520,
        y: 600,
        width: 40,
        height: 40,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}],
        strokes: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}],
        strokeWeight: 3
      }
    },
    {
      nodeType: 'ellipse',
      properties: {
        name: '⚪ White Color',
        x: 580,
        y: 600,
        width: 40,
        height: 40,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'ellipse',
      properties: {
        name: '🔴 Red Color',
        x: 640,
        y: 600,
        width: 40,
        height: 40,
        fills: [{type: 'SOLID', color: {r: 0.8, g: 0.2, b: 0.2}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    // Size Selection
    {
      nodeType: 'text',
      properties: {
        name: '📏 Size Label',
        x: 520,
        y: 670,
        characters: 'Size:',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Size Options
    {
      nodeType: 'rectangle',
      properties: {
        name: '📏 Size S',
        x: 520,
        y: 690,
        width: 40,
        height: 35,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '📏 Size S Text',
        x: 535,
        y: 708,
        characters: 'S',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '📏 Size M (Selected)',
        x: 580,
        y: 690,
        width: 40,
        height: 35,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.95, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}],
        strokeWeight: 2
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '📏 Size M Text',
        x: 595,
        y: 708,
        characters: 'M',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '📏 Size L',
        x: 640,
        y: 690,
        width: 40,
        height: 35,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '📏 Size L Text',
        x: 656,
        y: 708,
        characters: 'L',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '📏 Size XL',
        x: 700,
        y: 690,
        width: 40,
        height: 35,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '📏 Size XL Text',
        x: 715,
        y: 708,
        characters: 'XL',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Action Buttons
    {
      nodeType: 'rectangle',
      properties: {
        name: '🛒 Add to Cart Button',
        x: 520,
        y: 750,
        width: 155,
        height: 45,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}],
        strokeWeight: 2
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🛒 Add to Cart Text',
        x: 565,
        y: 773,
        characters: 'Add to Cart',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '💳 Buy Now Button',
        x: 690,
        y: 750,
        width: 155,
        height: 45,
        fills: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '💳 Buy Now Text',
        x: 745,
        y: 773,
        characters: 'Buy Now',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
    },
    // Description Section
    {
      nodeType: 'rectangle',
      properties: {
        name: '📝 Description Section',
        x: 520,
        y: 815,
        width: 335,
        height: 2,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '📝 Description Title',
        x: 520,
        y: 835,
        characters: 'Description',
        fontSize: 18,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    }
  ];
  
  // Send commands with delay
  for (let i = 0; i < wireframes.length; i++) {
    setTimeout(() => {
      const element = wireframes[i];
      sendCommand(element.nodeType, element.properties, element.properties.name);
    }, i * 250); // 250ms delay between each element
  }
  
  console.log(`🎨 Queued ${wireframes.length} product detail wireframe elements for creation`);
  
}, 2000); // Wait 2 seconds for auto-bridge to be ready 