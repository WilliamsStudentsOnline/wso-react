// React imports
import React, { useEffect, useState } from "react";

// Component imports
import "./stylesheets/Homepage.css";
import BulletinBox from "./views/BulletinsDiscussions/BulletinBox";

// Redux Imports
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../lib/store";
import { getWSO } from "../lib/authSlice";
import { PostType } from "../lib/types";
import LibraryHoursTable from "./LibraryHours";
import HomepageDiningHours from "./HomepageDiningHours";
import MountainDayStill from "../assets/images/banners/MountainDayStill.png";
import MountainDayAnimated from "../assets/images/banners/MountainDay.png";
import { BannerBanner } from "wso-api-client/lib/services/types";

const BANNER_DISMISS_KEY = "wso-homepage-banner-dismissed";
const isMountainDay = false; // EDIT THIS TO TOGGLE MOUNTAIN DAY HEADER

const bannerFingerprint = (banner: BannerBanner) =>
  JSON.stringify({
    text: banner.text ?? "",
    link: banner.link ?? "",
    sub: banner.sub ?? "",
    type: banner.type ?? "",
  });

const readDismissedFingerprint = (): string | null => {
  try {
    return localStorage.getItem(BANNER_DISMISS_KEY);
  } catch {
    return null;
  }
};

const writeDismissedFingerprint = (fingerprint: string) => {
  try {
    localStorage.setItem(BANNER_DISMISS_KEY, fingerprint);
  } catch {
    // ignore quota / private mode
  }
};

const badgeLabel = (type?: string) => (type === "emergency" ? "Alert" : "New");

const Homepage = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [mountainDayPlaying, setMountainDayPlaying] = useState(false);
  const [banner, setBanner] = useState<BannerBanner | null>(null);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (searchInputValue.trim()) {
      navigateTo(`/facebook?q=${encodeURIComponent(searchInputValue.trim())}`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
  };

  useEffect(() => {
    let isMounted = true;

    const loadBanner = async () => {
      try {
        const response = await wso.bannerService.getBanner();
        const data = response.data;
        if (!isMounted || !data?.visible || !data.text) return;
        if (
          data.type === "dismissible" &&
          readDismissedFingerprint() === bannerFingerprint(data)
        ) {
          return;
        }
        setBanner(data);
      } catch {
        // Keep homepage usable if banner fetch fails
      }
    };

    loadBanner();
    return () => {
      isMounted = false;
    };
  }, [wso]);

  useEffect(() => {
    if (!isMountainDay) return;
    const img = new Image();
    img.src = MountainDayAnimated;
  }, []);

  const dismissBanner = () => {
    if (!banner) return;
    writeDismissedFingerprint(bannerFingerprint(banner));
    setBanner(null);
  };

  const noticeClass =
    banner?.type === "emergency"
      ? "home-notice home-notice--emergency"
      : "home-notice";

  return (
    <div className="home">
      <div className="full-width">
        {banner && (
          <div id="join-header" className={noticeClass}>
            <span className="home-notice-badge">{badgeLabel(banner.type)}</span>
            <span className="home-notice-copy">
              <span className="home-notice-title">{banner.text}</span>
              {banner.sub &&
                (banner.link ? (
                  <a
                    className="home-notice-sub"
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {banner.sub}
                  </a>
                ) : (
                  <span className="home-notice-sub">{banner.sub}</span>
                ))}
            </span>
            {banner.type === "dismissible" && (
              <button
                type="button"
                className="home-notice-dismiss"
                aria-label="Dismiss banner"
                onClick={dismissBanner}
              >
                ×
              </button>
            )}
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
