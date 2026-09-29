import React, { useMemo } from "react";
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
  useDiningData,
  useDiningMenus,
  useVendorStatus,
  MealMenuButton,
} from "./views/Dining/diningShared";

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
  const { style, message, currentMealName, nextMealName, openProgress } =
    useVendorStatus(vendor.meals);
  const pill = getDiningStatusPill(style);
  const highlightMealName =
    pill.kind === "open"
      ? currentMealName
      : pill.kind === "soon"
      ? nextMealName
      : null;
  const openProgressStyle =
    pill.kind === "open" && openProgress !== null
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
        const isOpenProgress =
          isHighlighted && pill.kind === "open" && openProgress !== null;

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

const HOMEPAGE_DINING_SKELETON_SLOTS = [
  "Breakfast",
  "Lunch",
  "Dinner",
] as const;
const HOMEPAGE_DINING_SKELETON_ROWS = 7;

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

  const vendors = useMemo(
    () =>
      Object.values(diningData)
        .filter((vendor) => vendor.operating)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [diningData]
  );

  const slots = useMemo(() => activeSlotsForVendors(vendors), [vendors]);

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
            <HomepageDiningVendorRow
              key={vendor.id}
              vendor={vendor}
              slots={slots}
              openMenuIds={openMenuIds}
              onToggleMenu={onToggleMenu}
            />
          ))}
        </tbody>
      </table>
      {menuPanels}
    </div>
  );
};

export default HomepageDiningHours;
