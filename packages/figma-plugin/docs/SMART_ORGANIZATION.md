# Smart Organization Features

## Overview

The Smart Organization system provides intelligent tools for creating responsive layouts and organizing design layers automatically. This advanced feature set includes responsive design capabilities and AI-powered layer analysis for optimal design structure.

## Features

### 🎯 Responsive Layout Creation
- **Multi-breakpoint layouts**: Mobile, tablet, desktop, and XL screen support
- **Auto Layout integration**: Intelligent spacing, padding, and alignment
- **Constraint-based design**: Flexible resizing and positioning rules
- **Layout type optimization**: Flex, grid, stack, and absolute positioning

### 🧠 Intelligent Layer Organization
- **Proximity analysis**: Groups nearby elements automatically
- **Similarity detection**: Identifies and organizes similar design elements
- **Hierarchy preservation**: Maintains logical layer structure
- **Functional grouping**: Organizes elements by UI function (buttons, text, containers)

## MCP Tools

### 1. create_responsive_layouts

Creates responsive layouts with auto layout and constraint-based design for multiple screen sizes.

#### Schema
```typescript
{
  name: "create_responsive_layouts",
  description: "Create responsive layouts with auto layout, constraints, and adaptive design for multiple screen sizes",
  inputSchema: {
    type: "object",
    properties: {
      fileKey: {
        type: "string",
        description: "The Figma file key"
      },
      layoutType: {
        type: "string",
        enum: ["flex_row", "flex_column", "grid", "absolute", "stack"],
        description: "Type of responsive layout to create"
      },
      responsive: {
        type: "object",
        properties: {
          breakpoints: {
            type: "array",
            items: {
              type: "string",
              enum: ["mobile", "tablet", "desktop", "xl"]
            },
            description: "Responsive breakpoints to design for"
          },
          constraints: {
            type: "object",
            properties: {
              horizontal: {
                type: "string",
                enum: ["left", "right", "center", "left_right", "scale"],
                description: "Horizontal constraints behavior"
              },
              vertical: {
                type: "string",
                enum: ["top", "bottom", "center", "top_bottom", "scale"],
                description: "Vertical constraints behavior"
              }
            },
            description: "Layout constraints configuration"
          },
          autoLayout: {
            type: "object",
            properties: {
              direction: {
                type: "string",
                enum: ["horizontal", "vertical"],
                description: "Auto layout direction"
              },
              spacing: {
                type: "number",
                description: "Spacing between elements in pixels"
              },
              padding: {
                type: "object",
                properties: {
                  top: { type: "number" },
                  right: { type: "number" },
                  bottom: { type: "number" },
                  left: { type: "number" }
                },
                description: "Container padding values"
              },
              alignment: {
                type: "string",
                enum: ["min", "center", "max", "space_between"],
                description: "Content alignment within container"
              },
              wrap: {
                type: "boolean",
                description: "Allow content wrapping for overflow"
              }
            },
            description: "Auto layout configuration"
          }
        },
        description: "Responsive design configuration"
      },
      content: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "Content element type (e.g., 'text', 'button', 'image')"
            },
            properties: {
              type: "object",
              description: "Element-specific properties"
            }
          }
        },
        description: "Content elements to include in layout"
      }
    },
    required: ["fileKey", "layoutType", "responsive"]
  }
}
```

#### Usage Examples

**Flex Row Layout**
```javascript
{
  fileKey: "your-file-key",
  layoutType: "flex_row",
  responsive: {
    breakpoints: ["mobile", "tablet", "desktop"],
    constraints: {
      horizontal: "left_right",
      vertical: "center"
    },
    autoLayout: {
      direction: "horizontal",
      spacing: 16,
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      alignment: "center",
      wrap: true
    }
  },
  content: [
    { type: "text", properties: { content: "Header Title", fontSize: 24 } },
    { type: "button", properties: { content: "Primary CTA", variant: "primary" } }
  ]
}
```

**Grid Layout**
```javascript
{
  fileKey: "your-file-key",
  layoutType: "grid",
  responsive: {
    breakpoints: ["mobile", "tablet", "desktop"],
    constraints: {
      horizontal: "left_right",
      vertical: "top_bottom"
    },
    autoLayout: {
      direction: "vertical",
      spacing: 24,
      padding: { top: 24, right: 24, bottom: 24, left: 24 }
    }
  },
  content: [
    { type: "card", properties: { title: "Card 1", content: "Grid item 1" } },
    { type: "card", properties: { title: "Card 2", content: "Grid item 2" } }
  ]
}
```

