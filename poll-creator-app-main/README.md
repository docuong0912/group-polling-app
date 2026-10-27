# Tiebreak — planning poker

Tiebreak is adapted for backlog refinement. A PM or business owner prepares a story and facilitates; development-team members estimate independently, reveal together, and use the numeric median as a team reference.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the landing page, then choose **My backlog** or **Open workspace** to go to `/workspace`. The workspace lets you create a story or load a small sample backlog. Data is stored in this browser only.

## Product decisions

- **Pass-the-device:** no accounts, backend, remote links, or cross-device voting in this version. The facilitator prepares the story; 2–15 named development-team estimators take turns on one device.
- **Cards:** modified Fibonacci sequence `0, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?`.
- **Blind interaction:** the UI shows only submission progress until the facilitator reveals the completed round. It then shows card values and estimator attribution together.
- **Local-only privacy:** this is an interaction choice, not secure secrecy. Votes are in localStorage and can be inspected by someone with access to the device or browser profile. Do not use for sensitive estimation sessions.
- **Team reference:** automatically use the median of numeric cards. For an even number of numeric votes, average the two middle values and allow half-points. Ignore `?`; when all estimates are `?`, there is no numeric reference. The median is not a replacement for discussion.
- **Re-estimation:** create a new round from a revealed story; past estimates are retained rather than edited.
- **Suggestions and moderation:** not part of this version. The facilitator owns the story details and can clarify them before estimating starts.
- **Results visualisation:** report card counts and percentages together, show the most-selected value as a segmented per-estimator tally, scale other bars relative to the highest count, and state ties in text. A mode tie is not a median tie; the UI labels them separately.

## Technology and design

- Next.js App Router, React, and TypeScript; the public page content is server-rendered, with localStorage interactivity isolated in a Client Component.
- Tailwind CSS v4 uses the supplied Tiebreak color and shape tokens. Radix Dialog primitives and Lucide icons are custom styled to match the preview rather than the default shadcn theme.
- Gabarito/Karla use `next/font` so production pages can self-host optimized font assets.
- The page metadata, Open Graph image, `robots.txt`, and `sitemap.xml` describe the public product and workspace route. Individual local backlog rounds are not routes, shareable, server-rendered, or indexed.
- Set `NEXT_PUBLIC_SITE_URL` to the canonical deployment origin. On Vercel, `VERCEL_URL` is used as a deployment-preview fallback.

## Checks

```bash
npm test
npm run lint
npm run build
```

Manually check the keyboard-only round flow, modal focus behavior, `prefers-reduced-motion`, 320px width, and 200% zoom before shipping. The demo should not be presented as satisfying the original challenge's full-stack, shared-link, server-side vote integrity, or real-time requirements.

## Deployment

Import this app directory into Vercel, set `NEXT_PUBLIC_SITE_URL` to the production domain, then deploy. Verify the landing/workspace, generated metadata, robots and sitemap, and local round flow on the deployed build. Local rounds remain in the visitor's browser and will not transfer between devices.
