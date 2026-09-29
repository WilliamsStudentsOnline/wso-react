import React, { useState, useEffect } from "react";

import "../../stylesheets/Dining.css";
import ServiceHeader from "../../ui/ServiceHeader";
import ContentPane from "../../ui/ContentPane";
import {
  Meal,
  Vendor,
  capitalizeMeal,
  getMealOrder,
  mealHasMenu,
  mealMenuId,
  parseAndAdjustTime,
  useDiningData,
  useDiningMenus,
  MealMenuButton,
} from "./diningShared";

const useVendorStatus = (vendorMeals: Record<string, Meal>) => {
  const [status, setStatus] = useState<{
    style: string;
    message: string;
    isOpen: boolean;
    currentMealName: string | null;
    nextMealName: string | null;
    nextMealKey: string | null;
    openProgress: number | null;
  }>({
    style: "Closed",
    message: "Closed",
    isOpen: false,
    currentMealName: null,
    nextMealName: null,
    nextMealKey: null,
    openProgress: null,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let calculatedStatus: typeof status = {
      style: "Closed",
      message: "Closed for the day",
      isOpen: false,
      currentMealName: null,
      nextMealName: null,
      nextMealKey: null,
      openProgress: null,
    };
    let nextOpenTime: Date | null = null;
    let tempNextMealName: string | null = null;
    let tempNextMealKey: string | null = null;
    let tempNextOpenMessage = "";

    const sortedMealEntries = Object.entries(vendorMeals)
      .filter(([, meal]) => meal.hours)
      .sort(([, a], [, b]) => getMealOrder(a.name) - getMealOrder(b.name));

    for (const [mealKey, meal] of sortedMealEntries) {
      if (!meal.hours) continue;

      const openDateTime = parseAndAdjustTime(
        meal.hours.open,
        currentTime,
        false
      );
      const closeDateTime = parseAndAdjustTime(
        meal.hours.close,
        currentTime,
        true,
        meal.hours.open
      );

      if (currentTime >= openDateTime && currentTime < closeDateTime) {
        const diffMinutes =
          (closeDateTime.getTime() - currentTime.getTime()) / 1000 / 60;
        const totalMs = closeDateTime.getTime() - openDateTime.getTime();
        const elapsedMs = currentTime.getTime() - openDateTime.getTime();
        const openProgress =
          totalMs > 0 ? Math.min(1, Math.max(0, elapsedMs / totalMs)) : 0;
        calculatedStatus = {
          style: diffMinutes < 60 ? "Closing" : "Open",
          message:
            diffMinutes < 60
              ? `Closes in ${Math.round(diffMinutes)} min`
              : `Open until ${meal.hours.close}`,
          isOpen: true,
          currentMealName: meal.name,
          nextMealName: null,
          nextMealKey: null,
          openProgress,
        };
        nextOpenTime = null;
        tempNextMealName = null;
        tempNextMealKey = null;
        break;
      }

      if (currentTime < openDateTime) {
        if (!nextOpenTime || openDateTime < nextOpenTime) {
          nextOpenTime = openDateTime;
          tempNextMealName = meal.name;
          tempNextMealKey = mealKey;
          const diffMinutes =
            (openDateTime.getTime() - currentTime.getTime()) / 1000 / 60;
          if (diffMinutes < 60) {
            tempNextOpenMessage = `Opens in ${Math.round(diffMinutes)} min`;
            calculatedStatus = {
              style: "Opening",
              message: tempNextOpenMessage,
              isOpen: false,
              currentMealName: null,
              nextMealName: meal.name,
              nextMealKey: mealKey,
              openProgress: null,
            };
          } else {
            tempNextOpenMessage = `Opens at ${meal.hours.open}`;
            if (calculatedStatus.style === "Closed") {
              calculatedStatus = {
                style: "Closed",
                message: tempNextOpenMessage,
                isOpen: false,
                currentMealName: null,
                nextMealName: meal.name,
                nextMealKey: mealKey,
                openProgress: null,
              };
            } else {
              calculatedStatus.nextMealName = meal.name;
              calculatedStatus.nextMealKey = mealKey;
            }
          }
        }
      }
    }

    if (!calculatedStatus.isOpen && !nextOpenTime) {
      calculatedStatus = {
        style: "Closed",
        message: "Closed for the day",
        isOpen: false,
        currentMealName: null,
        nextMealName: null,
        nextMealKey: null,
        openProgress: null,
      };
    } else if (calculatedStatus.style === "Closed" && tempNextOpenMessage) {
      calculatedStatus.message = tempNextOpenMessage;
      calculatedStatus.nextMealName = tempNextMealName;
      calculatedStatus.nextMealKey = tempNextMealKey;
    }

    setStatus(calculatedStatus);
  }, [vendorMeals, currentTime]);

  return status;
};

type DiningStatusPill = {
  label: "Open" | "Soon" | "Closed";
  kind: "open" | "soon" | "closed";
};

const getDiningStatusPill = (style: string): DiningStatusPill => {
  if (style === "Open" || style === "Closing") {
    return { label: "Open", kind: "open" };
  }
  if (style === "Opening") {
    return { label: "Soon", kind: "soon" };
  }
  return { label: "Closed", kind: "closed" };
};

