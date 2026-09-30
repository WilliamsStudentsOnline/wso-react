import React, { useEffect, useMemo, useState } from "react";
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
const SNAR_DISPLAY = "SNAR!!!";
const SNAR_REPEAT_COUNT = 12;

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

const isAfterNineUntilLateNightClose = (
  now: Date,
  lateNight: Meal
): boolean => {
  if (!lateNight.hours) return false;
  const ninePm = new Date(now);
  ninePm.setHours(21, 0, 0, 0);
  if (now.getHours() < 6) {
    ninePm.setDate(ninePm.getDate() - 1);
  }
  const close = parseAndAdjustTime(
    lateNight.hours.close,
    now,
    true,
    lateNight.hours.open
  );
  return now >= ninePm && now < close;
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

const HomepageSnarRow = ({
  vendor,
  mealKey,
  meal,
  colSpan,
  openMenuIds,
  onToggleMenu,
}: {
  vendor: Vendor;
  mealKey: string;
  meal: Meal;
  colSpan: number;
  openMenuIds: Set<string>;
  onToggleMenu: (
    id: string,
    vendorName: string,
    meal: Meal,
    clientX: number
  ) => void;
}) => {
  const hoursLabel = meal.hours
    ? formatCompactHours(meal.hours.open, meal.hours.close)
    : "";
  const id = mealMenuId(vendor.id, mealKey);
  const showMenu = mealHasMenu(meal);
  const snarSegment = Array.from(
    { length: SNAR_REPEAT_COUNT },
    () => SNAR_DISPLAY
  ).join(" ");

  return (
    <tr className="homepage-dining-snar-row">
      <td colSpan={colSpan} className="homepage-dining-snar-cell">
        <div className="homepage-dining-snar">
          {hoursLabel ? (
            <span className="homepage-status-tooltip" role="tooltip">
              {hoursLabel}
            </span>
          ) : null}
          <div className="homepage-dining-snar-marquee" aria-hidden>
            <div className="homepage-dining-snar-track">
              <span className="homepage-dining-snar-segment">
                {snarSegment}
              </span>
              <span className="homepage-dining-snar-segment">
                {snarSegment}
              </span>
            </div>
          </div>
          <span className="homepage-dining-snar-label">{SNAR_DISPLAY}</span>
          {showMenu ? (
            <span className="homepage-dining-snar-menu">
              <MealMenuButton
                isActive={openMenuIds.has(id)}
                label={`${vendor.name} ${capitalizeMeal(meal.name)}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleMenu(id, vendor.name, meal, event.clientX);
                }}
              />
            </span>
          ) : null}
        </div>
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

  const slots = useMemo(() => activeSlotsForVendors(vendors), [vendors]);
  const whitmansLateNight = useMemo(
    () => findWhitmansLateNight(vendors),
    [vendors]
  );
  const showSnarRow =
    !!whitmansLateNight &&
    isAfterNineUntilLateNightClose(now, whitmansLateNight.meal);

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
                  colSpan={slots.length + 1}
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
