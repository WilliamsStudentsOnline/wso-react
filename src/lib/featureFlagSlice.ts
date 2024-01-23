import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// const API_ADDRESS = "http://localhost:8080";

export enum FFState {
  Enabled = "Enabled",
  Disabled = "Disabled",
}

export interface FeatureFlag {
  enableAbout: FFState;
  enableWiki: FFState;
  enableFAQ: FFState;

  // Add more feature flags as needed
}

export const initialState: FeatureFlag = {
  enableAbout: FFState.Enabled,
  enableWiki: FFState.Enabled,
  enableFAQ: FFState.Enabled,
};

const featureFlagSlice = createSlice({
  name: "featureFlags",
  initialState,
  reducers: {
    updateFeatureFlag: (
      state,
      action: PayloadAction<{ flag: keyof FeatureFlag; value: FFState }>
    ) => {
      const { flag, value } = action.payload;
      if (flag in state) {
        state[flag] = value;
      }
    },
  },
});

export const { updateFeatureFlag } = featureFlagSlice.actions;

// export const getFeatureFlag = (state: FeatureFlagsState, flag: keyof FeatureFlagsState) => featureFlagsState[flag];

export default featureFlagSlice.reducer;
