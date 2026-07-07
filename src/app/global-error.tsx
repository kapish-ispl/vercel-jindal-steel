"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * global-error.tsx — catches errors thrown inside the root layout itself.
 * This replaces the entire HTML document, so it must include <html> and <body>.
 * Styling uses inline styles since globals.scss may not be available here.
 */

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "#0f1117",
          fontFamily: "system-ui, sans-serif",
          color: "#e0e0e0",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(245, 134, 52, 0.15)",
            border: "2px solid #f58634",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f58634"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1
          style={{
            margin: "0 0 0.5rem",
            fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          Application Error
        </h1>

        <p
          style={{
            margin: "0 0 2rem",
            fontSize: "1rem",
            color: "#9ca3af",
            maxWidth: 480,
          }}
        >
          A critical error occurred and the application could not recover.
          Please refresh the page or try again.
        </p>

        {/* Show digest in development only */}
        {process.env.NODE_ENV === "development" && error?.digest && (
          <code
            style={{
              display: "block",
              marginBottom: "1.5rem",
              padding: "0.5rem 1rem",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 6,
              fontSize: "0.8rem",
              color: "#6b7280",
            }}
          >
            Digest: {error.digest}
          </code>
        )}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              padding: "12px 28px",
              borderRadius: 6,
              border: "none",
              background: "#f58634",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#df6d0b")
            }
            onMouseOut={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#f58634")
            }
          >
            Try Again
          </button>

          <Link
            href="/"
            style={{
              padding: "12px 28px",
              borderRadius: 6,
              border: "2px solid #f58634",
              background: "transparent",
              color: "#f58634",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
