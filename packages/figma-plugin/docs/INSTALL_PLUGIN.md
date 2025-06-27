# 🔧 FIXED PLUGIN INSTALLATION GUIDE

## ✅ Files Ready
- ✅ JavaScript syntax: Valid
- ✅ JSON syntax: Valid  
- ✅ Bridge server: Running on port 3002

## 📍 EXACT STEPS TO INSTALL

### 1. Open Figma Desktop
- Make sure Figma Desktop app is open
- Create or open any Figma file

### 2. Import the Plugin
- Go to: **Menu → Plugins → Development → Import plugin from manifest...**
- Navigate to this **EXACT** path:
  ```
  /Volumes/ExtraCurricular/VScode/Github/Cursor/Repos/figma-write-mcp/plugin-files
  ```
- Select the file: **`manifest.json`** (NOT working-debug-manifest.json)
- Click **Open** or **Import**

### 3. Run the Plugin  
- Go to: **Menu → Plugins → Development → 🔧 Working Debug Plugin**
- Click on it to run

## 🔍 TROUBLESHOOTING

### If manifest.json "does nothing":

**Option A: Try direct file selection**
1. In the import dialog, make sure you're selecting the actual `manifest.json` file
2. Check that both `manifest.json` AND `working-debug.js` are in the same folder

**Option B: Use Finder**
1. Open Finder and navigate to the plugin-files folder
2. Drag `manifest.json` directly into the Figma import dialog

**Option C: Check file permissions**
```bash
chmod 644 manifest.json working-debug.js
```

### If still not working:
Try the minimal manifest:
- Select `minimal-manifest.json` instead
- But first, update it to use working-debug.js

## 🎯 EXPECTED RESULTS

When it works, you'll see:
1. **Figma notification**: "🔧 WORKING DEBUG: Starting connection..."
2. **Connection monitor**: Should show "Plugin Connected: ✅ YES"  
3. **Visual in Figma**: A gray frame that turns green saying "🎉 CONNECTED TO BRIDGE!"

## 📂 Alternative: Copy Files to Desktop

If the path is causing issues:
```bash
cp manifest.json ~/Desktop/
cp working-debug.js ~/Desktop/
```
Then import from Desktop instead. 