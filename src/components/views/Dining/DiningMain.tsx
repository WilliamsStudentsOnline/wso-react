import React, { useState, useEffect } from "react";

import "../../stylesheets/Dining.css";

interface MealHours {
  open: string;
  close: string;
}
interface MenuItem {
  name: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}
interface Course {
  name: string;
  items: MenuItem[];
}
interface Meal {
  name: string;
  hours: MealHours | null;
  courses: Record<string, Course> | null;
}
interface Vendor {
  id: string;
  name: string;
  meals: Record<string, Meal>;
  onlineOrder: boolean;
  operating: boolean;
}

const parseAndAdjustTime = (
  timeStr: string,
  baseDate: Date,
  isCloseTime: boolean,
  openTimeStr?: string
): Date => {
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})(am|pm)/i);
  if (!timeMatch) {
    console.warn("Invalid time format:", timeStr);
    const invalidDate = new Date();
    invalidDate.setTime(0);
    return invalidDate;
  }
  const [, hoursStr, minutesStr, modifier] = timeMatch;
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  let newHours = hours;

  if (modifier.toLowerCase() === "pm" && hours !== 12) newHours += 12;
  if (modifier.toLowerCase() === "am" && hours === 12) newHours = 0; // Handle 12am

  const date = new Date(baseDate);
  date.setHours(newHours, minutes, 0, 0);

  if (isCloseTime && openTimeStr) {
    const openDate = parseAndAdjustTime(openTimeStr, baseDate, false);
    if (date.getTime() <= openDate.getTime()) {
      // Use <= to handle same minute closing next day
      date.setDate(date.getDate() + 1);
    }
  }

  const currentHour = baseDate.getHours();
  if (currentHour < 6 && newHours > 18) {
    date.setDate(date.getDate() - 1);
  } else if (currentHour > 18 && newHours < 6) {
    date.setDate(date.getDate() + 1);
  }

  return date;
};

const getMealOrder = (mealName: string): number => {
  const lowerCaseName = mealName.toLowerCase();
  if (lowerCaseName.includes("breakfast")) return 1;
  if (lowerCaseName.includes("brunch")) return 2;
  if (lowerCaseName.includes("lunch")) return 3;
  if (lowerCaseName.includes("dinner")) return 4;
  if (
    lowerCaseName.includes("late night") ||
    lowerCaseName.includes("latenight")
  )
    return 5;
  return 99; // unknown meals last
};

