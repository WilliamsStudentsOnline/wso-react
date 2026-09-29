import React, { useMemo } from "react";
import "./stylesheets/Dining.css";
import {
  DINING_MEAL_SLOTS,
  DiningMealSlot,
  Meal,
  Vendor,
  capitalizeMeal,
  mealHasMenu,
  mealMenuId,
  mealSlotForName,
  mealSlotLabel,
  useDiningData,
  useDiningMenus,
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

const compactTimePart = (time: string): string =>
  time.replace(/:00(?=[ap]m)/i, "");

const formatCompactHours = (open: string, close: string): string => {
  let openPart = compactTimePart(open);
  const closePart = compactTimePart(close);
  const openMeridiem = openPart.match(/([ap]m)$/i)?.[1];
  const closeMeridiem = closePart.match(/([ap]m)$/i)?.[1];
  if (
    openMeridiem &&
    closeMeridiem &&
    openMeridiem.toLowerCase() === closeMeridiem.toLowerCase()
  ) {
    openPart = openPart.replace(/[ap]m$/i, "");
  }
  return `${openPart}–${closePart}`;
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
            <th>Hall</th>
            {slots.map((slot) => (
              <th key={slot}>{mealSlotLabel(slot)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td>
                <b>{vendor.name}</b>
              </td>
              {slots.map((slot) => {
                const match = findMealForSlot(vendor, slot);
                if (!match) {
                  return (
                    <td key={slot} className="homepage-dining-empty">
                      —
                    </td>
                  );
                }
                const { key, meal } = match;
                const hoursLabel = meal.hours
                  ? formatCompactHours(meal.hours.open, meal.hours.close)
                  : "—";
                const id = mealMenuId(vendor.id, key);
                const showMenu = mealHasMenu(meal);

                return (
                  <td key={slot}>
                    <span className="homepage-dining-cell">
                      <span className="homepage-dining-cell-hours">
                        {hoursLabel}
                      </span>
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
          ))}
        </tbody>
      </table>
      {menuPanels}
    </div>
  );
};

export default HomepageDiningHours;
