import React from "react";
import { features } from "./FeatureFlagsConfig";

// TODO: Resets to default on fail?

export const fetchFeatures = async () => {
  return Promise.resolve({ features });
};

// export const FeatureFlags = React.createContext({});

export const FeatureFlags = React.createContext<{
  features: Record<string, boolean>;
  toggleFlag: (flagName: string) => void;
}>({
  features: {},
  toggleFlag: () => {
    console.log("failed");
  },
});

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [features, setFeatures] = React.useState({});
  const toggleFlag = (flagName: string) => {
    setFeatures((prevFeatures: Record<string, boolean>) => ({
      ...prevFeatures,
      [flagName]: !prevFeatures[flagName],
    }));
  };

  React.useEffect(() => {
    (async () => {
      try {
        const data = await fetchFeatures();
        if (data.features) {
          setFeatures(data.features);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <FeatureFlags.Provider value={{ features, toggleFlag }}>
      {isLoading ? "Loading..." : children}
    </FeatureFlags.Provider>
  );
};

export const featureFlagComp = (comp: React.ReactElement, flag: string) => {
  return (
    <div>
      {features["enableAbout"] ? (
        { comp }
      ) : (
        <p className="unavaible-feature">Feature not available</p>
      )}
    </div>
  );
};
