#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_API_TOKEN;

if (!FIGMA_TOKEN) {
  console.error("❌ FIGMA_API_TOKEN environment variable is required");
  process.exit(1);
}

// Simplified MCP tools for now - we'll expand this later
const tools = [
  {
    name: "get_figma_file",
    description: "Get a Figma file by its key",
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
    name: "create_figma_node",
    description: "Create a new node in a Figma file",
    inputSchema: {
      type: "object",
      properties: {
        fileKey: {
          type: "string",
          description: "The Figma file key",
        },
        nodeType: {
          type: "string",
          description: "The type of node to create (e.g., 'FRAME', 'TEXT', 'RECTANGLE')",
        },
        properties: {
          type: "object",
          description: "Properties for the node",
        },
      },
      required: ["fileKey", "nodeType", "properties"],
    },
  },
];

async function executeTool(name: string, args: any): Promise<any> {
  switch (name) {
    case "get_figma_file":
      return await getFigmaFile(args.fileKey);
    case "create_figma_node":
      return await createFigmaNode(args.fileKey, args.nodeType, args.properties);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getFigmaFile(fileKey: string): Promise<any> {
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN!,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      file: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function createFigmaNode(fileKey: string, nodeType: string, properties: any): Promise<any> {
  // For now, return a mock response since we're focusing on getting MCP working
  return {
    success: true,
    message: `MCP server received request to create ${nodeType} in file ${fileKey}`,
    nodeType,
    properties,
    note: "This is a simplified MCP implementation - full Figma API integration coming soon",
  };
}

// Initialize MCP server
const server = new Server(
  {
    name: "figma-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Set up MCP handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    const result = await executeTool(name, args || {});
    
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

// Start the MCP server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Figma MCP server started successfully");
}

// Handle process termination
process.on('SIGINT', async () => {
  console.error("Shutting down MCP server...");
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error("Shutting down MCP server...");
  process.exit(0);
});

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
}); 