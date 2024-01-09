// React imports
import React from "react";
import { FeatureFlags } from "../../FeatureFlags"; // Import the context, not the provider

const Dashboard = () => {
  const { features, toggleFlag } = React.useContext(FeatureFlags); // Extract toggleFlag

  return (
    <div>
      <p>dashboard</p>
      {Object.entries(features).map(([key, value]) => (
        <button key={key} onClick={() => toggleFlag(key)}>
          {value ? "Toggle " + key + " Off" : "Toggle " + key + " On"}
        </button>
      ))}
    </div>
  );
};

export default Dashboard;
