// React imports
import React from "react";
// import { useDispatch, useSelector } from "react-redux";
import { FFState, toggleFeatureFlag } from "../../../lib/featureFlagSlice";
import { RootState } from "../../../lib/store";
import { useAppDispatch, useAppSelector } from "../../../lib/store";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const featureFlagState = useAppSelector(
    (state: RootState) => state.featureFlagState
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleToggle = (myflag: any, newState: FFState) => {
    dispatch(toggleFeatureFlag({ flag: myflag, value: newState }));
  };

  return (
    <div>
      <p>Dashboard</p>
      {Object.entries(featureFlagState).map(
        ([key, value]) =>
          !(key[0] === "_") && (
            <div key={key}>
              {Object.entries(FFState).map(([stateKey, stateValue]) => (
                <button
                  key={key + stateKey}
                  onClick={() => handleToggle(key, stateKey as FFState)}
                >
                  {"Set " + key.slice(6, key.length) + " to " + stateKey}
                </button>
              ))}
            </div>
          )
      )}
    </div>
  );
};

export default Dashboard;
