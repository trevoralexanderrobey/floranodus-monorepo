#!/usr/bin/env node

import dotenv from "dotenv";
import { UnifiedFigmaBridge } from "./unified-figma-bridge.js";

// Load environment variables
dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_API_TOKEN;

if (!FIGMA_TOKEN) {
  console.error("❌ FIGMA_API_TOKEN environment variable is required");
  process.exit(1);
}

// Main execution
async function main() {
  const unifiedBridge = new UnifiedFigmaBridge();
  
  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down unified bridge gracefully...");
    await unifiedBridge.stop();
    process.exit(0);
  });

  try {
    // Start the unified bridge with all 3 systems combined
    await unifiedBridge.start();
  } catch (error) {
    console.error("❌ Failed to start unified bridge:", error);
    process.exit(1);
  }
}

// Only run if this is the main module
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
}

export { UnifiedFigmaBridge }; 