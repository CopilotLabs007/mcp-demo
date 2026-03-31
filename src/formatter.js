const W = 58; // total card width

const SERVICE_ICONS = {
  venue:       "🏛️",
  food:        "🍽️",
  decor:       "🎨",
  invites:     "✉️ ",
  photography: "📸",
  budget:      "💰"
};

const EVENT_META = {
  wedding:         { icon: "💍", banner: "W E D D I N G   P L A N N E R",  tag: "💒 Shaadi" },
  "corporate event":{ icon: "🏢", banner: "C O R P O R A T E   E V E N T",   tag: "📊 Business" },
  "birthday party":{ icon: "🎂", banner: "B I R T H D A Y   P A R T Y",     tag: "🎈 Celebration" },
  event:           { icon: "🎉", banner: "E V E N T   P L A N N E R",       tag: "✨ Special Occasion" }
};

// ── Box-drawing helpers ───────────────────────────────────────────────────────

function top()    { return `╔${"═".repeat(W)}╗`; }
function bot()    { return `╚${"═".repeat(W)}╝`; }
function mid()    { return `╠${"═".repeat(W)}╣`; }
function sTop()   { return `┌${"─".repeat(W)}┐`; }
function sBot()   { return `└${"─".repeat(W)}┘`; }
function sMid()   { return `├${"─".repeat(W)}┤`; }

function boxLine(text = "") {
  const pad = W - stripEmoji(text).length;
  return `║ ${text}${" ".repeat(Math.max(0, pad - 1))}║`;
}

function sLine(text = "") {
  const pad = W - stripEmoji(text).length;
  return `│ ${text}${" ".repeat(Math.max(0, pad - 1))}│`;
}

function centered(text, width = W) {
  const visible = stripEmoji(text).length;
  const left = Math.floor((width - visible) / 2);
  const right = width - visible - left;
  return `║${" ".repeat(left)}${text}${" ".repeat(right)}║`;
}

function kv(label, value, icon = "") {
  const prefix = icon ? `${icon}  ` : "   ";
  const line = `${prefix}${label.padEnd(14)} ${value}`;
  return sLine(line);
}

function bullet(text) {
  return sLine(`   ✦  ${text}`);
}

function budgetBar(spent, total, width = 30) {
  if (!total) return "";
  const pct = Math.min(spent / total, 1);
  const filled = Math.round(pct * width);
  const empty  = width - filled;
  const isOver = spent > total;
  const bar = (isOver ? "█".repeat(width) : "█".repeat(filled) + "░".repeat(empty));
  const label = `${Math.round(pct * 100)}%`;
  return `   ${bar}  ${label}`;
}

// strip emoji/unicode for length calculations (rough approximation)
function stripEmoji(str) {
  return str.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2000}-\u{2FFF}]/gu, "  ")
            .replace(/[\u2500-\u257F]/g, "");
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Main formatter ────────────────────────────────────────────────────────────

