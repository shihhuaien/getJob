export default function RootNotFound() {
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
              color: "#688F79",
              margin: 0,
            }}
          >
            404
          </p>
          <h1
            style={{
              marginTop: "0.5rem",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#3A3A3A",
            }}
          >
            找不到這個頁面
          </h1>
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "#6B7280",
            }}
          >
            你造訪的頁面可能已移除或網址輸入錯誤。回首頁繼續掌握求職進度吧。
          </p>
          <a
            href="/"
            style={{
              marginTop: "2rem",
              display: "inline-block",
              height: "3rem",
              lineHeight: "3rem",
              padding: "0 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#FFFFFF",
              backgroundColor: "#688F79",
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow:
                "6px 6px 16px rgba(174, 174, 192, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.7)",
            }}
          >
            返回首頁
          </a>
        </div>
      </body>
    </html>
  );
}
