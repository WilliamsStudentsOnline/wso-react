// React Imports
import React, { useEffect, useState } from "react";

// Redux imports
import { getWSO, getCurrUser } from "../lib/authSlice";
import { removeCredentials } from "../lib/authSlice";
import { useAppSelector, useAppDispatch } from "../lib/store";

// External imports
import { Link } from "react-router-dom";
import history from "../lib/history";
import { userTypeStudent } from "../constants/general";

const Nav = () => {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);

  const [menuVisible, updateMenuVisibility] = useState(false);
  const [userPhoto, updateUserPhoto] = useState<string | undefined>(undefined);
  const [ephmatchVisibility, updateEphmatchVisibility] = useState(0);
  // 0 - off, 1 - on, 2 - senior only

  useEffect(() => {
    const loadPhoto = async () => {
      if (!currUser) {
        return;
      }
      try {
        const photoResponse = await wso.userService.getUserThumbPhoto(
          currUser.unixID
        );
        updateUserPhoto(URL.createObjectURL(photoResponse));
      } catch {
        // Do nothing - it's okay to gracefully handle this.
      }
    };

    const checkEphmatchVisibility = async () => {
      try {
        const ephmatchAvailabilityResp =
          await wso.ephmatchService.getAvailability();

        if (
          ephmatchAvailabilityResp?.data?.available ||
          (ephmatchAvailabilityResp?.data?.nextOpenTime &&
            new Date(ephmatchAvailabilityResp?.data?.nextOpenTime).valueOf() -
              new Date().valueOf() <
              4 * 604800000) // used to be 1 week: 604800000. Now 4 weeks: 3024000000
        ) {
          if (ephmatchAvailabilityResp?.data?.seniorOnly) {
            updateEphmatchVisibility(2);
          } else {
            updateEphmatchVisibility(1);
          }
        }
      } catch {
        // Do nothing - it's okay to gracefully handle this.
      }
    };

    if (currUser) {
      loadPhoto();
      checkEphmatchVisibility();
    } else {
      updateEphmatchVisibility(0);
    }

    updateMenuVisibility(false);
  }, [currUser, wso]);

  const logout = () => {
    dispatch(removeCredentials());
  };

  return (
    <nav>
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
            <li>
              <Link to="booktrak">Booktrak</Link>
            </li>
            {currUser?.type === userTypeStudent && (
              <>
                <li>
                  <Link to="factrak">Factrak</Link>
                </li>
                <li>
                  <Link to="dormtrak">Dormtrak</Link>
                </li>
              </>
            )}

            <li>
              <Link to="faq">FAQ</Link>
            </li>

            <li>
              <Link to="schedulecourses">Course Scheduler</Link>
            </li>
            <li
              className="dropdown"
              onClick={(e) => e.currentTarget.classList.toggle("open")}
            >
              <a href="#" className="dropbtn">
                more ▾
              </a>
              <ul className="dropdown-content">
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="https://status-wso.williams.edu">Status</a>
                </li>
                <li>
                  <a href="/wiki/">Willipedia (OLD)</a>
                </li>
                <li>
                  <a href="https://wiki-wso.williams.edu/">Willipedia (NEW)</a>
                </li>
                <li>
                  <a href="https://wso-vm-a10.williams.edu/bluemap/">
                    Minecraft
                  </a>
                </li>

                <li>
                  <a href="https://warp-wso.williams.edu">WARP Foundry</a>
                </li>
                <li>
                  <a href="https://github.com/WilliamsStudentsOnline">
                    WSO Github
                  </a>
                </li>
              </ul>
            </li>
            {ephmatchVisibility > 0 && (
              <li>
                <Link
                  className="ephmatch-link"
                  style={{ color: "#fff238" }}
                  to="ephmatch"
                >
                  {ephmatchVisibility === 2 ? "Senior " : ""}Ephmatch
                </Link>
              </li>
            )}
            {/* userScopes &&
              scopesContainsOneOfScopes(userScopes, [scopes.ScopeGoodrich]) && (
                <>
                  <li>
                    <Link routeName="goodrich">Goodrich</Link>
                  </li>
                </>
              ) */}
          </ul>
        </span>

        <span className="nav-right-container">
          <ul className="nav-right">
            {currUser?.id ? (
              <>
                <li className="avatar">
                  <Link to={`/facebook/users/${currUser.id}`}>
                    <img src={userPhoto} alt="avatar" />
                  </Link>
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
              </>
            ) : (
              <li>
                <Link to="login">Login</Link>
              </li>
            )}
          </ul>
        </span>
      </div>
    </nav>
  );
};

export default Nav;
