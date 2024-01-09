// React imports
import React from "react";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { NavLink } from "react-router-dom";
import "../../stylesheets/Booktrak.css";

const BooktrakLayout = ({ children }: { children: React.ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);

  const applyActiveLinkStyling = ({
    isActive,
  }: {
    isActive: boolean;
  }): string => (isActive ? "booktrak-active-link" : "");

  return (
    <div className="facebook">
      <header>
        <div className="page-head">
          <h1>
            <NavLink to="/booktrak">Booktrak</NavLink>
          </h1>
          <ul>
            <li>
              <NavLink to="/booktrak" className={applyActiveLinkStyling} end>
                Search Books
              </NavLink>
            </li>
            <li>
              <NavLink to="/booktrak/buy" className={applyActiveLinkStyling}>
                Buy Listings
              </NavLink>
            </li>
            <li>
              <NavLink to="/booktrak/sell" className={applyActiveLinkStyling}>
                Sell Listings
              </NavLink>
            </li>
            {currUser === null
              ? null
              : [
                  <li key="edit">
                    <NavLink
                      to="/booktrak/edit"
                      className={applyActiveLinkStyling}
                    >
                      My Listings
                    </NavLink>
                  </li>,
                ]}
          </ul>
        </div>
      </header>
      {children}
    </div>
  );
};

export default BooktrakLayout;
