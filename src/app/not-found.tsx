import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#12181b",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p>This page doesn&apos;t exist. Let&apos;s get you back on track.</p>
          <Link href="/en" style={{ color: "#3282b8" }}>
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
