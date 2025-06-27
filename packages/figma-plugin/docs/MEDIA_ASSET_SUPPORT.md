# Media & Asset Support

The Media & Asset Support feature provides comprehensive tools for creating, managing, and optimizing media assets within your Figma designs. This system supports multiple media types, AI generation, optimization, and advanced asset library management.

## Features Overview

### 🎬 Media Creation & Optimization
- Support for images, GIFs, videos, Lottie animations, and interactive prototypes
- AI-powered media generation with customizable prompts and styles
- Advanced optimization with format conversion, quality control, and compression
- Smart placement with auto layout integration

### 📚 Asset Library Management
- Organized asset categorization (icons, illustrations, photos, animations, logos, patterns, textures)
- Advanced search and filtering capabilities
- Version control with multiple strategies (semantic, timestamp, incremental)
- Library organization with automated page creation and navigation

## Available Tools

### 1. create_media_assets

Create and manage media assets with optimization and AI generation capabilities.

#### Parameters

```typescript
{
  fileKey: string;           // The Figma file key
  mediaType: "image" | "gif" | "video" | "lottie" | "interactive_prototype";
  source: {
    url?: string;            // External URL source
    upload?: string;         // Base64 encoded data or file path
    generate?: {             // AI generation configuration
      prompt: string;        // Generation prompt
      style: string;         // Style (e.g., "photorealistic", "illustration", "icon")
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  optimization?: {
    format?: "png" | "jpg" | "webp" | "svg" | "gif" | "mp4" | "json";
    quality?: number;        // 0-100, higher = better quality
    dimensions?: {
      width?: number;
      height?: number;
      maintainAspectRatio?: boolean;
    };
    compression?: {
      lossless?: boolean;
      progressive?: boolean;
    };
  };
  placement?: {
    x?: number;              // X position in Figma
    y?: number;              // Y position in Figma
    containerName?: string;  // Container to place media in
    autoLayout?: boolean;    // Use auto layout positioning
  };
}
```

#### Example Usage

```javascript
// AI Generated Image
const aiImageResult = await figmaClient.createMediaAssets(
  "fileKey123",
  "image",
  {
    generate: {
      prompt: "Modern minimalist dashboard interface with clean typography",
      style: "ui_design",
      dimensions: { width: 1200, height: 800 }
    }
  },
  {
    format: "webp",
    quality: 85,
    compression: { lossless: false, progressive: true }
  },
  {
    x: 100,
    y: 100,
    autoLayout: false
  }
);

// Lottie Animation from URL
const lottieResult = await figmaClient.createMediaAssets(
  "fileKey123",
  "lottie",
  {
    url: "https://assets.lottiefiles.com/packages/lf20_loading.json"
  },
  {
    format: "json",
    quality: 100
  },
  {
    x: 300,
    y: 300,
    autoLayout: true
  }
);

// Optimized Image Upload
const uploadResult = await figmaClient.createMediaAssets(
  "fileKey123",
  "image",
  {
    upload: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..."
  },
  {
    format: "webp",
    quality: 70,
    dimensions: { width: 400, height: 300, maintainAspectRatio: true }
  },
  {
    x: 500,
    y: 100,
    containerName: "Media Container"
  }
);
```

#### Response Structure

```javascript
{
  success: true,
  message: "Created image asset successfully",
  fileKey: "fileKey123",
  mediaType: "image",
  assetMetadata: {
    id: "media_1703123456789",
    name: "Image Asset",
    type: "image",
    source: "ai_generated",
    dimensions: { width: 1200, height: 800 },
    format: "webp",
    fileSize: 245760,
    quality: 85,
    createdAt: "2023-12-21T10:30:56.789Z",
    lastModified: "2023-12-21T10:30:56.789Z"
  },
  optimization: {
    originalSize: 350000,
    optimizedSize: 245760,
    compressionRatio: 0.3,
    qualityScore: 0.85
  },
  placement: {
    method: "manual",
    coordinates: { x: 100, y: 100 },
    container: null,
    autoLayout: false,
    constraints: { horizontal: "left", vertical: "top" },
    zIndex: 5
  },
  assetAnalytics: {
    creationMethod: "ai_generated",
    optimizationApplied: true,
    aiGenerated: true,
    placementMethod: "manual",
    estimatedLoadTime: 0.049
  },
  recommendations: [
    {
      type: "format",
      priority: "medium",
      title: "Format Optimization",
      description: "Consider using WebP format for better compression",
      suggestion: "Switch to WebP format for 25-35% smaller file sizes"
    }
  ]
}
```

### 2. manage_asset_library

Organize and manage reusable assets with search, version control, and library organization.

#### Parameters

