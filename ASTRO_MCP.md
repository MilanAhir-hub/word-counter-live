# Astro JS Model Context Protocol (MCP) Setup

To supercharge your AI assistants (like Cursor, Claude Desktop, or VS Code extensions) with the most up-to-date, hallucination-free Astro documentation, we have configured the official remote **Astro Docs MCP Server** for this project.

The server provides real-time access to official guides, APIs, and best practices directly from `https://mcp.docs.astro.build/mcp`.

---

## 🚀 Client Configuration Guide

### 1. Cursor (Configured Automatically)
We have created a project-specific Cursor configuration at [.cursor/mcp.json](file:///c:/Users/gagiy/OneDrive/Documents/Web%20Projects/wordcounterlive/.cursor/mcp.json).

*   **How to apply:** 
    1. Open Cursor in this project.
    2. Go to **Settings (Ctrl+Shift+J) > Features > MCP**.
    3. Make sure the configuration is loaded. (You may need to click **Reload** or restart Cursor).
    4. You should see `astro-docs` green and active in the MCP panel!

---

### 2. VS Code Extensions (Cline / Roo Code)
If you are using extensions like **Cline** or **Roo Code** in VS Code, you can add the server configuration globally or via their settings UI.

Add the following to your custom MCP settings:
```json
"astro-docs": {
  "url": "https://mcp.docs.astro.build/mcp"
}
```

---

### 3. Claude Desktop
If you want the official Claude Desktop app to have access to Astro docs whenever you chat:

1. Open your Claude Desktop configuration file:
   * **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
   * **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Add the following to your `mcpServers` object:

```json
{
  "mcpServers": {
    "astro-docs": {
      "url": "https://mcp.docs.astro.build/mcp"
    }
  }
}
```
3. Restart the Claude Desktop app.

---

## 💡 How to Use it
Once connected, your AI assistant will automatically use the official Astro docs when you ask questions like:
* *"How do I implement routing in Astro?"*
* *"What is the best way to handle pre-rendering in Astro 5/6?"*
* *"Explain Astro's island architecture with examples."*
