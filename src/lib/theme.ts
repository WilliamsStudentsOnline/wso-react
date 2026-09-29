export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "wso-theme";

type ViewTransitionLike = {
  finished: Promise<void>;
};

type DocumentWithViewTransition = Document & {
  startViewTransition?: (
    updateCallback: () => void | Promise<void>
  ) => ViewTransitionLike;
};

export const getSystemTheme = (): ResolvedTheme =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
  preference === "system" ? getSystemTheme() : preference;

export const readThemePreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (err) {
    void err;
  }
  return "system";
};

export const writeThemePreference = (preference: ThemePreference): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch (err) {
    void err;
  }
};

const setThemeAttributes = (resolved: ResolvedTheme): void => {
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.style.setProperty("color-scheme", resolved);
};

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const getDocumentTheme = (): ResolvedTheme | null => {
  const value = document.documentElement.getAttribute("data-theme");
  return value === "light" || value === "dark" ? value : null;
};

/** Returns a view-transition handle when one was started; otherwise null. */
export const applyResolvedTheme = (
  resolved: ResolvedTheme,
  options: { animate?: boolean } = {}
): ViewTransitionLike | null => {
  const { animate = true } = options;
  const root = document.documentElement;

  if (getDocumentTheme() === resolved) {
    return null;
  }

  const doc = document as DocumentWithViewTransition;
  const startViewTransition = doc.startViewTransition;

  if (!animate || prefersReducedMotion() || startViewTransition === undefined) {
    root.classList.add("theme-switching");
    setThemeAttributes(resolved);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-switching");
      });
    });
    return null;
  }

  root.classList.add("theme-switching");
  const transition = startViewTransition.bind(doc)(() => {
    setThemeAttributes(resolved);
  });
  transition.finished.finally(() => {
    root.classList.remove("theme-switching");
  });
  return transition;
};

export const cycleThemePreference = (
  current: ThemePreference
): ThemePreference => {
  if (current === "system") return "light";
  if (current === "light") return "dark";
  return "system";
};

export const themePreferenceLabel = (preference: ThemePreference): string => {
  if (preference === "system") return "System";
  if (preference === "light") return "Light";
  return "Dark";
};
