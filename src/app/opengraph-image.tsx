import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Big Vision Gym";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Red accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #ef4444, #f97316, #ef4444)",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(239, 68, 68, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            🏋️
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#f5f5f5",
            letterSpacing: "-2px",
            textTransform: "uppercase",
            display: "flex",
            gap: "16px",
          }}
        >
          <span>Big</span>
          <span style={{ color: "#ef4444" }}>Vision</span>
          <span>Gym</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#a3a3a3",
            marginTop: "16px",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Stronger Every Day
        </div>

        {/* Bottom info bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "40px",
            color: "#737373",
            fontSize: "18px",
          }}
        >
          <span>Personal Training</span>
          <span style={{ color: "#ef4444" }}>•</span>
          <span>Group Classes</span>
          <span style={{ color: "#ef4444" }}>•</span>
          <span>Premium Facilities</span>
          <span style={{ color: "#ef4444" }}>•</span>
          <span>Expert Trainers</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
