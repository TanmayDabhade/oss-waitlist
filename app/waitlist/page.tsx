"use client";
import React from "react";

// A dedicated Waitlist page that matches the light theme used across the site
// • No direct `process.env` access on the client
// • Supports demo vs. live modes:
//    - default: demo (simulated submit)
//    - force live: set <html data-openboard-mode="live"> OR add ?mode=live to the URL
// • Honeypot + submit-time threshold for basic spam protection
// • Character counter, client-side validation, and clear success/failure states

// --- Types ---
type Mode = "demo" | "live";

type WaitlistBody = {
  email: string;
  name?: string;
  role: "maintainer" | "contributor";
  interests: string[];
  notes?: string; // up to 280 chars
};

// --- Utilities ---
function getInitialMode(): Mode {
  // 1) URL param
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const m = url.searchParams.get("mode");
    if (m === "live") return "live";
    if (m === "demo") return "demo";
  }
  // 2) HTML attribute
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-openboard-mode");
    if (attr === "live") return "live";
  }
  return "demo";
}

function validateEmail(v: string) {
  // simple RFC 5322-ish check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// --- Page ---
export default function WaitlistPage() {
  const [mode, setMode] = React.useState<Mode>(getInitialMode());
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState<"maintainer" | "contributor">("contributor");
  const [interests, setInterests] = React.useState<string[]>([]);
  const [notes, setNotes] = React.useState("");
  const [agree, setAgree] = React.useState(false);

  // spam prevention
  const [hp, setHp] = React.useState(""); // honeypot hidden field
  const mountTimeRef = React.useRef<number>(Date.now());

  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState<"idle" | "ok" | "fail">("idle");
  const [error, setError] = React.useState<string | null>(null);

  const allInterests = React.useMemo(
    () => [
      "TypeScript",
      "Python",
      "Rust",
      "React Native",
      "Next.js",
      "AI/ML",
      "DevOps",
      "Design/Docs",
    ],
    []
  );

  function toggleInterest(tag: string) {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  const notesLeft = 280 - notes.length;
  const isValid =
    validateEmail(email) && agree && !submitting && notesLeft >= 0 && (hp || "").length === 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // basic checks
    if (!validateEmail(email)) return setError("Please enter a valid email.");
    if (!agree) return setError("Please accept the terms to continue.");
    if (hp) return setError("Spam detected.");
    const elapsed = Date.now() - mountTimeRef.current;
    if (elapsed < 1200) return setError("Hold on a sec and try again."); // bot-ish

    const payload: WaitlistBody = {
      email,
      name: name.trim() || undefined,
      role,
      interests,
      notes: notes.trim() || undefined,
    };

    try {
      setSubmitting(true);
      if (mode === "live") {
        const r = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error(`API ${r.status}`);
        setDone("ok");
      } else {
        // demo mode — simulate request
        await new Promise((res) => setTimeout(res, 700));
        setDone("ok");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong.");
      setDone("fail");
    } finally {
      setSubmitting(false);
    }
  }

  // Self-tests: run once, log only
  React.useEffect(() => {
    try {
      console.assert(validateEmail("a@b.com"), "email valid");
      console.assert(!validateEmail("not-an-email"), "email invalid");
      console.assert(280 - "abc".length === 277, "notes counter");
    } catch (e) {
      console.warn("Waitlist self-tests failed", e);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Top border accent */}
      <div className="h-1 w-full bg-black" />

      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold tracking-tight">OpenBoard</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ModePill mode={mode} onToggle={() => setMode((m) => (m === "demo" ? "live" : "demo"))} />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-10">
        <div className="absolute inset-x-4 -z-10 top-6 rounded-3xl border border-black/10" />
        <div className="grid place-items-center gap-3 text-center">
          <p className="mx-auto w-fit rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-widest">Early access</p>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">Join the OpenBoard waitlist</h1>
          <p className="max-w-2xl text-sm text-black/70">
            Be first to try the project-matching hub for maintainers and contributors. We’ll invite batches as we ship milestones.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-black/15 p-6 sm:p-8">
          {done === "ok" ? (
            <div className="grid gap-3 text-center">
              <h2 className="text-xl font-semibold sm:text-2xl">You’re on the list! 🎉</h2>
              <p className="text-sm text-black/70">We’ll email you when your invite is ready. Meanwhile, say hi on the repo and star updates.</p>
              <div className="mt-2 flex items-center justify-center gap-3">
                <a href="https://github.com/openboard" className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white">GitHub</a>
                <a href="/projects" className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white">Explore projects</a>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              {/* Honeypot (hidden) */}
              <input
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                placeholder="Leave this field empty"
              />

              <div className="grid gap-1">
                <label className="text-xs font-medium" htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                  className={clsx(
                    "h-11 rounded-xl border px-3 outline-none",
                    validateEmail(email) || email.length === 0
                      ? "border-black/25 focus:border-black"
                      : "border-red-600"
                  )}
                />
              </div>

              <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-1">
                  <label className="text-xs font-medium" htmlFor="name">Name</label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Optional"
                    className="h-11 rounded-xl border border-black/25 px-3 outline-none focus:border-black"
                  />
                </div>
                <div className="grid gap-1">
                  <span className="text-xs font-medium">Role</span>
                  <div className="flex h-11 items-center gap-3 rounded-xl border border-black/25 px-3">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="role"
                        value="contributor"
                        checked={role === "contributor"}
                        onChange={() => setRole("contributor")}
                      />
                      Contributor
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="role"
                        value="maintainer"
                        checked={role === "maintainer"}
                        onChange={() => setRole("maintainer")}
                      />
                      Maintainer
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid gap-1">
                <span className="text-xs font-medium">Interests</span>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleInterest(t)}
                      className={clsx(
                        "rounded-full border px-3 py-1 text-xs font-medium",
                        interests.includes(t)
                          ? "border-black bg-black text-white"
                          : "border-black/25 hover:border-black"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium" htmlFor="notes">What would you like to build?</label>
                  <span className={clsx("text-[11px]", notesLeft < 0 && "text-red-600")}>{notesLeft}</span>
                </div>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 320))}
                  placeholder="Optional • 280 characters max"
                  rows={4}
                  className={clsx(
                    "rounded-xl border px-3 py-2 outline-none",
                    notesLeft >= 0 ? "border-black/25 focus:border-black" : "border-red-600"
                  )}
                />
              </div>

              <label className="mt-1 inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={agree} onChange={() => setAgree((v) => !v)} />
                I agree to receive OpenBoard emails and accept the terms.
              </label>

              {error && (
                <div className="rounded-xl border border-red-600 bg-red-50 p-3 text-sm text-red-800">{error}</div>
              )}

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!isValid}
                  className={clsx(
                    "h-11 rounded-xl px-5 text-sm font-semibold",
                    isValid
                      ? "bg-black text-white hover:translate-y-0.5 active:translate-y-1"
                      : "bg-black/10 text-black/40"
                  )}
                >
                  {submitting ? "Submitting…" : mode === "live" ? "Join waitlist" : "Join waitlist (demo)"}
                </button>
                <a
                  href="/"
                  className="h-11 rounded-xl border border-black px-5 text-sm font-semibold hover:bg-black hover:text-white"
                >
                  Back home
                </a>
              </div>

              <p className="text-xs text-black/60">No spam. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="text-sm">© {new Date().getFullYear()} OpenBoard</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a className="hover:opacity-70" href="#">Privacy</a>
            <a className="hover:opacity-70" href="#">Terms</a>
            <a className="hover:opacity-70" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

// --- Small UI ---
function ModePill({ mode, onToggle }: { mode: Mode; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-black px-3 py-1.5 font-semibold"
    >
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: mode === "demo" ? "#bbb" : "#000" }} />
      <span className="text-xs">{mode === "demo" ? "Demo" : "Live"}</span>
    </button>
  );
}

function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="4" className="fill-black" />
      <path d="M8 8h8v2H8zM8 12h8v2H8zM8 16h5v2H8z" className="fill-white" />
    </svg>
  );
}
