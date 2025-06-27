import dotenv from 'dotenv';
import UnifiedBridgeServer from './bridge-server';

// Load environment variables
dotenv.config();

console.log('🚀 UNIFIED BRIDGE: Starting TypeScript production server...');
console.log('✨ Type-safe, maintainable, and production-ready!');

const server = new UnifiedBridgeServer();
server.start(); 