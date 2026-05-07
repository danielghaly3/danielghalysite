import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0E0E10",
          color: "#FFFFFF",
          padding: 72
        }}
      >
        <div style={{ width: 96, height: 4, background: "#0052CC" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: "-0.04em" }}>
            Daniel Ghaly
          </div>
          <div style={{ marginTop: 24, fontSize: 34, color: "rgba(255,255,255,0.72)" }}>
            Designer and cofounder of Graphxify.
          </div>
        </div>
      </div>
    ),
    size
  );
}
