import React from "react";

import "../../stylesheets/Dining.css";
import ServiceHeader from "../../ui/ServiceHeader";
import ContentPane from "../../ui/ContentPane";
import {
  Meal,
  Vendor,
  capitalizeMeal,
  getDiningStatusPill,
  getMealOrder,
  mealHasMenu,
  mealMenuId,
  useDiningData,
  useDiningMenus,
  useVendorStatus,
  MealMenuButton,
} from "./diningShared";

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
  const { style, isOpen, currentMealName, nextMealName, openProgress } =
    useVendorStatus(vendor.meals);
  const pill = getDiningStatusPill(style);
  const highlightMealName = isOpen
    ? currentMealName
    : pill.kind === "soon"
    ? nextMealName
    : null;
  const sortedMealEntries = Object.entries(vendor.meals).sort(
    ([, a], [, b]) => getMealOrder(a.name) - getMealOrder(b.name)
  );
  const openProgressStyle =
    isOpen && openProgress !== null
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
                isHighlighted && isOpen && openProgress !== null;
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
