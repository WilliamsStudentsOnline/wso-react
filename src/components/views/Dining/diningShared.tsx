import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { MdClose, MdRestaurantMenu } from "react-icons/md";

export const MENU_ANIM_MS = 220;

export interface MealHours {
  open: string;
  close: string;
}
export interface MenuItem {
  name: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}
export interface Course {
  name: string;
  items: MenuItem[];
}
export interface Meal {
  name: string;
  hours: MealHours | null;
  courses: Record<string, Course> | null;
}
export interface Vendor {
  id: string;
  name: string;
  meals: Record<string, Meal>;
  onlineOrder: boolean;
  operating: boolean;
}

export type MenuSide = "left" | "right";

export type OpenMenu = {
  id: string;
  vendorName: string;
  meal: Meal;
  side: MenuSide;
  visible: boolean;
};

/** Canonical meal slots for compact / matrix views. */
export const DINING_MEAL_SLOTS = [
  "breakfast",
  "brunch",
  "lunch",
  "dinner",
  "late night",
] as const;

export type DiningMealSlot = typeof DINING_MEAL_SLOTS[number];

export const parseAndAdjustTime = (
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
  if (modifier.toLowerCase() === "am" && hours === 12) newHours = 0;

  const date = new Date(baseDate);
  date.setHours(newHours, minutes, 0, 0);

  if (isCloseTime && openTimeStr) {
    const openDate = parseAndAdjustTime(openTimeStr, baseDate, false);
    if (date.getTime() <= openDate.getTime()) {
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

export const getMealOrder = (mealName: string): number => {
  const lowerCaseName = mealName.toLowerCase();
  if (lowerCaseName.includes("breakfast")) return 1;
  if (lowerCaseName.includes("brunch")) return 2;
  if (lowerCaseName.includes("lunch") || lowerCaseName.includes("midday"))
    return 3;
  if (lowerCaseName.includes("dinner")) return 4;
  if (
    lowerCaseName.includes("late night") ||
    lowerCaseName.includes("latenight")
  )
    return 5;
  return 99;
};

export const mealSlotForName = (mealName: string): DiningMealSlot | null => {
  const lowerCaseName = mealName.toLowerCase();
  if (lowerCaseName.includes("breakfast")) return "breakfast";
  if (lowerCaseName.includes("brunch")) return "brunch";
  if (lowerCaseName.includes("lunch") || lowerCaseName.includes("midday"))
    return "lunch";
  if (lowerCaseName.includes("dinner")) return "dinner";
  if (
    lowerCaseName.includes("late night") ||
    lowerCaseName.includes("latenight")
  )
    return "late night";
  return null;
};

export const capitalizeMeal = (str: string): string => {
  if (!str) return "";
  return str
    .replaceAll("williams' ", "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const mealSlotLabel = (slot: DiningMealSlot): string =>
  capitalizeMeal(slot);

export const mealMenuId = (vendorId: string, mealKey: string) =>
  `${vendorId}::${mealKey}`;

export const mealHasMenu = (meal: Meal): boolean =>
  !!meal.courses &&
  Object.values(meal.courses).some(
    (course) => !!course.items && course.items.length > 0
  );

/** Vendors to never show, even if present in dining.json. */
export const HIDDEN_VENDOR_IDS = new Set(["goodrich"]);

export const useDiningData = () => {
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

export const MealMenuContent = ({ meal }: { meal: Meal }) => {
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

export const MealMenuCard = ({
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

export const MealMenuButton = ({
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

type DiningMenusMode = "dual" | "left-only";

/**
 * Shared open/close animation + Escape / scroll-lock for dining meal menus.
 * `dual` prefers left/right by click X; `left-only` always uses the left panel.
 */
export const useDiningMenus = (mode: DiningMenusMode = "dual") => {
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
    (id: string, vendorName: string, meal: Meal, clientX = 0) => {
      if (mode === "left-only") {
        if (leftMenu?.id === id) {
          closeSide("left");
          return;
        }
        if (rightMenu) closeSide("right");
        showInSide("left", id, vendorName, meal);
        return;
      }

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
    [mode, leftMenu, rightMenu, closeSide, showInSide]
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

  const menuPanels: ReactNode = (
    <>
      {leftMenu && (
        <MealMenuCard openMenu={leftMenu} onClose={() => closeSide("left")} />
      )}
      {rightMenu && (
        <MealMenuCard openMenu={rightMenu} onClose={() => closeSide("right")} />
      )}
    </>
  );

  return {
    leftMenu,
    rightMenu,
    openMenuIds,
    onToggleMenu,
    closeSide,
    anyOpen: !!(leftMenu || rightMenu),
    menuPanels,
  };
};