export function formatEventPlan(plan) {
  const { event } = plan;
  const currency    = event.budgetCurrency || "₹";
  const meta        = EVENT_META[event.eventType] || EVENT_META.event;
  const budget      = event.selectedServices.budget;
  const isOver      = budget && budget.budget && budget.totalEstimatedCost > budget.budget;
  const statusEmoji = !budget.budget ? "⚠️ " : isOver ? "❌" : "✅";
  const lines       = [];

  // ══ Banner ════════════════════════════════════════════════════════════════
  lines.push("");
  lines.push(top());
  lines.push(centered(""));
  lines.push(centered(`${meta.icon}   ${meta.banner}   ${meta.icon}`));
  lines.push(centered(""));
  lines.push(centered(`🏷️  ${meta.tag}`));
  lines.push(centered(""));
  lines.push(mid());

  // ══ Event at a glance ════════════════════════════════════════════════════
  lines.push(boxLine("  📌  EVENT DETAILS"));
  lines.push(boxLine(""));
  if (event.eventType) lines.push(boxLine(`     🎪  Type       :  ${capitalize(event.eventType)}`));
  if (event.date)      lines.push(boxLine(`     📅  Date       :  ${event.date}`));
  if (event.location)  lines.push(boxLine(`     📍  Location   :  ${event.location}`));
  if (event.guestCount)lines.push(boxLine(`     👥  Guests     :  ${event.guestCount} people`));
  if (event.budget)    lines.push(boxLine(`     💸  Budget     :  ${currency}${event.budget.toLocaleString()}`));
  if (event.theme)     lines.push(boxLine(`     🎨  Theme      :  ${event.theme}`));
  lines.push(boxLine(""));
  lines.push(bot());

  // ══ Services ══════════════════════════════════════════════════════════════
  lines.push("");
  lines.push("  ╔══════════════════════════════════════════════════════════╗");
  lines.push("  ║          🛎️   S E L E C T E D   S E R V I C E S        ║");
  lines.push("  ╚══════════════════════════════════════════════════════════╝");

  // Venue
  if (event.selectedServices.venue) {
    const v    = event.selectedServices.venue;
    const cost = event.costs.find(c => c.item === "Venue");
    lines.push("");
    lines.push(`  ${sTop()}`);
    lines.push(`  ${sLine(`🏛️   VENUE`)}`);
    lines.push(`  ${sMid()}`);
    lines.push(`  ${kv("Name",     v.name,               "🏠")}`);
    lines.push(`  ${kv("Area",     v.area,               "📍")}`);
    lines.push(`  ${kv("Capacity", `${v.capacity} guests`,"👥")}`);
    lines.push(`  ${kv("Setup",    v.setup,              "🛠️")}`);
    if (cost) lines.push(`  ${kv("Cost",     `${currency}${cost.amount.toLocaleString()}`, "💰")}`);
    lines.push(`  ${sBot()}`);
  }

  // Food
  if (event.selectedServices.food) {
    const f = event.selectedServices.food;
    lines.push("");
    lines.push(`  ${sTop()}`);
    lines.push(`  ${sLine(`🍽️   CATERING`)}`);
    lines.push(`  ${sMid()}`);
    lines.push(`  ${kv("Style",    f.style,              "🧑‍🍳")}`);
    if (f.perGuestRate) lines.push(`  ${kv("Rate",`${currency}${f.perGuestRate}/guest`, "🪙")}`);
    lines.push(`  ${sLine("   🍱  Menu")}`);
    for (const item of f.highlights) lines.push(`  ${bullet(item)}`);
    lines.push(`  ${kv("Total cost", `${currency}${f.estimatedCost.toLocaleString()}`, "💰")}`);
    lines.push(`  ${sBot()}`);
  }

  // Decor
  if (event.selectedServices.decor) {
    const d = event.selectedServices.decor;
    lines.push("");
    lines.push(`  ${sTop()}`);
    lines.push(`  ${sLine(`🎨   DECOR & STYLING`)}`);
    lines.push(`  ${sMid()}`);
    lines.push(`  ${kv("Theme",    d.theme,              "🌸")}`);
    lines.push(`  ${kv("Mood",     d.mood,               "✨")}`);
    lines.push(`  ${sLine("   🎀  Elements")}`);
    for (const el of d.elements) lines.push(`  ${bullet(el)}`);
    lines.push(`  ${kv("Cost", `${currency}${d.estimatedCost.toLocaleString()}`, "💰")}`);
    lines.push(`  ${sBot()}`);
  }

  // Invitations
  if (event.selectedServices.invites) {
    const i = event.selectedServices.invites;
    lines.push("");
    lines.push(`  ${sTop()}`);
    lines.push(`  ${sLine(`✉️    INVITATIONS`)}`);
    lines.push(`  ${sMid()}`);
    lines.push(`  ${kv("Format",   i.format,             "📄")}`);
    lines.push(`  ${kv("Audience", `${i.audienceSize} guests`, "👥")}`);
    lines.push(`  ${kv("Send by",  i.sendTiming,         "📬")}`);
    lines.push(`  ${sLine("   💬  Draft message")}`);
    lines.push(`  ${sLine(`       "${i.draft}"`)}`);
    lines.push(`  ${kv("Cost", `${currency}${i.estimatedCost.toLocaleString()}`, "💰")}`);
    lines.push(`  ${sBot()}`);
  }

  // Photography
  if (event.selectedServices.photography) {
    const p    = event.selectedServices.photography;
    const cost = event.costs.find(c => c.item === "Photography");
    lines.push("");
    lines.push(`  ${sTop()}`);
    lines.push(`  ${sLine(`📸   PHOTOGRAPHY & VIDEOGRAPHY`)}`);
    lines.push(`  ${sMid()}`);
    lines.push(`  ${kv("Package",  p.package,            "🎬")}`);
    lines.push(`  ${sLine("   🖼️   Deliverables")}`);
    for (const d of p.deliverables) lines.push(`  ${bullet(d)}`);
    if (cost) lines.push(`  ${kv("Cost", `${currency}${cost.amount.toLocaleString()}`, "💰")}`);
    lines.push(`  ${sBot()}`);
  }

  // ══ Budget Summary ════════════════════════════════════════════════════════
  lines.push("");
  lines.push(top());
  lines.push(centered(`💰   B U D G E T   S U M M A R Y`));
  lines.push(mid());
  lines.push(boxLine(""));

  for (const c of event.costs) {
    const label = `   ${c.item}`;
    const val   = `${currency}${c.amount.toLocaleString()}`;
    const gap   = W - stripEmoji(label).length - val.length - 1;
    lines.push(boxLine(`${label}${" ".repeat(Math.max(1, gap))}${val}`));
  }

  lines.push(boxLine(""));
  lines.push(boxLine("─".repeat(W - 2)));

  const totalLabel = "   TOTAL ESTIMATE";
  const totalVal   = `${currency}${budget.totalEstimatedCost.toLocaleString()}`;
  const totalGap   = W - stripEmoji(totalLabel).length - totalVal.length - 1;
  lines.push(boxLine(`${totalLabel}${" ".repeat(Math.max(1, totalGap))}${totalVal}`));

  if (budget.budget) {
    const remaining = budget.budget - budget.totalEstimatedCost;
    const sign      = remaining < 0 ? "−" : "+";
    const rimLabel  = remaining < 0 ? "   OVER BUDGET BY" : "   REMAINING";
    const rimVal    = `${sign}${currency}${Math.abs(remaining).toLocaleString()}`;
    const rimGap    = W - stripEmoji(rimLabel).length - rimVal.length - 1;
    lines.push(boxLine(`${rimLabel}${" ".repeat(Math.max(1, rimGap))}${rimVal}`));

    lines.push(boxLine(""));
    lines.push(boxLine(`   ${budgetBar(budget.totalEstimatedCost, budget.budget)}`));
  }

  lines.push(boxLine(""));
  lines.push(boxLine(`   ${statusEmoji}  STATUS : ${budget.status.toUpperCase()}`));
  lines.push(boxLine(""));
  lines.push(bot());

  // ══ Assumptions ═══════════════════════════════════════════════════════════
  if (event.assumptions.length > 0) {
    lines.push("");
    lines.push(`  ┌${"─".repeat(W)}┐`);
    lines.push(`  │  ⚠️   ASSUMPTIONS & PLACEHOLDERS${" ".repeat(W - 34)}│`);
    lines.push(`  ├${"─".repeat(W)}┤`);
    for (const a of event.assumptions) lines.push(`  ${sLine(`   · ${a}`)}`);
    lines.push(`  ${sBot()}`);
  }

  // ══ Pending decisions ═════════════════════════════════════════════════════
  if (event.missingFields.length > 0) {
    lines.push("");
    lines.push(`  ┌${"─".repeat(W)}┐`);
    lines.push(`  │  📝  PENDING DECISIONS${" ".repeat(W - 22)}│`);
    lines.push(`  ├${"─".repeat(W)}┤`);
    for (const f of event.missingFields) lines.push(`  ${sLine(`   · Please provide: ${f}`)}`);
    lines.push(`  ${sBot()}`);
  }

  lines.push("");
  lines.push(`  ${"·".repeat(W)}  `);
  lines.push(`  Powered by MCP Event Organizer Demo  ·  Hyderabad Market Rates`);
  lines.push(`  ${"·".repeat(W)}  `);
  lines.push("");

  return lines.join("\n");
}

