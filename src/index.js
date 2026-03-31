import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { formatEventPlan } from "./formatter.js";
import { buildEventPlan } from "./orchestrator.js";
import {
  runBudgetManager,
  runDecorPlanner,
  runFoodPlanner,
  runInvitationManager,
  runPhotographyPlanner,
  runVenuePlanner
} from "./tools.js";
import { createEventDraft, validateEventDraft } from "./event-schema.js";

const server = new McpServer({
  name: "event-organizer-demo",
  version: "0.1.0"
});

server.tool(
  "venue_planner",
  "Suggest a mock venue option.",
  {
    eventType: z.string(),
    location: z.string().nullish(),
    guestCount: z.number().nullish()
  },
  async (args) => respond(runVenuePlanner(validateEventDraft(createEventDraft(args))))
);

server.tool(
  "food_planner",
  "Build a mock catering recommendation and estimate.",
  {
    eventType: z.string(),
    guestCount: z.number().nullish(),
    budget: z.number().nullish()
  },
  async (args) => respond(runFoodPlanner(validateEventDraft(createEventDraft(args))))
);

server.tool(
  "decor_planner",
  "Create a mock decoration concept.",
  {
    eventType: z.string(),
    theme: z.string().nullish()
  },
  async (args) => respond(runDecorPlanner(validateEventDraft(createEventDraft(args))))
);

server.tool(
  "invitation_manager",
  "Draft a mock invitation plan.",
  {
    eventType: z.string(),
    date: z.string().nullish(),
    guestCount: z.number().nullish()
  },
  async (args) => respond(runInvitationManager(validateEventDraft(createEventDraft(args))))
);

server.tool(
  "budget_manager",
  "Summarize the current mock event budget.",
  {
    budget: z.number().nullish(),
    costs: z.array(z.object({ item: z.string(), amount: z.number() })).default([])
  },
  async (args) => {
    const eventDraft = validateEventDraft(createEventDraft(args));
    eventDraft.costs = args.costs;
    return respond(runBudgetManager(eventDraft));
  }
);

server.tool(
  "plan_event",
  "Coordinate the event planning tools into one combined event plan.",
  {
    request: z.string(),
    date: z.string().nullish(),
    location: z.string().nullish(),
    guestCount: z.number().nullish(),
    budget: z.number().nullish(),
    theme: z.string().nullish()
  },
  async (args) => {
    const plan = buildEventPlan(args);
    return {
      content: [
        {
          type: "text",
          text: `${formatEventPlan(plan)}\n\nRaw plan:\n${JSON.stringify(plan, null, 2)}`
        }
      ]
    };
  }
);

// ── Resources ─────────────────────────────────────────────────────────────────

server.resource(
  "event-schema",
  "event://schema",
  { mimeType: "application/json" },
  async () => ({
    contents: [{
      uri: "event://schema",
      mimeType: "application/json",
      text: JSON.stringify({
        description: "Fields on the shared event object passed through all planning tools.",
        fields: {
          request: "Original natural-language request.",
          eventType: "wedding | corporate event | birthday party | event",
          date: "Parsed event date (e.g. 'June 12').",
          location: "City or venue area.",
          guestCount: "Number of guests. Defaults to 50 if not provided.",
          budget: "Total budget as a plain number.",
          budgetCurrency: "Currency symbol: ₹ | $ | €",
          theme: "Optional decoration theme override.",
          requestedServices: "Array: venue | food | decor | invites | photography | budget",
          selectedServices: "Populated by each tool as it runs.",
          costs: "Array of { item, amount } appended by each tool.",
          assumptions: "Placeholder values used when fields were missing.",
          missingFields: "Field names absent from the request."
        }
      }, null, 2)
    }]
  })
);

server.resource(
  "sample-requests",
  "event://sample-requests",
  { mimeType: "application/json" },
  async () => ({
    contents: [{
      uri: "event://sample-requests",
      mimeType: "application/json",
      text: JSON.stringify([
        {
          label: "Wedding",
          request: "Plan a wedding with venue, food, decorations, photography and invitations for 150 guests in Austin on June 12 with a $15000 budget."
        },
        {
          label: "Corporate event",
          request: "Plan a corporate offsite with venue and catering for 40 people in Chicago on September 5 with a $8000 budget."
        },
        {
          label: "Birthday party",
          request: "Plan a birthday party with food and decorations for 25 guests in Brooklyn on March 22 with a $1500 budget."
        }
      ], null, 2)
    }]
  })
);

// ── Prompts ───────────────────────────────────────────────────────────────────

server.prompt(
  "plan_wedding",
  "Prefilled prompt to plan a wedding.",
  {
    guests: z.string().default("100"),
    location: z.string().default("the city"),
    date: z.string().default("TBD"),
    budget: z.string().default("unspecified")
  },
  ({ guests, location, date, budget }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Plan a wedding with venue, food, decorations, photography, and invitations for ${guests} guests in ${location} on ${date} with a ${budget} budget.`
      }
    }]
  })
);

server.prompt(
  "plan_corporate_event",
  "Prefilled prompt to plan a corporate event.",
  {
    guests: z.string().default("50"),
    location: z.string().default("the city"),
    date: z.string().default("TBD"),
    budget: z.string().default("unspecified")
  },
  ({ guests, location, date, budget }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Plan a corporate offsite with venue and catering for ${guests} people in ${location} on ${date} with a ${budget} budget.`
      }
    }]
  })
);

server.prompt(
  "plan_birthday_party",
  "Prefilled prompt to plan a birthday party.",
  {
    guests: z.string().default("30"),
    location: z.string().default("the city"),
    date: z.string().default("TBD"),
    budget: z.string().default("unspecified")
  },
  ({ guests, location, date, budget }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Plan a birthday party with food and decorations for ${guests} guests in ${location} on ${date} with a ${budget} budget.`
      }
    }]
  })
);

// ── Transport ─────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);

function respond(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2)
      }
    ]
  };
}