// React imports
import React from "react";
// import { useDispatch, useSelector } from "react-redux";
import { toggleFeatureFlag } from "../../../lib/featureFlagSlice";
import { RootState } from "../../../lib/store";
import { useAppDispatch, useAppSelector } from "../../../lib/store";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const featureFlagState = useAppSelector(
    (state: RootState) => state.featureFlagState
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleToggle = (flag: any) => {
    dispatch(toggleFeatureFlag(flag));
  };

  return (
    <div>
      <p>Dashboard</p>
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

export default Dashboard;
