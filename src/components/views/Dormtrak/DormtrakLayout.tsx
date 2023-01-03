// React imports
import React, { useState, useEffect, ReactElement } from "react";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { Link, useNavigate } from "react-router-dom";
import { ModelsNeighborhood } from "wso-api-client/lib/services/types";

const DormtrakLayout = ({ children }: { children: ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [neighborhoods, updateNeighborhoods] = useState<ModelsNeighborhood[]>(
    []
  );
  const [query, updateQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadNeighborhoods = async () => {
      try {
        const neighborhoodsResponse =
          await wso.dormtrakService.listNeighborhoods();
        if (isMounted && neighborhoodsResponse.data) {
          updateNeighborhoods(neighborhoodsResponse.data);
        }
      } catch {
        // It's alright to handle this gracefully without showing them.
      }
    };

    loadNeighborhoods();

    return () => {
      isMounted = false;
    };
  }, [wso]);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    navigateTo(`/dormtrak/search?q=${query}`, { replace: true });
  };

  if (currUser) {
    return (
      <>
        <header>
          <div className="page-head">
            <h1>
              <Link to="/dormtrak">Dormtrak</Link>
            </h1>
            <ul>
              <li>
                <Link to="/dormtrak">Home</Link>
              </li>
              <li>
                <Link to="/dormtrak/policy">Policy</Link>
              </li>
              <li>
                <a
                  href="http://student-life.williams.edu"
                  title="Office of Campus Life"
                >
                  OCL
                </a>
              </li>
              {neighborhoods.map((neighborhood) =>
                neighborhood.name !== "First-year" &&
                neighborhood.name !== "Co-op" ? (
                  <li key={neighborhood.name}>
                    <Link
                      to={`/dormtrak/neighborhoods/${neighborhood.id}`}
                      title={`${neighborhood.name} Neighborhood Dorms`}
                    >
                      {neighborhood.name}
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </div>

          <form onSubmit={(event) => submitHandler(event)}>
            <input
              type="search"
              id="search"
              placeholder="Enter all or part of a building's name"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
            />
            <input
              type="submit"
              value="Search"
              className="submit"
              data-disable-with="Search"
            />
          </form>
        </header>
        {children}
      </>
    );
  }

  // Just to handle weird cases (when API Token is loaded, but user is not)
  return null;
};

export default DormtrakLayout;
