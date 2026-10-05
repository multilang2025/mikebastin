"use client";

/** Night Swell / Morning Glass. Persisted, and the band mapping flips with it. */
export default function ThemeToggle() {
  const flip = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("mb-theme", next);
    } catch {
      /* private mode, fall back to session-only */
    }
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label="Toggle theme"
      title="Toggle theme"
      /* Sits in the nav row rather than floating.
         `fixed top-5 right-5` put a 44px circle at 20px from the top of the
         viewport, against a 62px header: 2px of it hung below the header's
         bottom rule on every page, and the nav had to reserve a
         `pr-[64px]` gutter so its own contents did not slide under it.
         In the row, alignment is the flexbox's problem and cannot drift. */
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full
                 border transition-transform duration-300 hover:scale-110
                 active:scale-95"
      style={{
        borderColor: "var(--rule)",
        background: "var(--chip)",
        color: "var(--berry)",
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="4.2" fill="currentColor" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
          <line
            key={d}
            x1="12"
            y1="1.6"
            x2="12"
            y2="4.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            transform={`rotate(${d} 12 12)`}
          />
        ))}
      </svg>
    </button>
  );
}
