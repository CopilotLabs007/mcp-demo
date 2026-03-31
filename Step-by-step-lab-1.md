<div align="center">

# 🐙 GitHub MCP Server — Setup & Usage
### Connect VS Code Copilot Chat to GitHub via MCP

<img src="https://img.shields.io/badge/MCP-GitHub%20Server-black?style=for-the-badge&logo=github"/>
<img src="https://img.shields.io/badge/VS%20Code-Copilot%20Chat-blue?style=for-the-badge&logo=visualstudiocode"/>

</div>

---

## 🗺️ Overview

The **GitHub MCP Server** lets VS Code Copilot Chat call GitHub APIs directly — listing issues, reading PRs, searching code, and more — without leaving the editor. This guide walks through installing it, wiring it to VS Code, and querying open issues in your repo.

---

## 📦 Phase 1 — Prerequisites

| Requirement | Notes |
|---|---|
| **VS Code ≥ 1.99** | MCP client support required |
| **GitHub Copilot** | Active subscription / free tier |
| **A GitHub Personal Access Token (PAT)** | Generate at `github.com → Settings → Developer Settings → PATs → Fine-grained` |

**PAT minimum scopes needed:**

- `Issues` → Read/Write
- `Pull requests` → Read
- `Contents` → Read
- `Metadata` → Read (auto-selected)

> 💡 Save the token somewhere safe — you only see it once.

---

## ⚙️ Phase 2 — Add GitHub MCP Server to VS Code

### Option A — via `mcp.json` (recommended for teams)

**Step 1** — Open or create `.vscode/mcp.json` in your workspace and add the GitHub server entry:

```jsonc
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

> 🔐 This uses your **existing Copilot session token** automatically — no PAT required when using the hosted Copilot endpoint.

---

### Option B — via User Settings (personal, any workspace)

**Step 2** — Open the Command Palette (`⌘⇧P` / `Ctrl+Shift+P`) and run:

```
MCP: Add Server
```

**Step 3** — Choose **HTTP (server-sent events)** and enter:

```
https://api.githubcopilot.com/mcp/
```

**Step 4** — Give it the name `github` and save.

---

### Option C — Self-hosted with PAT (local `npx`)

Use this if you want to run the server locally against your own PAT:

**Step 5** — Add to `.vscode/mcp.json`:

```jsonc
{
  "servers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_PAT_HERE>"
      }
    }
  }
}
```

> ⚠️ Never commit a real PAT to source control. Use a `${input:githubPat}` variable or store it in your shell environment instead.

---

## 🔌 Phase 3 — Connect & Verify in Copilot Chat

**Step 6** — Open the Command Palette and run:

```
MCP: List Servers
```

Confirm `github` shows status **Running**.

**Step 7** — Open **Copilot Chat** (`⌘I` or the chat icon in the sidebar).

**Step 8** — Click the **Tools** (plug) icon in the chat input bar. You should see a `github` group with tools like:
- `github_list_issues`
- `github_search_issues`
- `github_get_issue`
- `github_list_pull_requests`
- `github_search_code`
- …and more

**Step 9** — If the tools are not visible, reload VS Code window:

```
⌘⇧P → Developer: Reload Window
```

---

## 🔍 Phase 4 — Query Open Issues

Use the prompt below directly in the **Copilot Chat** window (Agent mode):

### 📋 List all open issues in this repo

```
List all open issues in the CopilotLabs007/mcp-demo repository.
For each issue show the issue number, title, and who opened it.
```

### 🏷️ Filter by label

```
Show all open issues in CopilotLabs007/mcp-demo that have the label "bug".
```

### 🔎 Search by keyword

```
Search open issues in CopilotLabs007/mcp-demo for any issues related to "budget" or "INR".
```

### 📊 Summary with counts

```
Summarize the open issues in CopilotLabs007/mcp-demo. Group them by label and
tell me how many are bugs vs enhancements.
```

### 📝 Get details on a specific issue

```
Get the full details and acceptance criteria for issue #8 in CopilotLabs007/mcp-demo.
```

---

## ✅ Expected Result

Copilot Chat will call the GitHub MCP tools and return a formatted table like:

| # | Title | Label | Opened by |
|---|---|---|---|
| 8 | `photography_planner` not registered as standalone MCP tool | bug | pvreddy |
| 7 | `inferEventType()` falls back to "event" with no assumption note | enhancement | pvreddy |
| … | … | … | … |

---

<div align="center">

**Powered by** 🐙 GitHub MCP Server · 🤖 VS Code Copilot Chat · 🔵 MCP Protocol

</div>
