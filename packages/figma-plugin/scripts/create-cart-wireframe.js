const http = require('http');

// Wait for auto-bridge to be ready
setTimeout(async () => {
  console.log('🎨 Creating Shopping Cart wireframe in Figma...');
  
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
  
  // Shopping Cart wireframe elements (positioned at x: 950 to be the third screen)
  const wireframes = [
    // Mobile Frame for Cart
    {
      nodeType: 'rectangle',
      properties: {
        name: '📱 Cart Frame',
        x: 950,
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
        name: '🛒 Cart Header',
        x: 970,
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
        name: '🔙 Cart Back Button',
        x: 980,
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
        name: '🔙 Cart Back Arrow',
        x: 990,
        y: 120,
        characters: '←',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Cart Title
    {
      nodeType: 'text',
      properties: {
        name: '🛒 Cart Title',
        x: 1090,
        y: 115,
        characters: 'Shopping Cart (3)',
        fontSize: 18,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Clear Cart Button
    {
      nodeType: 'rectangle',
      properties: {
        name: '🗑️ Clear Cart Button',
        x: 1265,
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
        name: '🗑️ Trash Icon',
        x: 1275,
        y: 120,
        characters: '🗑',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Cart Items Section
    // Cart Item 1
    {
      nodeType: 'rectangle',
      properties: {
        name: '📦 Cart Item 1',
        x: 970,
        y: 170,
        width: 335,
        height: 120,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '🖼️ Item 1 Image',
        x: 985,
        y: 185,
        width: 80,
        height: 80,
        fills: [{type: 'SOLID', color: {r: 0.94, g: 0.94, b: 0.94}}],
        strokes: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🏷️ Item 1 Name',
        x: 1080,
        y: 190,
        characters: 'Wireless Headphones',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🏷️ Item 1 Details',
        x: 1080,
        y: 210,
        characters: 'Black, Size M',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '💰 Item 1 Price',
        x: 1080,
        y: 235,
        characters: '$149.99',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.2, b: 0.2}}]
      }
    },
    // Quantity Controls Item 1
    {
      nodeType: 'rectangle',
      properties: {
        name: '➖ Item 1 Minus',
        x: 1080,
        y: 255,
        width: 25,
        height: 25,
        fills: [{type: 'SOLID', color: {r: 0.95, g: 0.95, b: 0.95}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '➖ Minus Sign 1',
        x: 1090,
        y: 268,
        characters: '-',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🔢 Item 1 Quantity',
        x: 1120,
        y: 268,
        characters: '2',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '➕ Item 1 Plus',
        x: 1140,
        y: 255,
        width: 25,
        height: 25,
        fills: [{type: 'SOLID', color: {r: 0.95, g: 0.95, b: 0.95}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '➕ Plus Sign 1',
        x: 1150,
        y: 268,
        characters: '+',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Remove Button Item 1
    {
      nodeType: 'rectangle',
      properties: {
        name: '❌ Remove Item 1',
        x: 1275,
        y: 185,
        width: 20,
        height: 20,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '❌ X Icon 1',
        x: 1282,
        y: 195,
        characters: '×',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Cart Item 2
    {
      nodeType: 'rectangle',
      properties: {
        name: '📦 Cart Item 2',
        x: 970,
        y: 305,
        width: 335,
        height: 120,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '🖼️ Item 2 Image',
        x: 985,
        y: 320,
        width: 80,
        height: 80,
        fills: [{type: 'SOLID', color: {r: 0.94, g: 0.94, b: 0.94}}],
        strokes: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🏷️ Item 2 Name',
        x: 1080,
        y: 325,
        characters: 'Smartphone Case',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🏷️ Item 2 Details',
        x: 1080,
        y: 345,
        characters: 'Clear, iPhone 14',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '💰 Item 2 Price',
        x: 1080,
        y: 370,
        characters: '$29.99',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.2, b: 0.2}}]
      }
    },
    // Quantity Controls Item 2
    {
      nodeType: 'rectangle',
      properties: {
        name: '➖ Item 2 Minus',
        x: 1080,
        y: 390,
        width: 25,
        height: 25,
        fills: [{type: 'SOLID', color: {r: 0.95, g: 0.95, b: 0.95}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '➖ Minus Sign 2',
        x: 1090,
        y: 403,
        characters: '-',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🔢 Item 2 Quantity',
        x: 1120,
        y: 403,
        characters: '1',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '➕ Item 2 Plus',
        x: 1140,
        y: 390,
        width: 25,
        height: 25,
        fills: [{type: 'SOLID', color: {r: 0.95, g: 0.95, b: 0.95}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '➕ Plus Sign 2',
        x: 1150,
        y: 403,
        characters: '+',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Remove Button Item 2
    {
      nodeType: 'rectangle',
      properties: {
        name: '❌ Remove Item 2',
        x: 1275,
        y: 320,
        width: 20,
        height: 20,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '❌ X Icon 2',
        x: 1282,
        y: 330,
        characters: '×',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Promo Code Section
    {
      nodeType: 'rectangle',
      properties: {
        name: '🎫 Promo Section',
        x: 970,
        y: 450,
        width: 335,
        height: 50,
        fills: [{type: 'SOLID', color: {r: 0.98, g: 0.98, b: 0.98}}],
        strokes: [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '🎫 Promo Input',
        x: 985,
        y: 465,
        width: 200,
        height: 20,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}],
        strokes: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🎫 Promo Placeholder',
        x: 990,
        y: 475,
        characters: 'Enter promo code',
        fontSize: 12,
        fills: [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}]
      }
    },
    {
      nodeType: 'rectangle',
      properties: {
        name: '🎫 Apply Button',
        x: 1200,
        y: 465,
        width: 90,
        height: 20,
        fills: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🎫 Apply Text',
        x: 1235,
        y: 475,
        characters: 'Apply',
        fontSize: 12,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
    },
    // Order Summary Section
    {
      nodeType: 'rectangle',
      properties: {
        name: '📊 Order Summary',
        x: 970,
        y: 520,
        width: 335,
        height: 160,
        fills: [{type: 'SOLID', color: {r: 0.98, g: 0.98, b: 0.98}}],
        strokes: [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}],
        strokeWeight: 1
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '📊 Summary Title',
        x: 985,
        y: 540,
        characters: 'Order Summary',
        fontSize: 18,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Summary Lines
    {
      nodeType: 'text',
      properties: {
        name: '💰 Subtotal Label',
        x: 985,
        y: 565,
        characters: 'Subtotal (3 items)',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '💰 Subtotal Amount',
        x: 1250,
        y: 565,
        characters: '$209.97',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🚚 Shipping Label',
        x: 985,
        y: 585,
        characters: 'Shipping',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🚚 Shipping Amount',
        x: 1260,
        y: 585,
        characters: 'FREE',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0.2, g: 0.7, b: 0.2}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🎯 Tax Label',
        x: 985,
        y: 605,
        characters: 'Tax',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '🎯 Tax Amount',
        x: 1250,
        y: 605,
        characters: '$21.00',
        fontSize: 14,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    // Total Line
    {
      nodeType: 'rectangle',
      properties: {
        name: '📊 Total Divider',
        x: 985,
        y: 625,
        width: 305,
        height: 1,
        fills: [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '💰 Total Label',
        x: 985,
        y: 645,
        characters: 'Total',
        fontSize: 18,
        fills: [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '💰 Total Amount',
        x: 1240,
        y: 645,
        characters: '$230.97',
        fontSize: 18,
        fills: [{type: 'SOLID', color: {r: 0.9, g: 0.2, b: 0.2}}]
      }
    },
    // Checkout Button
    {
      nodeType: 'rectangle',
      properties: {
        name: '💳 Checkout Button',
        x: 970,
        y: 700,
        width: 335,
        height: 50,
        fills: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}]
      }
    },
    {
      nodeType: 'text',
      properties: {
        name: '💳 Checkout Text',
        x: 1105,
        y: 730,
        characters: 'Proceed to Checkout',
        fontSize: 18,
        fills: [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
    },
    // Continue Shopping Link
    {
      nodeType: 'text',
      properties: {
        name: '🛍️ Continue Shopping',
        x: 1100,
        y: 780,
        characters: 'Continue Shopping',
        fontSize: 16,
        fills: [{type: 'SOLID', color: {r: 0, g: 0.5, b: 1}}]
      }
    }
  ];
  
  // Send commands with delay
  for (let i = 0; i < wireframes.length; i++) {
    setTimeout(() => {
      const element = wireframes[i];
      sendCommand(element.nodeType, element.properties, element.properties.name);
    }, i * 200); // 200ms delay between each element
  }
  
  console.log(`🎨 Queued ${wireframes.length} shopping cart wireframe elements for creation`);
  
}, 2000); // Wait 2 seconds for auto-bridge to be ready 