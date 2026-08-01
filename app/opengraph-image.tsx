import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// No gradients, no decoration beyond wordmark and type — CLAUDE.md §4.
// next/og can't read our CSS custom properties, so the locked hex values
// are repeated here directly (same constraint as the email templates).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0d3320",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#ca9035" }}>
          NORTHEAST INDIA · EXPORTING TO UK &amp; USA
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 76,
            color: "#f4f2eb",
            fontWeight: 400,
          }}
        >
          Premium origins. Global excellence.
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 30, color: "#b9c4bc" }}>
          Westora Global — 17 crops from Northeast India
        </div>
      </div>
    ),
    { ...size },
  );
}
