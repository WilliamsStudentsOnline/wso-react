// React imports
import React from "react";
// import PropTypes from "prop-types";
import DormtrakRanking from "./DormtrakRanking";
// import DormtrakRecentComments from "./DormtrakRecentComments";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

const DormtrakHome = () => {
  return (
    <div className="container">
      <aside className="sidebar">
        <DormtrakRanking />
      </aside>

      <article className="main">
        <section className="lead">
          <h3>Welcome to Dormtrak</h3>
          <p>
            Dormtrak is a system where students can
            <a href="/dormtrak/policy">&nbsp;anonymously&nbsp;</a>
            share their thoughts about dorm buildings and rooms, as well as find
            out everything there is to know about housing at Williams. Much of
            our information is pulled from surveys that students fill out, so by
            filling out the survey for your building, you help all of us make
            the most informed decision we can about where to live.
          </p>

          <p>
            <strong>
              To fill out the survey, click{" "}
              <a href="/dormtrak/reviews/new">here</a>
            </strong>
            .
          </p>
        </section>
        <section>
          {/* <DormtrakRecentComments
            abridged
            currentUser={currentUser}
            reviews={reviews}
          /> */}
        </section>
      </article>
    </div>
  );
};

DormtrakHome.propTypes = {};

DormtrakHome.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(DormtrakHome);
