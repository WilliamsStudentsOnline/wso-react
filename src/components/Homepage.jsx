// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Component imports
import BulletinBox from "./views/BulletinsDiscussions/BulletinBox";
import "./stylesheets/Homepage.css";
import { actions } from "redux-router5";

// API imports
import { connect } from "react-redux";

const Homepage = ({ navigateTo }) => {
  const bulletinTypes = [
    "Discussions",
    "Announcements",
    "Exchanges",
    "Lost And Found",
    "Jobs",
    "Rides",
  ];
  const [query, updateQuery] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();

    navigateTo("facebook", { q: query }, { reload: true });
  };

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
          <form onSubmit={submitHandler}>
            <input
              id="search"
              type="search"
              autoFocus
              placeholder="Search Facebook"
              onChange={(event) => updateQuery(event.target.value)}
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

Homepage.propTypes = { navigateTo: PropTypes.func.isRequired };

Homepage.defaultProps = {};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  null,
  mapDispatchToProps
)(Homepage);
