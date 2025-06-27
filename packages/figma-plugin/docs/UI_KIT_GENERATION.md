# UI Kit Generation System

## Overview

The UI Kit Generation system provides automated creation of complete design systems with professional UI components. This system includes two powerful MCP tools that work together to create comprehensive design libraries using modern design principles and atomic design methodology.

## MCP Tools

### 1. `generate_ui_kit`

Generate complete UI kits with all component variations, design system foundations, and organized structure for specific platform types.

#### Input Schema
```typescript
{
  fileKey: string,
  kitType: "mobile_app" | "web_app" | "dashboard" | "e_commerce" | "saas" | "landing_page",
  designSystem?: {
    colorPalette?: {
      primary?: string,
      secondary?: string,
      success?: string,
      warning?: string,
      error?: string,
      neutral?: string[]
    },
    typography?: {
      fontFamily?: string,
      fontSizes?: { xs: number, sm: number, md: number, lg: number, xl: number, xxl: number },
      fontWeights?: { normal: number, medium: number, semibold: number, bold: number }
    },
    spacing?: {
      baseUnit?: number,
      scale?: number[]
    },
    borderRadius?: {
      none: number, sm: number, md: number, lg: number, full: number
    },
    shadows?: {
      sm: string, md: string, lg: string, xl: string
    }
  },
  components?: ["buttons", "inputs", "cards", "navigation", "modals", "tables", "forms", "charts", "icons", "avatars", "badges", "tooltips", "dropdowns", "sliders", "toggles"]
}
```

#### Usage Examples

**Mobile App UI Kit:**
```javascript
const mobileKit = await mcpClient.callTool('generate_ui_kit', {
  fileKey: 'your-figma-file-key',
  kitType: 'mobile_app',
  designSystem: {
    colorPalette: {
      primary: "#007AFF",
      secondary: "#5856D6",
      success: "#34C759"
    },
    typography: {
      fontFamily: "San Francisco",
      fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 32 }
    }
  },
  components: ["buttons", "inputs", "cards", "navigation", "modals", "avatars"]
});
```

**Web App UI Kit:**
```javascript
const webKit = await mcpClient.callTool('generate_ui_kit', {
  fileKey: 'your-figma-file-key',
  kitType: 'web_app',
  designSystem: {
    colorPalette: {
      primary: "#3B82F6",
      secondary: "#8B5CF6"
    },
    typography: {
      fontFamily: "Inter"
    }
  },
  components: ["buttons", "inputs", "cards", "navigation", "tables", "forms"]
});
```

### 2. `create_component_library`

Organize components into a structured library using atomic design principles with proper categorization and hierarchy.

#### Input Schema
```typescript
{
  fileKey: string,
  libraryStructure: {
    foundations?: ["colors", "typography", "spacing", "icons"],
    atoms?: ["buttons", "inputs", "labels", "icons"],
    molecules?: ["forms", "search", "navigation_items"],
    organisms?: ["headers", "footers", "sidebars", "modals"],
    templates?: ["page_layouts", "dashboards", "forms"],
    pages?: ["examples", "documentation"]
  }
}
```

#### Usage Example
```javascript
const componentLibrary = await mcpClient.callTool('create_component_library', {
  fileKey: 'your-figma-file-key',
  libraryStructure: {
    foundations: ["colors", "typography", "spacing", "icons"],
    atoms: ["buttons", "inputs", "labels", "icons"],
    molecules: ["forms", "search", "navigation_items"],
    organisms: ["headers", "footers", "sidebars", "modals"],
    templates: ["page_layouts", "dashboards", "forms"],
    pages: ["examples", "documentation"]
  }
});
```

## Kit Types & Specifications

### Mobile App Kit
- **Platform**: iOS/Android native apps
- **Design System**: Touch-friendly, accessible, platform-native
- **Components**: Buttons, inputs, cards, navigation, modals, avatars, badges
- **Typography**: San Francisco (iOS) / Roboto (Android)
- **Colors**: System colors with high contrast
- **Spacing**: 8px base unit, touch-target optimized

### Web App Kit  
- **Platform**: Responsive web applications
- **Design System**: Cross-browser, responsive, accessible
- **Components**: Buttons, inputs, cards, navigation, tables, forms, dropdowns
- **Typography**: Inter, system fonts
- **Colors**: Web-safe palette with semantic colors
- **Spacing**: 4px base unit, flexible scaling

