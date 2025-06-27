# Page Organization Features

## Overview

The Page Organization feature set provides comprehensive tools for structuring, tracking, and managing design projects in Figma. This system includes three powerful MCP tools that work together to create a professional project management workflow.

## MCP Tools

### 1. `create_organized_pages`

Create and organize pages by categories, milestones, or projects with proper naming conventions and hierarchical structure.

#### Input Schema
```typescript
{
  fileKey: string,
  pageStructure: {
    categories?: ["wireframes", "components", "prototypes", "assets"],
    milestones?: ["sprint_1", "sprint_2", "launch", "iteration"], 
    projects?: ["mobile_app", "web_app", "design_system"]
  }
}
```

#### Usage Example
```javascript
// Create organized page structure
const result = await mcpClient.callTool('create_organized_pages', {
  fileKey: 'your-figma-file-key',
  pageStructure: {
    categories: ["wireframes", "components", "prototypes"],
    milestones: ["sprint_1", "sprint_2", "launch"],
    projects: ["mobile_app", "web_app"]
  }
});
```

#### Generated Page Structure
```
📊 Project Overview
📁 Wireframes  
📁 Components
📁 Prototypes
🎯 Sprint 1
🎯 Sprint 2  
🎯 Launch
🚀 Mobile App
🚀 Web App
📋 Status Dashboard
```

### 2. `manage_design_status`

Track design progress with status labels, priority levels, assignees, and milestones for better project management.

#### Input Schema
```typescript
{
  fileKey: string,
  nodeId?: string, // Optional - specific node to update
  statusSystem: {
    statuses?: ["todo", "in_progress", "review", "approved", "archived"],
    priority?: "low" | "medium" | "high" | "urgent",
    assignee?: string,
    dueDate?: string, // ISO format
    currentStatus?: "todo" | "in_progress" | "review" | "approved" | "archived"
  }
}
```

#### Usage Examples

**Create Status System:**
```javascript
const statusSystem = await mcpClient.callTool('manage_design_status', {
  fileKey: 'your-figma-file-key',
  statusSystem: {
    statuses: ["todo", "in_progress", "review", "approved", "archived"],
    priority: "high",
    assignee: "Design Team",
    currentStatus: "in_progress"
  }
});
```

**Update Node Status:**
```javascript
const nodeUpdate = await mcpClient.callTool('manage_design_status', {
  fileKey: 'your-figma-file-key',
  nodeId: 'specific-node-id',
  statusSystem: {
    currentStatus: "review",
    priority: "urgent",
    assignee: "John Doe",
    dueDate: "2024-02-15T00:00:00.000Z"
  }
});
```

#### Status Color Coding
- **Todo**: Gray (⏳)
- **In Progress**: Blue (🔄)
- **Review**: Orange (👀)
- **Approved**: Green (✅)
- **Archived**: Dark Gray (📦)

#### Priority Levels
- **Low**: Green (🟢)
- **Medium**: Yellow (🟡)  
- **High**: Orange (🟠)
- **Urgent**: Red (🔴)

### 3. `create_scratchpad_system`

Create organized scratchpad pages for ideas, experiments, mood boards, and inspiration with smart organization methods.

#### Input Schema
```typescript
{
  fileKey: string,
  scratchpadTypes: ["quick_ideas", "experiments", "mood_boards", "inspiration"],
  organizationMethod: "by_date" | "by_project" | "by_theme" | "by_status"
}
```

#### Usage Examples

**Date-Based Organization:**
```javascript
const dateScratchpads = await mcpClient.callTool('create_scratchpad_system', {
  fileKey: 'your-figma-file-key',
  scratchpadTypes: ["quick_ideas", "experiments"],
  organizationMethod: "by_date"
});
```

**Project-Based Organization:**
```javascript
const projectScratchpads = await mcpClient.callTool('create_scratchpad_system', {
  fileKey: 'your-figma-file-key', 
  scratchpadTypes: ["mood_boards", "inspiration"],
  organizationMethod: "by_project"
});
```

#### Scratchpad Types & Icons
- **Quick Ideas**: 💡 - Sticky notes and rapid ideation
- **Experiments**: 🧪 - A/B tests and prototyping
- **Mood Boards**: 🎨 - Visual inspiration and style exploration
- **Inspiration**: ✨ - Reference collection and trend analysis

#### Organization Methods

**By Date (`by_date`):**
- Format: `YYYY-MM-DD - 💡 Quick Ideas`
- Sections: ["Today's Ideas", "Quick Sketches", "Notes", "References"]

**By Project (`by_project`):**
- Format: `💡 Quick Ideas - Project Hub`  
- Sections: ["Mobile App", "Web App", "Design System", "Cross-Platform"]

