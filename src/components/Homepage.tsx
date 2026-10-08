// React imports
import React, { useEffect, useState } from "react";

// Component imports
import "./stylesheets/Homepage.css";
import BulletinBox from "./views/BulletinsDiscussions/BulletinBox";

// Redux Imports
import { Link, useNavigate } from "react-router-dom";
import { PostType } from "../lib/types";
import LibraryHoursTable from "./LibraryHours";
import HomepageDiningHours from "./HomepageDiningHours";
import MountainDayStill from "../assets/images/banners/MountainDayStill.png";
import MountainDayAnimated from "../assets/images/banners/MountainDay.png";

const Homepage = () => {
  const navigateTo = useNavigate();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [mountainDayPlaying, setMountainDayPlaying] = useState(false);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (searchInputValue.trim()) {
      navigateTo(`/facebook?q=${encodeURIComponent(searchInputValue.trim())}`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
  };

  const joinHeaderText = ""; // EDIT THIS (OR SET TO "") TO TOGGLE JOIN HEADER
  const joinHeaderLink =
    "https://apps.apple.com/us/app/wso-mobile-rewritten/id6755857250";
  const isMountainDay = true; // EDIT THIS TO TOGGLE MOUNTAIN DAY HEADER

  useEffect(() => {
    if (!isMountainDay) return;
    const img = new Image();
    img.src = MountainDayAnimated;
  }, [isMountainDay]);

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
          {isMountainDay ? (
            <div
              className="home-mountain-day"
              aria-label="Mountain Day"
              onMouseEnter={() => {
                if (
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ) {
                  return;
                }
                setMountainDayPlaying(true);
              }}
              onMouseLeave={() => setMountainDayPlaying(false)}
            >
              <img
                src={
                  mountainDayPlaying ? MountainDayAnimated : MountainDayStill
                }
                alt="Mountain Day — purple cows celebrating in the mountains"
              />
            </div>
          ) : (
            <div className="logo">
              <h2 className="text-center" id="logotype">
                WSO
              </h2>
              <h4 className="text-center" id="tagline">
                <i>By Students, For Students!</i>
              </h4>
            </div>
          )}
          <br />
          <div
            className={`search-bar${
              isMountainDay ? " search-bar--with-caption" : ""
            }`}
          >
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
            {isMountainDay && (
              <p className="home-mountain-day-caption">
                Artwork courtesy of{" "}
                <Link to="/facebook/users/15462">Moira Ford &apos;28</Link>.
                Want your art featured on WSO? Email{" "}
                <a href="mailto:cmt8@williams.edu">cmt8</a>!
              </p>
            )}
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
