import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./stylesheets/Dining.css";
import { formatCompactHours } from "../lib/timeFormat";
import {
  DINING_MEAL_SLOTS,
  DiningMealSlot,
  Meal,
  Vendor,
  capitalizeMeal,
  getDiningStatusPill,
  mealHasMenu,
  mealMenuId,
  mealSlotForName,
  mealSlotLabel,
  parseAndAdjustTime,
  useDiningData,
  useDiningMenus,
  useVendorStatus,
  MealMenuButton,
} from "./views/Dining/diningShared";

const WHITMANS_VENDOR_ID = "whitmans";
const SNAR_DISPLAY = "SNAR!!";
const SNAR_REPEAT_COUNT = 12;
const SNAR_BURGER_HOLD_MS = 1000;
const SNAR_BURGER_SPAWN_MS = 110;
const SNAR_BURGER_MAX = 96;
const SNAR_PLAIN_STORAGE_KEY = "wso-homepage-snar-plain";

const readSnarPlainPreference = (): boolean => {
  try {
    return localStorage.getItem(SNAR_PLAIN_STORAGE_KEY) === "1";
  } catch (err) {
    void err;
    return false;
  }
};

const writeSnarPlainPreference = (plain: boolean): void => {
  try {
    localStorage.setItem(SNAR_PLAIN_STORAGE_KEY, plain ? "1" : "0");
  } catch (err) {
    void err;
  }
};

const SnarBurgerRain = ({
  raining,
  emoji,
}: {
  raining: boolean;
  emoji: string;
}) => {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const emojiRef = useRef(emoji);
  emojiRef.current = emoji;

  useEffect(() => {
    if (!raining) return undefined;
    const layer = layerRef.current;
    if (!layer) return undefined;

    const spawn = () => {
      while (layer.childElementCount >= SNAR_BURGER_MAX) {
        layer.firstElementChild?.remove();
      }

      const duration = 2.4 + Math.random() * 2.2;
      const spinDuration = 0.7 + Math.random() * 1.2;
      const spinDirection = Math.random() < 0.5 ? 1 : -1;
      const sway = (Math.random() * 2 - 1) * 80;

      const burger = document.createElement("span");
      burger.className = "homepage-snar-burger";
      burger.style.left = `${Math.random() * 100}%`;
      burger.style.fontSize = `${1.35 + Math.random() * 1.4}rem`;
      burger.style.animationDuration = `${duration}s`;
      burger.style.setProperty("--sway", `${sway}px`);

      const inner = document.createElement("span");
      inner.className = "homepage-snar-burger-inner";
      inner.style.animationDuration = `${spinDuration}s`;
      inner.style.setProperty("--spin-dir", String(spinDirection));
      inner.textContent = emojiRef.current;

      burger.appendChild(inner);
      burger.addEventListener("animationend", () => burger.remove(), {
        once: true,
      });
      layer.appendChild(burger);
    };

    spawn();
    const timer = window.setInterval(spawn, SNAR_BURGER_SPAWN_MS);
    return () => window.clearInterval(timer);
  }, [raining]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div ref={layerRef} className="homepage-snar-burger-rain" aria-hidden />,
    document.body
  );
};

const findWhitmansLateNight = (
  vendors: Vendor[]
): { vendor: Vendor; key: string; meal: Meal } | null => {
  const whitmans = vendors.find(
    (vendor) => vendor.id.toLowerCase() === WHITMANS_VENDOR_ID
  );
  if (!whitmans) return null;
  const entry = Object.entries(whitmans.meals).find(
    ([, meal]) => mealSlotForName(meal.name) === "late night"
  );
  if (!entry) return null;
  return { vendor: whitmans, key: entry[0], meal: entry[1] };
};

const isLateNightOpen = (now: Date, lateNight: Meal): boolean => {
  if (!lateNight.hours) return false;
  const open = parseAndAdjustTime(lateNight.hours.open, now, false);
  const close = parseAndAdjustTime(
    lateNight.hours.close,
    now,
    true,
    lateNight.hours.open
  );
  return now >= open && now < close;
};

const MOBILE_MAX = "(max-width: 48.125em)";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_MAX).matches
      : false
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MAX);
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};

const useNowMinute = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
};

