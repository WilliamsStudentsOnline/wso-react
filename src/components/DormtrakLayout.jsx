// React imports
import React from "react";
import PropTypes from "prop-types";

const DormtrakLayout = ({ children, neighborhoods, authToken }) => {
  return (
    <>
      <header>
        <div className="page-head">
          <h1>
            <a href="/dormtrak">Dormtrak</a>
          </h1>
          <ul>
            <li>
              <a href="/dormtrak">Home</a>
            </li>
            <li>
              <a href="/dormtrak/policy">Policy</a>
            </li>
            <li>
              <a
                href="http://student-life.williams.edu"
                title="Office of Student Life"
              >
                OSL
              </a>
            </li>
            {neighborhoods.map((neighborhood) =>
              neighborhood.name !== "First-year" &&
              neighborhood.name !== "Co-op" ? (
                <li key={neighborhood.name}>
                  <a
                    href={`/dormtrak/hoods/${neighborhood.name}`}
                    title={`${neighborhood.name} Neighborhood Dorms`}
                  >
                    {neighborhood.name}
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </div>

        <form
          action="/dormtrak/search?method=get"
          acceptCharset="UTF-8"
          method="post"
        >
          <input name="utf8" type="hidden" value="✓" />
          <input type="hidden" name="authenticity_token" value={authToken} />
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Enter all or part of a building's name"
          />
          <input
            type="submit"
            name="commit"
            value="Search"
            className="submit"
            data-disable-with="Search"
          />
        </form>
      </header>
      {children}
    </>
  );
};

DormtrakLayout.propTypes = {
  children: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.object).isRequired,
};

DormtrakLayout.defaultProps = {};

export default DormtrakLayout;
