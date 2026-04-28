import { isSupabaseConfigured } from "../lib/supabase/client";

const statusItems = [
  "GitHub / Vercel / Supabase connection ready",
  "Supabase environment variables are expected to be available",
  "Next.js App Router is ready for the URL Manager MVP"
];

export default function Home() {
  return (
    <main style={styles.main}>
      <section style={styles.panel}>
        <p style={styles.eyebrow}>autp</p>
        <h1 style={styles.title}>URL Manager MVP</h1>
        <p style={styles.lead}>GitHub / Vercel / Supabase connection ready</p>
        <div style={styles.statusBox}>
          <p style={styles.statusLabel}>Supabase environment</p>
          <p style={styles.statusValue}>
            {isSupabaseConfigured
              ? "Supabase environment variables are readable."
              : "Supabase environment variables are expected at runtime."}
          </p>
        </div>
        <ul style={styles.list}>
          {statusItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "48px 20px",
    background: "#f6f7f9",
    color: "#1b1f24",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
  },
  panel: {
    width: "min(100%, 720px)",
    border: "1px solid #d9dee5",
    borderRadius: "8px",
    padding: "40px",
    background: "#ffffff",
    boxShadow: "0 18px 60px rgba(15, 23, 42, 0.08)"
  },
  eyebrow: {
    margin: "0 0 12px",
    color: "#2563eb",
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: 0
  },
  title: {
    margin: 0,
    fontSize: "42px",
    lineHeight: 1.1,
    letterSpacing: 0
  },
  lead: {
    margin: "18px 0 0",
    color: "#465160",
    fontSize: "18px",
    lineHeight: 1.6
  },
  statusBox: {
    marginTop: "28px",
    padding: "18px",
    border: "1px solid #d9dee5",
    borderRadius: "8px",
    background: "#f9fafb"
  },
  statusLabel: {
    margin: 0,
    color: "#667085",
    fontSize: "14px",
    fontWeight: 700
  },
  statusValue: {
    margin: "6px 0 0",
    color: "#1b1f24",
    fontSize: "16px"
  },
  list: {
    margin: "24px 0 0",
    paddingLeft: "20px",
    color: "#344054",
    lineHeight: 1.8
  }
} satisfies Record<string, React.CSSProperties>;
