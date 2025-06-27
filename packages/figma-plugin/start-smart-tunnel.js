#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SMART TUNNEL BRIDGE - Automatic Fallback System');
console.log('==================================================');

// Add fetch support
let fetch;
(async () => {
  try {
    // Try to use native fetch (Node 18+)
    if (global.fetch) {
      fetch = global.fetch;
    } else {
      // Fallback to node-fetch for older versions
      const { default: nodeFetch } = await import('node-fetch');
      fetch = nodeFetch;
    }
  } catch (error) {
    console.log('⚠️ Fetch not available, using simplified HTTP requests');
    // Simple HTTP fallback
    const http = require('http');
    fetch = (url, options = {}) => {
      return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const req = http.request({
          hostname: urlObj.hostname,
          port: urlObj.port || 80,
          path: urlObj.pathname,
          method: options.method || 'GET',
          headers: options.headers || {}
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              json: () => Promise.resolve(JSON.parse(data)),
              text: () => Promise.resolve(data)
            });
          });
        });
        
        if (options.body) {
          req.write(options.body);
        }
        
        req.on('error', reject);
        req.end();
      });
    };
  }
})();

// Tunnel configurations in priority order
const TUNNEL_CONFIGS = [
  {
    name: 'Cloudflare',
    emoji: '☁️',
    priority: 1,
    command: 'cloudflared',
    args: ['tunnel', '--url', 'http://localhost:3000'],
    urlPattern: /https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/,
    checkCommand: 'cloudflared --version'
  },
  {
    name: 'LocalTunnel', 
    emoji: '🌐',
    priority: 2,
    command: 'npx',
    args: ['localtunnel', '--port', '3000', '--subdomain', 'figma-bridge-unified'],
    urlPattern: /https:\/\/[a-zA-Z0-9-]+\.loca\.lt/,
    checkCommand: 'npx --version'
  },
  {
    name: 'Serveo',
    emoji: '🔗',
    priority: 3,
    command: 'ssh',
    args: ['-o', 'StrictHostKeyChecking=no', '-R', '80:localhost:3000', 'serveo.net'],
    urlPattern: /https:\/\/[a-zA-Z0-9-]+\.serveo\.net/,
    checkCommand: 'ssh -V'
  },
  {
    name: 'Bore',
    emoji: '⚡',
    priority: 4,
    command: 'bore',
    args: ['local', '3000', '--to', 'bore.pub'],
    urlPattern: /https:\/\/[a-zA-Z0-9-]+\.bore\.pub/,
    checkCommand: 'bore --version'
  }
];

let serverProcess = null;
let tunnelProcess = null;
let activeTunnel = null;

// Smart tunnel detection and connection
async function startSmartTunnel() {
  try {
    // 1. Start TypeScript server first
    console.log('🚀 Starting TypeScript production server...');
    serverProcess = spawn('npm', ['run', 'start'], {
      stdio: 'pipe',
      shell: true
    });

    // Wait for server to start
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 15000);

      serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(output.trim());
        
        if (output.includes('All systems operational') || output.includes('TYPESCRIPT SERVER RUNNING')) {
          clearTimeout(timeout);
          resolve();
        }
      });

      serverProcess.stderr.on('data', (data) => {
        console.error('Server error:', data.toString());
      });

      serverProcess.on('error', reject);
    });

    console.log('✅ TypeScript server is running!');

    // 2. Test server health
    if (!(await testServerHealth())) {
      throw new Error('Server health check failed');
    }

    // 3. Find and connect best tunnel
    const workingTunnel = await findBestTunnel();
    
    if (workingTunnel) {
      console.log(`\n🎉 SUCCESS! Connected via ${workingTunnel.config.emoji} ${workingTunnel.config.name}`);
      console.log(`🌐 Tunnel URL: ${workingTunnel.url}`);
      console.log(`📋 Import plugin/manifest.json into Figma to connect!`);
      
      // Set tunnel URL in server
      await setTunnelUrl(workingTunnel.url);
      
      activeTunnel = workingTunnel;
    } else {
      console.log(`\n🏠 LOCALHOST MODE: No tunnels available, using localhost:3000`);
      console.log(`📋 Plugin will connect to local server only`);
    }

    console.log('\n🛑 Press Ctrl+C to stop everything');
    
    // Keep processes alive
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    // Monitor tunnel health
    if (activeTunnel) {
      setInterval(async () => {
        if (!(await testTunnelHealth(activeTunnel.url))) {
          console.log('⚠️ Tunnel connection lost, attempting to reconnect...');
          const newTunnel = await findBestTunnel();
          if (newTunnel) {
            activeTunnel = newTunnel;
            await setTunnelUrl(newTunnel.url);
            console.log(`🔄 Reconnected via ${newTunnel.config.name}: ${newTunnel.url}`);
          }
        }
      }, 30000); // Check every 30 seconds
    }

  } catch (error) {
    console.error('❌ Smart tunnel failed:', error.message);
    cleanup();
    process.exit(1);
  }
}

