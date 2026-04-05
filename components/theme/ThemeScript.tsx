export default function ThemeScript() {
  const script = `
    try {
      const saved = localStorage.getItem("gradeup-theme");
      const theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.dataset.theme = theme;
    } catch (error) {
      document.documentElement.classList.remove("dark");
      document.documentElement.dataset.theme = "light";
    }
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