**Stack Layout (Hero Sections)**
```javascript
{
  fileKey: "your-file-key",
  layoutType: "stack",
  responsive: {
    breakpoints: ["mobile", "desktop"],
    constraints: {
      horizontal: "center",
      vertical: "center"
    },
    autoLayout: {
      direction: "vertical",
      spacing: 12,
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      alignment: "center"
    }
  },
  content: [
    { type: "image", properties: { width: 200, height: 150, alt: "Hero image" } },
    { type: "text", properties: { content: "Overlay Title", fontSize: 20, color: "white" } },
    { type: "text", properties: { content: "Subtitle", fontSize: 14, color: "white" } }
  ]
}
```

#### Response Format
```javascript
{
  success: true,
  message: "Responsive flex_row layout created for 3 breakpoints",
  fileKey: "your-file-key",
  layoutType: "flex_row",
  responsiveDesignSystem: {
    breakpoints: [
      { name: "mobile", width: 375, minWidth: 320, maxWidth: 767 },
      { name: "tablet", width: 768, minWidth: 768, maxWidth: 1023 },
      { name: "desktop", width: 1440, minWidth: 1024, maxWidth: 1439 }
    ],
    constraints: { horizontal: "left_right", vertical: "center" },
    autoLayout: { direction: "horizontal", spacing: 16, alignment: "center" },
    layoutType: "flex_row",
    adaptiveRules: [...]
  },
  layoutFrames: [
    {
      name: "📱 Mobile Layout",
      type: "FRAME",
      width: 375,
      height: 812,
      layoutMode: "HORIZONTAL",
      itemSpacing: 16,
      children: [...]
    }
  ],
  breakpointCount: 3,
  adaptiveFeatures: {
    autoLayout: true,
    constraints: true,
    responsiveContent: true,
    breakpointOptimization: true
  },
  timestamp: "2024-01-20T10:30:00Z"
}
```

### 2. organize_layers_as_containers

Intelligently analyzes and organizes layers into logical containers based on proximity, similarity, hierarchy, and function.

#### Schema
```typescript
{
  name: "organize_layers_as_containers",
  description: "Intelligently analyze and organize layers into logical containers based on proximity, similarity, hierarchy, and function",
  inputSchema: {
    type: "object",
    properties: {
      fileKey: {
        type: "string",
        description: "The Figma file key"
      },
      nodeIds: {
        type: "array",
        items: { type: "string" },
        description: "Specific node IDs to organize (optional, analyzes all if not provided)"
      },
      organizationRules: {
        type: "object",
        properties: {
          groupBy: {
            type: "array",
            items: {
              type: "string",
              enum: ["proximity", "similarity", "hierarchy", "function"]
            },
            description: "Criteria for intelligent grouping"
          },
          containerTypes: {
            type: "array",
            items: {
              type: "string",
              enum: ["section", "frame", "auto_layout", "component"]
            },
            description: "Types of containers to create"
          },
          namingConvention: {
            type: "string",
            description: "Pattern for naming containers (e.g., 'Section {number}', 'Container_{type}')"
          },
          preserveHierarchy: {
            type: "boolean",
            description: "Whether to preserve existing layer hierarchy"
          },
          createComponents: {
            type: "boolean",
            description: "Whether to convert organized groups into reusable components"
          }
        },
        description: "Rules for organizing layers into containers"
      },
      analysisOptions: {
        type: "object",
        properties: {
          proximityThreshold: {
            type: "number",
            description: "Distance threshold for proximity grouping (pixels)"
          },
          similarityThreshold: {
            type: "number",
            description: "Similarity threshold for grouping similar elements (0-1)"
          },
          minGroupSize: {
            type: "number",
            description: "Minimum number of elements to form a group"
          },
          maxGroupSize: {
            type: "number",
            description: "Maximum number of elements in a group"
          }
        },
        description: "Options for intelligent layer analysis and grouping"
      }
    },
    required: ["fileKey", "organizationRules"]
  }
}
```

#### Usage Examples

