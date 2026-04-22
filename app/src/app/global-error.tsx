"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh-TW">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FCFBF9",
          color: "#3A3A3A",
          fontFamily:
            "'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "28rem",
            padding: "2rem",
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            boxShadow:
              "6px 6px 16px rgba(174, 174, 192, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.7)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "var(--color-error)",
              margin: 0,
            }}
          >
            500
          </p>
          <h1
            style={{
              marginTop: "0.5rem",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#3A3A3A",
            }}
          >
            伺服器出了點狀況
          </h1>
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "#6B7280",
            }}
          >
            我們已記錄這次錯誤，請稍後再試。如果一直遇到，請聯絡我們。
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              height: "3rem",
              padding: "0 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#FFFFFF",
              backgroundColor: "#688F79",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow:
                "6px 6px 16px rgba(174, 174, 192, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.7)",
            }}
          >
            重試
          </button>
        </div>
      </body>
    </html>
  );
}
