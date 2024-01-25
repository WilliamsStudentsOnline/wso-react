// React imports
import React from "react";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { Link } from "react-router-dom";
import { StylizedLink } from "../../StylizedLink";

const BooktrakLayout = ({ children }: { children: React.ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);

  return (
    <div className="facebook">
      <header>
        <div className="page-head">
          <h1>
            <Link to="/booktrak">Booktrak</Link>
          </h1>
          <ul>
            <li>
              <StylizedLink to="/booktrak" end>
                Search Books
              </StylizedLink>
            </li>
            <li>
              <StylizedLink to="/booktrak/buy">Buy Listings</StylizedLink>
            </li>
            <li>
              <StylizedLink to="/booktrak/sell">Sell Listings</StylizedLink>
            </li>
            {currUser === null
              ? null
              : [
                  <li key="edit">
                    <StylizedLink to="/booktrak/edit">My Listings</StylizedLink>
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