**Proximity-based Organization**
```javascript
{
  fileKey: "your-file-key",
  organizationRules: {
    groupBy: ["proximity"],
    containerTypes: ["frame", "auto_layout"],
    namingConvention: "Proximity Group {number}",
    preserveHierarchy: true,
    createComponents: false
  },
  analysisOptions: {
    proximityThreshold: 100,
    minGroupSize: 2,
    maxGroupSize: 8
  }
}
```

**Similarity-based Organization (with Component Creation)**
```javascript
{
  fileKey: "your-file-key",
  organizationRules: {
    groupBy: ["similarity"],
    containerTypes: ["auto_layout", "component"],
    namingConvention: "Similar {type} Group",
    preserveHierarchy: false,
    createComponents: true
  },
  analysisOptions: {
    similarityThreshold: 0.8,
    minGroupSize: 3,
    maxGroupSize: 6
  }
}
```

**Comprehensive Multi-criteria Organization**
```javascript
{
  fileKey: "your-file-key",
  organizationRules: {
    groupBy: ["proximity", "similarity", "hierarchy", "function"],
    containerTypes: ["section", "frame", "auto_layout", "component"],
    namingConvention: "Smart Container {number}",
    preserveHierarchy: true,
    createComponents: true
  },
  analysisOptions: {
    proximityThreshold: 75,
    similarityThreshold: 0.7,
    minGroupSize: 2,
    maxGroupSize: 10
  }
}
```

#### Response Format
```javascript
{
  success: true,
  message: "Organized 15 layers into 6 intelligent containers",
  fileKey: "your-file-key",
  organizationRules: { groupBy: ["proximity", "similarity"], ... },
  analysisOptions: { proximityThreshold: 75, ... },
  analysisResults: {
    proximityGroups: [
      { elements: [...], confidence: 0.9 }
    ],
    similarityGroups: [
      { elements: [...], confidence: 0.85 }
    ],
    hierarchyGroups: [...],
    functionalGroups: [...]
  },
  organizedContainers: [
    {
      name: "Smart Container 1",
      type: "auto_layout",
      groupingCriteria: "proximity",
      elements: [...],
      confidence: 0.9,
      properties: { x: 100, y: 100, width: 300, height: 200 },
      autoLayout: { direction: "horizontal", spacing: 16 },
      isComponent: false
    }
  ],
  organizationStats: {
    totalLayers: 15,
    containersCreated: 6,
    layersOrganized: 14,
    organizationEfficiency: 93.3,
    groupingBreakdown: {
      proximity: 3,
      similarity: 2,
      hierarchy: 1,
      functional: 2
    }
  },
  recommendations: [
    {
      type: "optimization",
      title: "Auto Layout Optimization",
      description: "3 auto layout containers were created. Review spacing and alignment for consistency.",
      priority: "low"
    }
  ],
  timestamp: "2024-01-20T10:30:00Z"
}
```

## Layout Types

### Flex Row (`flex_row`)
- **Best for**: Navigation bars, toolbars, button groups
- **Behavior**: Arranges elements horizontally with flexible spacing
- **Auto Layout**: Horizontal direction with optional wrapping
- **Responsive**: Adapts to screen width, may stack on mobile

### Flex Column (`flex_column`) 
- **Best for**: Page layouts, form structures, content sections
- **Behavior**: Arranges elements vertically with consistent spacing
- **Auto Layout**: Vertical direction with scalable gaps
- **Responsive**: Maintains vertical flow across all breakpoints

### Grid (`grid`)
- **Best for**: Card layouts, galleries, dashboard widgets
- **Behavior**: Creates flexible grid systems
- **Auto Layout**: Adaptive column count based on screen size
- **Responsive**: 1 column (mobile) → 2 columns (tablet) → 3+ columns (desktop)

### Stack (`stack`)
- **Best for**: Hero sections, overlays, layered content
- **Behavior**: Centers and stacks elements on top of each other
- **Auto Layout**: Centered alignment with overlay positioning
- **Responsive**: Scales proportionally across devices

### Absolute (`absolute`)
- **Best for**: Fixed positioning, custom layouts, precise control
- **Behavior**: Maintains exact positioning relative to container
- **Auto Layout**: Disabled (uses manual positioning)
- **Responsive**: Uses constraints for adaptive positioning

