import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  ThemePreference,
  ResolvedTheme,
  applyResolvedTheme,
  cycleThemePreference,
  readThemePreference,
  resolveTheme,
  writeThemePreference,
} from "./theme";

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  cyclePreference: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getResolvedFromMedia = (media: MediaQueryList): ResolvedTheme =>
  media.matches ? "dark" : "light";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readThemePreference()
  );
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveTheme(readThemePreference())
  );
  const preferenceRef = useRef(preference);
  preferenceRef.current = preference;

  const setPreference = useCallback((next: ThemePreference) => {
    if (next === preferenceRef.current) return;

    preferenceRef.current = next;
    writeThemePreference(next);
    const nextResolved = resolveTheme(next);
    const transition = applyResolvedTheme(nextResolved, { animate: true });

    const commitReactState = () => {
      setPreferenceState(next);
      setResolved(nextResolved);
    };

    if (transition && transition.finished) {
      transition.finished.then(commitReactState, commitReactState);
    } else {
      commitReactState();
    }
  }, []);

  const cyclePreference = useCallback(() => {
    setPreference(cycleThemePreference(preferenceRef.current));
  }, [setPreference]);

  useEffect(() => {
    if (preference !== "system") return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const nextResolved = getResolvedFromMedia(media);
      const transition = applyResolvedTheme(nextResolved, { animate: true });
      const commit = () => setResolved(nextResolved);
      if (transition && transition.finished) {
        transition.finished.then(commit, commit);
      } else {
        commit();
      }
    };

    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, [preference]);

  const value = useMemo(
    () => ({ preference, resolved, setPreference, cyclePreference }),
    [preference, resolved, setPreference, cyclePreference]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
