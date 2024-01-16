// React imports
import React from "react";
import {
  FFState,
  toggleFeatureFlag,
  FeatureFlag,
} from "../../../lib/featureFlagSlice";
import { RootState } from "../../../lib/store";
import { useAppDispatch, useAppSelector } from "../../../lib/store";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const featureFlagState = useAppSelector(
    (state: RootState) => state.featureFlagState
  );

  const setFeatureFlag = (myflag: keyof FeatureFlag, newState: FFState) => {
    dispatch(toggleFeatureFlag({ flag: myflag, value: newState }));
  };

  return (
    <div>
      <p>Dashboard</p>
      {Object.entries(featureFlagState).map(([key, value]) => (
        <div key={key}>
          {Object.entries(FFState).map(([stateKey, stateValue]) => (
            <button
              key={key + stateKey}
              onClick={() =>
                setFeatureFlag(key as keyof FeatureFlag, stateKey as FFState)
              }
            >
              {"Set " + key.slice(6, key.length) + " to " + stateKey}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
