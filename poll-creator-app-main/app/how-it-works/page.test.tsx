import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Home from "../page";
import HowItWorksPage from "./page";

describe("HowItWorksPage", () => {
    afterEach(() => {
        cleanup();
    });

    it("explains the planning poker session in three steps", () => {
        render(<HowItWorksPage />);

        const steps = within(
            screen.getByRole("list", { name: "Planning poker steps" }),
        ).getAllByRole("listitem");

        expect(steps).toHaveLength(3);
        expect(steps[0].textContent).toContain("Set up the story");
        expect(steps[0].textContent).toContain("sample backlog");
        expect(steps[1].textContent).toContain("Pass the device");
        expect(steps[2].textContent).toContain("Reveal and discuss");
        expect(steps[2].textContent).toContain("numeric median");
    });

    it("summarizes the cards and local storage limitations", () => {
        render(<HowItWorksPage />);

        const details = screen.getByRole("region", {
            name: "Card and privacy details",
        }).textContent;

        expect(details).toContain("0, 1, 2, 3, 5, 8, 13, 20, 40, 100");
        expect(details).toContain("Unsure is excluded from the numeric median");
        expect(details).toContain("not secure secrecy");
        expect(details).toContain("do not sync");
    });

    it("links to the separate workspace from the guide and landing page", () => {
        const { unmount } = render(<HowItWorksPage />);

        expect(
            screen.getByRole("link", { name: "Go to the workspace" }).getAttribute("href"),
        ).toBe("/workspace");
        expect(
            screen.getByRole("link", { name: "My backlog" }).getAttribute("href"),
        ).toBe("/workspace");
        unmount();

        render(<Home />);

        expect(
            screen.getByRole("link", { name: "How it works" }).getAttribute("href"),
        ).toBe("/how-it-works");
        expect(screen.getByRole("link", { name: "My backlog" }).getAttribute("href"))
            .toBe("/workspace");
        expect(screen.getByRole("link", { name: "Start a round" }).getAttribute("href"))
            .toBe("/workspace");
        expect(screen.getByRole("main").querySelector("#backlog")).toBeNull();
    });
});