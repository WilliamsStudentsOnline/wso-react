import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { WcfmNow } from "wso-api-client/lib/services/types";
import { getWSO } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";

const FALLBACK_STREAM = "https://wcfm-streaming.williams.edu:8443/stream";
const IDLE_POLL_SECONDS = 60;
const ERROR_POLL_SECONDS = 30;
const MAX_RETRIES = 6;
const MAX_RETRY_DELAY_MS = 15000;
const STALL_MS = 10000;

export type PlayerStatus = "idle" | "loading" | "playing" | "error";

interface WCFMContextValue {
  now: WcfmNow | null;
  status: PlayerStatus;
  play: () => void;
  stop: () => void;
  toggle: () => void;
}

const WCFMContext = createContext<WCFMContextValue | null>(null);

export const useWCFM = () => {
  const ctx = useContext(WCFMContext);
  if (!ctx) throw new Error("useWCFM must be used inside WCFMProvider");
  return ctx;
};

export const WCFMProvider = ({ children }: { children: ReactNode }) => {
  const wso = useAppSelector(getWSO);
  const [now, setNow] = useState<WcfmNow | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("idle");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamURL = now?.streamURL || FALLBACK_STREAM;
  const streamURLRef = useRef(streamURL);
  streamURLRef.current = streamURL;
  // reconnect until stopped
  const wantRef = useRef(false);
  const retriesRef = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const stallTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const connect = useCallback((audio: HTMLAudioElement) => {
    // rejoin live
    audio.src = streamURLRef.current;
    setStatus("loading");
    audio.play().catch((err: Error) => {
      // autoplay blocked
      if (err.name === "NotAllowedError") {
        wantRef.current = false;
        setStatus("idle");
      }
    });
  }, []);

  const reconnect = useCallback(
    (audio: HTMLAudioElement) => {
      clearTimeout(retryTimer.current);
      clearTimeout(stallTimer.current);
      if (!wantRef.current) return;
      if (retriesRef.current >= MAX_RETRIES) {
        wantRef.current = false;
        setStatus("error");
        return;
      }
      const delay = Math.min(
        1000 * 2 ** retriesRef.current,
        MAX_RETRY_DELAY_MS
      );
      retriesRef.current += 1;
      setStatus("loading");
      retryTimer.current = setTimeout(() => connect(audio), delay);
    },
    [connect]
  );

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "none";
      audio.addEventListener("playing", () => {
        clearTimeout(stallTimer.current);
        retriesRef.current = 0;
        setStatus("playing");
      });
      audio.addEventListener("waiting", () => {
        setStatus("loading");
        clearTimeout(stallTimer.current);
        stallTimer.current = setTimeout(() => reconnect(audio), STALL_MS);
      });
      audio.addEventListener("error", () => reconnect(audio));
      audio.addEventListener("ended", () => reconnect(audio));
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [reconnect]);

  const play = useCallback(() => {
    const audio = getAudio();
    wantRef.current = true;
    retriesRef.current = 0;
    clearTimeout(retryTimer.current);
    connect(audio);
  }, [getAudio, connect]);

  const stop = useCallback(() => {
    wantRef.current = false;
    clearTimeout(retryTimer.current);
    clearTimeout(stallTimer.current);
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setStatus("idle");
  }, []);

  const toggle = useCallback(() => {
    if (status === "playing" || status === "loading") stop();
    else play();
  }, [status, play, stop]);

  const playing = status === "playing" || status === "loading";

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const poll = async () => {
      let wait = ERROR_POLL_SECONDS;
      try {
        const resp = await wso.wcfmService.getWCFMNow();
        if (cancelled) return;
        setNow(resp.data ?? null);
        wait = resp.data?.refreshAfter ?? ERROR_POLL_SECONDS;
      } catch {
        // keep the last response
      }
      if (!playing) wait = Math.max(wait, IDLE_POLL_SECONDS);
      if (!cancelled && document.visibilityState === "visible") {
        timer = setTimeout(poll, wait * 1000);
      }
    };

    const onVisibility = () => {
      clearTimeout(timer);
      if (document.visibilityState === "visible") void poll();
    };

    void poll();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [wso, playing]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const track = now?.track;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track?.song || now?.onAir?.title || "WCFM 91.9",
      artist: track?.artist || "WCFM 91.9",
      album: now?.onAir?.title || "",
      artwork: track?.image ? [{ src: track.image, sizes: "225x225" }] : [],
    });
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", stop);
    navigator.mediaSession.setActionHandler("stop", stop);
  }, [now, play, stop]);

  const value = useMemo(
    () => ({
      now,
      status,
      play,
      stop,
      toggle,
    }),
    [now, status, play, stop, toggle]
  );

  return <WCFMContext.Provider value={value}>{children}</WCFMContext.Provider>;
};
