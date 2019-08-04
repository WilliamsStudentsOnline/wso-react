// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import BulletinBox from "./BulletinBox";
import SearchBox from "./SearchBox";
import "./stylesheets/Homepage.css";

const Homepage = ({ bulletins, authToken }) => {
  return (
    <div className="home">
      <div className="full-width">
        <div id="join-header">
          <a href="https://forms.gle/RYeBrHvi776F24sE9">Join us today!</a>
        </div>

        <header>
          <h2 align="center">WSO</h2>
          <h4 align="center">By Students, For Students!</h4>
          <br />
          <SearchBox authToken={authToken} />
        </header>
        <article>
          <section>
            <div className="bulletin-list">
              {bulletins.map((bulletin) => {
                return <BulletinBox bulletin={bulletin} key={bulletin[1]} />;
              })}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

Homepage.propTypes = {
  bulletins: PropTypes.arrayOf(PropTypes.array),
  authToken: PropTypes.string,
  notice: PropTypes.string,
  warning: PropTypes.string,
  currentUser: PropTypes.object,
};

Homepage.defaultProps = {
  currentUser: {},
  notice: "",
  warning: "",
  bulletins: [
    [[], "Discussions", "/discussions"],
    [[], "Announcements", "/announcements"],
    [[], "Exchanges", "/exchanges"],
    [[], "Lost + Found", "/lostAndFound"],
    [[], "Jobs", "/jobs"],
    [[], "Rides", "/rides"],
  ],
  authToken: "",
};

export default Homepage;