const DiningHoursCard = ({
  vendor,
  openMenuIds,
  onToggleMenu,
}: {
  vendor: Vendor;
  openMenuIds: Set<string>;
  onToggleMenu: (
    id: string,
    vendorName: string,
    meal: Meal,
    clientX: number
  ) => void;
}) => {
  const { style, currentMealName, nextMealName, openProgress } =
    useVendorStatus(vendor.meals);
  const pill = getDiningStatusPill(style);
  const highlightMealName =
    pill.kind === "open"
      ? currentMealName
      : pill.kind === "soon"
      ? nextMealName
      : null;
  const sortedMealEntries = Object.entries(vendor.meals).sort(
    ([, a], [, b]) => getMealOrder(a.name) - getMealOrder(b.name)
  );
  const openProgressStyle =
    pill.kind === "open" && openProgress !== null
      ? ({
          ["--open-progress" as string]: `${Math.round(openProgress * 100)}%`,
        } as React.CSSProperties)
      : undefined;

  const renderMenuButton = (mealKey: string, meal: Meal) => {
    if (!mealHasMenu(meal)) return null;
    const id = mealMenuId(vendor.id, mealKey);
    return (
      <MealMenuButton
        isActive={openMenuIds.has(id)}
        label={`${vendor.name} ${capitalizeMeal(meal.name)}`}
        onClick={(event) => {
          event.stopPropagation();
          onToggleMenu(id, vendor.name, meal, event.clientX);
        }}
      />
    );
  };

  return (
    <div className="table-with-text">
      <table
        className={`dining-table-container dining-table-status-${pill.kind}`}
      >
        <thead>
          <tr>
            <th className="dining-hours-header">
              <div className="dining-hours-header-inner">
                <span className="dining-hall-name">{vendor.name}</span>
                <span
                  className={`dining-status-pill dining-status-pill-${pill.kind}`}
                >
                  {pill.label}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMealEntries.length > 0 ? (
            sortedMealEntries.map(([mealKey, meal]) => {
              const isHighlighted =
                highlightMealName !== null && meal.name === highlightMealName;
              const isOpenProgress =
                isHighlighted && pill.kind === "open" && openProgress !== null;
              const hoursLabel = meal.hours
                ? `${meal.hours.open} – ${meal.hours.close}`
                : "No Times";
              const menuButton = renderMenuButton(mealKey, meal);

              return (
                <tr
                  key={mealKey}
                  className={`dining-children${
                    isHighlighted ? ` dining-meal-status-${pill.kind}` : ""
                  }${isOpenProgress ? " dining-meal-has-progress" : ""}`}
                  style={isOpenProgress ? openProgressStyle : undefined}
                >
                  <td className="dining-meal-row-cell">
                    {isOpenProgress && (
                      <div className="dining-meal-progress-fill" aria-hidden />
                    )}
                    <div className="dining-meal-row">
                      <span className="dining-meal-name">
                        {capitalizeMeal(meal.name)}
                      </span>
                      <span className="dining-meal-hours">{hoursLabel}</span>
                      <span className="dining-meal-menu-slot">
                        {menuButton}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>No meal times listed.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const DiningHours = ({
  diningData,
  openMenuIds,
  onToggleMenu,
}: {
  diningData: Record<string, Vendor>;
  openMenuIds: Set<string>;
  onToggleMenu: (
    id: string,
    vendorName: string,
    meal: Meal,
    clientX: number
  ) => void;
}) => {
  const sortedVendors = Object.values(diningData)
    .filter((vendor) => vendor.operating)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="hours-grid-container">
      {sortedVendors.length > 0 ? (
        sortedVendors.map((vendor) => (
          <DiningHoursCard
            key={vendor.id}
            vendor={vendor}
            openMenuIds={openMenuIds}
            onToggleMenu={onToggleMenu}
          />
        ))
      ) : (
        <p className="loading-message">
          No operating dining information available.
        </p>
      )}
    </div>
  );
};

const App = () => {
  const { diningData, loading, error, updateTime } = useDiningData();
  const { openMenuIds, onToggleMenu, anyOpen, menuPanels } =
    useDiningMenus("dual");

  const renderContent = () => {
    if (loading)
      return <p className="loading-message">Loading Dining Info...</p>;
    if (error)
      return (
        <p className="error-message">Error loading dining info: {error}</p>
      );
    if (!loading && Object.keys(diningData).length === 0)
      return <p className="loading-message">No dining data available.</p>;

    return (
      <DiningHours
        diningData={diningData}
        openMenuIds={openMenuIds}
        onToggleMenu={onToggleMenu}
      />
    );
  };

  return (
    <div className={`dining${anyOpen ? " dining--menu-open" : ""}`}>
      <ServiceHeader title="Dining" titleTo="/dining" />
      <ContentPane>
        <section className="dining-main">
          {renderContent()}
          <p className="dining-footer">
            Dining info last updated: {updateTime || "N/A"}. Menus typically
            refresh on Sundays around 1:00 AM.
          </p>
        </section>
      </ContentPane>
      {menuPanels}
    </div>
  );
};

export default App;