const findMealForSlot = (
  vendor: Vendor,
  slot: DiningMealSlot
): { key: string; meal: Meal } | null => {
  const entry = Object.entries(vendor.meals).find(
    ([, meal]) => mealSlotForName(meal.name) === slot
  );
  if (!entry) return null;
  return { key: entry[0], meal: entry[1] };
};

const activeSlotsForVendors = (vendors: Vendor[]): DiningMealSlot[] => {
  const present = new Set<DiningMealSlot>();
  vendors.forEach((vendor) => {
    Object.values(vendor.meals).forEach((meal) => {
      const slot = mealSlotForName(meal.name);
      if (slot) present.add(slot);
    });
  });
  return DINING_MEAL_SLOTS.filter(
    (slot) => slot !== "late night" && present.has(slot)
  );
};

/* Prefer currently-open meal period; else the next one to open */
const featuredSlotsForVendors = (
  vendors: Vendor[],
  now: Date
): DiningMealSlot[] => {
  const present = activeSlotsForVendors(vendors);
  if (present.length <= 1) return present;

  let openSlot: DiningMealSlot | null = null;
  let nextSlot: DiningMealSlot | null = null;
  let nextOpenTime: Date | null = null;

  vendors.forEach((vendor) => {
    Object.values(vendor.meals).forEach((meal) => {
      if (!meal.hours) return;
      const slot = mealSlotForName(meal.name);
      if (!slot || slot === "late night" || !present.includes(slot)) return;

      const openDateTime = parseAndAdjustTime(meal.hours.open, now, false);
      const closeDateTime = parseAndAdjustTime(
        meal.hours.close,
        now,
        true,
        meal.hours.open
      );

      if (now >= openDateTime && now < closeDateTime) {
        if (
          !openSlot ||
          DINING_MEAL_SLOTS.indexOf(slot) < DINING_MEAL_SLOTS.indexOf(openSlot)
        ) {
          openSlot = slot;
        }
        return;
      }

      if (now < openDateTime) {
        if (!nextOpenTime || openDateTime < nextOpenTime) {
          nextOpenTime = openDateTime;
          nextSlot = slot;
        }
      }
    });
  });

  if (openSlot) return [openSlot];
  if (nextSlot) return [nextSlot];
  return [present[0]];
};

