import React from "react";

/** Night Swell / Morning Glass. Flips the band mapping, persists the choice. */
export function ThemeToggle({ initial = "dark" }) {
  const [theme, setTheme] = React.useState(initial);

  React.useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current) setTheme(current === "light" ? "light" : "dark");
  }, []);

  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("mb-theme", next); } catch (e) { /* private mode */ }
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={theme === "dark" ? "Switch to Morning Glass" : "Switch to Night Swell"}
      title={theme === "dark" ? "Morning Glass" : "Night Swell"}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 50,
        display: "grid",
        placeItems: "center",
        width: 44,
        height: 44,
        borderRadius: "var(--r-pill)",
        border: "1px solid var(--rule)",
        background: "var(--chip)",
        backdropFilter: "blur(12px)",
        color: "var(--berry)",
        cursor: "pointer",
        transition: "transform var(--dur-state) var(--ease)",
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        {theme === "dark" ? (
          <g>
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
              <line key={d} x1="12" y1="1.6" x2="12" y2="4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" transform={"rotate(" + d + " 12 12)"} />
            ))}
          </g>
        ) : (
          <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" fill="currentColor" />
        )}
      </svg>
    </button>
  );
}
