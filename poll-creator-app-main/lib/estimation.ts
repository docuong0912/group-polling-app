import {
  ESTIMATION_CARDS,
  type Estimate,
  type EstimationCard,
  type EstimationRound,
} from "./types";

export const MIN_ESTIMATORS = 2;
export const MAX_ESTIMATORS = 15;

export function normalizeEstimatorNames(value: string): string[] {
  const names: string[] = [];
  const seen = new Set<string>();

  for (const line of value.split(/\r?\n/)) {
    const name = line.trim();
    const normalizedName = name.toLocaleLowerCase();
    if (name && !seen.has(normalizedName)) {
      names.push(name);
      seen.add(normalizedName);
    }
  }

  return names;
}

export function isEstimationCard(value: unknown): value is EstimationCard {
  return (
    typeof value === "string" &&
    ESTIMATION_CARDS.includes(value as EstimationCard)
  );
}

export function medianEstimate(estimates: Estimate[]): number | null {
  const values = estimates
    .map(({ value }) => Number(value))
    .filter(Number.isFinite)
    .sort((left, right) => left - right);

  if (values.length === 0) return null;

  const middle = Math.floor(values.length / 2);
  if (values.length % 2 === 1) return values[middle];
  return (values[middle - 1] + values[middle]) / 2;
}

export function summarizeEstimates(estimates: Estimate[]) {
  const counts = new Map<EstimationCard, number>(
    ESTIMATION_CARDS.map((card) => [card, 0]),
  );

  for (const estimate of estimates) {
    counts.set(estimate.value, (counts.get(estimate.value) ?? 0) + 1);
  }

  const highestCount = Math.max(0, ...counts.values());
  const modes =
    highestCount === 0
      ? []
      : ESTIMATION_CARDS.filter((card) => counts.get(card) === highestCount);

  return {
    counts,
    modes,
    highestCount,
    median: medianEstimate(estimates),
    total: estimates.length,
  };
}

export function canSubmitEstimate(round: EstimationRound): boolean {
  return (
    round.status === "estimating" &&
    round.estimates.length < round.estimators.length
  );
}

export function addEstimate(
  round: EstimationRound,
  value: EstimationCard,
): EstimationRound {
  if (!canSubmitEstimate(round)) {
    throw new Error("This estimation round is not accepting estimates.");
  }

  const estimator = round.estimators[round.estimates.length];
  if (!estimator) {
    throw new Error("No estimator is waiting to submit a card.");
  }

  return {
    ...round,
    estimates: [...round.estimates, { estimator, value }],
  };
}

export function revealRound(
  round: EstimationRound,
  revealedAt: string,
): EstimationRound {
  if (round.status !== "estimating") {
    throw new Error("This estimation round has already been revealed.");
  }
  if (round.estimates.length !== round.estimators.length) {
    throw new Error("Every estimator must submit a card before reveal.");
  }

  return { ...round, status: "revealed", revealedAt };
}