const capitalizeMeal = (str: string): string => {
  if (!str) return "";
  return str
    .replaceAll("williams' ", "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const useDiningData = () => {
  const [diningData, setDiningData] = useState<Record<string, Vendor>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateTime, setUpdateTime] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/dining.json");
        if (!response.ok)
          throw new Error(`Error fetching dining JSON: ${response.status}`);
        const responseJSON = await response.json();

        if (responseJSON && responseJSON.vendors) {
          const vendorsWithId: Record<string, Vendor> = {};
          Object.entries(responseJSON.vendors).forEach(([key, vendor]) => {
            vendorsWithId[key] = { ...(vendor as Omit<Vendor, "id">), id: key };
          });
          setDiningData(vendorsWithId);
          setUpdateTime(responseJSON.updateTime || "Not specified");
        } else {
          throw new Error("Invalid data format received.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { diningData, loading, error, updateTime };
};

const useVendorStatus = (vendorMeals: Record<string, Meal>) => {
  const [status, setStatus] = useState<{
    style: string;
    message: string;
    isOpen: boolean;
    currentMealName: string | null;
    nextMealName: string | null;
    nextMealKey: string | null;
  }>({
    style: "Closed",
    message: "Closed",
    isOpen: false,
    currentMealName: null,
    nextMealName: null,
    nextMealKey: null,
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

      // check if currently open
      if (currentTime >= openDateTime && currentTime < closeDateTime) {
        const diffMinutes =
          (closeDateTime.getTime() - currentTime.getTime()) / 1000 / 60;
        calculatedStatus = {
          style: diffMinutes < 60 ? "Closing" : "Open",
          message:
            diffMinutes < 60
              ? `Closes in ${Math.round(diffMinutes)} min`
              : `Open until ${meal.hours.close}`,
          isOpen: true,
          currentMealName: meal.name,
          nextMealName: null, // not needed if open
          nextMealKey: null,
        };
        nextOpenTime = null; // clear next open time since it's open now
        tempNextMealName = null;
        tempNextMealKey = null;
        break; // found open meal, no need to check further
      }

      // check for the *next* opening time if not already open
      if (currentTime < openDateTime) {
        if (!nextOpenTime || openDateTime < nextOpenTime) {
          nextOpenTime = openDateTime;
          tempNextMealName = meal.name; // store potential next meal
          tempNextMealKey = mealKey;
          const diffMinutes =
            (openDateTime.getTime() - currentTime.getTime()) / 1000 / 60;
          if (diffMinutes < 60) {
            tempNextOpenMessage = `Opens in ${Math.round(diffMinutes)} min`;
            // Tentatively set status to Opening, might be overridden by Closed later if needed
            calculatedStatus = {
              style: "Opening",
              message: tempNextOpenMessage,
              isOpen: false,
              currentMealName: null,
              nextMealName: meal.name,
              nextMealKey: mealKey,
            };
          } else {
            tempNextOpenMessage = `Opens at ${meal.hours.open}`;
            // Only update message if still Closed, don't override Opening status
            if (calculatedStatus.style === "Closed") {
              calculatedStatus = {
                style: "Closed",
                message: tempNextOpenMessage,
                isOpen: false,
                currentMealName: null,
                nextMealName: meal.name,
                nextMealKey: mealKey,
              };
            } else {
              // if already opening, ensure next meal details are correct
              calculatedStatus.nextMealName = meal.name;
              calculatedStatus.nextMealKey = mealKey;
            }
          }
        }
      }
    }

    // Final check: if not open and no future opening time found today, it's closed for the day
    if (!calculatedStatus.isOpen && !nextOpenTime) {
      calculatedStatus = {
        style: "Closed",
        message: "Closed for the day",
        isOpen: false,
        currentMealName: null,
        nextMealName: null,
        nextMealKey: null,
      };
    }
    // if status is still 'Closed' but we found a next opening time message, use it
    else if (calculatedStatus.style === "Closed" && tempNextOpenMessage) {
      calculatedStatus.message = tempNextOpenMessage;
      // Ensure next meal details are set even if not "Opening" style
      calculatedStatus.nextMealName = tempNextMealName;
      calculatedStatus.nextMealKey = tempNextMealKey;
    }

    setStatus(calculatedStatus);
  }, [vendorMeals, currentTime]);

  return status;
};

const DiningHoursCard = ({ vendor }: { vendor: Vendor }) => {
  const { style, message } = useVendorStatus(vendor.meals);
  const sortedMeals = Object.values(vendor.meals).sort(
    (a, b) => getMealOrder(a.name) - getMealOrder(b.name)
  );
  return (
    <div className="table-with-text">
      <p className="dining-hall-text">
        <b>{vendor.name}</b> · <span className={style}>{message}</span>
      </p>
      <table className="dining-table-container">
        <colgroup>
          <col style={{ width: "40%" }} /> {/* Left column width */}
          <col style={{ width: "60%" }} /> {/* Right column width */}
        </colgroup>
        <thead className="meal-title">
          <tr>
            <th
              colSpan={2}
              style={{ display: "table-cell" }}
              className="meal-header"
            >
              Hours
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMeals.length > 0 ? (
            sortedMeals.map((meal, j) => (
              <tr key={j} className="dining-children">
                <td>{capitalizeMeal(meal.name)}</td>
                <td>
                  {meal.hours
                    ? `${meal.hours.open} - ${meal.hours.close}`
                    : "No Times"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No meal times listed.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const DiningHours = ({
  diningData,
}: {
  diningData: Record<string, Vendor>;
}) => {
  const sortedVendors = Object.values(diningData)
    .filter((vendor) => vendor.operating)
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div>
      <h2 className="dining-section-title">Dining Hall Hours</h2>
      <div className="hours-grid-container">
        {sortedVendors.length > 0 ? (
          sortedVendors.map((vendor) => (
            <DiningHoursCard key={vendor.id} vendor={vendor} />
          ))
        ) : (
          <p className="loading-message">
            No operating dining information available.
          </p>
        )}
      </div>
    </div>
  );
};

const MealSection = ({
  mealKey,
  meal,
  isOpen,
  toggleMeal,
}: {
  mealKey: string;
  meal: Meal;
  isOpen: boolean;
  toggleMeal: (key: string) => void;
}) => {
  const isExpanded = isOpen;

  return (
    <div style={{ marginBottom: "0" }}>
      {" "}
      <table className="menu-table-container">
        <thead className="meal-title">
          <tr>
            <th onClick={() => toggleMeal(mealKey)} className="meal-header">
              {capitalizeMeal(meal.name)}{" "}
              {meal.hours ? `(${meal.hours.open} - ${meal.hours.close})` : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: 0, border: "none" }} colSpan={1}>
              {" "}
              <div
                className={`meal-content-wrapper ${
                  isExpanded ? "expanded" : "collapsed"
                }`}
              >
                <table className="meal-content-table">
                  <tbody>
                    {meal.courses ? (
                      Object.entries(meal.courses)
                        .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                        .map(([courseKey, course], k) => (
                          <React.Fragment key={k}>
                            <tr className="course-title menu-item-row">
                              <td colSpan={1}>
                                <b>{course.name}</b>
                              </td>
                            </tr>
                            {course.items && course.items.length > 0 ? (
                              course.items.map((item, l) => (
                                <tr key={l} className="menu-item-row">
                                  <td className="menu-item-cell">
                                    <span className="menu-item-name">
                                      {item.name}
                                    </span>
                                    <div className="item-details">
                                      {item.vegetarian && (
                                        <span className="vegetarian">
                                          Vegetarian
                                        </span>
                                      )}
                                      {item.vegan && (
                                        <span className="vegan">Vegan</span>
                                      )}
                                      {item.glutenFree && (
                                        <span className="glutenFree">GF</span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr className="menu-item-row">
                                <td className="menu-item-cell">
                                  <i>No items listed for this course.</i>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                    ) : (
                      <tr className="menu-item-row">
                        <td className="menu-item-cell">
                          <i>No courses listed for this meal.</i>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const VendorMenu = ({
  vendor,
  isSingleView,
}: {
  vendor: Vendor;
  isSingleView: boolean;
}) => {
  const {
    isOpen: vendorIsOpen,
    currentMealName,
    nextMealKey,
  } = useVendorStatus(vendor.meals);
  const [openMeals, setOpenMeals] = useState<Record<string, boolean>>({});

  // Initialize collapsible state: open current OR next meal if in single view
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    const targetKey = vendorIsOpen
      ? Object.entries(vendor.meals).find(
          ([, m]) => m.name === currentMealName
        )?.[0]
      : nextMealKey;

    Object.keys(vendor.meals).forEach((mealKey) => {
      initialOpenState[mealKey] = !!targetKey && mealKey === targetKey;
    });
    setOpenMeals(initialOpenState);
  }, [
    vendor.id,
    vendor.meals,
    isSingleView,
    vendorIsOpen,
    currentMealName,
    nextMealKey,
  ]);

  const toggleMeal = (mealKey: string) => {
    setOpenMeals((prev) => ({ ...prev, [mealKey]: !prev[mealKey] }));
  };

  // Sort meals: prioritize open meal OR next meal in single view, then chronological
  const sortedMealEntries = Object.entries(vendor.meals).sort(
    ([, a], [, b]) => {
      const orderA = getMealOrder(a.name);
      const orderB = getMealOrder(b.name);

      // Prioritize in single view
      if (isSingleView) {
        const currentMealKey = vendorIsOpen
          ? Object.entries(vendor.meals).find(
              ([, m]) => m.name === currentMealName
            )?.[0]
          : null;
        const priorityKey = currentMealKey ?? nextMealKey; // Use current if open, else next

        if (priorityKey) {
          const keyA = Object.entries(vendor.meals).find(
            ([, m]) => m.name === a.name
          )?.[0];
          const keyB = Object.entries(vendor.meals).find(
            ([, m]) => m.name === b.name
          )?.[0];
          if (keyA === priorityKey) return -1; // a is priority
          if (keyB === priorityKey) return 1; // b is priority
        }
      }

      return orderA - orderB; // otherwise, sort chronologically
    }
  );

  return (
    <div className="table-with-text">
      {isSingleView ? null : (
        <p className="dining-hall-text">
          <b>{vendor.name} Menu</b>
        </p>
      )}
      {sortedMealEntries.length === 0 && (
        <p style={{ padding: "10px" }}>
          No meals listed for {vendor.name} today.
        </p>
      )}

      {sortedMealEntries.map(([mealKey, meal]) => (
        <MealSection
          key={mealKey}
          mealKey={mealKey}
          meal={meal}
          isOpen={!!openMeals[mealKey]}
          toggleMeal={toggleMeal}
        />
      ))}
    </div>
  );
};

const DiningMenu = ({
  diningData,
  view,
}: {
  diningData: Record<string, Vendor>;
  view: string;
}) => {
  const targetHalls =
    view === "all" ? ["driscoll", "mission", "whitmans"] : [view];
  const filteredData = Object.values(diningData)
    .filter((vendor) => targetHalls.includes(vendor.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (filteredData.length === 0 && Object.keys(diningData).length > 0)
    return (
      <p className="loading-message">
        No menu information available for the selected view.
      </p>
    );
  if (filteredData.length === 0) return null;

  return (
    <div>
      <h2 className="dining-section-title">
        {view === "all"
          ? "Dining Hall Menus"
          : `${filteredData[0]?.name || ""} Menu`}
      </h2>
      <div className={view === "all" ? "all-menus-grid" : "single-dining-view"}>
        {filteredData.map((vendor) => (
          <VendorMenu
            key={vendor.id}
            vendor={vendor}
            isSingleView={view !== "all"}
          />
        ))}
      </div>
    </div>
  );
};

const Footer = ({ updateTime }: { updateTime: string | null }) => {
  return (
    <div className="dining-footer">
      {" "}
      Dining info last updated: {updateTime || "N/A"}. Menus typically refresh
      daily around 2:00 AM.{" "}
    </div>
  );
};

const App = () => {
  const { diningData, loading, error, updateTime } = useDiningData();
  const [currentView, setCurrentView] = useState("all");

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
      <>
        {currentView === "all" && <DiningHours diningData={diningData} />}
        <DiningMenu diningData={diningData} view={currentView} />
      </>
    );
  };

  return (
    <div className="app-container">
      <h1 className="main-title">Williams Dining</h1>
      <Footer updateTime={updateTime} />
      <nav className="quick-nav">
        <button
          className={`nav-button ${currentView === "all" ? "active" : ""}`}
          onClick={() => setCurrentView("all")}
        >
          {" "}
          All{" "}
        </button>
        <button
          className={`nav-button ${currentView === "whitmans" ? "active" : ""}`}
          onClick={() => setCurrentView("whitmans")}
        >
          {" "}
          Whitman&apos;s{" "}
        </button>
        <button
          className={`nav-button ${currentView === "mission" ? "active" : ""}`}
          onClick={() => setCurrentView("mission")}
        >
          {" "}
          Mission{" "}
        </button>
        <button
          className={`nav-button ${currentView === "driscoll" ? "active" : ""}`}
          onClick={() => setCurrentView("driscoll")}
        >
          {" "}
          Driscoll{" "}
        </button>
      </nav>
      {renderContent()}
    </div>
  );
};

export default App;
