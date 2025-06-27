import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { FigmaClient } from "../figma-client";
import { z } from "zod";

// Zod schemas for validation
const GetFileSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
});

const GetFileNodesSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  nodeIds: z.array(z.string()).describe("Array of node IDs to fetch"),
});

const GetImagesSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  nodeIds: z.array(z.string()).describe("Array of node IDs to render"),
  format: z.enum(["png", "jpg", "svg", "pdf"]).describe("Image format"),
  scale: z.number().optional().describe("Scale factor for raster images"),
});

const GetCommentsSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
});

const PostCommentSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  message: z.string().describe("Comment message"),
  x: z.number().optional().describe("X coordinate for comment"),
  y: z.number().optional().describe("Y coordinate for comment"),
});

// New schemas for creation tools
const CreateNodesFromCodeSchema = z.object({
  fileKey: z.string().describe("The Figma file key where nodes will be created"),
  code: z.string().describe("UI code (HTML/CSS, React JSX, Vue template, etc.) to convert to Figma nodes"),
  framework: z.enum(["html", "react", "vue", "angular", "svelte", "unknown"]).optional().describe("Framework used in the code"),
  parentNodeId: z.string().optional().describe("Parent node ID where new nodes should be placed"),
  x: z.number().optional().describe("X position for the created nodes"),
  y: z.number().optional().describe("Y position for the created nodes"),
});

const SetDesignVariablesSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  variables: z.record(z.any()).describe("Design variables to set (colors, fonts, spacing, etc.)"),
  variableCollection: z.string().optional().describe("Name of the variable collection"),
});

const EstablishCodeConnectionsSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  nodeId: z.string().describe("Node ID to establish code connection for"),
  codeInfo: z.object({
    componentName: z.string().describe("Name of the component in code"),
    filePath: z.string().describe("Path to the component file"),
    repository: z.string().optional().describe("Repository URL"),
    framework: z.string().optional().describe("Framework (React, Vue, etc.)"),
  }).describe("Code connection information"),
});

const GenerateDesignPreviewSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  designDescription: z.string().describe("Description of the design to create and preview"),
  width: z.number().optional().describe("Width of the preview (default 375)"),
  height: z.number().optional().describe("Height of the preview (default 812)"),
  style: z.string().optional().describe("Design style (modern, minimal, corporate, etc.)"),
  format: z.enum(["png", "jpg", "svg"]).optional().describe("Preview image format"),
});

// New schemas for Page Organization tools
const CreateOrganizedPagesSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  pageStructure: z.object({
    categories: z.array(z.enum(["wireframes", "components", "prototypes", "assets"])).optional().describe("Page categories"),
    milestones: z.array(z.enum(["sprint_1", "sprint_2", "launch", "iteration"])).optional().describe("Project milestones"),
    projects: z.array(z.enum(["mobile_app", "web_app", "design_system"])).optional().describe("Project types"),
  }).describe("Page organization structure"),
});

const ManageDesignStatusSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  nodeId: z.string().optional().describe("Node ID to update status for"),
  statusSystem: z.object({
    statuses: z.array(z.enum(["todo", "in_progress", "review", "approved", "archived"])).optional().describe("Available status options"),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional().describe("Priority level"),
    assignee: z.string().optional().describe("Person assigned to this task"),
    dueDate: z.string().optional().describe("Due date for completion"),
    currentStatus: z.enum(["todo", "in_progress", "review", "approved", "archived"]).optional().describe("Current status to set"),
  }).describe("Status tracking system"),
});

const CreateScratchpadSystemSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  scratchpadTypes: z.array(z.enum(["quick_ideas", "experiments", "mood_boards", "inspiration"])).describe("Types of scratchpad pages to create"),
  organizationMethod: z.enum(["by_date", "by_project", "by_theme", "by_status"]).describe("How to organize scratchpad pages"),
});

// New schemas for UI Kit Generation tools
const GenerateUIKitSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  kitType: z.enum(["mobile_app", "web_app", "dashboard", "e_commerce", "saas", "landing_page"]).describe("Type of UI kit to generate"),
  designSystem: z.object({
    colorPalette: z.object({
      primary: z.string().optional().describe("Primary color"),
      secondary: z.string().optional().describe("Secondary color"), 
      success: z.string().optional().describe("Success color"),
      warning: z.string().optional().describe("Warning color"),
      error: z.string().optional().describe("Error color"),
      neutral: z.array(z.string()).optional().describe("Neutral colors array"),
    }).optional().describe("Color palette configuration"),
    typography: z.object({
      fontFamily: z.string().optional().describe("Primary font family"),
      fontSizes: z.object({
        xs: z.number().optional(),
        sm: z.number().optional(),
        md: z.number().optional(),
        lg: z.number().optional(),
        xl: z.number().optional(),
        xxl: z.number().optional(),
      }).optional().describe("Font size scale"),
      fontWeights: z.object({
        normal: z.number().optional(),
        medium: z.number().optional(),
        semibold: z.number().optional(),
        bold: z.number().optional(),
      }).optional().describe("Font weight scale"),
    }).optional().describe("Typography configuration"),
    spacing: z.object({
      baseUnit: z.number().optional().describe("Base spacing unit"),
      scale: z.array(z.number()).optional().describe("Spacing scale multipliers"),
    }).optional().describe("Spacing system"),
    borderRadius: z.object({
      none: z.number().optional(),
      sm: z.number().optional(),
      md: z.number().optional(),
      lg: z.number().optional(),
      full: z.number().optional(),
    }).optional().describe("Border radius values"),
    shadows: z.object({
      sm: z.string().optional(),
      md: z.string().optional(),
      lg: z.string().optional(),
      xl: z.string().optional(),
    }).optional().describe("Shadow definitions"),
  }).describe("Design system configuration"),
  components: z.array(z.enum([
    "buttons", "inputs", "cards", "navigation", "modals", 
    "tables", "forms", "charts", "icons", "avatars",
    "badges", "tooltips", "dropdowns", "sliders", "toggles"
  ])).describe("Components to include in the UI kit"),
});

const CreateComponentLibrarySchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  libraryStructure: z.object({
    foundations: z.array(z.enum(["colors", "typography", "spacing", "icons"])).optional().describe("Foundation elements"),
    atoms: z.array(z.enum(["buttons", "inputs", "labels", "icons"])).optional().describe("Atomic components"),
    molecules: z.array(z.enum(["forms", "search", "navigation_items"])).optional().describe("Molecular components"),
    organisms: z.array(z.enum(["headers", "footers", "sidebars", "modals"])).optional().describe("Organism components"),
    templates: z.array(z.enum(["page_layouts", "dashboards", "forms"])).optional().describe("Template layouts"),
    pages: z.array(z.enum(["examples", "documentation"])).optional().describe("Example pages"),
  }).describe("Atomic design library structure"),
});

// New schemas for Smart Organization tools
const CreateResponsiveLayoutsSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  layoutType: z.enum(["flex_row", "flex_column", "grid", "absolute", "stack"]).describe("Type of responsive layout to create"),
  responsive: z.object({
    breakpoints: z.array(z.enum(["mobile", "tablet", "desktop", "xl"])).optional().describe("Responsive breakpoints"),
    constraints: z.object({
      horizontal: z.enum(["left", "right", "center", "left_right", "scale"]).optional().describe("Horizontal constraints"),
      vertical: z.enum(["top", "bottom", "center", "top_bottom", "scale"]).optional().describe("Vertical constraints"),
    }).optional().describe("Layout constraints"),
    autoLayout: z.object({
      direction: z.enum(["horizontal", "vertical"]).optional().describe("Auto layout direction"),
      spacing: z.number().optional().describe("Spacing between elements"),
      padding: z.object({
        top: z.number().optional(),
        right: z.number().optional(),
        bottom: z.number().optional(),
        left: z.number().optional(),
      }).optional().describe("Container padding"),
      alignment: z.enum(["min", "center", "max", "space_between"]).optional().describe("Content alignment"),
      wrap: z.boolean().optional().describe("Allow content wrapping"),
    }).optional().describe("Auto layout configuration"),
  }).describe("Responsive design configuration"),
  content: z.array(z.object({
    type: z.string().describe("Content element type"),
    properties: z.record(z.any()).optional().describe("Element properties"),
  })).optional().describe("Content elements to include"),
});

const OrganizeLayersAsContainersSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  nodeIds: z.array(z.string()).optional().describe("Specific node IDs to organize (optional, will analyze all if not provided)"),
  organizationRules: z.object({
    groupBy: z.array(z.enum(["proximity", "similarity", "hierarchy", "function"])).describe("Criteria for grouping layers"),
    containerTypes: z.array(z.enum(["section", "frame", "auto_layout", "component"])).describe("Types of containers to create"),
    namingConvention: z.string().optional().describe("Pattern for naming containers (e.g., 'Section {number}', 'Container_{type}')"),
    preserveHierarchy: z.boolean().optional().describe("Whether to preserve existing layer hierarchy"),
    createComponents: z.boolean().optional().describe("Whether to convert organized groups into components"),
  }).describe("Rules for organizing layers into containers"),
  analysisOptions: z.object({
    proximityThreshold: z.number().optional().describe("Distance threshold for proximity grouping (pixels)"),
    similarityThreshold: z.number().optional().describe("Similarity threshold for grouping similar elements (0-1)"),
    minGroupSize: z.number().optional().describe("Minimum number of elements to form a group"),
    maxGroupSize: z.number().optional().describe("Maximum number of elements in a group"),
  }).optional().describe("Options for layer analysis and grouping"),
});

