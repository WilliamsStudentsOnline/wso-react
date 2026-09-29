import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdClose, MdRestaurantMenu } from "react-icons/md";

import "../../stylesheets/Dining.css";
import ServiceHeader from "../../ui/ServiceHeader";
import ContentPane from "../../ui/ContentPane";

const MENU_ANIM_MS = 220;

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

type MenuSide = "left" | "right";

type OpenMenu = {
  id: string;
  vendorName: string;
  meal: Meal;
  side: MenuSide;
  visible: boolean;
};

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

const mealMenuId = (vendorId: string, mealKey: string) =>
  `${vendorId}::${mealKey}`;

const mealHasMenu = (meal: Meal): boolean =>
  !!meal.courses &&
  Object.values(meal.courses).some(
    (course) => !!course.items && course.items.length > 0
  );

/** Vendors to never show, even if present in dining.json. */
const HIDDEN_VENDOR_IDS = new Set(["goodrich"]);

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
            if (HIDDEN_VENDOR_IDS.has(key.toLowerCase())) return;
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

      // check if currently open
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
          nextMealName: null, // not needed if open
          nextMealKey: null,
          openProgress,
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
              openProgress: null,
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
                openProgress: null,
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
        openProgress: null,
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

const MealMenuContent = ({ meal }: { meal: Meal }) => {
  if (!meal.courses || Object.keys(meal.courses).length === 0) {
    return (
      <p className="dining-menu-empty">
        <i>No courses listed for this meal.</i>
      </p>
    );
  }

  return (
    <table className="meal-content-table">
      <tbody>
        {Object.entries(meal.courses)
          .sort(([, a], [, b]) => a.name.localeCompare(b.name))
          .map(([courseKey, course]) => (
            <React.Fragment key={courseKey}>
              <tr className="course-title menu-item-row">
                <td>
                  <b>{course.name}</b>
                </td>
              </tr>
              {course.items && course.items.length > 0 ? (
                course.items.map((item, i) => (
                  <tr key={`${courseKey}-${i}`} className="menu-item-row">
                    <td className="menu-item-cell">
                      <span className="menu-item-name">{item.name}</span>
                      <div className="item-details">
                        {item.vegetarian && (
                          <span className="vegetarian">VGT</span>
                        )}
                        {item.vegan && <span className="vegan">V</span>}
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
          ))}
      </tbody>
    </table>
  );
};

const MealMenuCard = ({
  openMenu,
  onClose,
}: {
  openMenu: OpenMenu;
  onClose: () => void;
}) => {
  return (
    <div
      className={`dining-menu-card dining-menu-card--${openMenu.side}${
        openMenu.visible ? " is-visible" : ""
      }`}
      role="dialog"
      aria-label={`${openMenu.vendorName} ${capitalizeMeal(
        openMenu.meal.name
      )} menu`}
    >
      <div className="dining-menu-card-header">
        <div className="dining-menu-card-title">
          <span className="dining-menu-card-vendor">{openMenu.vendorName}</span>
          <span className="dining-menu-card-meal">
            {capitalizeMeal(openMenu.meal.name)}
            {openMenu.meal.hours
              ? ` · ${openMenu.meal.hours.open} – ${openMenu.meal.hours.close}`
              : ""}
          </span>
        </div>
        <button
          type="button"
          className="dining-menu-card-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <MdClose size={18} />
        </button>
      </div>
      <div
        className="dining-menu-card-body"
        onWheel={(event) => event.stopPropagation()}
      >
        <MealMenuContent meal={openMenu.meal} />
      </div>
    </div>
  );
};

const MealMenuButton = ({
  isActive,
  onClick,
  label,
}: {
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
}) => (
  <button
    type="button"
    className={`dining-meal-menu-btn${isActive ? " is-active" : ""}`}
    onClick={onClick}
    aria-label={isActive ? `Close ${label} menu` : `Open ${label} menu`}
    aria-expanded={isActive}
  >
    <MdRestaurantMenu size={16} aria-hidden />
  </button>
);

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

  const [leftMenu, setLeftMenu] = useState<OpenMenu | null>(null);
  const [rightMenu, setRightMenu] = useState<OpenMenu | null>(null);
  const lastSideRef = useRef<MenuSide | null>(null);
  const closeTimersRef = useRef<Partial<Record<MenuSide, number>>>({});

  const clearCloseTimer = (side: MenuSide) => {
    const timer = closeTimersRef.current[side];
    if (timer !== undefined) {
      window.clearTimeout(timer);
      delete closeTimersRef.current[side];
    }
  };

  const setSlot = useCallback((side: MenuSide, menu: OpenMenu | null) => {
    if (side === "left") setLeftMenu(menu);
    else setRightMenu(menu);
  }, []);

  const closeSide = useCallback(
    (side: MenuSide) => {
      const current = side === "left" ? leftMenu : rightMenu;
      if (!current) return;
      setSlot(side, { ...current, visible: false });
      clearCloseTimer(side);
      closeTimersRef.current[side] = window.setTimeout(() => {
        setSlot(side, null);
        delete closeTimersRef.current[side];
        if (lastSideRef.current === side) {
          lastSideRef.current = side === "left" ? "right" : "left";
          if (!(side === "left" ? rightMenu : leftMenu)) {
            lastSideRef.current = null;
          }
        }
      }, MENU_ANIM_MS);
    },
    [leftMenu, rightMenu, setSlot]
  );

  const showInSide = useCallback(
    (side: MenuSide, id: string, vendorName: string, meal: Meal) => {
      clearCloseTimer(side);
      lastSideRef.current = side;
      setSlot(side, { id, vendorName, meal, side, visible: false });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlot(side, { id, vendorName, meal, side, visible: true });
        });
      });
    },
    [setSlot]
  );

  const onToggleMenu = useCallback(
    (id: string, vendorName: string, meal: Meal, clientX: number) => {
      if (leftMenu?.id === id) {
        closeSide("left");
        return;
      }
      if (rightMenu?.id === id) {
        closeSide("right");
        return;
      }

      const preferred: MenuSide =
        clientX > window.innerWidth / 2 ? "right" : "left";
      const leftOpen = !!leftMenu;
      const rightOpen = !!rightMenu;

      if (!leftOpen && !rightOpen) {
        showInSide(preferred, id, vendorName, meal);
        return;
      }

      if (leftOpen && !rightOpen) {
        showInSide("right", id, vendorName, meal);
        return;
      }

      if (!leftOpen && rightOpen) {
        showInSide("left", id, vendorName, meal);
        return;
      }

      const replaceSide = lastSideRef.current ?? preferred;
      showInSide(replaceSide, id, vendorName, meal);
    },
    [leftMenu, rightMenu, closeSide, showInSide]
  );

  useEffect(
    () => () => {
      clearCloseTimer("left");
      clearCloseTimer("right");
    },
    []
  );

  useEffect(() => {
    const anyOpen = !!(leftMenu || rightMenu);
    if (!anyOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (lastSideRef.current) closeSide(lastSideRef.current);
      else if (rightMenu) closeSide("right");
      else if (leftMenu) closeSide("left");
    };
    const onWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".dining-menu-card-body")) return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [leftMenu, rightMenu, closeSide]);

  const openMenuIds = new Set<string>();
  if (leftMenu) openMenuIds.add(leftMenu.id);
  if (rightMenu) openMenuIds.add(rightMenu.id);

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
    <div
      className={`dining${leftMenu || rightMenu ? " dining--menu-open" : ""}`}
    >
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
      {leftMenu && (
        <MealMenuCard openMenu={leftMenu} onClose={() => closeSide("left")} />
      )}
      {rightMenu && (
        <MealMenuCard openMenu={rightMenu} onClose={() => closeSide("right")} />
      )}
    </div>
  );
};

export default App;
