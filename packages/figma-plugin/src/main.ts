#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError 
} from "@modelcontextprotocol/sdk/types.js";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

class UnifiedFigmaBridge {
  private server: Server;
  private app: express.Application;
  private httpServer: any;
  private pluginConnected = false;
  private commands: any[] = [];
  private results = new Map<string, any>();

  constructor() {
    // Initialize MCP Server
    this.server = new Server(
      {
        name: "unified-figma-bridge",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Express App
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    
    this.setupMCPHandlers();
    this.setupHTTPEndpoints();
  }

  private setupMCPHandlers() {
    // List all available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // READ TOOLS (9)
          {
            name: "get_figma_file",
            description: "Get complete file data with nodes and components",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string", description: "Figma file key" },
                version: { type: "string", description: "File version (optional)" },
                depth: { type: "number", description: "Node tree depth" }
              },
              required: ["fileKey"]
            }
          },
          {
            name: "get_figma_nodes",
            description: "Get specific node details and properties",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                nodeIds: { type: "array", items: { type: "string" } }
              },
              required: ["fileKey", "nodeIds"]
            }
          },
          {
            name: "get_figma_images",
            description: "Export images in multiple formats",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                nodeIds: { type: "array", items: { type: "string" } },
                format: { type: "string", enum: ["png", "jpg", "svg", "pdf"] },
                scale: { type: "number" }
              },
              required: ["fileKey", "nodeIds"]
            }
          },
          {
            name: "get_figma_comments",
            description: "Get comments and collaboration data",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" }
              },
              required: ["fileKey"]
            }
          },
          {
            name: "post_figma_comment",
            description: "Add comments to designs",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                message: { type: "string" },
                clientMeta: { type: "object" }
              },
              required: ["fileKey", "message"]
            }
          },
          {
            name: "get_figma_versions",
            description: "Get version history and changes",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" }
              },
              required: ["fileKey"]
            }
          },
          {
            name: "get_team_projects",
            description: "Get team projects and organization",
            inputSchema: {
              type: "object",
              properties: {
                teamId: { type: "string" }
              },
              required: ["teamId"]
            }
          },
          {
            name: "get_project_files",
            description: "Get files within projects",
            inputSchema: {
              type: "object",
              properties: {
                projectId: { type: "string" }
              },
              required: ["projectId"]
            }
          },
          {
            name: "get_user_profile",
            description: "Get user profile and permissions",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },

          // CREATION TOOLS (4)
          {
            name: "create_nodes_from_code",
            description: "Convert React/HTML to Figma nodes",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                code: { type: "string" },
                framework: { type: "string", enum: ["react", "vue", "angular", "html"] },
                parentNodeId: { type: "string" },
                position: { type: "object" }
              },
              required: ["fileKey", "code"]
            }
          },
          {
            name: "set_design_variables",
            description: "Create design system variables",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                variables: { type: "object" },
                collection: { type: "string" }
              },
              required: ["fileKey", "variables"]
            }
          },
          {
            name: "establish_code_connections",
            description: "Link designs to code repositories",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                nodeId: { type: "string" },
                codeInfo: { type: "object" }
              },
              required: ["fileKey", "nodeId", "codeInfo"]
            }
          },
          {
            name: "generate_design_preview",
            description: "AI-powered design generation",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                description: { type: "string" },
                style: { type: "string" },
                dimensions: { type: "object" }
              },
              required: ["fileKey", "description"]
            }
          },

          // PAGE ORGANIZATION TOOLS (3)
          {
            name: "create_organized_pages",
            description: "Structure pages by categories, milestones, projects",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                structure: { type: "object" },
                categories: { type: "array" }
              },
              required: ["fileKey", "structure"]
            }
          },
          {
            name: "manage_design_status",
            description: "Track progress with status labels and priorities",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                nodeId: { type: "string" },
                status: { type: "string" },
                priority: { type: "string" },
                assignee: { type: "string" }
              },
              required: ["fileKey", "nodeId", "status"]
            }
          },
          {
            name: "create_scratchpad_system",
            description: "Organize ideation pages with smart workflows",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                scratchpadType: { type: "string" },
                organization: { type: "string" }
              },
              required: ["fileKey", "scratchpadType"]
            }
          },

          // UI KIT GENERATION TOOLS (2)
          {
            name: "generate_ui_kit",
            description: "Complete UI kits with design systems for 6 platform types",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                kitType: { type: "string", enum: ["mobile", "web", "dashboard", "ecommerce", "saas", "landing"] },
                designSystem: { type: "object" },
                components: { type: "array" }
              },
              required: ["fileKey", "kitType"]
            }
          },
          {
            name: "create_component_library",
            description: "Atomic design component libraries with full hierarchy",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                hierarchy: { type: "string", enum: ["atomic", "molecular", "organisms", "templates"] },
                components: { type: "array" }
              },
              required: ["fileKey", "hierarchy"]
            }
          },

          // SMART ORGANIZATION & RESPONSIVE DESIGN TOOLS (2)
          {
            name: "create_responsive_layouts",
            description: "Create responsive layouts with auto layout and constraints for multiple breakpoints",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                layoutType: { type: "string", enum: ["flex", "grid", "absolute", "auto"] },
                breakpoints: { type: "array" },
                constraints: { type: "object" }
              },
              required: ["fileKey", "layoutType"]
            }
          },
          {
            name: "organize_layers_as_containers",
            description: "Intelligently group and organize layers into logical containers using AI analysis",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                nodeIds: { type: "array", items: { type: "string" } },
                organizationRules: { type: "object" },
                containerType: { type: "string" }
              },
              required: ["fileKey", "nodeIds"]
            }
          },

          // MEDIA & ASSET SUPPORT TOOLS (2)
          {
            name: "create_media_assets",
            description: "Create and manage images, GIFs, videos, and interactive media",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                mediaType: { type: "string", enum: ["image", "gif", "video", "interactive"] },
                source: { type: "object" },
                optimization: { type: "object" }
              },
              required: ["fileKey", "mediaType"]
            }
          },
          {
            name: "manage_asset_library",
            description: "Organize and manage reusable assets and media",
            inputSchema: {
              type: "object",
              properties: {
                fileKey: { type: "string" },
                assetCategories: { type: "array" },
                tagging: { type: "array" },
                versionControl: { type: "object" }
              },
              required: ["fileKey", "assetCategories"]
            }
          }
        ]
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        console.log(`🔧 Executing tool: ${name}`, args);
        
        // Execute the tool (you'll implement specific logic for each tool)
        const result = await this.executeTool(name, args || {});
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(`Error executing tool ${request.params.name}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    });
  }

  private setupHTTPEndpoints() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        mode: 'unified-bridge',
        services: {
          mcp: 'active',
          automation: 'active',
          enhancedApi: 'active'
        },
        pluginConnected: this.pluginConnected,
        supportedTools: 22,
        timestamp: Date.now()
      });
    });

    // HTTP tool execution (for bypass operations)
    this.app.post('/tools/:toolName', async (req, res) => {
      try {
        const { toolName } = req.params;
        const args = req.body;
        
        console.log(`🌐 HTTP tool execution: ${toolName}`, args);
        const result = await this.executeTool(toolName, args);
        
        res.json({ success: true, result });
      } catch (error) {
        console.error(`HTTP tool error:`, error);
        res.status(500).json({ 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    });

    // Plugin communication endpoints (for Figma sandbox bypass)
    this.app.post('/plugin/ping', (req, res) => {
      this.pluginConnected = true;
      res.json({ success: true, timestamp: Date.now() });
    });

    this.app.get('/plugin/commands', (req, res) => {
      const pendingCommands = this.commands.splice(0);
      res.json(pendingCommands);
    });

    this.app.post('/plugin/results', (req, res) => {
      const { results } = req.body;
      if (Array.isArray(results)) {
        results.forEach(result => {
          if (result.commandId) {
            this.results.set(result.commandId, result);
          }
        });
      }
      res.json({ success: true });
    });
  }

  private async executeTool(name: string, args: any): Promise<any> {
    // This is where you'll implement the actual tool logic
    // For now, return a mock response showing the tool is working
    
    switch (name) {
      case 'get_figma_file':
        return {
          success: true,
          message: `✅ ${name} executed successfully`,
          data: {
            file: args.fileKey,
            nodes: `Mock node data for ${args.fileKey}`,
            timestamp: Date.now()
          }
        };
        
      case 'create_nodes_from_code':
        return {
          success: true,
          message: `✅ Converted ${args.framework || 'HTML'} code to Figma nodes`,
          data: {
            parsedNodes: 1,
            framework: args.framework,
            timestamp: Date.now()
          }
        };

      case 'generate_ui_kit':
        return {
          success: true,
          message: `✅ Generated ${args.kitType} UI kit`,
          data: {
            kitType: args.kitType,
            componentsCreated: 15,
            timestamp: Date.now()
          }
        };

      default:
        return {
          success: true,
          message: `✅ Tool ${name} executed successfully`,
          data: args,
          timestamp: Date.now()
        };
    }
  }

  async start() {
    // Start HTTP server
    this.httpServer = this.app.listen(PORT, () => {
      console.log(`🚀 UNIFIED FIGMA BRIDGE: Running on port ${PORT}`);
      console.log(`🔧 MCP Tools: 22 available`);
      console.log(`🌐 HTTP API: Available for sandbox bypass`);
      console.log(`🔗 Plugin Bridge: Ready for Figma connection`);
    });

    // Start MCP server for Cursor integration
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("📡 MCP Server: Connected to Cursor via stdio");
  }
}

// Start the unified bridge
const bridge = new UnifiedFigmaBridge();
bridge.start().catch((error) => {
  console.error("Failed to start unified bridge:", error);
  process.exit(1);
}); 