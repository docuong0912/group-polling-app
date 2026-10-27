import type { EstimationRound } from "./types";

const createdAt = "2026-10-20T09:00:00.000Z";

export const DEMO_ROUNDS: EstimationRound[] = [
  {
    id: "demo-unified-search",
    title: "As a support agent, I can search tickets by customer email",
    description:
      "The ticket list should support email search across open and recently closed tickets. Results must update as the query is submitted, and an empty state should explain when there are no matches.",
    facilitator: "Morgan",
    estimators: ["Priya", "Ada", "Kai", "Bo", "Noor"],
    estimates: [
      { estimator: "Priya", value: "5" },
      { estimator: "Ada", value: "8" },
      { estimator: "Kai", value: "5" },
      { estimator: "Bo", value: "13" },
      { estimator: "Noor", value: "?" },
    ],
    status: "revealed",
    createdAt,
    revealedAt: "2026-10-20T09:18:00.000Z",
  },
  {
    id: "demo-billing-email",
    title: "As an account owner, I can update my billing email",
    description:
      "Allow account owners to change the address used for invoices. Validate the new address, send a confirmation email, and retain the previous address until confirmation.",
    facilitator: "Morgan",
    estimators: ["Priya", "Ada", "Kai", "Bo", "Noor"],
    estimates: [],
    status: "estimating",
    createdAt: "2026-10-21T10:30:00.000Z",
    revealedAt: null,
  },
];

export function loadDemoRounds(): EstimationRound[] {
  return DEMO_ROUNDS.map((round) => ({
    ...round,
    estimators: [...round.estimators],
    estimates: round.estimates.map((estimate) => ({ ...estimate })),
  }));
}