const HomepageSnarRow = ({
  vendor,
  mealKey,
  meal,
  mealColSpan,
  openMenuIds,
  onToggleMenu,
}: {
  vendor: Vendor;
  mealKey: string;
  meal: Meal;
  mealColSpan: number;
  openMenuIds: Set<string>;
  onToggleMenu: (
    id: string,
    vendorName: string,
    meal: Meal,
    clientX: number
  ) => void;
}) => {
  const [burgerRaining, setBurgerRaining] = useState(false);
  const [plainFormat, setPlainFormat] = useState(readSnarPlainPreference);
  const holdTimerRef = useRef<number | null>(null);
  const holdActivatedRef = useRef(false);
  const holdDoneListenerRef = useRef<(() => void) | null>(null);
  const lateNightMeals = useMemo(() => ({ [mealKey]: meal }), [mealKey, meal]);
  const { style, message } = useVendorStatus(lateNightMeals);
  const pill = getDiningStatusPill(style);
  const hoursLabel = meal.hours
    ? formatCompactHours(meal.hours.open, meal.hours.close)
    : "";
  const id = mealMenuId(vendor.id, mealKey);
  const showMenu = mealHasMenu(meal);
  const plainHoursText = hoursLabel ? `Snar open ${hoursLabel}` : "Snar open";
  const snarItems = (keyPrefix: string) =>
    Array.from({ length: SNAR_REPEAT_COUNT }, (_, index) => (
      <span key={`${keyPrefix}-${index}`} className="homepage-dining-snar-item">
        {SNAR_DISPLAY}
      </span>
    ));

  useEffect(() => {
    const onHoldDone = () => {
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      setBurgerRaining(false);
      window.removeEventListener("pointerup", onHoldDone);
      window.removeEventListener("pointercancel", onHoldDone);
    };
    holdDoneListenerRef.current = onHoldDone;
    return () => {
      onHoldDone();
    };
  }, []);

  const menuControls = showMenu ? (
    <span
      className="homepage-dining-snar-menu"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        const onHoldDone = holdDoneListenerRef.current;
        if (!onHoldDone) return;
        holdActivatedRef.current = false;
        onHoldDone();
        holdTimerRef.current = window.setTimeout(() => {
          holdActivatedRef.current = true;
          setBurgerRaining(true);
        }, SNAR_BURGER_HOLD_MS);
        window.addEventListener("pointerup", onHoldDone);
        window.addEventListener("pointercancel", onHoldDone);
      }}
    >
      {hoursLabel && !plainFormat ? (
        <span className="homepage-status-tooltip" role="tooltip">
          {`Open ${hoursLabel}`}
        </span>
      ) : null}
      <MealMenuButton
        isActive={openMenuIds.has(id)}
        label={`${vendor.name} ${capitalizeMeal(meal.name)}`}
        onClick={(event) => {
          event.stopPropagation();
          if (holdActivatedRef.current) {
            holdActivatedRef.current = false;
            return;
          }
          onToggleMenu(id, vendor.name, meal, event.clientX);
        }}
      />
    </span>
  ) : null;

  return (
    <tr className="homepage-dining-snar-row">
      <td>
        <span className="homepage-hours-name">
          <span
            className={`homepage-status-dot homepage-status-dot-${pill.kind}`}
            aria-label={`${pill.label}: ${message}`}
          >
            <span className="homepage-status-tooltip" role="tooltip">
              {message}
            </span>
          </span>
          <b>{vendor.name}</b>
        </span>
      </td>
      <td
        colSpan={mealColSpan}
        className={`homepage-dining-snar-cell${plainFormat ? " is-plain" : ""}`}
        onClick={() =>
          setPlainFormat((plain) => {
            const next = !plain;
            writeSnarPlainPreference(next);
            return next;
          })
        }
      >
        <div className="homepage-dining-snar">
          {plainFormat ? (
            <span className="homepage-dining-cell">
              <span className="homepage-dining-cell-hours">
                {plainHoursText}
              </span>
            </span>
          ) : (
            <>
              <div className="homepage-dining-snar-marquee" aria-hidden>
                <div className="homepage-dining-snar-track">
                  {snarItems("a")}
                  {snarItems("b")}
                </div>
              </div>
              <span className="homepage-dining-snar-label">{SNAR_DISPLAY}</span>
            </>
          )}
          {menuControls}
        </div>
        <SnarBurgerRain
          raining={burgerRaining}
          emoji={plainFormat ? "😢" : "🍔"}
        />
      </td>
    </tr>
  );
};