### Dashboard Kit
- **Platform**: Data-heavy admin interfaces
- **Design System**: Data-focused, scannable, professional
- **Components**: Buttons, inputs, cards, tables, charts, badges
- **Typography**: Condensed, readable at small sizes
- **Colors**: Neutral-heavy with accent colors for data
- **Spacing**: Compact, information-dense

### E-Commerce Kit
- **Platform**: Shopping and retail interfaces
- **Design System**: Conversion-focused, trustworthy, mobile-first
- **Components**: Product cards, CTAs, trust indicators, reviews
- **Typography**: Clear, promotional
- **Colors**: High-conversion reds, trust blues
- **Spacing**: Product-focused, CTA-optimized

### SaaS Kit
- **Platform**: Software-as-a-Service applications
- **Design System**: Professional, scalable, user-centric
- **Components**: Dashboards, settings, billing, user management
- **Typography**: Professional, readable
- **Colors**: Brand-focused with professional neutrals
- **Spacing**: Feature-dense, organized

### Landing Page Kit
- **Platform**: Marketing and promotional websites
- **Design System**: Conversion-focused, visually appealing
- **Components**: Hero sections, CTAs, testimonials, features
- **Typography**: Bold, promotional, hierarchy-focused
- **Colors**: Brand-forward, high-impact
- **Spacing**: Section-based, visual impact

## Atomic Design Structure

### 🎨 Foundations
**Design system building blocks**
- **Colors**: Brand palette, semantic colors, neutral scales
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Base units, scales, layout measurements
- **Icons**: Icon library, styles, usage guidelines

### ⚛️ Atoms
**Basic building blocks**
- **Buttons**: Primary, secondary, outline, ghost variants
- **Inputs**: Text, email, password, textarea, select
- **Labels**: Form labels, tags, badges
- **Icons**: Individual symbols and graphics

### 🧬 Molecules
**Combined atoms**
- **Forms**: Input + label + validation combinations
- **Search**: Input + icon + suggestions
- **Navigation Items**: Link + icon + badge combinations

### 🦠 Organisms
**Complex components**
- **Headers**: Logo + navigation + user menu
- **Footers**: Links + social + legal information
- **Sidebars**: Navigation + user info + actions
- **Modals**: Header + content + actions

### 📐 Templates
**Layout structures**
- **Page Layouts**: Grid systems, responsive breakpoints
- **Dashboards**: Widget arrangements, data layouts
- **Forms**: Multi-step, validation, progress

### 📄 Pages
**Complete examples**
- **Examples**: Real-world page implementations
- **Documentation**: Usage guidelines, best practices

## Component Variations

### Button Variations
```javascript
// Generated automatically for each kit type
[
  { name: "Primary Button", variant: "primary", size: "md", state: "default" },
  { name: "Secondary Button", variant: "secondary", size: "md", state: "default" },
  { name: "Outline Button", variant: "outline", size: "md", state: "default" },
  { name: "Ghost Button", variant: "ghost", size: "md", state: "default" },
  { name: "Small Button", variant: "primary", size: "sm", state: "default" },
  { name: "Large Button", variant: "primary", size: "lg", state: "default" },
  { name: "Disabled Button", variant: "primary", size: "md", state: "disabled" },
  { name: "Loading Button", variant: "primary", size: "md", state: "loading" }
]
```

### Input Variations
```javascript
[
  { name: "Text Input", type: "text", size: "md", state: "default" },
  { name: "Email Input", type: "email", size: "md", state: "default" },
  { name: "Password Input", type: "password", size: "md", state: "default" },
  { name: "Textarea", type: "textarea", size: "md", state: "default" },
  { name: "Select Dropdown", type: "select", size: "md", state: "default" },
  { name: "Input with Error", type: "text", size: "md", state: "error" },
  { name: "Input with Success", type: "text", size: "md", state: "success" },
  { name: "Disabled Input", type: "text", size: "md", state: "disabled" }
]
```

