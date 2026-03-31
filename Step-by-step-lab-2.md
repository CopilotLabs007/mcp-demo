<div align="center">

# 🎉 MCP Event Organizer Demo
### Step-by-Step Walkthrough

<img src="https://img.shields.io/badge/Runtime-Node.js%2022-green?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/Protocol-MCP-blue?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Market-Hyderabad%20🇮🇳-orange?style=for-the-badge"/>

</div>

---

## 🗺️ Overview

This guide walks you through building and running a minimal **MCP (Model Context Protocol) server** that acts as an AI-powered event organizer. The LLM receives one natural-language request, calls mock vendor tools, and returns a combined event plan — all with Hyderabad market rates.

---

## 📋 Phase 1 — Plan

<table>
<tr>
<td width="60px" align="center">🗂️</td>
<td><strong>Step 1</strong> — Create an empty folder called <code>mcp-demo</code> and <code>cd</code> into it.</td>
</tr>
<tr>
<td align="center">🧠</td>
<td><strong>Step 2</strong> — Switch VS Code Copilot to <strong>Plan mode</strong>.</td>
</tr>
</table>

**Step 3** — Paste the following prompt into the chat window:

<details>
<summary>📝 Click to expand the planning prompt</summary>

```
Plan: MCP Event Organizer MVP
Build a small demo MCP server that takes one event request, calls a few mock
planning tools, and returns one combined event plan in India.

Steps
  - Keep the MVP narrow: venue, food, decor, invites, and budget summary only.
  - Define one shared event object with basics like event type, date, location,
    guest count, budget, and selected services.
  - Add mock MCP tools for venue, food, decor, invites, and budget.
  - Add one orchestrator that reads the request, calls the needed tools,
    and merges the results.
  - Add simple validation for missing inputs and a final summary formatter.
  - Test with a few sample prompts.

Relevant components
  - MCP server entry point
  - Shared event schema
  - Tool modules
  - Orchestrator
  - Final formatter

Verification
  ✅ Each tool is exposed independently.
  ✅ One request can call multiple tools and return one merged plan.
  ✅ Missing fields are handled gracefully.
  ✅ Mock outputs are structured enough to replace later.

Decisions
  - Use mock integrations only.
  - Use one shared event object.
  - Exclude bookings, payments, and live delivery.
```

</details>

---

## ⚡ Phase 2 — Implementation

> **Switch to Agent Mode** before the steps below.

<table>
<tr>
<td width="60px" align="center">🔨</td>
<td><strong>Step 4</strong> — Ask: <em>"Start implementation using Python SDK or TypeScript SDK."</em></td>
</tr>
<tr>
<td align="center">📖</td>
<td><strong>Step 5</strong> — Ask: <em>"Write demo notes that explain how tools, resources, and prompts work in this demo, with analogies and examples from the code."</em></td>
</tr>
<tr>
<td align="center">📄</td>
<td><strong>Step 6</strong> — Ask: <em>"Write a README.md that explains what this project is, how to run it, and what tools it includes."</em></td>
</tr>
<tr>
<td align="center">🔍</td>
<td><strong>Step 7</strong> — Review the code, demo notes, and README for accuracy and completeness. Make edits as needed.</td>
</tr>
<tr>
<td align="center">▶️</td>
<td><strong>Step 8</strong> — Ask: <em>"Build and run this."</em></td>
</tr>
</table>

---

## 🔬 Phase 3 — Inspect & Connect

<table>
<tr>
<td width="60px" align="center">🧪</td>
<td><strong>Step 9</strong> — Interact with the demo via the <strong>MCP Inspector</strong>, testing different prompts and exploring the tools and resources.</td>
</tr>
<tr>
<td align="center">🔌</td>
<td><strong>Step 10</strong> — Ask: <em>"Configure and connect it to an MCP client/inspector and call <code>plan_event</code>."</em></td>
</tr>
<tr>
<td align="center">🌐</td>
<td><strong>Step 11</strong> — Confirm the MCP Inspector launches correctly and opens the browser UI at <code>http://localhost:6274</code>.</td>
</tr>
<tr>
<td align="center">📁</td>
<td><strong>Step 12</strong> — Verify that <code>.vscode/mcp.json</code> exists in the project folder — this means the server is registered with VS Code's MCP client.</td>
</tr>
<tr>
<td align="center">⚙️</td>
<td><strong>Step 13</strong> — In the Inspector, confirm the <strong>Tools</strong>, <strong>Resources</strong>, and <strong>Prompts</strong> tabs are all populated, then click <strong>Start</strong>.</td>
</tr>
<tr>
<td align="center">🛠️</td>
<td><strong>Step 14</strong> — Click <strong>Configure Tools</strong> and verify all tools are listed with their descriptions and input schemas.</td>
</tr>
</table>

---

## 🎯 Phase 4 — Test

**Step 15** — Call the `plan_event` tool with a natural-language request:

```
Plan a birthday party with venue, food, photography and decorations
for 100 guests in Hyderabad on 18-May with a 300000 budget.
```

> 💡 **Try these too:**
> - `Plan a wedding with venue, food, decorations, photography and invitations for 300 guests in Hyderabad on May 18 with a 10 lakh rupees budget.`
> - `Plan a corporate offsite with venue and catering for 40 people in Hyderabad on September 5 with a 5 lakh budget.`

**Step 16** — Review the response. It should include a **combined event plan** with:

| Section | What you'll see |
|---|---|
| 🏛️ Venue | Suggested Hyderabad banquet hall with cost |
| 🍽️ Food | Menu style, per-guest rate, and estimated cost |
| 🎨 Decor | Theme, elements, and styling cost |
| ✉️ Invitations | Format, send timing, and draft message |
| 📸 Photography | Package, deliverables, and cost |
| 💰 Budget | Itemised cost table, visual spend bar, and status |

---

<div align="center">

**Built with** 🤖 GitHub Copilot Agent · 🟢 Node.js · 🔵 MCP SDK · 📍 Hyderabad Market Rates

</div>


