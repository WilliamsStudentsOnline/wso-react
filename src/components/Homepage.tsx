// React imports
import React from "react";

// Component imports
import "./stylesheets/Homepage.css";
import BulletinBox from "./views/BulletinsDiscussions/BulletinBox";

import { PostType } from "../lib/types";
import LibraryHoursTable from "./LibraryHours";
import HomepageDiningHours from "./HomepageDiningHours";

const Homepage = () => {
  const joinHeaderText = "Install the new WSO Mobile iOS app!"; // EDIT THIS (OR SET TO "") TO TOGGLE JOIN HEADER
  const joinHeaderLink =
    "https://apps.apple.com/us/app/wso-mobile-rewritten/id6755857250";

  return (
    <div className="home">
      <div className="full-width">
        {joinHeaderText && (
          <div id="join-header" className="home-notice">
            <span className="list-date home-notice-badge">New</span>
            <span className="home-notice-copy">
              <span className="home-notice-title">{joinHeaderText}</span>
              <a
                className="home-notice-sub"
                href={joinHeaderLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Click to download on the App Store
              </a>
            </span>
          </div>
        )}
        <header>
          <div className="logo">
            <h2 className="text-center" id="logotype">
              WSO
            </h2>
            <h4 className="text-center" id="tagline">
              <i>By Students, For Students!</i>
            </h4>
          </div>
        </header>
        <article className="home-hours-row">
          <LibraryHoursTable />
          <HomepageDiningHours />
        </article>
        <article>
          <section>
            <h3 className="home-bulletins-heading">Bulletin</h3>
            <div className="bulletin-list">
              {Object.values(PostType).map((type) => (
                <BulletinBox type={type} key={type} />
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default Homepage;