### Card Variations
```javascript
[
  { name: "Basic Card", variant: "basic", layout: "vertical", shadow: "md" },
  { name: "Image Card", variant: "image", layout: "vertical", shadow: "md" },
  { name: "Horizontal Card", variant: "basic", layout: "horizontal", shadow: "md" },
  { name: "Elevated Card", variant: "basic", layout: "vertical", shadow: "lg" },
  { name: "Outline Card", variant: "outline", layout: "vertical", shadow: "none" },
  { name: "Product Card", variant: "product", layout: "vertical", shadow: "md" },
  { name: "Profile Card", variant: "profile", layout: "vertical", shadow: "md" },
  { name: "Stats Card", variant: "stats", layout: "vertical", shadow: "md" }
]
```

## Design System Defaults

### Mobile App Design System
```javascript
{
  colorPalette: {
    primary: "#007AFF",      // iOS Blue
    secondary: "#5856D6",    // iOS Purple
    success: "#34C759",      // iOS Green
    warning: "#FF9500",      // iOS Orange
    error: "#FF3B30",        // iOS Red
    neutral: ["#000000", "#1C1C1E", "#3A3A3C", "#48484A", "#6D6D70", "#8E8E93", "#AEAEB2", "#C7C7CC", "#D1D1D6", "#E5E5EA", "#F2F2F7", "#FFFFFF"]
  },
  typography: {
    fontFamily: "San Francisco",
    fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 32 },
    fontWeights: { normal: 400, medium: 500, semibold: 600, bold: 700 }
  },
  spacing: { baseUnit: 8, scale: [0, 4, 8, 12, 16, 24, 32, 48, 64] },
  borderRadius: { none: 0, sm: 4, md: 8, lg: 12, full: 9999 },
  shadows: { 
    sm: "0 1px 3px rgba(0,0,0,0.12)", 
    md: "0 4px 6px rgba(0,0,0,0.1)", 
    lg: "0 10px 15px rgba(0,0,0,0.1)", 
    xl: "0 20px 25px rgba(0,0,0,0.1)" 
  }
}
```

### Web App Design System
```javascript
{
  colorPalette: {
    primary: "#3B82F6",      // Tailwind Blue
    secondary: "#8B5CF6",    // Tailwind Violet
    success: "#10B981",      // Tailwind Emerald
    warning: "#F59E0B",      // Tailwind Amber
    error: "#EF4444",        // Tailwind Red
    neutral: ["#000000", "#111827", "#1F2937", "#374151", "#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB", "#E5E7EB", "#F3F4F6", "#F9FAFB", "#FFFFFF"]
  },
  typography: {
    fontFamily: "Inter",
    fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
    fontWeights: { normal: 400, medium: 500, semibold: 600, bold: 700 }
  },
  spacing: { baseUnit: 4, scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64] },
  borderRadius: { none: 0, sm: 2, md: 4, lg: 8, full: 9999 },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.07)", 
    lg: "0 10px 15px rgba(0,0,0,0.1)",
    xl: "0 25px 50px rgba(0,0,0,0.25)"
  }
}
```

## Complete Workflow Example

### Multi-Platform Design System

```javascript
// 1. Generate mobile app UI kit
const mobileKit = await mcpClient.callTool('generate_ui_kit', {
  fileKey: 'design-system-file-key',
  kitType: 'mobile_app',
  designSystem: {
    colorPalette: {
      primary: "#6366F1",
      secondary: "#EC4899",
      success: "#10B981"
    }
  },
  components: ["buttons", "inputs", "cards", "navigation", "modals"]
});

// 2. Generate web app UI kit
const webKit = await mcpClient.callTool('generate_ui_kit', {
  fileKey: 'design-system-file-key',
  kitType: 'web_app',
  designSystem: {
    colorPalette: {
      primary: "#6366F1",
      secondary: "#EC4899",
      success: "#10B981"
    }
  },
  components: ["buttons", "inputs", "cards", "navigation", "tables", "forms"]
});

// 3. Generate dashboard kit
const dashboardKit = await mcpClient.callTool('generate_ui_kit', {
  fileKey: 'design-system-file-key',
  kitType: 'dashboard',
  components: ["buttons", "inputs", "cards", "tables", "charts", "badges"]
});

// 4. Create atomic design component library
const componentLibrary = await mcpClient.callTool('create_component_library', {
  fileKey: 'design-system-file-key',
  libraryStructure: {
    foundations: ["colors", "typography", "spacing", "icons"],
    atoms: ["buttons", "inputs", "labels", "icons"],
    molecules: ["forms", "search", "navigation_items"],
    organisms: ["headers", "footers", "sidebars", "modals"],
    templates: ["page_layouts", "dashboards", "forms"],
    pages: ["examples", "documentation"]
  }
});
```

