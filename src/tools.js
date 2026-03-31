function addCost(eventDraft, item, amount) {
  eventDraft.costs.push({ item, amount });
}

export const toolDefinitions = [
  {
    name: "venue_planner",
    description: "Suggests a mock venue option for the event.",
    inputSchema: {
      type: "object",
      properties: {
        eventType: { type: "string" },
        location: { type: ["string", "null"] },
        guestCount: { type: ["number", "null"] }
      },
      required: ["eventType"]
    }
  },
  {
    name: "food_planner",
    description: "Builds a mock catering recommendation and estimate.",
    inputSchema: {
      type: "object",
      properties: {
        eventType: { type: "string" },
        guestCount: { type: ["number", "null"] },
        budget: { type: ["number", "null"] }
      },
      required: ["eventType"]
    }
  },
  {
    name: "decor_planner",
    description: "Creates a mock decoration concept for the event.",
    inputSchema: {
      type: "object",
      properties: {
        eventType: { type: "string" },
        theme: { type: ["string", "null"] }
      },
      required: ["eventType"]
    }
  },
  {
    name: "invitation_manager",
    description: "Drafts a mock invitation approach and send schedule.",
    inputSchema: {
      type: "object",
      properties: {
        eventType: { type: "string" },
        date: { type: ["string", "null"] },
        guestCount: { type: ["number", "null"] }
      },
      required: ["eventType"]
    }
  },
  {
    name: "budget_manager",
    description: "Summarizes current estimated event costs.",
    inputSchema: {
      type: "object",
      properties: {
        budget: { type: ["number", "null"] },
        costs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              item: { type: "string" },
              amount: { type: "number" }
            },
            required: ["item", "amount"]
          }
        }
      }
    }
  },
  {
    name: "plan_event",
    description: "Handles one event-planning request by coordinating the mock planning tools into a single event plan.",
    inputSchema: {
      type: "object",
      properties: {
        request: { type: "string", description: "Natural-language event planning request." },
        date: { type: "string" },
        location: { type: "string" },
        guestCount: { type: "number" },
        budget: { type: "number" },
        theme: { type: "string" }
      },
      required: ["request"]
    }
  }
];

export function runVenuePlanner(eventDraft) {
  const suggestion = {
    name: chooseVenueName(eventDraft.eventType),
    area: eventDraft.location || "city center",
    capacity: Math.max(eventDraft.guestCount || 50, 50),
    setup: eventDraft.eventType === "corporate event" ? "presentation and networking layout" : "dining and photo-friendly layout"
  };

  eventDraft.selectedServices.venue = suggestion;
  addCost(eventDraft, "Venue", estimateVenueCost(eventDraft.guestCount));
  return suggestion;
}

export function runFoodPlanner(eventDraft) {
  // Hyderabad market: budget events ~₹900/plate, premium events ~₹1,500/plate
  // Corporate buffet is slightly cheaper at ₹1,000/head
  const guestCount = eventDraft.guestCount || 50;
  let perGuest;
  let style;
  let highlights;

  if (eventDraft.eventType === "corporate event") {
    perGuest = 1000;
    style = "corporate buffet";
    highlights = ["welcome drinks", "live counter starters", "veg & non-veg mains", "dessert station"];
  } else if (eventDraft.eventType === "birthday party") {
    perGuest = eventDraft.budget && eventDraft.budget < 500000 ? 800 : 1200;
    style = "party buffet";
    highlights = ["mocktails & welcome drinks", "snack counters", "live chaat station", "birthday cake", "ice cream bar"];
  } else {
    // wedding and generic events
    perGuest = eventDraft.budget && eventDraft.budget < 500000 ? 1000 : 1600;
    style = "grand sit-down dinner";
    highlights = ["welcome sharbat", "starters (veg & non-veg)", "live biryani counter", "main course (8 items)", "dal makhani, rotis & breads", "dessert with double ka meetha & qubani ka meetha"];
  }

  const suggestion = {
    style,
    highlights,
    perGuestRate: perGuest,
    estimatedCost: guestCount * perGuest
  };

  eventDraft.selectedServices.food = suggestion;
  addCost(eventDraft, "Catering", suggestion.estimatedCost);
  return suggestion;
}

