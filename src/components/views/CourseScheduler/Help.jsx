// React imports
import React from "react";

// Component imports
import "../../stylesheets/Help.css";
import { UPDATE_DATE } from "../../../constants/constants.json";

const Help = () => {
  return <div className="help">{`Last Updated at ${UPDATE_DATE}`}</div>;
};

export default Help;
