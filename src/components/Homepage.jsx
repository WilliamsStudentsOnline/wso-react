// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import BulletinBox from "./views/BulletinsDiscussions/BulletinBox";
import SearchBox from "./SearchBox";
import "./stylesheets/Homepage.css";

// API imports
import { connect } from "react-redux";
import { getToken } from "../selectors/auth";

const Homepage = ({ token }) => {
  const bulletinTypes = [
    "Discussions",
    "Announcements",
    "Exchanges",
    "Lost And Found",
    "Jobs",
    "Rides",
  ];

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
          <SearchBox authToken={token} />
        </header>
        <article>
          <section>
            <div className="bulletin-list">
              {bulletinTypes.map((bulletin) => {
                return <BulletinBox type={bulletin} key={bulletin} />;
              })}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

Homepage.propTypes = {
  // No isRequired because authentication not necessary for going to the homepage.
  token: PropTypes.string,
};

Homepage.defaultProps = {
  token: "",
};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(Homepage);
