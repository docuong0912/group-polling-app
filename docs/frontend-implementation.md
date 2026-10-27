# Frontend Implementation Guide

Use this guide when designing or implementing Tiebreak's frontend. The product is a group poll shared in a chat: creators organize the poll, while voters arrive by link, vote without an account, and return for the reveal.

## Before implementation

1. Read the [unit testing instructions](./unit-testing.md), [core requirements](../spec/core-requirements.md), [design challenges](../spec/design-challenges.md), [technical requirements](../spec/technical-requirements.md), [brand kit](../guidance/brand-kit.md), [patterns](../guidance/patterns.md), and [accessibility checklist](../guidance/accessibility.md).
2. Confirm the product path: **full-stack** (creator auth, shared links, and persistent multi-device data) or **frontend-only** (pass-the-phone mode, with local data and no remote voting).
3. Agree on the open design decisions before building their screens. Record the choices and rationale in the project README:
   - What a voter sees after voting, on a return visit, and after the poll closes.
   - How a settled win or tie is revealed, and the exact **Copy result** text.
   - What the empty dashboard and post-creation share step look like.
   - Whether reopening keeps the old deadline, sets a new one, or removes it.
   - How per-voter results change beyond roughly 20 voters.
4. For this Next.js project, consult the installed version's relevant guides under `node_modules/next/dist/docs/` before using framework APIs.

## Implementation sequence

### 1. Establish the app shell and visual system

- Build the usable product experience as the initial screen; do not add a marketing landing page unless it is explicitly required.
- Use the brand kit's color roles, typography, and checked contrast pairs. If deviating, use a coherent system rather than a one-hue palette.
- Create responsive navigation and page structure with semantic landmarks, a skip link, and a clear heading hierarchy.
- Prefer unframed page sections and simple layouts. Use cards only for individual repeated items, modals, or genuinely framed tools; do not nest cards.
- Use relevant visual assets such as voter avatars. Use the existing icon library if one is installed; otherwise use familiar text labels rather than hand-drawn icons.
- Respect reduced motion and use stable dimensions for controls and repeated UI.

### 2. Build creator workflows

- Make the dashboard answer what needs attention first: feature the nearest closing open poll and surface pending suggestion counts. Distinguish open and settled polls in both words and visuals.
- Design the first-run dashboard and the zero-vote state; neither should look like a broken or empty list.
- Keep poll creation quick: title, 2–10 options, closing time, single or pick-up-to-N voting, and suggestions on or off.
- After creation, provide a dedicated share step with a copyable, truncated link and an announced “Link copied” status.
- Give creators a live-results view, suggestion moderation, early close, settled reveal, and confirmed reopen flow.

### 3. Build the voter journey mobile-first

- Treat the public vote page as the most important entry point. It must be self-contained, understandable on first visit, and usable from 320px wide without horizontal scrolling.
- Collect a visible name and avatar/tint before voting. Keep the ballot unselected initially and use native radio or checkbox controls inside a fieldset.
- Disable casting until the form is valid. The action label should restate the selected choice; validate inline, associate errors with their fields, and focus the first invalid field.
- Confirm before final casting. Preserve the entered values if casting fails.
- Design distinct post-vote, already-voted, and closed-poll states on the same public route. Keep the voter's choice visible where applicable.
- If suggestions are enabled, make “Suggest something else” a real accessible modal. Attribute suggestions as “Suggested by [name]”; pending suggestions stay off the public ballot.

### 4. Present results honestly

- Derive counts from votes; do not maintain separate vote-count data that can drift.
- For the leader, show a segmented per-voter tally. For other options, scale bars relative to the leader. Show counts beside every percentage, and state ties in text.
- Show counts only while voting is open; reveal voter attribution only after settlement.
- Keep live updates from moving focus or shifting layout. Use one throttled polite live region for meaningful summaries.
- Make the settled view legible as a standalone screenshot. Provide separate **Copy link** and **Copy result** actions with distinct payloads and status announcements.
- Treat a tie as a designed result, not an error. Reduced-motion users must receive the same result and sense of occasion.

### 5. Complete responsive and accessible behavior

- Use semantic HTML, visible form labels, keyboard-operable controls, and a visible focus indicator.
- Pair color with text; meet WCAG 2.2 AA contrast for text and non-text controls. Do not put small text on plain tangerine.
- Give dialogs correct labeling, focus trapping, Escape handling, and predictable focus return. After moderation, move focus deliberately.
- Mark adjacent decorative avatars as hidden from assistive technology; provide a graceful fallback if an avatar fails.
- Announce copy confirmations, moderation outcomes, and meaningful live-result changes without flooding screen readers.
- Test narrow screens, 200% zoom, keyboard-only flows, a screen reader, and `prefers-reduced-motion`.

## Core feature coverage

| Core feature | Frontend surface and completion check |
| --- | --- |
| Landing and guest mode | Clear entry into the product; guest experience includes the supplied sample polls. Keep sign-up and login paths only for the full-stack path. |
| Creator accounts | Protected creator views and persistent sessions for full-stack; no account wall on public poll links. Not applicable to pass-the-phone mode. |
| Dashboard | Open and settled polls, closing-soon priority, pending counts, and a designed first-run state. |
| Poll creation | All specified fields and validation; successful creation leads to the share step. |
| Vote page | Name, avatar/tint, empty initial ballot, validation, irreversible-vote confirmation, and already-voted state. |
| Voter suggestions | Accessible modal; author identity is retained; pending options are not ballot choices. |
| Suggestion moderation | Add or decline, explicit zero-vote approval, undo for declines, announced outcomes, and deliberate focus management. |
| Live results | Honest small-group visualization, text counts and percentages, tie wording, throttled updates, and no voter attribution before close. |
| Close and reveal | Automatic deadline state, early close, attribution at settlement, distinct result-copy payload, and confirmed reopen. |
| Responsive design | No horizontal overflow from 320px up; usable touch targets, keyboard access, and reduced-motion support. |

## Stretch scope

Treat these as optional additions after the core poll lifecycle works: saved voter identity, poll retention and deletion, resilience edge states, and dark mode. Select and document any differentiators separately; one complete differentiator is better than several shallow additions.

## Verification before delivery

- Walk through poll creation, sharing, voting, suggestion moderation, closing, result sharing, and reopening on the selected product path.
- Verify the public link works without creator authentication and that closed polls cannot be voted on.
- Check the supplied sample data, zero-vote polls, long option labels, multi-choice ballots, pending suggestions, and tie outcomes.
- Run the project's lint and build commands. Test the vote and results views at mobile width and with keyboard and assistive technology.
- Add and run unit tests for every new unit and every changed behavior, as required by the [unit testing instructions](./unit-testing.md).
- For a deployed product, test a real shared link from a phone and run Lighthouse on the vote page as well as the entry/dashboard view.