```typescript
{
  fileKey: string;
  operation: "create" | "update" | "organize" | "search" | "delete";
  assetCategories?: ("icons" | "illustrations" | "photos" | "animations" | "logos" | "patterns" | "textures")[];
  assets?: Array<{
    id?: string;             // Asset ID for updates
    name: string;            // Asset name
    category: string;        // Asset category
    tags?: string[];         // Searchable tags
    metadata?: {
      description?: string;
      author?: string;
      license?: string;
      usage?: string;
    };
    source?: {
      url?: string;
      nodeId?: string;
      componentId?: string;
    };
  }>;
  libraryStructure?: {
    createPages?: boolean;   // Create organized pages
    namingConvention?: string; // Page naming pattern
    groupByCategory?: boolean;
    includeMetadata?: boolean;
  };
  searchCriteria?: {
    query?: string;          // Text search
    category?: string;       // Category filter
    tags?: string[];         // Tag filters
    dateRange?: {
      start?: string;
      end?: string;
    };
  };
  versionControl?: {
    enableVersioning?: boolean;
    versionStrategy?: "semantic" | "timestamp" | "incremental";
    backupOriginals?: boolean;
    changeTracking?: boolean;
  };
}
```

#### Example Usage

```javascript
// Create Asset Library
const createResult = await figmaClient.manageAssetLibrary(
  "fileKey123",
  "create",
  ["icons", "illustrations", "photos", "animations"],
  [
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
    }
  ],
  {
    createPages: true,
    namingConvention: "Assets - {category}",
    groupByCategory: true,
    includeMetadata: true
  }
);

// Search Assets
const searchResult = await figmaClient.manageAssetLibrary(
  "fileKey123",
  "search",
  undefined,
  undefined,
  undefined,
  {
    query: "icon",
    category: "icons",
    tags: ["navigation", "ui"]
  }
);

// Update Assets with Version Control
const updateResult = await figmaClient.manageAssetLibrary(
  "fileKey123",
  "update",
  undefined,
  [
    {
      id: "asset_1",
      name: "Updated Home Icon",
      category: "icons",
      tags: ["navigation", "home", "ui", "updated"]
    }
  ],
  undefined,
  undefined,
  {
    enableVersioning: true,
    versionStrategy: "semantic",
    backupOriginals: true,
    changeTracking: true
  }
);
```

## Media Types & Formats

### Supported Media Types

| Type | Description | Supported Formats | Use Cases |
|------|-------------|-------------------|-----------|
| **image** | Static images and graphics | PNG, JPG, WebP, SVG | UI elements, photos, illustrations |
| **gif** | Animated images | GIF | Simple animations, loading states |
| **video** | Video content | MP4 | Product demos, tutorials, backgrounds |
| **lottie** | Vector animations | JSON | Complex animations, micro-interactions |
| **interactive_prototype** | Interactive components | JSON | Prototypes, interactive demos |

### Optimization Options

#### Image Optimization
- **WebP**: 25-35% smaller than PNG/JPG
- **Progressive JPEG**: Better perceived loading
- **Quality Control**: 0-100 scale for size/quality balance
- **Dimension Scaling**: Maintain aspect ratio or custom sizing

#### Animation Optimization
- **Lossless Compression**: For vector animations
- **Frame Rate Control**: Optimize animation smoothness
- **File Size Reduction**: Smart compression algorithms

## Asset Categories

### 🔷 Icons
Small graphics and symbols for UI elements
- Navigation icons
- Action buttons
- Status indicators
- Brand symbols

### 🎨 Illustrations
Custom artwork and decorative graphics
- Hero illustrations
- Empty state graphics
- Marketing visuals
- Character illustrations

### 📷 Photos
Photography and realistic imagery
- Product photos
- User avatars
- Background images
- Stock photography

### 🎬 Animations
Animated graphics and motion assets
- Loading animations
- Micro-interactions
- Transition effects
- Lottie animations

### 🏷️ Logos
Brand logos and identity graphics
- Company logos
- Partner logos
- Certification badges
- Brand marks

### 🔳 Patterns
Repeatable design patterns and motifs
- Background patterns
- Texture overlays
- Geometric patterns
- Decorative elements

### 🎭 Textures
Surface textures and material patterns
- Paper textures
- Fabric patterns
- Material surfaces
- Artistic textures

## Version Control Strategies

### Semantic Versioning
- **Format**: MAJOR.MINOR.PATCH (e.g., 1.2.3)
- **Use Case**: Systematic version tracking
- **Best For**: Design systems, component libraries

### Timestamp Versioning
- **Format**: YYYY-MM-DD-HH-mm-ss
- **Use Case**: Time-based version tracking
- **Best For**: Iterative design processes

### Incremental Versioning
- **Format**: Sequential numbers (1, 2, 3...)
- **Use Case**: Simple version counting
- **Best For**: Quick iterations, drafts

## AI Generation Styles

### UI Design
- Clean, modern interfaces
- Minimal design elements
- Professional typography
- Consistent spacing

### Photorealistic
- Realistic imagery
- Natural lighting
- High detail rendering
- Photo-quality output

### Illustration
- Vector-style graphics
- Artistic interpretation
- Custom color palettes
- Creative composition

