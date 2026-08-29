"use client";

export default function GlobalError({ reset }) {
  // NOT: global-error.js, root layout'un kendisinde bir hata olursa devreye girer
  // (çok nadir). Bu yüzden kendi <html>/<body> etiketlerini içermek zorundadır.
  return (
    <html lang="tr">
      <body style={{ margin: 0, backgroundColor: "#F6F4EE" }}>
        <main
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "384px",
              borderRadius: "1.75rem",
              border: "1px solid rgba(0,0,0,0.05)",
              backgroundColor: "white",
              textAlign: "center",
              overflow: "hidden",
              boxShadow: "0 20px 60px -20px rgba(184,121,74,0.35)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #1E212B, #14161C)",
                padding: "32px 24px 40px",
              }}
            >
              <p
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Beklenmeyen bir hata oluştu
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                Sayfa yüklenirken bir sorun çıktı.
              </p>
            </div>
            <div style={{ padding: "24px", backgroundColor: "#F6F4EE" }}>
              <button
                onClick={() => reset()}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "0.75rem",
                  padding: "12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#14161C",
                  background: "linear-gradient(90deg,#E8C9A0,#B8794A)",
                  cursor: "pointer",
                }}
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
