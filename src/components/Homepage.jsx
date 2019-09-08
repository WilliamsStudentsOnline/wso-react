// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Component imports
import "./stylesheets/Homepage.css";
import BulletinBox from "./views/BulletinsDiscussions/BulletinBox";

// Redux Imports
import { connect } from "react-redux";
import { actions } from "redux-router5";

const Homepage = ({ navigateTo }) => {
  const bulletinTypeWords = [
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
              type="search"
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
              {bulletinTypeWords.map((bulletin) => {
                return <BulletinBox typeWord={bulletin} key={bulletin} />;
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
