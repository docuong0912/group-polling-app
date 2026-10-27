import { describe, expect, it } from "vitest";
import {
  addEstimate,
  medianEstimate,
  normalizeEstimatorNames,
  revealRound,
  summarizeEstimates,
} from "./estimation";
import type { EstimationRound } from "./types";

describe("medianEstimate", () => {
  it("returns the middle numeric estimate and ignores uncertainty cards", () => {
    expect(
      medianEstimate([
        { estimator: "Ada", value: "13" },
        { estimator: "Bo", value: "?" },
        { estimator: "Kai", value: "3" },
      ]),
    ).toBe(8);
  });

  it("averages the two center values when there are an even number", () => {
    expect(
      medianEstimate([
        { estimator: "Ada", value: "1" },
        { estimator: "Bo", value: "?" },
        { estimator: "Kai", value: "2" },
        { estimator: "Mina", value: "5" },
      ]),
    ).toBe(2);
  });

  it("supports half-point medians", () => {
    expect(
      medianEstimate([
        { estimator: "Ada", value: "2" },
        { estimator: "Bo", value: "3" },
      ]),
    ).toBe(2.5);
  });

  it("returns null when the team selected only uncertainty cards", () => {
    expect(medianEstimate([{ estimator: "Ada", value: "?" }])).toBeNull();
  });
});

describe("normalizeEstimatorNames", () => {
  it("trims empty lines and removes case-insensitive duplicates", () => {
    expect(normalizeEstimatorNames(" Ada \n\nada\nBo")).toEqual(["Ada", "Bo"]);
  });
});

describe("round state", () => {
  const round: EstimationRound = {
    id: "round-1",
    title: "Add passkey sign-in",
    description: "",
    facilitator: "Morgan",
    estimators: ["Ada", "Bo"],
    estimates: [],
    status: "estimating",
    createdAt: "2026-01-01T00:00:00.000Z",
    revealedAt: null,
  };

  it("assigns cards sequentially and rejects reveal before all votes", () => {
    const first = addEstimate(round, "5");
    expect(first.estimates).toEqual([{ estimator: "Ada", value: "5" }]);
    expect(() => revealRound(first, "2026-01-01T00:01:00.000Z")).toThrow(
      "Every estimator must submit a card before reveal.",
    );

    const completed = addEstimate(first, "?");
    expect(completed.estimates[1].estimator).toBe("Bo");
    expect(
      revealRound(completed, "2026-01-01T00:01:00.000Z").status,
    ).toBe("revealed");
  });

  it("states a tied mode and reports all vote counts", () => {
    const summary = summarizeEstimates([
      { estimator: "Ada", value: "3" },
      { estimator: "Bo", value: "5" },
      { estimator: "Kai", value: "?" },
    ]);
    expect(summary.modes).toEqual(["3", "5", "?"]);
    expect(summary.counts.get("?")).toBe(1);
    expect(summary.total).toBe(3);
  });
});
