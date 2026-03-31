export function createEventDraft(input = {}) {
  const eventType = normalizeString(input.eventType) || inferEventType(input.request);
  const guestCount = normalizeGuestCount(input.guestCount, input.request);
  const budget = normalizeBudget(input.budget, input.request);
  const date = normalizeString(input.date) || inferDate(input.request);
  const location = normalizeString(input.location) || inferLocation(input.request);

  return {
    request: normalizeString(input.request),
    eventType,
    date,
    location,
    guestCount,
    budget,
    budgetCurrency: inferBudgetCurrency(input.request),
    theme: normalizeString(input.theme),
    requestedServices: inferRequestedServices(input.request),
    selectedServices: {},
    costs: [],
    assumptions: [],
    missingFields: []
  };
}

export function validateEventDraft(eventDraft) {
  const missingFields = [];

  if (!eventDraft.date) {
    missingFields.push("date");
    eventDraft.assumptions.push("Date not provided; schedule is still tentative.");
  }

  if (!eventDraft.location) {
    missingFields.push("location");
    eventDraft.assumptions.push("Location not provided; venue suggestions use a generic city-center placeholder.");
  }

  if (!eventDraft.guestCount) {
    missingFields.push("guestCount");
    eventDraft.guestCount = 50;
    eventDraft.assumptions.push("Guest count not provided; using 50 guests as a planning placeholder.");
  }

  if (!eventDraft.budget) {
    missingFields.push("budget");
    eventDraft.assumptions.push("Budget not provided; recommendations are optimized for moderate cost.");
  }

  eventDraft.missingFields = missingFields;
  return eventDraft;
}

function inferRequestedServices(request = "") {
  const text = request.toLowerCase();
  const services = new Set();

  if (containsAny(text, ["venue", "place", "location"])) {
    services.add("venue");
  }
  if (containsAny(text, ["food", "catering", "menu", "dinner", "lunch"])) {
    services.add("food");
  }
  if (containsAny(text, ["decor", "decoration", "theme", "stage", "setup"])) {
    services.add("decor");
  }
  if (containsAny(text, ["invite", "invitation", "guest list", "rsvp"])) {
    services.add("invites");
  }
  if (containsAny(text, ["photo", "photography", "photographer", "videography", "video"])) {
    services.add("photography");
  }
  if (containsAny(text, ["budget", "cost", "estimate"])) {
    services.add("budget");
  }

  if (services.size === 0) {
    services.add("venue");
    services.add("food");
    services.add("decor");
    services.add("invites");
    services.add("budget");
  }

  return Array.from(services);
}

function inferEventType(request = "") {
  const text = request.toLowerCase();

  if (text.includes("wedding")) {
    return "wedding";
  }
  if (containsAny(text, ["corporate", "offsite", "conference", "team event"])) {
    return "corporate event";
  }
  if (containsAny(text, ["birthday", "party"])) {
    return "birthday party";
  }

  return "event";
}

function normalizeGuestCount(guestCount, request = "") {
  if (Number.isFinite(guestCount) && guestCount > 0) {
    return guestCount;
  }

  const match = request.match(/(\d{1,4})\s+(guest|people|attendee|person)s?/i);
  return match ? Number(match[1]) : null;
}

function normalizeBudget(budget, request = "") {
  if (Number.isFinite(budget) && budget > 0) {
    return budget;
  }
  const lakhMatch = request.match(/(\d+(?:\.\d+)?)\s*lakh/i);
  if (lakhMatch) {
    return Math.round(Number(lakhMatch[1]) * 100000);
  }
  const match = request.match(/(?:\$\s?(\d[\d,]*)|(\d[\d,]*)\s*(?:usd|dollars|budget))/i);
  const rawBudget = match?.[1] || match?.[2];
  if (rawBudget) return Number(rawBudget.replace(/,/g, ""));

  // fallback: bare number >= 1000 preceded by "a" or "with a" (e.g. "with a 300000 budget")
  const bareMatch = request.match(/\ba\s+(\d{4,}(?:[,\d]*)?)\b/i);
  return bareMatch ? Number(bareMatch[1].replace(/,/g, "")) : null;
}

function inferBudgetCurrency(request = "") {
  const text = request.toLowerCase();
  if (text.includes("lakh") || text.includes("rupee") || text.includes("inr")) {
    return "₹";
  }
  if (text.includes("£") || text.includes("gbp")) {
    return "£";
  }
  if (text.includes("€") || text.includes("eur")) {
    return "€";
  }
  return "₹";
}

function inferDate(request = "") {
  // "on May 18" or "on May 18, 2026"
  const namedFull = request.match(/\bon\s+((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:,\s*\d{4})?)/i);
  if (namedFull) return namedFull[1];

  // "18-May", "18 May", "May-18", "May 18" (without "on")
  const namedShort = request.match(/\b(\d{1,2})[-\s](jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i)
    || request.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s*[-\s]\s*(\d{1,2})\b/i);
  if (namedShort) {
    // normalise to "Month Day" order
    const parts = namedShort.slice(1).filter(Boolean);
    return isNaN(Number(parts[0])) ? `${parts[0]} ${parts[1]}` : `${parts[1]} ${parts[0]}`;
  }

  return null;
}

function inferLocation(request = "") {
  const match = request.match(/\bin\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\b/);
  return match ? match[1] : null;
}

function normalizeString(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term));
}