import React, { useState, useEffect } from "react";
// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { StylizedLink } from "../../StylizedLink";
import { PostType } from "../../../lib/types";

// Component imports
import ClubBox from "./ClubBox";

// List of clubs (delete later and link to database/API)
const clubs = [
  { name: "Robotics", initials: "R" },
  { name: "Debate", initials: "D" },
  { name: "Williams Outing Club", initials: "WOC" },
  { name: "Williams Students Online", initials: "WSO" },
  { name: "Ritmo", initials: "R" },
];

const ClubtrakLayout = ({ children }: { children: React.ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, updateQuery] = useState("");

  // Handles submissions
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    searchParams.set("q", query);
    //TODO: Check routing system
    navigateTo(`/clubtrak?${searchParams.toString()}`);
  };

  return (
    <div className="clubtrak">
      <header>
        <div className="page-head">
          <h1>
            <Link to="/clubtrak">Clubtrak</Link>
          </h1>
        </div>
        <form onSubmit={submitHandler}>
          <input
            id="search"
            type="search"
            placeholder="Search Clubtrak"
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
      <article>
        <section>
          <div className="club-list">
            {clubs.map((club) => (
              <ClubBox key={club.name} club={club} />
            ))}
          </div>
        </section>
      </article>
      {children}
    </div>
  );
};

export default ClubtrakLayout;
