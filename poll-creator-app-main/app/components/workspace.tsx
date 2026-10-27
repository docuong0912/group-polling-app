"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Clipboard,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  addEstimate,
  canSubmitEstimate,
  medianEstimate,
  summarizeEstimates,
} from "@/lib/estimation";
import { loadDemoRounds } from "@/lib/demo-rounds";
import {
  clearSavedRounds,
  loadRounds,
  saveRounds,
} from "@/lib/persistence";
import { ESTIMATION_CARDS, type EstimationCard, type EstimationRound } from "@/lib/types";
import {
  CreateRoundDialog,
  type NewRoundDetails,
  type RoundPrefill,
} from "./create-round-dialog";
import { ConfirmDialog } from "./dialogs";

type FocusTarget = "dashboard" | "story" | "handoff" | "reveal";

interface FocusRequest {
  target: FocusTarget;
  requestId: number;
}

function makeId(): string {
  if (!globalThis.crypto?.randomUUID) {
    throw new Error("This browser cannot create a secure local round ID.");
  }
  return globalThis.crypto.randomUUID();
}

function formatMedian(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function percent(count: number, total: number): number {
  return total ? Math.round((count / total) * 100) : 0;
}

function medianDescription(round: EstimationRound, median: number | null): string {
  const numericCount = round.estimates.filter((estimate) => estimate.value !== "?").length;
  if (median === null) {
    return "No numeric team reference: every estimator selected unsure.";
  }
  const numericLabel = `${numericCount} numeric ${numericCount === 1 ? "estimate" : "estimates"}`;
  return `Median of ${numericLabel}. Unsure cards are excluded.`;
}

export function Workspace() {
  const [rounds, setRounds] = useState<EstimationRound[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [prefill, setPrefill] = useState<RoundPrefill | null>(null);
  const [selectedCard, setSelectedCard] = useState<EstimationCard | null>(null);
  const [confirmEstimateOpen, setConfirmEstimateOpen] = useState(false);
  const [confirmRevealOpen, setConfirmRevealOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  const focusRequestId = useRef(0);
  const dashboardHeadingRef = useRef<HTMLHeadingElement>(null);
  const storyHeadingRef = useRef<HTMLHeadingElement>(null);
  const handoffHeadingRef = useRef<HTMLHeadingElement>(null);
  const revealHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const result = loadRounds();
      setRounds(result.rounds);
      setLoadError(result.error ?? "");
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !focusRequest) return;
    const target = {
      dashboard: dashboardHeadingRef,
      story: storyHeadingRef,
      handoff: handoffHeadingRef,
      reveal: revealHeadingRef,
    }[focusRequest.target];
    const frame = requestAnimationFrame(() => target.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [focusRequest, loaded, rounds, activeRoundId]);

  function requestFocus(target: FocusTarget) {
    focusRequestId.current += 1;
    setFocusRequest({ target, requestId: focusRequestId.current });
  }

  const activeRound = useMemo(
    () => rounds.find((round) => round.id === activeRoundId) ?? null,
    [activeRoundId, rounds],
  );
  const openRounds = rounds
    .filter((round) => round.status === "estimating")
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const revealedRounds = rounds
    .filter((round) => round.status === "revealed")
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  function commit(nextRounds: EstimationRound[], successMessage?: string) {
    setRounds(nextRounds);
    const error = saveRounds(nextRounds);
    if (error) {
      setNotice(error);
      return false;
    }
    if (successMessage) setNotice(successMessage);
    return true;
  }

  function createRound(details: NewRoundDetails) {
    try {
      const round: EstimationRound = {
        id: makeId(),
        ...details,
        estimates: [],
        status: "estimating",
        createdAt: new Date().toISOString(),
        revealedAt: null,
      };
      commit([round, ...rounds], "Story added. Hand the device to the first estimator.");
      setActiveRoundId(round.id);
      setSelectedCard(null);
      setPrefill(null);
      setCreateOpen(false);
      requestFocus("story");
    } catch (error) {
      console.error("Unable to create estimation round:", error);
      setNotice(
        error instanceof Error
          ? error.message
          : "The estimation round could not be created.",
      );
    }
  }

  function loadDemo() {
    if (loadError) return;
    const demos = loadDemoRounds();
    const existingIds = new Set(rounds.map((round) => round.id));
    const safeDemos = demos.map((round) =>
      existingIds.has(round.id) ? { ...round, id: makeId() } : round,
    );
    commit([...safeDemos, ...rounds], "Sample backlog added to this browser.");
  }

  function repeatRound(round: EstimationRound) {
    setPrefill({
      title: round.title,
      description: round.description,
      facilitator: round.facilitator,
      estimators: round.estimators,
    });
    setCreateOpen(true);
  }

  function submitEstimate() {
    if (!activeRound || !selectedCard || !canSubmitEstimate(activeRound)) return;

    try {
      const nextRound = addEstimate(activeRound, selectedCard);
      const nextRounds = rounds.map((round) =>
        round.id === nextRound.id ? nextRound : round,
      );
      const remaining = nextRound.estimators.length - nextRound.estimates.length;
      commit(
        nextRounds,
        remaining > 0
          ? `Estimate submitted. Pass the device to ${nextRound.estimators[nextRound.estimates.length]}.`
          : "Everyone has estimated. The cards stay hidden until the facilitator reveals them.",
      );
      setSelectedCard(null);
      setConfirmEstimateOpen(false);
      requestFocus("handoff");
    } catch (error) {
      console.error("Unable to submit the estimate:", error);
      setNotice(
        error instanceof Error ? error.message : "That estimate could not be saved.",
      );
    }
  }

  function revealEstimates() {
    if (!activeRound || activeRound.estimates.length !== activeRound.estimators.length) {
      setConfirmRevealOpen(false);
      setNotice("Wait until every estimator has submitted before revealing the cards.");
      return;
    }

    const nextRound: EstimationRound = {
      ...activeRound,
      status: "revealed",
      revealedAt: new Date().toISOString(),
    };
    commit(
      rounds.map((round) => (round.id === nextRound.id ? nextRound : round)),
      "Estimates revealed. The numeric median is the team reference point.",
    );
    setConfirmRevealOpen(false);
    requestFocus("reveal");
  }

  function confirmReset() {
    const error = clearSavedRounds();
    setConfirmResetOpen(false);
    if (error) {
      setNotice(error);
      return;
    }
    setRounds([]);
    setActiveRoundId(null);
    setLoadError("");
    setNotice("Saved estimation data cleared from this browser.");
    requestFocus("dashboard");
  }

  async function copyResult(round: EstimationRound) {
    const median = medianEstimate(round.estimates);
    const summary = summarizeEstimates(round.estimates);
    const distribution = ESTIMATION_CARDS.filter(
      (card) => (summary.counts.get(card) ?? 0) > 0,
    )
      .map((card) => `${card === "?" ? "Unsure" : `${card} points`}: ${summary.counts.get(card)}`)
      .join(", ");
    const medianLine =
      median === null
        ? "No numeric team reference (all estimates were unsure)."
        : `Team reference: ${formatMedian(median)} points (median of numeric estimates).`;
    const text = `Tiebreak planning poker\n${round.title}\n${medianLine}\nEstimate distribution: ${distribution}\nFacilitated by ${round.facilitator}.`;

    try {
      await navigator.clipboard.writeText(text);
      setNotice("Estimation summary copied.");
    } catch (error) {
      console.error("Unable to copy the estimation summary:", error);
      setNotice("Could not copy the summary. Check clipboard permission and try again.");
    }
  }

  function openNewRound() {
    setPrefill(null);
    setCreateOpen(true);
  }

  if (!loaded) {
    return (
      <section className="workspace-loading" aria-label="Loading saved estimation rounds">
        <div className="loading-line" />
        <div className="loading-line loading-line-short" />
      </section>
    );
  }

  if (activeRound) {
    const isComplete = activeRound.estimates.length === activeRound.estimators.length;
    const nextEstimator = activeRound.estimators[activeRound.estimates.length];

    return (
      <>
        <div className="workspace-toolbar">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              setActiveRoundId(null);
              setSelectedCard(null);
              setNotice("");
              requestFocus("dashboard");
            }}
          >
            <ArrowLeft aria-hidden="true" size={17} />
            Back to backlog
          </button>
          <span className={`status-pill ${activeRound.status === "revealed" ? "status-settled" : ""}`}>
            {activeRound.status === "revealed"
              ? "Estimates revealed"
              : isComplete
                ? "Ready to reveal"
                : "Estimation in progress"}
          </span>
        </div>

        {activeRound.status === "estimating" ? (
          <article className="round-panel">
            <div className="round-kicker">
              <span className="eyebrow">BACKLOG STORY</span>
              <span className="meta-pill">
                Facilitated by {activeRound.facilitator}
              </span>
            </div>
            <h2 className="round-title" ref={storyHeadingRef} tabIndex={-1}>
              {activeRound.title}
            </h2>
            {activeRound.description ? (
              <p className="story-description">{activeRound.description}</p>
            ) : (
              <p className="story-description empty-description">
                No extra context added. Ask the facilitator to clarify before estimates begin.
              </p>
            )}

            <div className="round-progress">
              <div>
                <strong>
                  {activeRound.estimates.length} of {activeRound.estimators.length} estimates submitted
                </strong>
                <p>Individual cards are hidden until reveal.</p>
              </div>
              <div
                className="progress-ticks"
                aria-hidden="true"
                style={{ "--tick-count": activeRound.estimators.length } as CSSProperties}
              >
                {activeRound.estimators.map((name, index) => (
                  <span
                    className={index < activeRound.estimates.length ? "is-submitted" : ""}
                    key={`${name}-${index}`}
                  />
                ))}
              </div>
            </div>

            {!isComplete ? (
              <section className="estimator-step" aria-labelledby="handoff-title">
                <div className="step-indicator">
                  <span className="step-number">{activeRound.estimates.length + 1}</span>
                  <p className="eyebrow">NEXT ESTIMATOR</p>
                </div>
                <h3
                  className="estimator-title"
                  id="handoff-title"
                  ref={handoffHeadingRef}
                  tabIndex={-1}
                >
                  Hand the device to <span>{nextEstimator}</span>
                </h3>
                <p className="step-copy">
                  Read the story, choose a card independently, and keep it face down until the group reveal.
                </p>
                <fieldset className="card-deck">
                  <legend className="visually-hidden">Choose a story point estimate</legend>
                  {ESTIMATION_CARDS.map((card) => (
                    <label className="estimate-card" key={card}>
                      <input
                        type="radio"
                        name="story-point-estimate"
                        value={card}
                        checked={selectedCard === card}
                        onChange={() => setSelectedCard(card)}
                      />
                      <span className="estimate-card-face">
                        {card === "?" ? (
                          <>
                            <CircleHelp aria-hidden="true" size={24} />
                            <span className="unsure-label">Unsure</span>
                          </>
                        ) : (
                          card
                        )}
                      </span>
                    </label>
                  ))}
                </fieldset>
                <button
                  className="button button-primary submit-estimate"
                  type="button"
                  disabled={!selectedCard}
                  onClick={() => setConfirmEstimateOpen(true)}
                >
                  Confirm {selectedCard ? `${selectedCard} point${selectedCard === "1" ? "" : "s"}` : "estimate"}
                  <ChevronRight aria-hidden="true" size={18} />
                </button>
                <p className="privacy-note">
                  <CircleHelp aria-hidden="true" size={17} />
                  Values are hidden in the app until reveal. This shared-device demo does not protect saved votes from someone inspecting browser storage.
                </p>
              </section>
            ) : (
              <section className="ready-reveal" aria-labelledby="reveal-ready-title">
                <div className="ready-mark" aria-hidden="true">
                  <Check size={22} />
                </div>
                <div>
                  <h3 id="reveal-ready-title">All estimates are in</h3>
                  <p>
                    No values or distribution are shown yet. The facilitator can reveal the cards when the team is together.
                  </p>
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => setConfirmRevealOpen(true)}
                  >
                    Reveal estimates
                    <Sparkles aria-hidden="true" size={17} />
                  </button>
                </div>
              </section>
            )}
          </article>
        ) : (
          <RevealPanel
            round={activeRound}
            headingRef={revealHeadingRef}
            onCopy={() => void copyResult(activeRound)}
            onEstimateAgain={() => repeatRound(activeRound)}
          />
        )}

        <p className="status-message" role="status" aria-live="polite" aria-atomic="true">
          {notice}
        </p>

        <ConfirmDialog
          open={confirmEstimateOpen}
          onOpenChange={setConfirmEstimateOpen}
          title="Submit this estimate?"
          description={
            selectedCard
              ? `Your ${selectedCard === "?" ? "unsure" : `${selectedCard}-point`} card is final for this round. The next estimator will not see your choice.`
              : "Choose an estimate card first."
          }
          confirmLabel="Submit estimate"
          onConfirm={submitEstimate}
        />
        <ConfirmDialog
          open={confirmRevealOpen}
          onOpenChange={setConfirmRevealOpen}
          title="Reveal the cards?"
          description="Every estimate and its estimator’s name will become visible together. This round cannot be hidden again."
          confirmLabel="Reveal estimates"
          onConfirm={revealEstimates}
        />
        <CreateRoundDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreate={createRound}
          prefill={prefill}
        />
      </>
    );
  }

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <div className="section-eyebrow">
            <span className="eyebrow">YOUR LOCAL BACKLOG</span>
            <span className="meta-pill">{rounds.length} {rounds.length === 1 ? "story" : "stories"}</span>
          </div>
          <h2 className="section-title" ref={dashboardHeadingRef} tabIndex={-1}>
            {rounds.length ? "Stories for the team" : "Your backlog starts here"}
          </h2>
          <p className="section-description">
            {rounds.length
              ? "Facilitate a story, collect independent estimates, then reveal them together."
              : "Prepare a backlog story and let your development team estimate together on this device."}
          </p>
        </div>
        <button
          className="button button-primary"
          type="button"
          disabled={Boolean(loadError)}
          onClick={openNewRound}
        >
          <Plus aria-hidden="true" size={18} />
          New story
        </button>
      </div>

      {loadError ? (
        <div className="storage-warning" role="alert">
          <div>
            <strong>Saved data needs attention</strong>
            <p>{loadError}</p>
          </div>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setConfirmResetOpen(true)}
          >
            Reset local data
          </button>
        </div>
      ) : null}

      {!rounds.length ? (
        <section className="empty-state" aria-labelledby="empty-title">
          <span className="empty-symbol" aria-hidden="true">
            <Clipboard size={26} />
          </span>
          <h3 id="empty-title">Start with one clear story</h3>
          <p>
            Add a title, acceptance criteria, and estimator roster. We’ll pass the device around and keep every card hidden until the team is ready.
          </p>
          <div className="empty-actions">
            <button
              className="button button-primary"
              type="button"
              disabled={Boolean(loadError)}
              onClick={openNewRound}
            >
              Create a story
              <ArrowRight aria-hidden="true" size={17} />
            </button>
            <button
              className="text-button"
              type="button"
              disabled={Boolean(loadError)}
              onClick={loadDemo}
            >
              Load sample backlog
            </button>
          </div>
        </section>
      ) : (
        <div className="backlog-sections">
          <section aria-labelledby="active-stories-title">
            <div className="section-heading">
              <div>
                <h3 id="active-stories-title">Needs estimation</h3>
                <p>Rounds in progress; estimates are still hidden.</p>
              </div>
              <span className="meta-pill">{openRounds.length} open</span>
            </div>
            {openRounds.length ? (
              <ul className="story-list">
                {openRounds.map((round) => (
                  <li className="story-row" key={round.id}>
                    <div className="story-main">
                      <div className="story-meta">
                        <span className={`status-pill ${round.estimates.length === round.estimators.length ? "status-ready" : ""}`}>
                          {round.estimates.length === round.estimators.length ? "Ready to reveal" : "Estimating"}
                        </span>
                        <span className="meta-pill">
                          {round.estimates.length} of {round.estimators.length} submitted
                        </span>
                      </div>
                      <h4>{round.title}</h4>
                      <p>{round.description || "No extra story context."}</p>
                    </div>
                    <button
                      className="button button-secondary story-open"
                      type="button"
                      onClick={() => {
                        setActiveRoundId(round.id);
                        setSelectedCard(null);
                        requestFocus("story");
                      }}
                    >
                      Continue
                      <ChevronRight aria-hidden="true" size={17} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="quiet-empty">No estimation rounds in progress.</p>
            )}
          </section>

          <section aria-labelledby="completed-stories-title">
            <div className="section-heading">
              <div>
                <h3 id="completed-stories-title">Estimated stories</h3>
                <p>Revealed rounds and their numeric median reference.</p>
              </div>
              <span className="meta-pill">{revealedRounds.length} done</span>
            </div>
            {revealedRounds.length ? (
              <ul className="story-list">
                {revealedRounds.map((round) => {
                  const median = medianEstimate(round.estimates);
                  return (
                    <li className="story-row" key={round.id}>
                      <div className="story-main">
                        <div className="story-meta">
                          <span className="status-pill status-settled">Revealed</span>
                          <span className="meta-pill">{round.estimators.length} estimators</span>
                        </div>
                        <h4>{round.title}</h4>
                        <p>{medianDescription(round, median)}</p>
                      </div>
                      <div className="completed-actions">
                        <span className="estimate-badge">
                          {median === null ? "—" : formatMedian(median)}
                          <span>PTS</span>
                        </span>
                        <button
                          className="button button-secondary"
                          type="button"
                          onClick={() => {
                            setActiveRoundId(round.id);
                            requestFocus("reveal");
                          }}
                        >
                          View
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="quiet-empty">Revealed rounds will be kept here.</p>
            )}
          </section>
        </div>
      )}

      <div className="privacy-footer">
        <CircleHelp aria-hidden="true" size={17} />
        <p>
          Stories and votes stay in this browser. This demo has no accounts, shared links, or cross-device sync.
        </p>
      </div>

      <p className="status-message" role="status" aria-live="polite" aria-atomic="true">
        {notice}
      </p>

      <CreateRoundDialog
        open={createOpen}
        onOpenChange={(isOpen) => {
          setCreateOpen(isOpen);
          if (!isOpen) setPrefill(null);
        }}
        onCreate={createRound}
        prefill={prefill}
      />
      <ConfirmDialog
        open={confirmResetOpen}
        onOpenChange={setConfirmResetOpen}
        title="Clear saved data?"
        description="This removes all estimation rounds stored in this browser, including any data that could not be read."
        confirmLabel="Clear browser data"
        onConfirm={confirmReset}
      />
    </>
  );
}

interface RevealPanelProps {
  round: EstimationRound;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onCopy: () => void;
  onEstimateAgain: () => void;
}

function RevealPanel({
  round,
  headingRef,
  onCopy,
  onEstimateAgain,
}: RevealPanelProps) {
  const summary = summarizeEstimates(round.estimates);
  const median = summary.median;
  const numericTotal = round.estimates.filter((estimate) => estimate.value !== "?").length;
  const modes = summary.modes;
  const modeDescription =
    modes.length > 1
      ? `Most-selected cards tied at ${modes.map((card) => (card === "?" ? "Unsure" : `${card} points`)).join(" and ")}.`
      : modes.length === 1
        ? `${modes[0] === "?" ? "Unsure" : `${modes[0]} points`} was the most-selected card.`
        : "No estimates were submitted.";

  return (
    <article className="round-panel reveal-panel">
      <div className="round-kicker">
        <span className="status-pill status-settled">Estimates revealed</span>
        <span className="meta-pill">Facilitated by {round.facilitator}</span>
      </div>
      <h2 className="round-title" ref={headingRef} tabIndex={-1}>
        {round.title}
      </h2>
      {round.description ? <p className="story-description">{round.description}</p> : null}

      <section className="median-hero" aria-labelledby="median-label">
        <div>
          <p className="median-overline" id="median-label">TEAM REFERENCE · MEDIAN</p>
          <p className="median-value">
            {median === null ? "—" : formatMedian(median)}
            {median !== null ? <span> pts</span> : null}
          </p>
          <p className="median-caption">{medianDescription(round, median)}</p>
        </div>
        <div className="median-stamp" aria-hidden="true">
          <Check size={25} />
        </div>
      </section>

      <section className="distribution-section" aria-labelledby="distribution-heading">
        <div className="result-section-heading">
          <div>
            <h3 id="distribution-heading">The spread</h3>
            <p>{modeDescription} {numericTotal} numeric {numericTotal === 1 ? "estimate" : "estimates"}.</p>
          </div>
          <span className="meta-pill">{round.estimates.length} cards</span>
        </div>
        {modes.length ? (
          <div
            className="leader-tally"
            aria-label={`Most-selected estimate has ${summary.highestCount} of ${summary.total} cards`}
          >
            <span className="tally-label">Most-selected card</span>
            <div className="tally-row">
              <strong>{modes.map((card) => (card === "?" ? "Unsure" : `${card} pts`)).join(" / ")}</strong>
              <span>{summary.highestCount} of {summary.total}</span>
            </div>
            <div className="segmented-tally" aria-hidden="true">
              {round.estimates.map((estimate, index) => (
                <span
                  className={modes.includes(estimate.value) ? "is-filled" : ""}
                  key={`${estimate.estimator}-${index}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        <ul className="distribution-list">
          {ESTIMATION_CARDS.filter((card) => (summary.counts.get(card) ?? 0) > 0).map((card) => {
            const count = summary.counts.get(card) ?? 0;
            const isMode = modes.includes(card);
            return (
              <li className={`distribution-row ${isMode ? "distribution-mode" : ""}`} key={card}>
                <div className="distribution-label">
                  <span>{card === "?" ? "Unsure" : `${card} ${card === "1" ? "point" : "points"}`}</span>
                  <span className="distribution-track" aria-hidden="true">
                    <span
                      className="distribution-fill"
                      style={{ width: `${percent(count, summary.highestCount)}%` }}
                    />
                  </span>
                </div>
                <strong className="distribution-count">
                  {count} of {summary.total}
                  <span>{percent(count, summary.total)}%</span>
                </strong>
              </li>
            );
          })}
        </ul>
        <p className="data-note">
          Counts and percentages show all cards. The median uses numeric cards only; it is a reference, not a substitute for discussion.
        </p>
      </section>

      <section className="attribution-section" aria-labelledby="individual-estimates-heading">
        <div className="result-section-heading">
          <div>
            <h3 id="individual-estimates-heading">Individual estimates</h3>
            <p>Shown together after the facilitator’s reveal.</p>
          </div>
        </div>
        <ul className="estimator-results">
          {round.estimates.map((estimate, index) => (
            <li key={`${estimate.estimator}-${index}`}>
              <span className="estimator-index">{String(index + 1).padStart(2, "0")}</span>
              <span>{estimate.estimator}</span>
              <strong>{estimate.value === "?" ? "Unsure" : `${estimate.value} pts`}</strong>
            </li>
          ))}
        </ul>
      </section>

      <div className="result-actions">
        <button className="button button-primary" type="button" onClick={onCopy}>
          <Clipboard aria-hidden="true" size={17} />
          Copy result
        </button>
        <button className="button button-secondary" type="button" onClick={onEstimateAgain}>
          <RotateCcw aria-hidden="true" size={17} />
          Estimate again
        </button>
      </div>
    </article>
  );
}
