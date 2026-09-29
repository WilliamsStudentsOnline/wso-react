// React Imports
import React, { useEffect, useState } from "react";

// Redux imports
import {
  getWSO,
  getCurrUser,
  getAuthReady,
  removeCredentials,
} from "../lib/authSlice";
import { useAppSelector, useAppDispatch } from "../lib/store";

// External imports
import { Link } from "react-router-dom";
import history from "../lib/history";
import { userTypeStudent } from "../constants/general";
import { useTheme } from "../lib/ThemeProvider";
import { themePreferenceLabel, ThemePreference } from "../lib/theme";

const themeIcon = (preference: ThemePreference): string => {
  if (preference === "light") return "light_mode";
  if (preference === "dark") return "dark_mode";
  return "brightness_auto";
};

const NavSkeletonLink = ({ label }: { label: string }) => (
  <li aria-hidden="true">
    <span className="nav-skeleton-link">{label}</span>
  </li>
);

const Nav = () => {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector(getCurrUser);
  const authReady = useAppSelector(getAuthReady);
  const wso = useAppSelector(getWSO);
  const { preference, cyclePreference } = useTheme();

  const [menuVisible, updateMenuVisibility] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<
    "games" | "more" | "user" | null
  >(null);
  const [userPhoto, updateUserPhoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    let photoUrl: string | undefined;
    let cancelled = false;

    const loadPhoto = async () => {
      if (!currUser) {
        return;
      }
      try {
        const photoResponse = await wso.userService.getUserThumbPhoto(
          currUser.unixID
        );
        if (cancelled) {
          return;
        }
        photoUrl = URL.createObjectURL(photoResponse);
        updateUserPhoto(photoUrl);
      } catch {
        // Do nothing - it's okay to gracefully handle this.
      }
    };

    if (!authReady) {
      updateUserPhoto(undefined);
      return undefined;
    }

    if (currUser) {
      loadPhoto();
    } else {
      updateUserPhoto(undefined);
    }

    updateMenuVisibility(false);
    setOpenDropdown(null);

    return () => {
      cancelled = true;
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [authReady, currUser, wso]);

  const logout = () => {
    dispatch(removeCredentials());
  };

  const toggleDropdown = (id: "games" | "more" | "user") => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const renderFactrakSlot = () => {
    if (!authReady) {
      return <NavSkeletonLink label="Factrak" />;
    }
    if (currUser?.type === userTypeStudent) {
      return (
        <li>
          <Link to="factrak">Factrak</Link>
        </li>
      );
    }
    return null;
  };

  const renderAccountControls = () => {
    if (!authReady) {
      return (
        <span className="nav-user-toggle nav-skeleton-user" aria-hidden="true">
          <span className="avatar">
            <span className="nav-skeleton-circle" />
          </span>
          <i className="material-icons nav-user-caret" aria-hidden="true">
            expand_more
          </i>
        </span>
      );
    }

    if (currUser?.id) {
      return (
        <>
          <a
            href="#"
            className="dropbtn nav-user-toggle"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown("user");
            }}
          >
            <span className="avatar">
              {userPhoto ? (
                <img src={userPhoto} alt="avatar" />
              ) : (
                <span className="nav-skeleton-circle" aria-hidden="true" />
              )}
            </span>
            <i className="material-icons nav-user-caret" aria-hidden="true">
              expand_more
            </i>
          </a>
          <ul className="dropdown-content">
            <li>
              <Link to={`/facebook/users/${currUser.id}`}>Profile</Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  logout();
                  history.go(0);
                }}
                to="/"
              >
                Logout
              </Link>
            </li>
          </ul>
        </>
      );
    }

    return (
      <Link to="login" className="nav-user-toggle nav-login-link">
        Login
      </Link>
    );
  };

  return (
    <nav className="site-nav">
      <div className="nav-container">
        <span className="nav-left-container">
          <a
            href="#top"
            type="button"
            id="nav-menu-button"
            onClick={(event) => {
              event.preventDefault();
              updateMenuVisibility(!menuVisible);
            }}
          >
            Menu
          </a>

          <ul
            className="nav-left"
            id="nav-menu-content"
            style={{ display: menuVisible ? "block" : "" }}
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="dining">Dining</Link>
            </li>
            <li>
              <Link to="facebook">Facebook</Link>
            </li>
            {renderFactrakSlot()}
            <li>
              <Link to="schedulecourses">Course Scheduler</Link>
            </li>
            <li>
              <a href="https://listserv-wso.williams.edu">Listserv</a>
            </li>
            <li
              className={`dropdown${openDropdown === "games" ? " open" : ""}`}
            >
              <a
                href="#"
                className="dropbtn"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("games");
                }}
              >
                Games ▾
              </a>
              <ul className="dropdown-content">
                <li>
                  <a href="https://wso.williams.edu/orgs/trivia/index.html">
                    Williams Trivia
                  </a>
                </li>
                <li>
                  <a href="https://wso.williams.edu/bluemap/">Minecraft</a>
                </li>
                <li>
                  <a href="https://warp-wso.williams.edu">Warp Foundry</a>
                </li>
              </ul>
            </li>
            <li className={`dropdown${openDropdown === "more" ? " open" : ""}`}>
              <a
                href="#"
                className="dropbtn"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("more");
                }}
              >
                More ▾
              </a>
              <ul className="dropdown-content">
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <Link to="faq">FAQ</Link>
                </li>
                <li>
                  <a href="https://status-wso.williams.edu">Status</a>
                </li>
                <li>
                  <a href="https://wiki-wso.williams.edu/">Willipedia</a>
                </li>
                <li>
                  <a href="/wiki/">Developer Wiki</a>
                </li>
                <li>
                  <a href="https://github.com/WilliamsStudentsOnline">Github</a>
                </li>
              </ul>
            </li>
          </ul>
        </span>

        <span className="nav-right-container">
          <ul className="nav-right">
            <li
              className={[
                "nav-account",
                authReady && currUser?.id ? "dropdown" : "",
                authReady && currUser?.id && openDropdown === "user"
                  ? "open"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <button
                type="button"
                className="theme-toggle"
                onClick={cyclePreference}
                title={`Theme: ${themePreferenceLabel(
                  preference
                )} (click to cycle Light / Dark / System)`}
                aria-label={`Theme ${themePreferenceLabel(
                  preference
                )}. Click to cycle.`}
              >
                <i className="material-icons" aria-hidden="true">
                  {themeIcon(preference)}
                </i>
              </button>
              {renderAccountControls()}
            </li>
          </ul>
        </span>
      </div>
    </nav>
  );
};

export default Nav;
