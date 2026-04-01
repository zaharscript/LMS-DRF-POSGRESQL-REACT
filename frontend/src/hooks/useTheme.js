// src/hooks/useTheme.js
// Re-export from ThemeContext to ensure a single source of truth.
// Previously this hook had its own useState + useEffect that conflicted with ThemeProvider.
export { useTheme as default } from "../context/ThemeContext";
