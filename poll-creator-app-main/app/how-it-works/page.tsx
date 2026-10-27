import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, CircleHelp } from "lucide-react";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Learn how to run a planning poker session with Tiebreak: prepare a story, estimate privately on one device, and reveal together.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="Tiebreak home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>tiebreak</span>
        </Link>
        <nav className="top-navigation" aria-label="Main navigation">
          <Link className="nav-pill" href="/workspace">
            My backlog
          </Link>
          <Link className="help-link" href="/how-it-works" aria-current="page">
            <CircleHelp aria-hidden="true" size={17} />
            How it works
          </Link>
        </nav>
        <Link className="topbar-cta" href="/workspace">
          <span>Open workspace</span>
          <ArrowDownRight aria-hidden="true" size={16} />
        </Link>
      </header>

      <main id="main-content" className="page-shell">
        <section className="quick-guide-intro" aria-labelledby="page-title">
          <p className="eyebrow">PLANNING POKER</p>
          <h1 id="page-title">How it works</h1>
          <p className="intro-description">
            Set up one story, pass the device around, and compare estimates
            after the team reveal.
          </p>
        </section>

        <section className="guide-section quick-guide-section" aria-labelledby="session-steps-title">
          <h2 id="session-steps-title">Three steps</h2>
          <ol className="guide-steps quick-guide-steps" aria-label="Planning poker steps">
            <li className="guide-step">
              <span className="guide-step-number" aria-hidden="true">1</span>
              <div>
                <h3>Set up the story</h3>
                <p>
                  Create a story and add 2–15 estimators, or load the sample
                  backlog to get started.
                </p>
              </div>
            </li>
            <li className="guide-step">
              <span className="guide-step-number" aria-hidden="true">2</span>
              <div>
                <h3>Pass the device</h3>
                <p>
                  Each person reads the story and confirms one estimate without
                  seeing the earlier cards.
                </p>
              </div>
            </li>
            <li className="guide-step">
              <span className="guide-step-number" aria-hidden="true">3</span>
              <div>
                <h3>Reveal and discuss</h3>
                <p>
                  When everyone has submitted, reveal all cards together. Use
                  the numeric median as a starting point for conversation.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className="quick-guide-details" aria-label="Card and privacy details">
          <p>
            <strong>Cards:</strong> 0, 1, 2, 3, 5, 8, 13, 20, 40, 100, and ?
            for Unsure. Unsure is excluded from the numeric median.
          </p>
          <p>
            <strong>Local demo:</strong> Stories and estimates stay in this
            browser and do not sync. Submitted cards are hidden in the app
            until reveal, but browser storage is not secure secrecy.
          </p>
        </section>

        <div className="guide-cta">
          <Link className="button button-primary" href="/workspace">
            Go to the workspace
            <ArrowDownRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </main>

      <footer className="site-footer">
        <Link className="footer-wordmark" href="/" aria-label="Tiebreak home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>tiebreak</span>
        </Link>
        <p>Estimate independently. Decide as a team.</p>
        <p>Local demo · Your rounds stay in this browser</p>
      </footer>
    </>
  );
}
