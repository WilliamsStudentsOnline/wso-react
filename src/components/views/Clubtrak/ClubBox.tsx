// React imports
import React, { useState, useEffect } from "react";
import "../../stylesheets/ClubBox.css";
import { Line } from "../../Skeleton";

// Additional imports
import { Link } from "react-router-dom";

const ClubBox = ({ club }: { club: { name: string; initials: string } }) => {
  return (
    <div className="club-box">
      <div className="club-initials">{club.initials}</div>
      <div className="club-name">{club.name}</div>
    </div>
  );
};

export default ClubBox;