// New schemas for Media & Asset Support tools
const CreateMediaAssetsSchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  mediaType: z.enum(["image", "gif", "video", "lottie", "interactive_prototype"]).describe("Type of media asset to create"),
  source: z.object({
    url: z.string().optional().describe("URL source for media"),
    upload: z.string().optional().describe("Upload path or base64 data"),
    generate: z.object({
      prompt: z.string().optional().describe("AI generation prompt"),
      style: z.string().optional().describe("Generation style (e.g., 'photorealistic', 'illustration', 'icon')"),
      dimensions: z.object({
        width: z.number().optional(),
        height: z.number().optional(),
      }).optional().describe("Generated media dimensions"),
    }).optional().describe("AI generation configuration"),
  }).describe("Media source configuration"),
  optimization: z.object({
    format: z.enum(["png", "jpg", "webp", "svg", "gif", "mp4", "json"]).optional().describe("Output format"),
    quality: z.number().min(0).max(100).optional().describe("Compression quality (0-100)"),
    dimensions: z.object({
      width: z.number().optional(),
      height: z.number().optional(),
      maintainAspectRatio: z.boolean().optional(),
    }).optional().describe("Optimization dimensions"),
    compression: z.object({
      lossless: z.boolean().optional(),
      progressive: z.boolean().optional(),
    }).optional().describe("Compression settings"),
  }).optional().describe("Media optimization settings"),
  placement: z.object({
    x: z.number().optional().describe("X position in Figma"),
    y: z.number().optional().describe("Y position in Figma"),
    containerName: z.string().optional().describe("Container to place media in"),
    autoLayout: z.boolean().optional().describe("Use auto layout positioning"),
  }).optional().describe("Media placement configuration"),
});

const ManageAssetLibrarySchema = z.object({
  fileKey: z.string().describe("The Figma file key"),
  operation: z.enum(["create", "update", "organize", "search", "delete"]).describe("Asset library operation"),
  assetCategories: z.array(z.enum(["icons", "illustrations", "photos", "animations", "logos", "patterns", "textures"])).optional().describe("Asset categories to manage"),
  assets: z.array(z.object({
    id: z.string().optional().describe("Asset ID for updates"),
    name: z.string().describe("Asset name"),
    category: z.enum(["icons", "illustrations", "photos", "animations", "logos", "patterns", "textures"]).describe("Asset category"),
    tags: z.array(z.string()).optional().describe("Asset tags for search"),
    metadata: z.object({
      description: z.string().optional(),
      author: z.string().optional(),
      license: z.string().optional(),
      usage: z.string().optional(),
    }).optional().describe("Asset metadata"),
    source: z.object({
      url: z.string().optional(),
      nodeId: z.string().optional(),
      componentId: z.string().optional(),
    }).optional().describe("Asset source reference"),
  })).optional().describe("Assets to manage"),
  libraryStructure: z.object({
    createPages: z.boolean().optional().describe("Create organized pages for categories"),
    namingConvention: z.string().optional().describe("Page naming pattern"),
    groupByCategory: z.boolean().optional().describe("Group assets by category"),
    includeMetadata: z.boolean().optional().describe("Include metadata frames"),
  }).optional().describe("Library organization structure"),
  searchCriteria: z.object({
    query: z.string().optional().describe("Search query"),
    category: z.string().optional().describe("Category filter"),
    tags: z.array(z.string()).optional().describe("Tag filters"),
    dateRange: z.object({
      start: z.string().optional(),
      end: z.string().optional(),
    }).optional().describe("Date range filter"),
  }).optional().describe("Asset search criteria"),
  versionControl: z.object({
    enableVersioning: z.boolean().optional().describe("Enable asset versioning"),
    versionStrategy: z.enum(["semantic", "timestamp", "incremental"]).optional().describe("Versioning strategy"),
    backupOriginals: z.boolean().optional().describe("Keep backup of original assets"),
    changeTracking: z.boolean().optional().describe("Track asset changes"),
  }).optional().describe("Version control configuration"),
});

export class FigmaTools {
  private figmaClient: FigmaClient;

  constructor(figmaClient: FigmaClient) {
    this.figmaClient = figmaClient;
  }

