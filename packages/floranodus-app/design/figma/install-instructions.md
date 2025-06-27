# 🚀 **First Time Setup Instructions**

## **Prerequisites**
- Node.js 18+ installed
- VS Code with Figma extension
- Figma account with API access

## **1. Get Figma API Token** 
1. Go to https://www.figma.com/developers/api#access-tokens
2. Click "Create a new personal access token"
3. Copy the token

## **2. Configure Environment**
```bash
# In figma-write-mcp directory
cp .env.example .env
# Edit .env and add your FIGMA_API_TOKEN
```

## **3. Install Dependencies**
```bash
# In figma-write-mcp
npm install

# In floranodus/design/figma
npm run setup
```

## **4. Start the Magic! 🪄**
```bash
# Option 1: Use VS Code Task
Cmd+Shift+P → "Tasks: Run Task" → "🚀 Start Figma AI Bridge"

# Option 2: Terminal
cd ../figma-write-mcp && npm run start
```

## **5. Test AI Generation**
```bash
cd design/figma
npm run test-ai
```

**✅ You're ready to generate AI-powered Figma designs from VS Code!**

## **Troubleshooting**

### **Bridge not starting?**
- Check your `FIGMA_API_TOKEN` in `.env`
- Make sure port 3000 is available
- Run `npm run status` to check connection

### **No nodes appearing in Figma?**
- Make sure your Figma file is open in browser
- Check the console for plugin connection messages
- The unified bridge auto-installs and connects the plugin

### **VS Code Figma panel not showing designs?**
- Click "Refresh" in the Figma panel
- Make sure your file URL is correct in `design-links.json`
- Check your internet connection 