## Organization Criteria

### Proximity Analysis
- **Algorithm**: Calculates distance between element centers
- **Threshold**: Configurable pixel distance (default: 50px)
- **Output**: Groups nearby elements into spatial containers
- **Use Case**: Organizing scattered UI elements into logical sections

### Similarity Detection
- **Algorithm**: Compares element properties (type, size, color, style)
- **Threshold**: Configurable similarity score (0-1, default: 0.7)
- **Output**: Groups elements with similar visual characteristics
- **Use Case**: Creating consistent component libraries

### Hierarchy Preservation
- **Algorithm**: Analyzes layer parent-child relationships
- **Behavior**: Maintains existing layer structure when grouping
- **Output**: Hierarchical container organization
- **Use Case**: Preserving designer intent while improving organization

### Functional Grouping
- **Algorithm**: Identifies UI patterns (buttons, text, images, containers)
- **Classification**: Groups by UI function and interaction type
- **Output**: Functionally organized sections
- **Use Case**: Creating logical UI structure (headers, content, footers)

## Container Types

### Section (`section`)
- **Purpose**: High-level organizational container
- **Properties**: Large padding, subtle background, rounded corners
- **Best for**: Page sections, content areas, major layout divisions
- **Auto Layout**: Optional, typically disabled for flexible positioning

### Frame (`frame`)
- **Purpose**: Basic grouping container
- **Properties**: Minimal styling, transparent background
- **Best for**: Simple grouping, maintaining visual hierarchy
- **Auto Layout**: Optional, preserves original layout

### Auto Layout (`auto_layout`)
- **Purpose**: Dynamic layout container with intelligent spacing
- **Properties**: Automatic spacing, padding, alignment
- **Best for**: Navigation, button groups, form elements
- **Auto Layout**: Always enabled with optimized settings

### Component (`component`)
- **Purpose**: Reusable design element
- **Properties**: Component styling, consistent variants
- **Best for**: Repeated elements, design system components
- **Auto Layout**: Enabled when beneficial for the component type

## Breakpoint System

### Mobile (`mobile`)
- **Width**: 375px (default)
- **Range**: 320px - 767px
- **Characteristics**: Single column, compact spacing, touch-friendly sizing
- **Auto Layout**: Vertical orientation, reduced padding

### Tablet (`tablet`)
- **Width**: 768px (default)
- **Range**: 768px - 1023px
- **Characteristics**: 2-column layouts, medium spacing, hybrid interactions
- **Auto Layout**: Flexible direction, moderate padding

### Desktop (`desktop`)
- **Width**: 1440px (default)
- **Range**: 1024px - 1439px
- **Characteristics**: Multi-column layouts, generous spacing, mouse interactions
- **Auto Layout**: Horizontal preference, full padding

### XL (`xl`)
- **Width**: 1920px (default)
- **Range**: 1440px+
- **Characteristics**: Wide layouts, maximum content width, desktop-optimized
- **Auto Layout**: Wide horizontal layouts, maximum spacing

## Best Practices

### Responsive Layout Design
1. **Start Mobile-First**: Design for smallest screen first, then scale up
2. **Use Consistent Spacing**: Maintain spacing ratios across breakpoints
3. **Test Auto Layout**: Verify behavior with dynamic content
4. **Optimize for Touch**: Ensure mobile interactions are touch-friendly
5. **Content Priority**: Show most important content on smaller screens

### Layer Organization
1. **Group Logically**: Use functional grouping for UI sections
2. **Maintain Hierarchy**: Preserve meaningful layer structure
3. **Name Consistently**: Use clear, descriptive container names
4. **Create Components**: Convert repeated elements to components
5. **Review Organization**: Check grouping efficiency and adjust thresholds

### Performance Considerations
1. **Limit Complexity**: Avoid excessive nesting in auto layout
2. **Optimize Groups**: Keep group sizes manageable (2-10 elements)
3. **Use Constraints**: Prefer constraints over fixed positioning
4. **Test Responsiveness**: Verify layouts work across all breakpoints
5. **Monitor Performance**: Check Figma performance with complex layouts

## Integration Examples