  // Define all available tools
  getTools(): Tool[] {
    return [
      {
        name: "get_figma_file",
        description: "Get information about a Figma file including all nodes, components, and styles",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key (from file URL)",
            },
          },
          required: ["fileKey"],
        },
      },
      {
        name: "get_figma_nodes",
        description: "Get specific nodes from a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            nodeIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of node IDs to fetch",
            },
          },
          required: ["fileKey", "nodeIds"],
        },
      },
      {
        name: "get_figma_images",
        description: "Render nodes from a Figma file as images",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            nodeIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of node IDs to render",
            },
            format: {
              type: "string",
              enum: ["png", "jpg", "svg", "pdf"],
              description: "Image format",
            },
            scale: {
              type: "number",
              description: "Scale factor for raster images (1-4)",
              minimum: 0.01,
              maximum: 4,
            },
          },
          required: ["fileKey", "nodeIds", "format"],
        },
      },
      {
        name: "get_figma_comments",
        description: "Get comments from a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
          },
          required: ["fileKey"],
        },
      },
      {
        name: "post_figma_comment",
        description: "Post a comment to a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            message: {
              type: "string",
              description: "Comment message",
            },
            x: {
              type: "number",
              description: "X coordinate for comment placement",
            },
            y: {
              type: "number", 
              description: "Y coordinate for comment placement",
            },
          },
          required: ["fileKey", "message"],
        },
      },
      {
        name: "get_figma_versions",
        description: "Get version history of a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
          },
          required: ["fileKey"],
        },
      },
      {
        name: "get_team_projects",
        description: "Get projects from a team",
        inputSchema: {
          type: "object",
          properties: {
            teamId: {
              type: "string",
              description: "The team ID",
            },
          },
          required: ["teamId"],
        },
      },
      {
        name: "get_project_files",
        description: "Get files from a project",
        inputSchema: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              description: "The project ID",
            },
          },
          required: ["projectId"],
        },
      },
      {
        name: "get_user_profile",
        description: "Get current user profile information",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      // NEW CREATION TOOLS (mirrors of Figma to Code Converter)
      {
        name: "create_nodes_from_code",
        description: "Create Figma nodes from UI code (HTML/CSS, React, Vue, etc.). This is the inverse of get_code - instead of generating code from Figma, it creates Figma nodes from code.",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key where nodes will be created",
            },
            code: {
              type: "string",
              description: "UI code (HTML/CSS, React JSX, Vue template, etc.) to convert to Figma nodes",
            },
            framework: {
              type: "string",
              enum: ["html", "react", "vue", "angular", "svelte", "unknown"],
              description: "Framework used in the code",
            },
            parentNodeId: {
              type: "string",
              description: "Parent node ID where new nodes should be placed",
            },
            x: {
              type: "number",
              description: "X position for the created nodes",
            },
            y: {
              type: "number",
              description: "Y position for the created nodes",
            },
          },
          required: ["fileKey", "code"],
        },
      },
      {
        name: "set_design_variables",
        description: "Set design variables in a Figma file (colors, typography, spacing, etc.). This is the inverse of get_variable_defs - instead of reading variables, it creates and sets them.",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            variables: {
              type: "object",
              description: "Design variables to set (e.g., {'primary-color': '#3B82F6', 'font-size-lg': '18px'})",
            },
            variableCollection: {
              type: "string",
              description: "Name of the variable collection (default: 'Default Collection')",
            },
          },
          required: ["fileKey", "variables"],
        },
      },
      {
        name: "establish_code_connections",
        description: "Establish connections between Figma nodes and code components. This is the inverse of get_code_connect_map - instead of reading connections, it creates them.",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            nodeId: {
              type: "string",
              description: "Node ID to establish code connection for",
            },
            codeInfo: {
              type: "object",
              properties: {
                componentName: {
                  type: "string",
                  description: "Name of the component in code",
                },
                filePath: {
                  type: "string",
                  description: "Path to the component file",
                },
                repository: {
                  type: "string",
                  description: "Repository URL",
                },
                framework: {
                  type: "string",
                  description: "Framework (React, Vue, etc.)",
                },
              },
              required: ["componentName", "filePath"],
              description: "Code connection information",
            },
          },
          required: ["fileKey", "nodeId", "codeInfo"],
        },
      },
      {
        name: "generate_design_preview",
        description: "Generate a design preview from a description and create it in Figma. This is the inverse of get_image - instead of getting images of existing designs, it creates new designs and previews them.",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            designDescription: {
              type: "string",
              description: "Description of the design to create and preview",
            },
            width: {
              type: "number",
              description: "Width of the preview (default 375)",
            },
            height: {
              type: "number",
              description: "Height of the preview (default 812)",
            },
            style: {
              type: "string",
              description: "Design style (modern, minimal, corporate, etc.)",
            },
            format: {
              type: "string",
              enum: ["png", "jpg", "svg"],
              description: "Preview image format",
            },
          },
          required: ["fileKey", "designDescription"],
        },
      },
      // NEW PAGE ORGANIZATION TOOLS
      {
        name: "create_organized_pages",
        description: "Create and organize pages by categories, milestones, or projects with proper naming conventions and structure",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            pageStructure: {
              type: "object",
              properties: {
                categories: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["wireframes", "components", "prototypes", "assets"]
                  },
                  description: "Page categories to create"
                },
                milestones: {
                  type: "array", 
                  items: {
                    type: "string",
                    enum: ["sprint_1", "sprint_2", "launch", "iteration"]
                  },
                  description: "Project milestones to organize by"
                },
                projects: {
                  type: "array",
                  items: {
                    type: "string", 
                    enum: ["mobile_app", "web_app", "design_system"]
                  },
                  description: "Project types to organize"
                }
              },
              description: "Page organization structure"
            }
          },
          required: ["fileKey", "pageStructure"],
        },
      },
      {
        name: "manage_design_status",
        description: "Track design progress with status labels, priority levels, assignees, and milestones for better project management",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            nodeId: {
              type: "string",
              description: "Node ID to update status for (optional, if not provided will create status system)",
            },
            statusSystem: {
              type: "object",
              properties: {
                statuses: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["todo", "in_progress", "review", "approved", "archived"]
                  },
                  description: "Available status options"
                },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high", "urgent"],
                  description: "Priority level"
                },
                assignee: {
                  type: "string",
                  description: "Person assigned to this task"
                },
                dueDate: {
                  type: "string",
                  description: "Due date for completion (ISO format)"
                },
                currentStatus: {
                  type: "string",
                  enum: ["todo", "in_progress", "review", "approved", "archived"],
                  description: "Current status to set"
                }
              },
              description: "Status tracking system configuration"
            }
          },
          required: ["fileKey", "statusSystem"],
        },
      },
      {
        name: "create_scratchpad_system",
        description: "Create organized scratchpad pages for ideas, experiments, mood boards, and inspiration with smart organization methods",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            scratchpadTypes: {
              type: "array",
              items: {
                type: "string",
                enum: ["quick_ideas", "experiments", "mood_boards", "inspiration"]
              },
              description: "Types of scratchpad pages to create"
            },
            organizationMethod: {
              type: "string",
              enum: ["by_date", "by_project", "by_theme", "by_status"],
              description: "How to organize scratchpad pages"
            }
          },
          required: ["fileKey", "scratchpadTypes", "organizationMethod"],
        },
      },
      // NEW UI KIT GENERATION TOOLS
      {
        name: "generate_ui_kit",
        description: "Generate complete UI kits with all component variations, design system foundations, and organized structure",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            kitType: {
              type: "string",
              enum: ["mobile_app", "web_app", "dashboard", "e_commerce", "saas", "landing_page"],
              description: "Type of UI kit to generate",
            },
            designSystem: {
              type: "object",
              properties: {
                colorPalette: {
                  type: "object",
                  properties: {
                    primary: {
                      type: "string",
                      description: "Primary color (hex)",
                    },
                    secondary: {
                      type: "string",
                      description: "Secondary color (hex)",
                    },
                    success: {
                      type: "string",
                      description: "Success color (hex)",
                    },
                    warning: {
                      type: "string",
                      description: "Warning color (hex)",
                    },
                    error: {
                      type: "string",
                      description: "Error color (hex)",
                    },
                    neutral: {
                      type: "array",
                      items: { type: "string" },
                      description: "Neutral colors array",
                    },
                  },
                  description: "Color palette configuration",
                },
                typography: {
                  type: "object",
                  properties: {
                    fontFamily: {
                      type: "string",
                      description: "Primary font family",
                    },
                    fontSizes: {
                      type: "object",
                      properties: {
                        xs: { type: "number" },
                        sm: { type: "number" },
                        md: { type: "number" },
                        lg: { type: "number" },
                        xl: { type: "number" },
                        xxl: { type: "number" },
                      },
                      description: "Font size scale",
                    },
                    fontWeights: {
                      type: "object",
                      properties: {
                        normal: { type: "number" },
                        medium: { type: "number" },
                        semibold: { type: "number" },
                        bold: { type: "number" },
                      },
                      description: "Font weight scale",
                    },
                  },
                  description: "Typography configuration",
                },
                spacing: {
                  type: "object",
                  properties: {
                    baseUnit: {
                      type: "number",
                      description: "Base spacing unit",
                    },
                    scale: {
                      type: "array",
                      items: { type: "number" },
                      description: "Spacing scale multipliers",
                    },
                  },
                  description: "Spacing system",
                },
                borderRadius: {
                  type: "object",
                  properties: {
                    none: { type: "number" },
                    sm: { type: "number" },
                    md: { type: "number" },
                    lg: { type: "number" },
                    full: { type: "number" },
                  },
                  description: "Border radius values",
                },
                shadows: {
                  type: "object",
                  properties: {
                    sm: { type: "string" },
                    md: { type: "string" },
                    lg: { type: "string" },
                    xl: { type: "string" },
                  },
                  description: "Shadow definitions",
                },
              },
              description: "Design system configuration",
            },
            components: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "buttons", "inputs", "cards", "navigation", "modals", 
                  "tables", "forms", "charts", "icons", "avatars",
                  "badges", "tooltips", "dropdowns", "sliders", "toggles"
                ]
              },
              description: "Components to include in the UI kit",
            },
          },
          required: ["fileKey", "kitType", "components"],
        },
      },
      {
        name: "create_component_library",
        description: "Organize components into a structured library using atomic design principles with proper categorization",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            libraryStructure: {
              type: "object",
              properties: {
                foundations: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["colors", "typography", "spacing", "icons"]
                  },
                  description: "Foundation elements to include",
                },
                atoms: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["buttons", "inputs", "labels", "icons"]
                  },
                  description: "Atomic components to include",
                },
                molecules: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["forms", "search", "navigation_items"]
                  },
                  description: "Molecular components to include",
                },
                organisms: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["headers", "footers", "sidebars", "modals"]
                  },
                  description: "Organism components to include",
                },
                templates: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["page_layouts", "dashboards", "forms"]
                  },
                  description: "Template layouts to include",
                },
                pages: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["examples", "documentation"]
                  },
                  description: "Example pages to include",
                },
              },
              description: "Atomic design library structure",
            },
          },
          required: ["fileKey", "libraryStructure"],
        },
      },
      // NEW RESPONSIVE LAYOUT TOOLS
      {
        name: "create_responsive_layouts",
        description: "Create responsive layouts with various types and configurations",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            layoutType: {
              type: "string",
              enum: ["flex_row", "flex_column", "grid", "absolute", "stack"],
              description: "Type of responsive layout to create",
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
                  description: "Responsive breakpoints",
                },
                constraints: {
                  type: "object",
                  properties: {
                    horizontal: {
                      type: "string",
                      enum: ["left", "right", "center", "left_right", "scale"],
                      description: "Horizontal constraints",
                    },
                    vertical: {
                      type: "string",
                      enum: ["top", "bottom", "center", "top_bottom", "scale"],
                      description: "Vertical constraints",
                    },
                  },
                  description: "Layout constraints",
                },
                autoLayout: {
                  type: "object",
                  properties: {
                    direction: {
                      type: "string",
                      enum: ["horizontal", "vertical"],
                      description: "Auto layout direction",
                    },
                    spacing: {
                      type: "number",
                      description: "Spacing between elements",
                    },
                    padding: {
                      type: "object",
                      properties: {
                        top: {
                          type: "number",
                          description: "Container padding top",
                        },
                        right: {
                          type: "number",
                          description: "Container padding right",
                        },
                        bottom: {
                          type: "number",
                          description: "Container padding bottom",
                        },
                        left: {
                          type: "number",
                          description: "Container padding left",
                        },
                      },
                      description: "Container padding",
                    },
                    alignment: {
                      type: "string",
                      enum: ["min", "center", "max", "space_between"],
                      description: "Content alignment",
                    },
                    wrap: {
                      type: "boolean",
                      description: "Allow content wrapping",
                    },
                  },
                  description: "Auto layout configuration",
                },
              },
              description: "Responsive design configuration",
            },
            content: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    description: "Content element type",
                  },
                  properties: {
                    type: "object",
                    description: "Element properties",
                  },
                },
              },
              description: "Content elements to include",
            },
          },
          required: ["fileKey", "layoutType", "responsive", "content"],
        },
      },
      // NEW ORGANIZATION TOOLS
      {
        name: "organize_layers_as_containers",
        description: "Organize layers into containers based on specified rules and analysis options",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            nodeIds: {
              type: "array",
              items: {
                type: "string",
                description: "Specific node IDs to organize (optional, will analyze all if not provided)",
              },
            },
            organizationRules: {
              type: "object",
              properties: {
                groupBy: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["proximity", "similarity", "hierarchy", "function"],
                    description: "Criteria for grouping layers",
                  },
                  description: "Criteria for grouping layers",
                },
                containerTypes: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["section", "frame", "auto_layout", "component"],
                    description: "Types of containers to create",
                  },
                  description: "Types of containers to create",
                },
                namingConvention: {
                  type: "string",
                  description: "Pattern for naming containers (e.g., 'Section {number}', 'Container_{type}')",
                },
                preserveHierarchy: {
                  type: "boolean",
                  description: "Whether to preserve existing layer hierarchy",
                },
                createComponents: {
                  type: "boolean",
                  description: "Whether to convert organized groups into components",
                },
              },
              description: "Rules for organizing layers into containers",
            },
            analysisOptions: {
              type: "object",
              properties: {
                proximityThreshold: {
                  type: "number",
                  description: "Distance threshold for proximity grouping (pixels)",
                },
                similarityThreshold: {
                  type: "number",
                  description: "Similarity threshold for grouping similar elements (0-1)",
                },
                minGroupSize: {
                  type: "number",
                  description: "Minimum number of elements to form a group",
                },
                maxGroupSize: {
                  type: "number",
                  description: "Maximum number of elements in a group",
                },
              },
              description: "Options for layer analysis and grouping",
            },
          },
          required: ["fileKey", "organizationRules", "analysisOptions"],
        },
      },
      // NEW MEDIA & ASSET SUPPORT TOOLS
      {
        name: "create_media_assets",
        description: "Create and manage images, GIFs, videos, Lottie animations, and interactive media with optimization and AI generation",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            mediaType: {
              type: "string",
              enum: ["image", "gif", "video", "lottie", "interactive_prototype"],
              description: "Type of media asset to create",
            },
            source: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  description: "URL source for media (e.g., external image, video URL)",
                },
                upload: {
                  type: "string",
                  description: "Upload path or base64 encoded data",
                },
                generate: {
                  type: "object",
                  properties: {
                    prompt: {
                      type: "string",
                      description: "AI generation prompt for creating media",
                    },
                    style: {
                      type: "string",
                      description: "Generation style (e.g., 'photorealistic', 'illustration', 'icon', 'abstract')",
                    },
                    dimensions: {
                      type: "object",
                      properties: {
                        width: { type: "number" },
                        height: { type: "number" },
                      },
                      description: "Generated media dimensions",
                    },
                  },
                  description: "AI generation configuration",
                },
              },
              description: "Media source configuration",
            },
            optimization: {
              type: "object",
              properties: {
                format: {
                  type: "string",
                  enum: ["png", "jpg", "webp", "svg", "gif", "mp4", "json"],
                  description: "Output format for the media",
                },
                quality: {
                  type: "number",
                  minimum: 0,
                  maximum: 100,
                  description: "Compression quality (0-100, higher = better quality)",
                },
                dimensions: {
                  type: "object",
                  properties: {
                    width: { type: "number" },
                    height: { type: "number" },
                    maintainAspectRatio: { type: "boolean" },
                  },
                  description: "Optimization dimensions",
                },
                compression: {
                  type: "object",
                  properties: {
                    lossless: { type: "boolean" },
                    progressive: { type: "boolean" },
                  },
                  description: "Advanced compression settings",
                },
              },
              description: "Media optimization settings",
            },
            placement: {
              type: "object",
              properties: {
                x: {
                  type: "number",
                  description: "X position in Figma canvas",
                },
                y: {
                  type: "number",
                  description: "Y position in Figma canvas",
                },
                containerName: {
                  type: "string",
                  description: "Name of container/frame to place media in",
                },
                autoLayout: {
                  type: "boolean",
                  description: "Use auto layout positioning if available",
                },
              },
              description: "Media placement configuration in Figma",
            },
          },
          required: ["fileKey", "mediaType", "source"],
        },
      },
      {
        name: "manage_asset_library",
        description: "Organize and manage reusable assets, media libraries, and version control for design system assets",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: {
              type: "string",
              description: "The Figma file key",
            },
            operation: {
              type: "string",
              enum: ["create", "update", "organize", "search", "delete"],
              description: "Asset library operation to perform",
            },
            assetCategories: {
              type: "array",
              items: {
                type: "string",
                enum: ["icons", "illustrations", "photos", "animations", "logos", "patterns", "textures"]
              },
              description: "Asset categories to manage",
            },
            assets: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "Asset ID for updates (optional for new assets)",
                  },
                  name: {
                    type: "string",
                    description: "Asset name",
                  },
                  category: {
                    type: "string",
                    enum: ["icons", "illustrations", "photos", "animations", "logos", "patterns", "textures"],
                    description: "Asset category",
                  },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "Asset tags for searchability",
                  },
                  metadata: {
                    type: "object",
                    properties: {
                      description: { type: "string" },
                      author: { type: "string" },
                      license: { type: "string" },
                      usage: { type: "string" },
                    },
                    description: "Asset metadata",
                  },
                  source: {
                    type: "object",
                    properties: {
                      url: { type: "string" },
                      nodeId: { type: "string" },
                      componentId: { type: "string" },
                    },
                    description: "Asset source reference",
                  },
                },
                required: ["name", "category"],
              },
              description: "Assets to manage",
            },
            libraryStructure: {
              type: "object",
              properties: {
                createPages: {
                  type: "boolean",
                  description: "Create organized pages for different categories",
                },
                namingConvention: {
                  type: "string",
                  description: "Page naming pattern (e.g., 'Assets - {category}')",
                },
                groupByCategory: {
                  type: "boolean",
                  description: "Group assets by category within pages",
                },
                includeMetadata: {
                  type: "boolean",
                  description: "Include metadata information frames",
                },
              },
              description: "Library organization structure configuration",
            },
            searchCriteria: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Text search query",
                },
                category: {
                  type: "string",
                  description: "Category filter",
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Tag filters",
                },
                dateRange: {
                  type: "object",
                  properties: {
                    start: { type: "string" },
                    end: { type: "string" },
                  },
                  description: "Date range filter (ISO date strings)",
                },
              },
              description: "Asset search criteria",
            },
            versionControl: {
              type: "object",
              properties: {
                enableVersioning: {
                  type: "boolean",
                  description: "Enable asset versioning",
                },
                versionStrategy: {
                  type: "string",
                  enum: ["semantic", "timestamp", "incremental"],
                  description: "Versioning strategy to use",
                },
                backupOriginals: {
                  type: "boolean",
                  description: "Keep backup copies of original assets",
                },
                changeTracking: {
                  type: "boolean",
                  description: "Track and log asset changes",
                },
              },
              description: "Version control configuration for assets",
            },
          },
          required: ["fileKey", "operation"],
        },
      },
    ];
  }

  // Handle tool execution
  async executeTool(name: string, args: any): Promise<any> {
    try {
      switch (name) {
        case "get_figma_file":
          const fileArgs = GetFileSchema.parse(args);
          return await this.figmaClient.getFile(fileArgs.fileKey);

        case "get_figma_nodes":
          const nodesArgs = GetFileNodesSchema.parse(args);
          return await this.figmaClient.getFileNodes(nodesArgs.fileKey, nodesArgs.nodeIds);

        case "get_figma_images":
          const imagesArgs = GetImagesSchema.parse(args);
          return await this.figmaClient.getImages({
            fileKey: imagesArgs.fileKey,
            nodeIds: imagesArgs.nodeIds,
            format: imagesArgs.format,
            scale: imagesArgs.scale,
          });

        case "get_figma_comments":
          const commentsArgs = GetCommentsSchema.parse(args);
          return await this.figmaClient.getComments(commentsArgs.fileKey);

        case "post_figma_comment":
          const postCommentArgs = PostCommentSchema.parse(args);
          return await this.figmaClient.postComment(
            postCommentArgs.fileKey,
            postCommentArgs.message,
            { x: postCommentArgs.x, y: postCommentArgs.y }
          );

        case "get_figma_versions":
          const versionsArgs = GetFileSchema.parse(args);
          return await this.figmaClient.getVersions(versionsArgs.fileKey);

        case "get_team_projects":
          return await this.figmaClient.getTeamProjects(args.teamId);

        case "get_project_files":
          return await this.figmaClient.getProjectFiles(args.projectId);

        case "get_user_profile":
          return await this.figmaClient.getUser();

        case "create_nodes_from_code":
          const createNodesArgs = CreateNodesFromCodeSchema.parse(args);
          return await this.figmaClient.createNodesFromCode(
            createNodesArgs.fileKey,
            createNodesArgs.code,
            createNodesArgs.framework,
            createNodesArgs.parentNodeId,
            createNodesArgs.x,
            createNodesArgs.y
          );

        case "set_design_variables":
          const setVariablesArgs = SetDesignVariablesSchema.parse(args);
          return await this.figmaClient.setDesignVariables(
            setVariablesArgs.fileKey,
            setVariablesArgs.variables,
            setVariablesArgs.variableCollection
          );

        case "establish_code_connections":
          const establishConnectionsArgs = EstablishCodeConnectionsSchema.parse(args);
          return await this.figmaClient.establishCodeConnections(
            establishConnectionsArgs.fileKey,
            establishConnectionsArgs.nodeId,
            establishConnectionsArgs.codeInfo
          );

        case "generate_design_preview":
          const generatePreviewArgs = GenerateDesignPreviewSchema.parse(args);
          return await this.figmaClient.generateDesignPreview(
            generatePreviewArgs.fileKey,
            generatePreviewArgs.designDescription,
            generatePreviewArgs.width,
            generatePreviewArgs.height,
            generatePreviewArgs.style,
            generatePreviewArgs.format
          );

        // NEW PAGE ORGANIZATION TOOL HANDLERS
        case "create_organized_pages":
          const createPagesArgs = CreateOrganizedPagesSchema.parse(args);
          return await this.figmaClient.createOrganizedPages(
            createPagesArgs.fileKey,
            createPagesArgs.pageStructure
          );

        case "manage_design_status":
          const manageStatusArgs = ManageDesignStatusSchema.parse(args);
          return await this.figmaClient.manageDesignStatus(
            manageStatusArgs.fileKey,
            manageStatusArgs.nodeId,
            manageStatusArgs.statusSystem
          );

        case "create_scratchpad_system":
          const createScratchpadArgs = CreateScratchpadSystemSchema.parse(args);
          return await this.figmaClient.createScratchpadSystem(
            createScratchpadArgs.fileKey,
            createScratchpadArgs.scratchpadTypes,
            createScratchpadArgs.organizationMethod
          );

        // NEW UI KIT GENERATION TOOL HANDLERS
        case "generate_ui_kit":
          const generateUIKitArgs = GenerateUIKitSchema.parse(args);
          return await this.figmaClient.generateUIKit(
            generateUIKitArgs.fileKey,
            generateUIKitArgs.kitType,
            generateUIKitArgs.designSystem,
            generateUIKitArgs.components
          );

        case "create_component_library":
          const createLibraryArgs = CreateComponentLibrarySchema.parse(args);
          return await this.figmaClient.createComponentLibrary(
            createLibraryArgs.fileKey,
            createLibraryArgs.libraryStructure
          );

        // NEW RESPONSIVE LAYOUT TOOL HANDLERS
        case "create_responsive_layouts":
          const createLayoutArgs = CreateResponsiveLayoutsSchema.parse(args);
          return await this.figmaClient.createResponsiveLayouts(
            createLayoutArgs.fileKey,
            createLayoutArgs.layoutType,
            createLayoutArgs.responsive,
            createLayoutArgs.content
          );

        // NEW ORGANIZATION TOOL HANDLERS
        case "organize_layers_as_containers":
          const organizeLayersArgs = OrganizeLayersAsContainersSchema.parse(args);
          return await this.figmaClient.organizeLayersAsContainers(
            organizeLayersArgs.fileKey,
            organizeLayersArgs.nodeIds,
            organizeLayersArgs.organizationRules,
            organizeLayersArgs.analysisOptions
          );

        // NEW MEDIA & ASSET SUPPORT TOOLS
        case "create_media_assets":
          const createMediaAssetsArgs = CreateMediaAssetsSchema.parse(args);
          return await this.figmaClient.createMediaAssets(
            createMediaAssetsArgs.fileKey,
            createMediaAssetsArgs.mediaType,
            createMediaAssetsArgs.source,
            createMediaAssetsArgs.optimization,
            createMediaAssetsArgs.placement
          );

        case "manage_asset_library":
          const manageAssetLibraryArgs = ManageAssetLibrarySchema.parse(args);
          return await this.figmaClient.manageAssetLibrary(
            manageAssetLibraryArgs.fileKey,
            manageAssetLibraryArgs.operation,
            manageAssetLibraryArgs.assetCategories,
            manageAssetLibraryArgs.assets,
            manageAssetLibraryArgs.libraryStructure,
            manageAssetLibraryArgs.searchCriteria,
            manageAssetLibraryArgs.versionControl
          );

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      console.error(`Error executing tool ${name}:`, error);
      throw error;
    }
  }
}
