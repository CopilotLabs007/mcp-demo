import { createEventDraft, validateEventDraft } from "./event-schema.js";
import {
  runBudgetManager,
  runDecorPlanner,
  runFoodPlanner,
  runInvitationManager,
  runPhotographyPlanner,
  runVenuePlanner
} from "./tools.js";

export function buildEventPlan(input) {
  const eventDraft = validateEventDraft(createEventDraft(input));
  const serviceOrder = [];

  if (eventDraft.requestedServices.includes("venue")) {
    runVenuePlanner(eventDraft);
    serviceOrder.push("venue");
  }
  if (eventDraft.requestedServices.includes("food")) {
    runFoodPlanner(eventDraft);
    serviceOrder.push("food");
  }
  if (eventDraft.requestedServices.includes("decor")) {
    runDecorPlanner(eventDraft);
    serviceOrder.push("decor");
  }
  if (eventDraft.requestedServices.includes("invites")) {
    runInvitationManager(eventDraft);
    serviceOrder.push("invites");
  }
  if (eventDraft.requestedServices.includes("photography")) {
    runPhotographyPlanner(eventDraft);
    serviceOrder.push("photography");
  }

  runBudgetManager(eventDraft);
  serviceOrder.push("budget");

  return {
    event: eventDraft,
    serviceOrder
  };
}