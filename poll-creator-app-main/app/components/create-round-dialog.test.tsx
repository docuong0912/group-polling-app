// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CreateRoundDialog } from "./create-round-dialog";

describe("CreateRoundDialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("submits a valid round and sends the normalized roster to the parent callback", () => {
    const onCreate = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CreateRoundDialog open={true} onOpenChange={onOpenChange} onCreate={onCreate} />,
    );

    fireEvent.change(screen.getByLabelText(/Backlog story/i), {
      target: { value: "As a customer, I can reset my password" },
    });
    fireEvent.change(screen.getByLabelText(/Facilitator name/i), {
      target: { value: "Morgan" },
    });
    fireEvent.change(screen.getByLabelText(/Development-team estimators/i), {
      target: { value: "Ada\nBo\nKai" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Start estimation/i }));

    expect(onCreate).toHaveBeenCalledWith({
      title: "As a customer, I can reset my password",
      description: "",
      facilitator: "Morgan",
      estimators: ["Ada", "Bo", "Kai"],
    });
  });

  it("shows validation errors for duplicate names and invalid roster sizes", () => {
    const onCreate = vi.fn();

    render(<CreateRoundDialog open={true} onOpenChange={vi.fn()} onCreate={onCreate} />);

    fireEvent.change(screen.getByLabelText(/Backlog story/i), {
      target: { value: "As a customer, I can reset my password" },
    });
    fireEvent.change(screen.getByLabelText(/Facilitator name/i), {
      target: { value: "Morgan" },
    });
    fireEvent.change(screen.getByLabelText(/Development-team estimators/i), {
      target: { value: "Ada\nAda" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Start estimation/i }));

    expect(screen.getByRole("alert").textContent).toContain(
      "Each estimator should appear once. Remove duplicate names from the roster.",
    );
    expect(onCreate).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/Development-team estimators/i), {
      target: { value: "Ada" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Start estimation/i }));
    expect(screen.getByRole("alert").textContent).toContain(
      "Add 2–15 development-team estimators, one name per line.",
    );
  });
});
