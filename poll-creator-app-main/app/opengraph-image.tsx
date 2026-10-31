import { ImageResponse } from "next/og";

export const alt =
  "RoundTable planning poker: estimate backlog stories independently, then reveal together.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "62px 72px",
          background: "#FAF2E3",
          color: "#38261A",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 700 }}>
          <div
            style={{
              display: "flex",
              width: 42,
              height: 42,
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid #38261A",
              borderRadius: 15,
              background: "#E2542C",
              color: "#FFF7EA",
              fontSize: 25,
              fontWeight: 900,
            }}
          >
            R
          </div>
          roundtable
          <span style={{ marginLeft: 4, color: "#77614C", fontSize: 19, fontWeight: 500 }}>
            · PLANNING POKER
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: "#14544B", fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>
            BACKLOG REFINEMENT
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 880,
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            Better estimates.
            <br />
            One story at a time.
          </div>
          <div style={{ fontSize: 25, color: "#77614C" }}>
            Estimate independently. Reveal the cards together.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 18 }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: "#1F7367" }} />
          A focused workspace for product and engineering teams
        </div>
      </div>
    ),
    size,
  );
}
