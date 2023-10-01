// React imports
import React, { useState, useEffect } from "react";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const BooktrakLayout = ({ children }: { children: React.ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, updateQuery] = useState("");

  useEffect(() => {
    if (searchParams?.get("q")) {
      updateQuery(searchParams.get("q") ?? "");
    } else {
      updateQuery("");
    }
  }, [searchParams]);

  // Handles submissions
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    searchParams.set("q", query);
    navigateTo(`/booktrak?${searchParams.toString()}`);
  };

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
            <li>
              <Link to="/booktrak/create">Create Listings</Link>
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
        <form onSubmit={submitHandler}>
          <input
            id="search"
            type="search"
            placeholder="Search Booktrak"
            autoFocus
            onChange={(event) => updateQuery(event.target.value)}
            value={query}
          />
          <input
            data-disable-with="Search"
            type="submit"
            value="Search"
            className="submit"
          />
        </form>
      </header>
      {children}
    </div>
  );
};

export default BooktrakLayout;
