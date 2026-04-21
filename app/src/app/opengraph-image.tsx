import { ImageResponse } from "next/og";

export const alt = "Offery — 智慧求職平台";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background:
            "linear-gradient(135deg, #FCFBF9 0%, #F0F4F1 60%, #DCE8E1 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 30%, rgba(104,143,121,0.25), rgba(104,143,121,0) 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#688F79",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.05em",
            }}
          >
            O
          </div>
          <span
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#3A3A3A",
              letterSpacing: "-0.02em",
            }}
          >
            Offery
          </span>
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: "#3A3A3A",
            lineHeight: 1.15,
            maxWidth: 900,
            letterSpacing: "-0.02em",
          }}
        >
          找到理想工作的
          <br />
          <span style={{ color: "#688F79" }}>最短路徑</span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 30,
            color: "#6B7280",
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          AI 履歷優化、職缺追蹤、面試模擬 — 一站式求職管理
        </div>
      </div>
    ),
    { ...size },
  );
}
