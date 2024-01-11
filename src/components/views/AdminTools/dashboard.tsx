// React imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFeatureFlag } from "../../../lib/featureFlagSlice";
import { RootState } from "../../../lib/store";
import Error403 from "../Errors/Error403";
import { getCurrUser } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";

const Dashboard = () => {
  const dispatch = useDispatch();
  const featureFlagState = useSelector(
    (state: RootState) => state.featureFlagState
  );
  const currUser = useAppSelector(getCurrUser);

  const handleToggle = (flag: any) => {
    dispatch(toggleFeatureFlag(flag));
  };

  return (
    <div>
      {currUser?.admin || currUser?.id === 13268 ? (
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
      ) : (
        <Error403 />
      )}
    </div>
  );
};

export default Dashboard;