const HomepageDiningVendorRow = ({
  vendor,
  slots,
  openMenuIds,
  onToggleMenu,
}: {
  vendor: Vendor;
  slots: DiningMealSlot[];
  openMenuIds: Set<string>;
  onToggleMenu: (
    id: string,
    vendorName: string,
    meal: Meal,
    clientX: number
  ) => void;
}) => {
  const {
    style,
    message,
    isOpen,
    currentMealName,
    nextMealName,
    openProgress,
  } = useVendorStatus(vendor.meals);
  const pill = getDiningStatusPill(style);
  const highlightMealName = isOpen
    ? currentMealName
    : pill.kind === "soon"
    ? nextMealName
    : null;
  const openProgressStyle =
    isOpen && openProgress !== null
      ? ({
          ["--open-progress" as string]: `${Math.round(openProgress * 100)}%`,
        } as React.CSSProperties)
      : undefined;

  return (
    <tr className={`homepage-dining-row-status-${pill.kind}`}>
      <td>
        <span className="homepage-hours-name">
          <span
            className={`homepage-status-dot homepage-status-dot-${pill.kind}`}
            aria-label={`${pill.label}: ${message}`}
          >
            <span className="homepage-status-tooltip" role="tooltip">
              {message}
            </span>
          </span>
          <b>{vendor.name}</b>
        </span>
      </td>
      {slots.map((slot) => {
        const match = findMealForSlot(vendor, slot);
        if (!match) {
          return <td key={slot} className="homepage-dining-empty" />;
        }
        const { key, meal } = match;
        const hoursLabel = meal.hours
          ? formatCompactHours(meal.hours.open, meal.hours.close)
          : "";
        const id = mealMenuId(vendor.id, key);
        const showMenu = mealHasMenu(meal);
        const isHighlighted =
          highlightMealName !== null && meal.name === highlightMealName;
        const isOpenProgress = isHighlighted && isOpen && openProgress !== null;

        return (
          <td
            key={slot}
            className={[
              "homepage-dining-meal-cell",
              isHighlighted ? `dining-meal-status-${pill.kind}` : "",
              isOpenProgress ? "dining-meal-has-progress" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={isOpenProgress ? openProgressStyle : undefined}
          >
            {isOpenProgress ? (
              <div className="dining-meal-progress-fill" aria-hidden />
            ) : null}
            <span className="homepage-dining-cell">
              <span className="homepage-dining-cell-hours">{hoursLabel}</span>
              {showMenu ? (
                <MealMenuButton
                  isActive={openMenuIds.has(id)}
                  label={`${vendor.name} ${capitalizeMeal(meal.name)}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleMenu(id, vendor.name, meal, event.clientX);
                  }}
                />
              ) : null}
            </span>
          </td>
        );
      })}
    </tr>
  );
};

const HOMEPAGE_HIDDEN_VENDOR_IDS = new Set([
  "82-grill",
  "lees-snack-bar",
  "fresh-n-go",
]);

const HOMEPAGE_DINING_SKELETON_SLOTS = [
  "Breakfast",
  "Lunch",
  "Dinner",
] as const;
const HOMEPAGE_DINING_SKELETON_ROWS = 4;

const HomepageDiningSkeleton = () => (
  <div
    className="dining homepage-dining-hours"
    aria-busy="true"
    aria-hidden="true"
  >
    <h3>Dining Hours</h3>
    <table className="homepage-dining-table">
      <thead>
        <tr>
          <th />
          {HOMEPAGE_DINING_SKELETON_SLOTS.map((slot) => (
            <th key={slot}>{slot}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(HOMEPAGE_DINING_SKELETON_ROWS)].map((_, row) => (
          // eslint-disable-next-line react/no-array-index-key
          <tr key={row}>
            <td>
              <span className="homepage-hours-name">
                <span className="homepage-skeleton-dot" />
                <span
                  className="homepage-skeleton-line"
                  style={{ width: "70%" }}
                />
              </span>
            </td>
            {HOMEPAGE_DINING_SKELETON_SLOTS.map((slot) => (
              <td key={slot}>
                <span
                  className="homepage-skeleton-line"
                  style={{ width: "55%" }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const HomepageDiningHours = () => {
  const { diningData, loading, error } = useDiningData();
  const { openMenuIds, onToggleMenu, anyOpen, menuPanels } =
    useDiningMenus("left-only");
  const now = useNowMinute();
  const isMobile = useIsMobile();

  const vendors = useMemo(
    () =>
      Object.values(diningData)
        .filter(
          (vendor) =>
            vendor.operating &&
            !HOMEPAGE_HIDDEN_VENDOR_IDS.has(vendor.id.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [diningData]
  );

  const slots = useMemo(() => {
    const all = activeSlotsForVendors(vendors);
    if (!isMobile) return all;
    return featuredSlotsForVendors(vendors, now);
  }, [vendors, now, isMobile]);
  const whitmansLateNight = useMemo(
    () => findWhitmansLateNight(vendors),
    [vendors]
  );
  const showSnarRow =
    !!whitmansLateNight && isLateNightOpen(now, whitmansLateNight.meal);

  if (error) return <p>Unable to load dining hours.</p>;
  if (loading) return <HomepageDiningSkeleton />;
  if (vendors.length === 0) {
    return <p>No dining hours available.</p>;
  }

  return (
    <div
      className={`dining homepage-dining-hours${
        anyOpen ? " dining--menu-open" : ""
      }`}
    >
      <h3>Dining Hours</h3>
      <table className="homepage-dining-table">
        <thead>
          <tr>
            <th />
            {slots.map((slot) => (
              <th key={slot}>{mealSlotLabel(slot)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <React.Fragment key={vendor.id}>
              <HomepageDiningVendorRow
                vendor={vendor}
                slots={slots}
                openMenuIds={openMenuIds}
                onToggleMenu={onToggleMenu}
              />
              {showSnarRow &&
              whitmansLateNight &&
              vendor.id === whitmansLateNight.vendor.id ? (
                <HomepageSnarRow
                  vendor={whitmansLateNight.vendor}
                  mealKey={whitmansLateNight.key}
                  meal={whitmansLateNight.meal}
                  mealColSpan={slots.length}
                  openMenuIds={openMenuIds}
                  onToggleMenu={onToggleMenu}
                />
              ) : null}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {menuPanels}
    </div>
  );
};

export default HomepageDiningHours;
