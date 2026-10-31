import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, CircleHelp } from "lucide-react";
import { Workspace } from "../components/workspace";

export const metadata: Metadata = {
  title: "My backlog",
  description:
    "Prepare backlog stories and estimate together with your development team in RoundTable on this device.",
  alternates: {
    canonical: "/workspace",
  },
};

export default function WorkspacePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="RoundTable home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>roundtable</span>
        </Link>
        <nav className="top-navigation" aria-label="Main navigation">
          <Link className="nav-pill is-current" href="/workspace" aria-current="page">
            My backlog
          </Link>
          <Link className="help-link" href="/how-it-works">
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
        <section className="workspace-section" aria-labelledby="workspace-title">
          <div className="workspace-section-heading">
            <div>
              <p className="eyebrow">YOUR WORKSPACE</p>
              <h1 id="workspace-title">Backlog estimation</h1>
            </div>
            <p className="workspace-guidance">A shared-device demo · no account required</p>
          </div>
          <Workspace />
        </section>
      </main>

      <footer className="site-footer">
        <Link className="footer-wordmark" href="/" aria-label="RoundTable home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>roundtable</span>
        </Link>
        <p>Estimate independently. Decide as a team.</p>
        <p>Local demo · Your rounds stay in this browser</p>
      </footer>
    </>
  );
}
