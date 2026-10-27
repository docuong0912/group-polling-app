import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import WorkspacePage from "./page";

describe("WorkspacePage", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the backlog on its own page and marks the navigation link current", () => {
    render(<WorkspacePage />);

    expect(
      screen.getByRole("heading", { name: "Backlog estimation", level: 1 }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "My backlog" }).getAttribute("href"),
    ).toBe("/workspace");
    expect(
      screen.getByRole("link", { name: "My backlog" }).getAttribute("aria-current"),
    ).toBe("page");
  });
});
