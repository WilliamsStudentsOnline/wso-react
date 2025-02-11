// React imports
import React, { useState, useEffect } from "react";
import "../../stylesheets/Dining.css";

interface MealHours {
  open: string;
  close: string;
}

interface Meal {
  name: string;
  hours: MealHours | null;
}

interface Vendor {
  name: string;
  meals: Record<string, Meal>;
}

const DiningHours = () => {
  // Variables for Dining JSON and Loading state
  const [diningData, setDiningData] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetches Dining JSON, sets diningData to JSON object
  const getDiningDataInfo = async () => {
    try {
      const response = await fetch("https://wso.williams.edu/dining.json");

      if (!response.ok) {
        throw new Error("Couldn't fetch dining JSON.");
      }

      const responseJSON = await response.json();
      return responseJSON.vendors;
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Returns style class name for color and open/close/opening/closing message
  const findClosestTime = (
    vendorMeals: Record<string, Meal>
  ): { style: string; message: string } => {
    const currentTime = new Date();
    let timeStr = "";
    let style = "";
    let lastTime = null;

    for (const meal of Object.values(vendorMeals)) {
      // Meal has no hours object
      if (!meal.hours) continue;

      const closeTimeStr = meal.hours.close;
      const [time, modifier] = closeTimeStr.split(/(am|pm)/);
      const [hours, minutes] = time.split(":").map(Number);

      let newHours = hours;

      if (modifier === "pm" && hours !== 12) {
        newHours += 12;
      }

      const closeDateTime = new Date();
      closeDateTime.setHours(newHours, minutes, 0);

      const openTimeStr = meal.hours.open;
      const [openTime, openModifier] = openTimeStr.split(/(am|pm)/);
      const [openHours, openMinutes] = openTime.split(":").map(Number);

      let newOpenHours = openHours;

      if (openModifier === "pm" && openHours !== 12) {
        newOpenHours += 12;
      }

      const openDateTime = new Date();
      openDateTime.setHours(newOpenHours, openMinutes, 0);

      if (
        closeDateTime > currentTime &&
        (!lastTime || lastTime > openDateTime)
      ) {
        if (
          openDateTime > currentTime &&
          (openDateTime.valueOf() - currentTime.valueOf()) / 1000 / 60 < 60
        ) {
          timeStr =
            "Opens in " +
            Math.round(
              (openDateTime.valueOf() - currentTime.valueOf()) / 1000 / 60
            ) +
            " minutes.";
          style = "Opening";
          lastTime = openDateTime;
        } else if (openDateTime > currentTime) {
          timeStr = "Closed";
          style = "Closed";
          lastTime = openDateTime;
        } else if (
          (closeDateTime.valueOf() - currentTime.valueOf()) / 1000 / 60 <
          60
        ) {
          timeStr =
            "Closes in " +
            Math.round(
              (closeDateTime.valueOf() - currentTime.valueOf()) / 1000 / 60
            ) +
            " minutes.";
          style = "Closing";
          lastTime = openDateTime;
        } else {
          return { style: "Open", message: "Open" };
        }
      }
    }

    if (timeStr === "") return { style: "Closed", message: "Closed" };
    return { style, message: timeStr };
  };

  // Capitalizes meal name for aesthetic
  const capitalizeMeal = (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Loading effect to give time to fetch dining JSON
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getDiningDataInfo();
      if (data) {
        setDiningData(data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h3 className="refresh-info">
        Dining menus refresh every day at 2:00am.
      </h3>
      {loading && <p>Loading...</p>}
      <div className="all-dining-table">
        {Object.keys(diningData).length > 0 ? (
          Object.entries(diningData).map(([key, vendor], i) => {
            const { style, message } = findClosestTime(vendor.meals);
            return (
              <div key={i} className="table-with-text">
                <p className="dining-hall-text">
                  <b>{vendor.name} · </b>
                  <span className={style}>{message}</span>
                </p>
                <table className="dining-table-container">
                  <thead className="hours-title">
                    <tr>
                      <th colSpan={2}>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(vendor.meals).length > 0 ? (
                      Object.entries(vendor.meals).map(([key, meal], j) => (
                        <tr key={j} className="dining-children">
                          <td>{capitalizeMeal(meal.name)}</td>
                          <td>
                            {meal.hours
                              ? `${meal.hours.open} - ${meal.hours.close}`
                              : "No Times."}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2}>No meals to show.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })
        ) : (
          <p>No dining information available.</p>
        )}
      </div>
    </div>
  );
};

export default DiningHours;
