// React imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFeatureFlag } from "../../../lib/featureFlagSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const featureFlagState = useSelector((state) => state.featureFlagState);

  const handleToggle = (flag) => {
    dispatch(toggleFeatureFlag(flag));
  };

  return (
    <div>
      <p>dashboard</p>
      {Object.entries(featureFlagState).map(([key, value]) =>
        key[0] === "_" ? null : (
          <button key={key} onClick={() => handleToggle(key)}>
            {value
              ? "Toggle " + key.slice(6, key.length) + " Off"
              : "Toggle " + key.slice(6, key.length) + " On"}
          </button>
        )
      )}
    </div>
  );
};

// return (
//   <div>
//     <p>Enable About: {String(enableAbout)}</p>
//     <button onClick={handleToggleAbout}>Toggle Enable About</button>
//   </div>
// );
// };

export default Dashboard;
