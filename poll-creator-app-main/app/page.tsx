import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, CircleHelp } from "lucide-react";

export const metadata: Metadata = {
  title: "Tiebreak | Planning poker for product teams",
  description:
    "Estimate backlog stories independently, reveal together, and use the team median as a starting point for discussion.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
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
          <Link className="help-link" href="/how-it-works">
            <CircleHelp aria-hidden="true" size={17} />
            How it works
          </Link>
        </nav>
        <Link aria-label="Open workspace" className="topbar-cta" href="/workspace">
          <span>Open workspace</span>
          <ArrowDownRight aria-hidden="true" size={16} />
        </Link>
      </header>

      <main id="main-content" className="page-shell">
        <section className="page-intro home-intro" aria-labelledby="page-title">
          <div className="page-intro-copy">
            <p className="eyebrow">BACKLOG REFINEMENT · ONE DEVICE</p>
            <h1 id="page-title">
              Think it through.
              <br />
              <span>Then reveal together.</span>
            </h1>
            <p className="intro-description">
              Give everyone space to estimate the same story independently,
              then compare cards and talk through the differences as a team.
            </p>
            <Link className="button button-primary home-intro-cta" href="/workspace">
              Start a round
              <ArrowDownRight aria-hidden="true" size={17} />
            </Link>
          </div>
          <div className="intro-aside">
            <span className="intro-aside-number" aria-hidden="true">
              2–15
            </span>
            <p>
              <strong>One facilitator.</strong> Prepare the story and estimator
              roster, then hand the device around.
            </p>
            <span className="aside-rule" />
            <p>
              <strong>Blind until reveal.</strong> Submitted values stay hidden
              in the app until everyone has estimated.
            </p>
          </div>
        </section>

        <section className="guide-section home-guide" aria-labelledby="session-steps-title">
          <div className="guide-section-heading">
            <div>
              <p className="eyebrow">THE SESSION</p>
              <h2 id="session-steps-title">From story to shared estimate</h2>
            </div>
            <p>Four steps, with every card face down until the reveal.</p>
          </div>

          <ol className="guide-steps" aria-label="Planning poker session steps">
            <li className="guide-step">
              <span className="guide-step-number" aria-hidden="true">1</span>
              <div>
                <h3>Prepare a clear story</h3>
                <p>
                  Create a story with a title and acceptance criteria, add the
                  facilitator and 2–15 estimators, or load the sample backlog
                  to try a session.
                </p>
              </div>
            </li>
            <li className="guide-step">
              <span className="guide-step-number" aria-hidden="true">2</span>
              <div>
                <h3>Estimate independently</h3>
                <p>
                  Read the story, then pass the device to the named estimator.
                  Each person chooses and confirms one card without seeing
                  earlier estimates.
                </p>
              </div>
            </li>
            <li className="guide-step">
              <span className="guide-step-number" aria-hidden="true">3</span>
              <div>
                <h3>Reveal when everyone is ready</h3>
                <p>
                  Once all estimators have submitted, the facilitator reveals
                  every card and its estimator together.
                </p>
              </div>
            </li>
            <li className="guide-step">
              <span className="guide-step-number" aria-hidden="true">4</span>
              <div>
                <h3>Talk through the spread</h3>
                <p>
                  Compare assumptions. The numeric median is a reference point,
                  not a decision made for the team. Estimate again to start a
                  fresh round; the revealed one stays in your backlog.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className="guide-details home-guide-details" aria-label="Estimation details">
          <div className="guide-detail-block">
            <p className="eyebrow">THE CARDS</p>
            <h2>Choose a size, not a promise</h2>
            <p>
              The modified Fibonacci deck makes bigger estimates farther apart.
              Choose “Unsure” when the story needs more conversation.
            </p>
            <ul className="guide-card-list" aria-label="Available estimate cards">
              {["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?"].map((card) => (
                <li className="guide-card-value" key={card}>
                  {card === "?" ? "Unsure" : card}
                </li>
              ))}
            </ul>
          </div>
          <div className="guide-detail-block guide-median">
            <p className="eyebrow">THE TEAM REFERENCE</p>
            <h2>How the median works</h2>
            <p>
              The median is the middle numeric estimate after sorting the
              cards. With an even number of numeric estimates, it averages the
              two middle values. “Unsure” cards are excluded; if every card is
              unsure, there is no numeric reference.
            </p>
          </div>
        </section>

        <aside className="guide-privacy" aria-labelledby="privacy-title">
          <CircleHelp aria-hidden="true" size={20} />
          <div>
            <h2 id="privacy-title">A note about privacy</h2>
            <p>
              The app keeps submitted cards off the screen until reveal, but
              this shared-device demo is not secure secrecy: estimates are
              stored in this browser and could be inspected there. Nothing
              syncs to another device.
            </p>
          </div>
        </aside>

        <div className="guide-cta home-guide-cta">
          <p>Ready to estimate a story together?</p>
          <Link className="button button-primary" href="/workspace">
            Open the workspace
            <ArrowDownRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </main>

      <footer className="site-footer">
        <Link className="footer-wordmark" href="/" aria-label="Tiebreak home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>tiebreak</span>
        </Link>
        <p>Estimate independently. Decide as a team.</p>
        <p>Local demo · Your rounds stay in this browser</p>
      </footer>
    </>
  );
}
