// React imports
import React from "react";
import {
  FFState,
  updateFeatureFlag,
  FeatureFlag,
} from "../../../lib/featureFlagSlice";
import { RootState } from "../../../lib/store";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import "../../stylesheets/Dashboard.css";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const featureFlagState = useAppSelector(
    (state: RootState) => state.featureFlagState
  );

  const setFeatureFlag = (myflag: keyof FeatureFlag, newState: FFState) => {
    dispatch(updateFeatureFlag({ flag: myflag, value: newState }));
  };

  // const enableFAQ = useAppSelector(
  //   (state) => state.featureFlagState["enableFAQ"]
  // );

  return (
    <div className="dash-body">
      <h2 className="text-center" id="logotype">
        Admin Dashboard
      </h2>
      <div className="dash-button-container">
        <h4 className="dash-section" id="tagline">
          Feature Flags
        </h4>

        {Object.entries(featureFlagState).map(
          ([key, value]) =>
            key[0] !== "_" && (
              <div key={key} className="dash-flag">
                <p className="feature-lab">{key.slice(6, key.length)}:</p>
                {Object.entries(FFState).map(([stateKey, stateValue]) => (
                  <button
                    key={key + stateKey}
                    id={value === stateValue ? "dash-hot" : "dash-cold"}
                    className={"dash-button"}
                    onClick={() =>
                      // console.log(value, stateValue)
                      setFeatureFlag(
                        key as keyof FeatureFlag,
                        stateKey as FFState
                      )
                    }
                  >
                    {"Set " + stateKey}
                  </button>
                ))}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
