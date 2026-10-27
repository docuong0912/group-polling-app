---
description: "Audit this project for security vulnerabilities and report evidence-based findings"
name: "Security Audit"
argument-hint: "Optional: focus the audit on a directory, feature, or threat area"
agent: "ask"
---

Perform a defensive security audit of this entire project. Do not modify files, implement fixes, or run exploit payloads. If the user supplied a focus area, prioritize it while still checking for critical issues elsewhere.

Inspect the application source, relevant configuration and dependency manifests, and project documentation that describes security-sensitive behavior. Exclude generated output, coverage reports, and vendored dependencies unless they directly reveal a risk in shipped code. Trace potentially vulnerable behavior to its source and consider how it is reachable; do not report speculative issues, generic best-practice advice, or findings without concrete evidence.

Look for exploitable weaknesses appropriate to this project, including (where applicable) injection and unsafe rendering, authentication and authorization gaps, insecure handling of user input or persisted data, secret exposure, unsafe redirects, cross-site request forgery, security misconfiguration, and vulnerable dependency usage. Distinguish real vulnerabilities from frontend-only limitations or intentional demo behavior.

Return only confirmed, actionable findings in a Markdown table with exactly these columns and in this order:

| ID | Security | Issue | File Path | Line number | Recommendation |
|---|---|---|---|---|---|

Start IDs at `1` and increment by one for each finding. In **Security**, give the severity (`Critical`, `High`, `Medium`, or `Low`). In **Issue**, briefly describe the vulnerability and its security impact. In **File Path**, use a working Markdown link to the repository-relative source file, with the relevant line as an optional link anchor (for example, `[poll-creator-app-main/lib/persistence.ts](poll-creator-app-main/lib/persistence.ts#L42)`). In **Line number**, give the precise one-based line number or range supporting the finding. In **Recommendation**, state a specific remediation.

Order findings by severity, highest first. Do not include a finding unless its file and line references have been verified. If the audit finds no confirmed vulnerabilities, return the table with its header and a single row stating `No confirmed vulnerabilities found` (use `—` in the other cells).
