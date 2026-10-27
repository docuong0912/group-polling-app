export const ESTIMATION_CARDS = [
  "0",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "20",
  "40",
  "100",
  "?",
] as const;

export type EstimationCard = (typeof ESTIMATION_CARDS)[number];
export type RoundStatus = "estimating" | "revealed";

export interface Estimate {
  estimator: string;
  value: EstimationCard;
}

export interface EstimationRound {
  id: string;
  title: string;
  description: string;
  facilitator: string;
  estimators: string[];
  estimates: Estimate[];
  status: RoundStatus;
  createdAt: string;
  revealedAt: string | null;
}
