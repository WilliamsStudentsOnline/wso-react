// React imports
import React from "react";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { Link } from "react-router-dom";

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
              <Link to="/booktrak">Search Books</Link>
            </li>
            <li>
              <Link to="/booktrak/buy">Buy Listings</Link>
            </li>
            <li>
              <Link to="/booktrak/sell">Sell Listings</Link>
            </li>
            {currUser === null
              ? null
              : [
                  <li key="edit">
                    <Link to="/booktrak/edit"> My Listings </Link>
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