## Demo Script Usage

Run the comprehensive demonstration:

```bash
# Run all UI Kit Generation demos
node scripts/create-ui-kit-demo.js

# Run specific demos
node scripts/create-ui-kit-demo.js mobile_ui_kit
node scripts/create-ui-kit-demo.js web_app_kit
node scripts/create-ui-kit-demo.js dashboard_kit
node scripts/create-ui-kit-demo.js e_commerce_kit
node scripts/create-ui-kit-demo.js component_library
node scripts/create-ui-kit-demo.js comprehensive_kit_system
```

## Best Practices

### Design System Development
1. **Start with Foundations**: Establish colors, typography, and spacing first
2. **Platform Consistency**: Use platform-appropriate patterns and conventions
3. **Scalable Systems**: Design for growth and extensibility
4. **Documentation**: Include usage guidelines and examples

### Component Organization
1. **Atomic Hierarchy**: Follow atomic design principles consistently
2. **Naming Conventions**: Use clear, descriptive names
3. **Variant Management**: Organize by purpose, size, and state
4. **Accessibility**: Include focus states, contrast ratios, and ARIA labels

### Kit Customization
1. **Brand Alignment**: Customize colors and typography for brand consistency
2. **Platform Optimization**: Adapt spacing and sizing for target platforms
3. **Component Selection**: Include only necessary components for your use case
4. **Regular Updates**: Keep kits updated with design system evolution

## Integration with Development

### Code Generation Ready
All generated UI kits include metadata that can be used for:
- **Design Tokens**: Automated token generation for development
- **Component Props**: Structured data for component APIs
- **Documentation**: Automated style guide generation
- **Testing**: Visual regression testing configurations

### Design-to-Code Workflow
```javascript
// Example integration with design tokens
const designTokens = {
  colors: mobileKit.designSystem.colorPalette,
  typography: mobileKit.designSystem.typography,
  spacing: mobileKit.designSystem.spacing,
  components: mobileKit.kitStructure.components
};

// Export to various formats
exportTokens(designTokens, 'scss');
exportTokens(designTokens, 'css-variables');
exportTokens(designTokens, 'javascript');
exportTokens(designTokens, 'json');
```

## Troubleshooting

### Common Issues

**Kit Generation Fails:**
- Verify file key is correct and accessible
- Check component array contains valid component types
- Ensure design system values are properly formatted

**Missing Components:**
- Check if component type is supported for selected kit type
- Verify components array includes desired component types
- Review kit type defaults for automatic component inclusion

**Design System Conflicts:**
- Ensure color values are valid hex codes
- Check font size values are numbers
- Verify spacing scale is an array of numbers

### Performance Optimization

**Large Kit Generation:**
- Generate kits incrementally for large component sets
- Use specific component arrays instead of defaults
- Consider breaking large kits into focused sub-kits

**Memory Management:**
- Process kits sequentially for resource management
- Clear intermediate results when not needed
- Monitor file size for large design systems

## API Reference Summary

| Tool | Purpose | Key Features | Output |
|------|---------|--------------|--------|
| `generate_ui_kit` | Complete UI kit creation | Platform-specific, design system, component variations | Structured kit with foundations and components |
| `create_component_library` | Atomic design organization | Hierarchical structure, categorization, documentation | Organized library with atomic levels |

## Advanced Features

### Custom Design Systems
- **Brand Integration**: Full brand customization support
- **Platform Adaptation**: Automatic platform-specific adjustments
- **Scalable Architecture**: Extensible for complex design systems

### Component Intelligence
- **Variation Generation**: Automatic state and size variations
- **Usage Guidelines**: Built-in documentation and examples
- **Accessibility Support**: WCAG-compliant defaults

### Export Capabilities
- **Multiple Formats**: Support for various design tool formats
- **Developer Handoff**: Code-ready specifications
- **Documentation**: Automatic style guide generation

## Related Documentation

- [Page Organization Features](./PAGE_ORGANIZATION.md)
- [Advanced Layer Support](./ADVANCED_LAYER_SUPPORT.md)
- [Plugin Manifest](./PLUGIN_MANIFEST.md)
- [Project Structure](./PROJECT_STRUCTURE.md) 