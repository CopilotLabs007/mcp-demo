# MCP Event Organizer Demo

Minimal MCP server that turns one event-planning request into a combined event plan using mock tools for venue, food, decor, invitations, photography, and budget. Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk).

## Run

```bash
npm install
npm start
```

## Inspect (MCP Inspector web UI)

```bash
npm run inspect
```

Opens `http://localhost:6274` with Tools, Resources, and Prompts tabs ready to use.

---

## Tools

Callable functions the LLM invokes to perform planning tasks.

| Tool | Description |
|---|---|
| `plan_event` | **Main entry point.** Takes one natural-language request and coordinates all vendor tools into a single event plan. |
| `venue_planner` | Suggests a venue based on event type, location, and guest count. |
| `food_planner` | Builds a catering menu and cost estimate. |
| `decor_planner` | Picks a decoration theme, elements, and cost. |
| `invitation_manager` | Drafts an invitation format and send schedule. |
| `budget_manager` | Sums all service costs and compares against the total budget. |

## Resources

Read-only reference data the LLM can fetch to understand the data model and see examples.

| URI | Description |
|---|---|
| `event://schema` | Field-by-field reference for the shared event object passed between all tools. |
| `event://sample-requests` | Three ready-to-use example requests (wedding, corporate event, birthday party). |

## Prompts

Structured intake templates with fillable arguments. Use them in the Inspector's Prompts tab to generate a ready-to-send planning request without writing one from scratch.

| Prompt | Arguments | Produces |
|---|---|---|
| `plan_wedding` | `guests`, `location`, `date`, `budget` | A wedding planning request for `plan_event`. |
| `plan_corporate_event` | `guests`, `location`, `date`, `budget` | A corporate offsite planning request. |
| `plan_birthday_party` | `guests`, `location`, `date`, `budget` | A birthday party planning request. |

---

## Example request

```
Plan a wedding with venue, food, decorations, photography and invitations
for 300 guests in Hyderabad on May 18 with a 10 lakh rupees budget.
```

Pass this to the `plan_event` tool or use a Prompt to generate it with structured inputs.