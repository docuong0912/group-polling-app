// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { loadDemoRounds } from "./demo-rounds";
import {
  clearSavedRounds,
  isEstimationRound,
  loadRounds,
  saveRounds,
  STORAGE_KEY,
} from "./persistence";
import type { EstimationRound } from "./types";

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key) ?? null : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

const validRound: EstimationRound = {
  id: "round-1",
  title: "As a support agent, I can search tickets by customer email",
  description: "Look up records using a customer email and filter by status.",
  facilitator: "Morgan",
  estimators: ["Ada", "Bo", "Kai"],
  estimates: [{ estimator: "Ada", value: "5" }, { estimator: "Bo", value: "8" }],
  status: "estimating",
  createdAt: "2026-01-01T00:00:00.000Z",
  revealedAt: null,
};

describe("isEstimationRound", () => {
  it("accepts a valid round and rejects malformed or inconsistent records", () => {
    expect(isEstimationRound(validRound)).toBe(true);
    expect(isEstimationRound({ ...validRound, estimators: ["Ada"] })).toBe(false);
    expect(isEstimationRound({ ...validRound, status: "revealed", revealedAt: null })).toBe(false);
    expect(
      isEstimationRound({
        ...validRound,
        estimates: [{ estimator: "Ada", value: "5" }, { estimator: "Kai", value: "8" }],
      }),
    ).toBe(false);
  });
});

describe("round storage helpers", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: createLocalStorageMock(),
      configurable: true,
    });
  });

  it("loads valid rounds from storage and tolerates unsupported data", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([validRound]));
    expect(loadRounds()).toEqual({ rounds: [validRound], error: null });

    window.localStorage.setItem(STORAGE_KEY, "{not valid json");
    expect(loadRounds()).toEqual({
      rounds: [],
      error:
        "Saved estimation data could not be read. Export or clear this browser’s stored data before continuing.",
    });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ bad: true }]));
    expect(loadRounds()).toEqual({
      rounds: [],
      error: "Saved estimation data is in an unsupported format. It was not overwritten.",
    });

    window.localStorage.removeItem(STORAGE_KEY);
    expect(loadRounds()).toEqual({ rounds: [], error: null });
  });

  it("saves and clears rounds from browser storage", () => {
    expect(saveRounds([validRound])).toBeNull();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")).toEqual([validRound]);

    expect(clearSavedRounds()).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe("demo rounds", () => {
  it("returns deep-cloned demo data without mutating the source list", () => {
    const rounds = loadDemoRounds();

    expect(rounds).toHaveLength(2);
    expect(rounds[0]).not.toBe(loadDemoRounds()[0]);
    expect(rounds[0].estimators).toEqual(["Priya", "Ada", "Kai", "Bo", "Noor"]);

    rounds[0].estimators.push("Morgan");
    expect(loadDemoRounds()[0].estimators).not.toContain("Morgan");
  });
});