// Test if server is healthy
async function testServerHealth() {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait a bit more
    const response = await fetch('http://localhost:3000/health');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Test if tunnel URL is working  
async function testTunnelHealth(url) {
  try {
    const response = await fetch(`${url}/health`, { timeout: 5000 });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Set tunnel URL in server
async function setTunnelUrl(url) {
  try {
    await fetch('http://localhost:3000/set-tunnel-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tunnelUrl: url })
    });
  } catch (error) {
    console.log('⚠️ Could not set tunnel URL in server');
  }
}

// Check if a command is available
function isCommandAvailable(command) {
  return new Promise((resolve) => {
    exec(command, (error) => {
      resolve(!error);
    });
  });
}

// Find the best working tunnel
async function findBestTunnel() {
  console.log('\n🔍 Scanning for available tunnels...');

  for (const config of TUNNEL_CONFIGS) {
    console.log(`\n${config.emoji} Testing ${config.name}...`);
    
    // Check if command is available
    const isAvailable = await isCommandAvailable(config.checkCommand);
    if (!isAvailable) {
      console.log(`  ❌ ${config.name} not installed`);
      continue;
    }

    console.log(`  ✅ ${config.name} is available`);
    console.log(`  🔄 Starting ${config.name} tunnel...`);

    try {
      const tunnelResult = await startTunnel(config);
      if (tunnelResult) {
        return tunnelResult;
      }
    } catch (error) {
      console.log(`  ❌ ${config.name} failed: ${error.message}`);
    }
  }

  return null;
}

// Start a specific tunnel and wait for URL
function startTunnel(config) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`${config.name} timeout`));
    }, 30000);

    tunnelProcess = spawn(config.command, config.args, {
      stdio: 'pipe',
      shell: true
    });

    let urlFound = false;

    tunnelProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`  📡 ${config.name}: ${output.trim()}`);
      
      // Look for tunnel URL
      const urlMatch = output.match(config.urlPattern);
      if (urlMatch && !urlFound) {
        urlFound = true;
        clearTimeout(timeout);
        
        const url = urlMatch[0];
        console.log(`  🎯 Found ${config.name} URL: ${url}`);
        
        // Test if the tunnel actually works
        setTimeout(async () => {
          if (await testTunnelHealth(url)) {
            console.log(`  ✅ ${config.name} tunnel is working!`);
            resolve({ url, config, process: tunnelProcess });
          } else {
            console.log(`  ❌ ${config.name} tunnel URL not responding`);
            tunnelProcess.kill();
            reject(new Error(`${config.name} tunnel not responding`));
          }
        }, 3000);
      }
    });

    tunnelProcess.stderr.on('data', (data) => {
      const error = data.toString();
      console.log(`  📡 ${config.name} (stderr): ${error.trim()}`);
      
      // Some tunnels output URLs to stderr
      const urlMatch = error.match(config.urlPattern);
      if (urlMatch && !urlFound) {
        urlFound = true;
        clearTimeout(timeout);
        
        const url = urlMatch[0];
        console.log(`  🎯 Found ${config.name} URL: ${url}`);
        
        setTimeout(async () => {
          if (await testTunnelHealth(url)) {
            console.log(`  ✅ ${config.name} tunnel is working!`);
            resolve({ url, config, process: tunnelProcess });
          } else {
            console.log(`  ❌ ${config.name} tunnel URL not responding`);
            tunnelProcess.kill();
            reject(new Error(`${config.name} tunnel not responding`));
          }
        }, 3000);
      }
    });

    tunnelProcess.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    tunnelProcess.on('exit', (code) => {
      if (!urlFound) {
        clearTimeout(timeout);
        reject(new Error(`${config.name} exited with code ${code}`));
      }
    });
  });
}

// Clean shutdown
function cleanup() {
  console.log('\n🧹 Cleaning up...');
  
  if (tunnelProcess) {
    console.log('🔄 Stopping tunnel...');
    tunnelProcess.kill('SIGTERM');
  }
  
  if (serverProcess) {
    console.log('🔄 Stopping server...');
    serverProcess.kill('SIGTERM');
  }
  
  console.log('✅ Cleanup complete');
  process.exit(0);
}

// Start the smart tunnel system
console.log('🎯 Initializing smart tunnel detection...');

// Wait a moment for fetch to be available
setTimeout(() => {
  startSmartTunnel().catch((error) => {
    console.error('💥 Fatal error:', error);
    cleanup();
  });
}, 1000); 