**By Theme (`by_theme`):**
- Format: `💡 Quick Ideas - Thematic`
- Sections: ["UI Patterns", "Visual Style", "User Flow", "Content Strategy"]

**By Status (`by_status`):**
- Format: `💡 Quick Ideas - Status Based`
- Sections: ["New Ideas", "In Progress", "Need Feedback", "Approved", "Archive"]

## Complete Workflow Example

### E-Commerce Mobile App Project

```javascript
// 1. Create organized page structure
const pages = await mcpClient.callTool('create_organized_pages', {
  fileKey: 'ecommerce-app-file-key',
  pageStructure: {
    categories: ["wireframes", "components", "prototypes", "assets"],
    milestones: ["sprint_1", "sprint_2", "launch", "iteration"],
    projects: ["mobile_app", "web_app", "design_system"]
  }
});

// 2. Set up status tracking system
const statusTracking = await mcpClient.callTool('manage_design_status', {
  fileKey: 'ecommerce-app-file-key',
  statusSystem: {
    statuses: ["todo", "in_progress", "review", "approved", "archived"],
    priority: "high",
    assignee: "UX Team",
    currentStatus: "in_progress"
  }
});

// 3. Create scratchpad systems for different purposes
const ideaScratchpads = await mcpClient.callTool('create_scratchpad_system', {
  fileKey: 'ecommerce-app-file-key',
  scratchpadTypes: ["quick_ideas", "experiments"],
  organizationMethod: "by_date"
});

const designScratchpads = await mcpClient.callTool('create_scratchpad_system', {
  fileKey: 'ecommerce-app-file-key',
  scratchpadTypes: ["mood_boards", "inspiration"],
  organizationMethod: "by_theme"
});

// 4. Update specific milestone status
const milestoneUpdate = await mcpClient.callTool('manage_design_status', {
  fileKey: 'ecommerce-app-file-key',
  statusSystem: {
    currentStatus: "review",
    priority: "urgent", 
    assignee: "Product Manager",
    dueDate: "2024-02-29T00:00:00.000Z"
  }
});
```

## Demo Script Usage

Run the comprehensive demonstration:

```bash
# Run all Page Organization demos
node scripts/create-page-organization-demo.js

# Run specific demos
node scripts/create-page-organization-demo.js organized_pages
node scripts/create-page-organization-demo.js status_tracking  
node scripts/create-page-organization-demo.js scratchpad_system
node scripts/create-page-organization-demo.js comprehensive_organization
```

## Best Practices

### Page Organization
1. **Consistent Naming**: Use emoji prefixes for visual categorization
2. **Logical Hierarchy**: Order pages by importance and workflow
3. **Clear Structure**: Separate work-in-progress from final deliverables

### Status Tracking  
1. **Regular Updates**: Keep status current for accurate project visibility
2. **Priority Assignment**: Use priority levels to focus team attention
3. **Due Date Management**: Set realistic deadlines and track progress

### Scratchpad System
1. **Daily Capture**: Use date-based organization for daily ideation
2. **Project Focus**: Use project-based for specific deliverables
3. **Regular Review**: Archive old ideas and promote good ones

## Integration with Existing Tools

The Page Organization system works seamlessly with existing MCP tools:

- **Wireframe Creation**: Organized pages provide structure for `create_nodes_from_code`
- **Design Variables**: Status tracking can include variable management workflows
- **Code Connections**: Project organization supports better code-design relationships
- **Advanced Layers**: Scratchpad pages are perfect for testing new layer types

## Troubleshooting

### Common Issues

**Pages Not Creating:**
- Verify file key is correct
- Ensure proper permissions on Figma file
- Check bridge server connection

**Status Updates Not Saving:**
- Confirm node ID exists if updating specific nodes
- Validate status values match available options
- Check timestamp format for due dates

**Scratchpad Organization:**
- Ensure organization method is supported
- Verify scratchpad types are valid
- Check for naming conflicts with existing pages

### Debug Mode

Enable verbose logging in demo script:
```bash
DEBUG=true node scripts/create-page-organization-demo.js
```

## API Reference Summary

| Tool | Purpose | Key Features |
|------|---------|--------------|
| `create_organized_pages` | Page structure | Categories, milestones, projects |
| `manage_design_status` | Progress tracking | Status, priority, assignee, dates |
| `create_scratchpad_system` | Ideation support | Multiple organization methods |

## Next Steps

1. **Customize Organization**: Adapt the page structure to your team's workflow
2. **Integrate with Tools**: Use with existing design and development tools
3. **Establish Workflows**: Create team processes around status updates
4. **Scale System**: Expand organization methods based on project needs

## Related Documentation

- [Advanced Layer Support](./ADVANCED_LAYER_SUPPORT.md)
- [Plugin Manifest](./PLUGIN_MANIFEST.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Development Log](./DEVELOPMENT_LOG.md) 