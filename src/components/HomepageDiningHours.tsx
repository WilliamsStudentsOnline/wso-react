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
  return DINING_MEAL_SLOTS.filter((slot) => present.has(slot));
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
        <span className="homepage-dining-hall">
          <span
            className={`homepage-dining-status-dot homepage-dining-status-dot-${pill.kind}`}
            aria-label={`${pill.label}: ${message}`}
          >
            <span className="homepage-dining-status-tooltip" role="tooltip">
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
  if (loading) return <p>Loading…</p>;
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
