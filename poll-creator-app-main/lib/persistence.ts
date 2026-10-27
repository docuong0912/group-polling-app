import { isEstimationCard } from "./estimation";
import type { Estimate, EstimationRound, RoundStatus } from "./types";

export const STORAGE_KEY = "tiebreak.planning-poker.rounds.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRoundStatus(value: unknown): value is RoundStatus {
  return value === "estimating" || value === "revealed";
}

function isEstimate(value: unknown): value is Estimate {
  return (
    isRecord(value) &&
    typeof value.estimator === "string" &&
    isEstimationCard(value.value)
  );
}

export function isEstimationRound(value: unknown): value is EstimationRound {
  if (!isRecord(value)) return false;
  const estimators = value.estimators;
  const estimates = value.estimates;
  if (
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.description !== "string" ||
    typeof value.facilitator !== "string" ||
    !Array.isArray(estimators) ||
    !estimators.every((name): name is string => typeof name === "string") ||
    !Array.isArray(estimates) ||
    !estimates.every(isEstimate) ||
    !isRoundStatus(value.status) ||
    typeof value.createdAt !== "string" ||
    !(typeof value.revealedAt === "string" || value.revealedAt === null)
  ) {
    return false;
  }

  if (
    estimators.length < 2 ||
    estimators.length > 15 ||
    estimates.length > estimators.length
  ) {
    return false;
  }
  if (estimates.some((estimate, index) => estimate.estimator !== estimators[index])) {
    return false;
  }
  if (
    value.status === "revealed" &&
    (estimates.length !== estimators.length ||
      typeof value.revealedAt !== "string")
  ) {
    return false;
  }

  return true;
}

export type LoadResult =
  | { rounds: EstimationRound[]; error: null }
  | { rounds: []; error: string };

export function loadRounds(): LoadResult {
  let serialized: string | null;
  try {
    serialized = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error("Unable to read Tiebreak local storage:", error);
    return {
      rounds: [],
      error: "Tiebreak could not access local storage. Your rounds cannot be saved in this browser.",
    };
  }

  if (serialized === null) return { rounds: [], error: null };

  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch (error) {
    console.error("Saved Tiebreak data is not valid JSON:", error);
    return {
      rounds: [],
      error: "Saved estimation data could not be read. Export or clear this browser’s stored data before continuing.",
    };
  }

  if (!Array.isArray(parsed) || !parsed.every(isEstimationRound)) {
    console.error("Saved Tiebreak data does not match the current estimation format.");
    return {
      rounds: [],
      error: "Saved estimation data is in an unsupported format. It was not overwritten.",
    };
  }

  return { rounds: parsed, error: null };
}

export function saveRounds(rounds: EstimationRound[]): string | null {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds));
    return null;
  } catch (error) {
    console.error("Unable to save Tiebreak rounds:", error);
    return "This change is only available until you close or reload this page; browser storage could not save it.";
  }
}

export function clearSavedRounds(): string | null {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (error) {
    console.error("Unable to clear Tiebreak local storage:", error);
    return "Tiebreak could not clear the saved data in this browser.";
  }
}