export function runDecorPlanner(eventDraft) {
  // Hyderabad market decor rates per event type
  const decorCosts = {
    wedding: 250000,        // ₹2.5L — floral mandap, entry arch, table centrepieces, stage
    "corporate event": 80000, // ₹80K — branded backdrop, podium, minimal table decor
    "birthday party": 90000   // ₹90K — balloon arch, photo booth, themed table setups
  };
  const cost = decorCosts[eventDraft.eventType] || 100000;

  const elementsByType = {
    wedding: ["floral mandap & stage", "entry arch & pathway", "table centrepieces", "photo booth wall", "lighting & drapes"],
    "corporate event": ["branded backdrop & podium", "registration desk setup", "minimal table decor", "ambient lighting"],
    "birthday party": ["balloon arch & ceiling decor", "themed photo booth", "table centerpieces", "LED lighting", "welcome signage"]
  };

  const suggestion = {
    theme: eventDraft.theme || defaultThemeFor(eventDraft.eventType),
    elements: elementsByType[eventDraft.eventType] || ["entry signage", "table styling", "stage backdrop", "ambient lighting"],
    mood: eventDraft.eventType === "corporate event" ? "clean and professional" : "vibrant and celebratory",
    estimatedCost: cost
  };

  eventDraft.selectedServices.decor = suggestion;
  addCost(eventDraft, "Decor", cost);
  return suggestion;
}

export function runInvitationManager(eventDraft) {
  // Hyderabad market: digital design + WhatsApp blast ₹8K; printed cards for large events add ₹25K
  const guestCount = eventDraft.guestCount || 50;
  const usePrinted = guestCount >= 100;
  const inviteCost = usePrinted ? 30000 : 8000;

  const suggestion = {
    format: usePrinted ? "printed cards + digital e-invite" : "digital e-invite (WhatsApp & email)",
    audienceSize: guestCount,
    sendTiming: eventDraft.date ? `Send 3 weeks before ${eventDraft.date}` : "Send once the date is confirmed",
    draft: `Join us for a ${eventDraft.eventType} with food, decor, and a curated guest experience.`,
    estimatedCost: inviteCost
  };

  eventDraft.selectedServices.invites = suggestion;
  addCost(eventDraft, "Invitations", inviteCost);
  return suggestion;
}

export function runPhotographyPlanner(eventDraft) {
  // Hyderabad market: candid photographer ₹45K half-day; 2 photographers + cinematographer ₹1.25L full-day
  const isLargeEvent = (eventDraft.guestCount || 50) > 100;
  const estimatedCost = isLargeEvent ? 125000 : 45000;

  const suggestion = {
    package: isLargeEvent
      ? "full-day coverage (2 candid photographers + cinematographer)"
      : "half-day coverage (1 candid photographer)",
    deliverables: isLargeEvent
      ? ["600+ edited photos", "cinematic highlight reel (5–7 min)", "full ceremony video", "online gallery", "USB with raw footage"]
      : ["300+ edited photos", "short highlight reel (2–3 min)", "online gallery"],
    estimatedCost
  };

  eventDraft.selectedServices.photography = suggestion;
  addCost(eventDraft, "Photography", estimatedCost);
  return suggestion;
}

export function runBudgetManager(eventDraft) {
  const totalEstimatedCost = eventDraft.costs.reduce((sum, item) => sum + item.amount, 0);
  const summary = {
    totalEstimatedCost,
    budget: eventDraft.budget,
    status: determineBudgetStatus(totalEstimatedCost, eventDraft.budget)
  };

  eventDraft.selectedServices.budget = summary;
  return summary;
}

function chooseVenueName(eventType) {
  if (eventType === "wedding") {
    return "Shilpakala Vedika Banquet Hall";
  }
  if (eventType === "corporate event") {
    return "HICC Convention Centre";
  }
  if (eventType === "birthday party") {
    return "The Lalit Ashok Banquet";
  }

  return "Novotel Hyderabad Convention Centre";
}

function estimateVenueCost(guestCount = 50) {
  // Hyderabad banquet hall rates: small ₹60K, mid ₹1.5L, large ₹3L, very large ₹5L
  if (guestCount <= 50) return 60000;
  if (guestCount <= 150) return 150000;
  if (guestCount <= 300) return 300000;
  return 500000;
}

function defaultThemeFor(eventType) {
  if (eventType === "wedding") {
    return "classic floral";
  }
  if (eventType === "corporate event") {
    return "modern minimal";
  }
  if (eventType === "birthday party") {
    return "bright playful";
  }

  return "simple modern";
}

function determineBudgetStatus(totalEstimatedCost, budget) {
  if (!budget) {
    return "No budget provided";
  }
  if (totalEstimatedCost <= budget) {
    return "Within budget";
  }
  return "Over budget";
}