### E-commerce Product Grid
```javascript
// Create responsive product grid
await figmaClient.createResponsiveLayouts("file-key", "grid", {
  breakpoints: ["mobile", "tablet", "desktop"],
  autoLayout: {
    direction: "vertical",
    spacing: 24,
    padding: { top: 24, right: 16, bottom: 24, left: 16 }
  }
}, [
  { type: "card", properties: { title: "Product 1", price: "$29.99" } },
  { type: "card", properties: { title: "Product 2", price: "$39.99" } }
]);

// Organize product cards into logical containers
await figmaClient.organizeLayersAsContainers("file-key", null, {
  groupBy: ["similarity", "function"],
  containerTypes: ["auto_layout", "component"],
  createComponents: true
}, {
  similarityThreshold: 0.8,
  minGroupSize: 2
});
```

### Dashboard Layout
```javascript
// Create responsive dashboard layout
await figmaClient.createResponsiveLayouts("file-key", "flex_column", {
  breakpoints: ["tablet", "desktop", "xl"],
  constraints: { horizontal: "left_right", vertical: "top_bottom" },
  autoLayout: {
    direction: "vertical",
    spacing: 32,
    padding: { top: 32, right: 32, bottom: 32, left: 32 }
  }
}, [
  { type: "header", properties: { title: "Dashboard" } },
  { type: "stats", properties: { widgets: 4 } },
  { type: "charts", properties: { count: 3 } },
  { type: "table", properties: { rows: 10 } }
]);

// Organize dashboard elements by function
await figmaClient.organizeLayersAsContainers("file-key", null, {
  groupBy: ["function", "hierarchy"],
  containerTypes: ["section", "auto_layout"],
  namingConvention: "Dashboard {type} Section"
}, {
  minGroupSize: 2,
  maxGroupSize: 8
});
```

## Testing and Validation

Use the test suite to validate Smart Organization functionality:

```bash
# Run all Smart Organization tests
node tests/test-smart-organization.js

# Run demo script
node scripts/create-smart-organization-demo.js

# Test specific layout type
node scripts/create-smart-organization-demo.js responsive_flex_layout

# Test specific organization method
node scripts/create-smart-organization-demo.js proximity_organization
```

## Troubleshooting

### Common Issues

**Layout Not Responsive**
- Verify breakpoints are properly configured
- Check auto layout settings for each breakpoint
- Ensure constraints are set correctly

**Poor Organization Results**
- Adjust proximity/similarity thresholds
- Review grouping criteria selection
- Check min/max group size settings

**Performance Issues**
- Reduce max group size
- Limit breakpoint count
- Simplify auto layout configurations

**Missing Content**
- Verify content array is properly formatted
- Check element type mappings
- Ensure required properties are included

### Error Messages

**"Invalid layoutType"**
- Use valid layout types: flex_row, flex_column, grid, absolute, stack

**"Breakpoint configuration error"**
- Ensure breakpoints array contains valid values
- Check breakpoint-specific configuration

**"Organization threshold out of range"**
- proximityThreshold: positive number (pixels)
- similarityThreshold: 0-1 decimal value

**"Auto layout configuration invalid"**
- Verify direction is "horizontal" or "vertical"
- Check spacing is a positive number
- Ensure alignment uses valid values

## Advanced Features

### Custom Breakpoints
```javascript
// Define custom breakpoint behavior
const responsiveConfig = {
  breakpoints: ["mobile", "desktop"],
  customBreakpoints: {
    mobile: { width: 390, spacing: 12, padding: 16 },
    desktop: { width: 1200, spacing: 20, padding: 32 }
  }
};
```

### Advanced Organization Rules
```javascript
// Complex organization with multiple criteria
const organizationRules = {
  groupBy: ["proximity", "similarity", "function"],
  weights: { proximity: 0.4, similarity: 0.4, function: 0.2 },
  containerTypes: ["auto_layout", "component"],
  hierarchyLevels: 3,
  componentThreshold: 0.9
};
```

### Performance Optimization
```javascript
// Optimize for large files
const analysisOptions = {
  batchSize: 50,
  parallelProcessing: true,
  cacheResults: true,
  skipSimilarityCheck: false
};
```

This Smart Organization system provides comprehensive tools for creating responsive, well-organized designs efficiently. The combination of responsive layout creation and intelligent layer organization enables designers to maintain consistency and structure across complex design systems. 