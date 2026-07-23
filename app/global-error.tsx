"use client";

import { useEffect } from "react";

/**
 * Catches errors thrown in the root layout itself (where app/error.tsx
 * cannot help, since it renders inside the layout). Must render its own
 * <html>/<body> since the root layout may be the thing that failed.
 * Kept deliberately dependency-free (no design-system imports) so it
 * still renders if something in the component tree is broken.
 */
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
    <html lang="it">
      <body
        style={{
          display: "flex",
          minHeight: "100dvh",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "0 1.5rem",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>Qualcosa è andato storto.</h1>
        <p style={{ color: "#737373", maxWidth: "32rem" }}>
          Si è verificato un errore critico. Riprova più tardi.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.625rem 1.25rem",
            borderRadius: "0.375rem",
            background: "#0a0a0b",
            color: "#fafafa",
            border: "none",
            cursor: "pointer",
          }}
        >
          Riprova
        </button>
      </body>
    </html>
  );
}
