// React imports
import React, { useState } from "react";

// Component imports
import "./stylesheets/Homepage.css";
import BulletinBox from "./views/BulletinsDiscussions/BulletinBox";

// Redux Imports
import { useNavigate } from "react-router-dom";
import { PostType } from "../lib/types";
import LibraryHoursTable from "./LibraryHours";

const Homepage = () => {
  const navigateTo = useNavigate();
  const [searchInputValue, setSearchInputValue] = useState("");

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (searchInputValue.trim()) {
      navigateTo(`/facebook?q=${encodeURIComponent(searchInputValue.trim())}`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
  };

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
          <br />
          <div className="search-bar">
            <form onSubmit={submitHandler}>
              <input
                aria-label="Search box for Facebook"
                type="search"
                placeholder="Search Facebook..."
                value={searchInputValue}
                onChange={handleInputChange}
              />
              <input
                data-disable-with="Search"
                type="submit"
                value="Search"
                className="submit"
              />
            </form>
          </div>
        </header>
        <article>
          <LibraryHoursTable />
        </article>
        <article>
          <section>
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
