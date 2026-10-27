"use client";

import { useRef, useState, type FormEvent } from "react";
import { MAX_ESTIMATORS, MIN_ESTIMATORS } from "@/lib/estimation";
import { AppDialog } from "./dialogs";

export interface NewRoundDetails {
  title: string;
  description: string;
  facilitator: string;
  estimators: string[];
}

export interface RoundPrefill {
  title: string;
  description: string;
  facilitator: string;
  estimators: string[];
}

interface CreateRoundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (details: NewRoundDetails) => void;
  prefill?: RoundPrefill | null;
}

export function CreateRoundDialog({
  open,
  onOpenChange,
  onCreate,
  prefill,
}: CreateRoundDialogProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const teamRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const facilitator = String(formData.get("facilitator") ?? "").trim();
    const namesText = String(formData.get("estimators") ?? "");
    const names = namesText
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean);
    const uniqueNames = [...new Set(names.map((name) => name.toLocaleLowerCase()))];

    if (!title) {
      setError("Add a story title so the team knows what they are estimating.");
      titleRef.current?.focus();
      return;
    }
    if (!facilitator) {
      setError("Add the PM or business owner facilitating this round.");
      document.getElementById("facilitator-name")?.focus();
      return;
    }
    if (uniqueNames.length !== names.length) {
      setError("Each estimator should appear once. Remove duplicate names from the roster.");
      teamRef.current?.focus();
      return;
    }
    if (names.length < MIN_ESTIMATORS || names.length > MAX_ESTIMATORS) {
      setError(
        `Add ${MIN_ESTIMATORS}–${MAX_ESTIMATORS} development-team estimators, one name per line.`,
      );
      teamRef.current?.focus();
      return;
    }

    onCreate({ title, description, facilitator, estimators: names });
    setError("");
    event.currentTarget.reset();
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setError("");
        onOpenChange(isOpen);
      }}
      title="Prepare a story"
      description="Add the backlog context and the team roster. The facilitator does not estimate."
    >
      <form className="dialog-form" onSubmit={handleSubmit} noValidate>
        <label className="field-label" htmlFor="story-title">
          Backlog story <span aria-hidden="true">*</span>
        </label>
        <input
          ref={titleRef}
          className="text-field"
          id="story-title"
          name="title"
          maxLength={160}
          required
          aria-describedby={error ? "create-error" : "story-title-help"}
          placeholder="As a customer, I can…"
          defaultValue={prefill?.title ?? ""}
        />
        <p className="field-help" id="story-title-help">
          Write the story the team will estimate.
        </p>

        <label className="field-label" htmlFor="story-description">
          Context and acceptance criteria
        </label>
        <textarea
          className="text-field text-area"
          id="story-description"
          name="description"
          maxLength={1800}
          rows={4}
          placeholder="What should the team know before estimating?"
          defaultValue={prefill?.description ?? ""}
        />

        <label className="field-label" htmlFor="facilitator-name">
          Facilitator name <span aria-hidden="true">*</span>
        </label>
        <input
          className="text-field"
          id="facilitator-name"
          name="facilitator"
          maxLength={48}
          required
          placeholder="PM or business owner"
          defaultValue={prefill?.facilitator ?? ""}
        />

        <label className="field-label" htmlFor="estimator-roster">
          Development-team estimators <span aria-hidden="true">*</span>
        </label>
        <textarea
          ref={teamRef}
          className="text-field text-area"
          id="estimator-roster"
          name="estimators"
          rows={5}
          required
          aria-describedby={error ? "create-error" : "team-help"}
          placeholder={"One name per line\nAda\nBo\nKai"}
          defaultValue={prefill?.estimators.join("\n") ?? ""}
        />
        <p className="field-help" id="team-help">
          Enter {MIN_ESTIMATORS}–{MAX_ESTIMATORS} names. Duplicate names are not allowed.
        </p>

        {error ? (
          <p className="form-error" id="create-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="dialog-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button className="button button-primary" type="submit">
            Start estimation
          </button>
        </div>
      </form>
    </AppDialog>
  );
}
