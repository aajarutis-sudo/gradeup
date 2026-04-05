"use client";

import { useReducer, useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getClientSnapshot(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "unknown" {
  return "unknown";
}

export default function ThemeToggle() {
  const [, forceRender] = useReducer((value) => value + 1, 0);
  const theme = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("gradeup-theme", nextTheme);
    forceRender();
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5"
      suppressHydrationWarning
    >
      {theme === "unknown" ? "Theme" : theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
