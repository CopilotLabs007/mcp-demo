# MCP Concepts: Tools, Resources, and Prompts

The Model Context Protocol (MCP) exposes three distinct primitives that a server can offer to a client (such as an LLM or an IDE). Each serves a different purpose and is surfaced separately in the MCP Inspector.

Think of it like running a wedding planning office:
- **Tools** are the *staff* you can call to get things done — the caterer, the decorator, the photographer.
- **Resources** are the *reference binders* on the shelf — rate cards, guest list templates, venue capacity charts.
- **Prompts** are the *intake forms* at the front desk — a structured questionnaire a client fills in so the planner has everything needed to get started.

---

## Tools

> **Analogy:** Tools are like staff you can delegate tasks to. You tell them what you need, they go do it, and they report back with a result.

**What they are:** Callable functions that the LLM can invoke to perform an action or compute a result. Every tool has a name, a description, and an input schema. The LLM reads the description to decide when to call the tool, and fills in arguments according to the schema.

**How they work:** The client sends a `tools/call` request with the tool name and arguments. The server executes the function and returns a result, usually as text or structured JSON.

**When to use them:** Any time you need the LLM to *do something* — look something up, run a calculation, write to a database, or coordinate other services.

**Tools in this demo:**

| Tool | What it does |
|---|---|
| `venue_planner` | Returns a mock venue suggestion for the event type and guest count |
| `food_planner` | Calculates a catering estimate and menu based on event type and budget |
| `decor_planner` | Picks a decoration theme and elements based on event type |
| `invitation_manager` | Drafts an invitation format and send schedule |
| `budget_manager` | Sums all service costs and compares against the budget |
| `plan_event` | Orchestrates all the above tools from a single natural-language request |

---

## Resources

> **Analogy:** Resources are like the reference binders on the office shelf. Anyone can pick one up and read it, but you can't ask a binder to do anything — it just holds information.

**What they are:** Read-only data that the server exposes for the client or LLM to read. A resource has a URI (like a web address), a MIME type, and content — either text or binary. Resources are not callable; they are fetched.

**How they work:** The client sends a `resources/read` request with the resource URI. The server returns the content of that resource. Resources can also be listed via `resources/list`.

**When to use them:** When you want to expose reference data, configuration, documentation, schemas, or any static or semi-static content that the LLM should be able to read and reason about — without needing to invoke a function.

**Resources in this demo:**

| URI | Content |
|---|---|
| `event://schema` | JSON description of every field on the shared event object, so the LLM understands what data flows between tools |
| `event://sample-requests` | Three example planning requests (wedding, corporate, birthday) the LLM can use as reference or the inspector user can paste directly |

---

## Prompts

> **Analogy:** Prompts are like intake forms at the front desk. Instead of a client explaining everything from scratch, they fill in a structured form — event type, date, guest count, budget — and the planner gets a complete, consistent brief every time.

**What they are:** Reusable message templates that the server provides to the client. A prompt has a name, a description, optional input arguments, and a fixed message structure. The client can list available prompts and ask the server to render one with specific argument values.

**How they work:** The client sends a `prompts/get` request with the prompt name and argument values. The server fills in the template and returns a ready-to-send message (or conversation) that the client can forward to the LLM.

**When to use them:** When you have common, recurring interactions that benefit from a consistent structure — for example, a prefilled planning request that always includes the right fields in the right order. Prompts reduce copy-paste errors and make it easy to drive the LLM through well-defined starting points.

**Prompts in this demo:**

| Prompt | Arguments | What it produces |
|---|---|---|
| `plan_wedding` | `guests`, `location`, `date`, `budget` | A ready-to-send wedding planning request for `plan_event` |
| `plan_corporate_event` | `guests`, `location`, `date`, `budget` | A ready-to-send corporate offsite planning request |
| `plan_birthday_party` | `guests`, `location`, `date`, `budget` | A ready-to-send birthday party planning request |

---

## How the three primitives work together in this demo

> **Analogy:** The client walks into the wedding planning office, fills in an intake form (Prompt), the planner checks the rate card on the shelf (Resource), then calls the caterer, decorator, and photographer (Tools) — and hands back a complete event plan.

```
User fills in a Prompt (e.g. plan_wedding with guests/location/date/budget)
        ↓
Rendered message is sent to the LLM
        ↓
LLM reads the event://schema Resource to understand the data model
        ↓
LLM calls plan_event Tool with the extracted arguments
        ↓
plan_event internally calls venue, food, decor, invites, photography, budget Tools
        ↓
A combined event plan is returned to the user
```

**Key distinction to remember:**
- **Tools** → the LLM *does* something — like calling a staff member to get a job done
- **Resources** → the LLM *reads* something — like consulting a reference binder
- **Prompts** → the *user or client* starts from a template — like filling in a structured intake form
