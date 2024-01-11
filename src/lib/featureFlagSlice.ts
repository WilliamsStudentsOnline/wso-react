import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// const API_ADDRESS = "http://localhost:8080";

interface FeatureFlagsState {
  enableAbout: boolean;
  enableWiki: boolean;
  enableFAQ: boolean;

  // Add more feature flags as needed
}

export const initialState: FeatureFlagsState = {
  enableAbout: false,
  enableWiki: false,
  enableFAQ: false,

  // Initialize other feature flags
};

const featureFlagSlice = createSlice({
  name: "featureFlags",
  initialState,
  reducers: {
    toggleFeatureFlag: (
      state,
      action: PayloadAction<keyof FeatureFlagsState>
    ) => {
      const flagKey = action.payload;
      if (flagKey in state) {
        state[flagKey] = !state[flagKey];
      }
    },
  },
});

export const { toggleFeatureFlag } = featureFlagSlice.actions;

// export const getFeatureFlag = (state: FeatureFlagsState, flag: keyof FeatureFlagsState) => featureFlagsState[flag];

export default featureFlagSlice.reducer;