### Icon Style
- Simple, clean symbols
- Consistent stroke width
- Minimal detail
- Scalable design

### Abstract
- Creative patterns
- Artistic interpretation
- Unique compositions
- Experimental styles

## Performance Optimization

### File Size Guidelines
- **Icons**: < 50KB (prefer SVG)
- **Images**: < 500KB (use WebP)
- **Animations**: < 200KB (optimize frames)
- **Videos**: < 5MB (compress quality)

### Loading Time Optimization
- **Progressive Loading**: Enable for large images
- **Format Selection**: Use appropriate formats
- **Compression**: Balance quality vs. size
- **Lazy Loading**: Consider implementation

### Figma Performance
- **Auto Layout**: Use for responsive behavior
- **Constraints**: Optimize for different screen sizes
- **Layer Organization**: Group related assets
- **Component Usage**: Create reusable elements

## Integration Examples

### Design System Integration
```javascript
// Create design system assets
const designSystemAssets = await figmaClient.manageAssetLibrary(
  fileKey,
  "create",
  ["icons", "illustrations", "patterns"],
  designSystemComponents,
  {
    createPages: true,
    namingConvention: "Design System - {category}",
    groupByCategory: true,
    includeMetadata: true
  },
  undefined,
  {
    enableVersioning: true,
    versionStrategy: "semantic",
    backupOriginals: true
  }
);
```

### AI Content Generation
```javascript
// Generate contextual media
const contextualMedia = await figmaClient.createMediaAssets(
  fileKey,
  "image",
  {
    generate: {
      prompt: "Professional dashboard showing analytics data with modern UI",
      style: "ui_design",
      dimensions: { width: 1440, height: 900 }
    }
  },
  {
    format: "webp",
    quality: 90,
    compression: { progressive: true }
  }
);
```

### Asset Search & Discovery
```javascript
// Search for specific assets
const searchResults = await figmaClient.manageAssetLibrary(
  fileKey,
  "search",
  undefined,
  undefined,
  undefined,
  {
    query: "button",
    tags: ["ui", "interactive"],
    category: "icons"
  }
);
```

## Best Practices

### Asset Organization
1. **Consistent Naming**: Use clear, descriptive names
2. **Proper Tagging**: Add relevant, searchable tags
3. **Category Structure**: Organize by logical categories
4. **Metadata Completion**: Include descriptions and usage notes

### Optimization Guidelines
1. **Format Selection**: Choose appropriate formats for content type
2. **Quality Balance**: Optimize for both quality and performance
3. **Dimension Planning**: Consider multiple screen sizes
4. **Compression Strategy**: Use progressive loading for large assets

### Version Management
1. **Regular Backups**: Enable backup originals
2. **Change Tracking**: Document significant changes
3. **Version Strategy**: Choose consistent versioning approach
4. **Archive Management**: Clean up old versions periodically

### Performance Considerations
1. **File Size Monitoring**: Keep assets within recommended limits
2. **Loading Optimization**: Use progressive formats when possible
3. **Caching Strategy**: Consider browser caching implications
4. **Responsive Design**: Optimize for different breakpoints

## Troubleshooting

### Common Issues

#### Large File Sizes
- **Solution**: Increase compression, reduce quality, or resize dimensions
- **Prevention**: Set file size limits in optimization settings

#### Poor Quality Output
- **Solution**: Increase quality setting or use lossless compression
- **Prevention**: Test quality settings before final generation

#### AI Generation Issues
- **Solution**: Refine prompts, try different styles, check dimensions
- **Prevention**: Use specific, detailed prompts with clear style guidelines

#### Search Not Finding Assets
- **Solution**: Check tag spelling, expand search criteria, verify categories
- **Prevention**: Use consistent tagging and naming conventions

### Error Handling
The system provides detailed error messages and recommendations for optimization and troubleshooting. Always check the `recommendations` array in responses for improvement suggestions.

## API Response Examples

### Successful Media Creation
```javascript
{
  success: true,
  message: "Created lottie asset successfully",
  mediaType: "lottie",
  assetMetadata: {
    id: "media_1703123456789",
    name: "Lottie Asset",
    type: "lottie",
    format: "json",
    dimensions: { width: 300, height: 300 },
    fileSize: 125000
  },
  recommendations: [
    {
      type: "optimization",
      priority: "low",
      title: "File Size Acceptable",
      description: "File size is within recommended limits"
    }
  ]
}
```

### Asset Library Search Results
```javascript
{
  success: true,
  operation: "search",
  results: [
    {
      id: "asset_1",
      name: "Home Icon",
      category: "icons",
      tags: ["navigation", "home", "ui"],
      fileSize: 2480,
      createdAt: "2023-12-20T10:30:56.789Z"
    }
  ],
  totalResults: 1,
  searchCriteria: {
    query: "home",
    category: "icons"
  }
}
```

The Media & Asset Support system provides a comprehensive solution for managing all your design assets with professional-grade optimization, intelligent organization, and powerful search capabilities. 