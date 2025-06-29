# 🔐 Secure Figma API Token Setup

## Why Use Environment Variables?

GitHub's security scanning blocks hardcoded API tokens to protect your credentials from:

- ❌ **Security Risk**: Tokens in code are visible to all repo collaborators
- ❌ **Git History**: Even if removed, tokens remain in git history forever
- ❌ **Public Exposure**: If repo becomes public, tokens are exposed to everyone
- ❌ **Compliance**: Violates security best practices and compliance requirements

## ✅ Secure Setup Method

### 1. Generate a Figma Token
1. Go to Figma → Account Settings → Personal Access Tokens
2. Create a new token with appropriate permissions
3. Copy the token (starts with `figd_`)

### 2. Set Environment Variable

**On macOS/Linux:**
```bash
# Add to your ~/.zshrc or ~/.bashrc
export FIGMA_API_TOKEN="your_figma_token_here"

# Reload your shell
source ~/.zshrc
```

**For this specific project:**
```bash
# In your project root, create a .env file
echo "FIGMA_API_TOKEN=your_figma_token_here" > .env

# Make sure .env is in .gitignore
echo ".env" >> .gitignore
```

### 3. Verify Setup
```bash
# Check if token is available
echo $FIGMA_API_TOKEN

# Should output your token (don't commit this output!)
```

### 4. MCP Configuration

The configuration uses environment variables:
```json
{
  "env": {
    "FIGMA_API_TOKEN": "${FIGMA_API_TOKEN}"
  }
}
```

This pulls the token from your environment, not from the code.

## 🔄 Alternative: Local Token File

If you need the token in a file:

```bash
# Create a local token file (NOT committed to git)
echo "your_figma_token_here" > .figma-token

# Add to .gitignore
echo ".figma-token" >> .gitignore

# Read in your code
# const token = fs.readFileSync('.figma-token', 'utf8').trim();
```

## 🚨 Security Best Practices

1. **Never commit tokens** to version control
2. **Use different tokens** for development/production
3. **Rotate tokens regularly** (every 90 days)
4. **Revoke compromised tokens** immediately
5. **Use minimal permissions** for each token

## 📝 This Setup is Safe to Commit

The configuration uses environment variables, so it's safe to commit:

```bash
git add .cursor/mcp.json FIGMA_TOKEN_SETUP.md .gitignore
git commit -m "🔐 Secure Figma token configuration"
git push origin master
```

This approach keeps your tokens secure while maintaining functionality! 