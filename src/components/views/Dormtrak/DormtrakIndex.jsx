// React imports
import React from "react";
import PropTypes from "prop-types";
import DormtrakRanking from "./DormtrakRanking";
import DormtrakRecentComments from "./DormtrakRecentComments";
import DormtrakLayout from "./DormtrakLayout";

const DormtrakIndex = ({
  dormInfo,
  max,
  currentUser,
  reviews,
  neighborhoods,
  authToken,
  notice,
  warning,
}) => {
  return (
    <DormtrakLayout
      neighborhoods={neighborhoods}
      authToken={authToken}
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <div className="container">
        <aside className="sidebar">
          <DormtrakRanking dormInfo={dormInfo} max={max} />
        </aside>

        <article className="main">
          <section className="lead">
            <h3>Welcome to Dormtrak</h3>
            <p>
              Dormtrak is a system where students can
              <a href="/dormtrak/policy">anonymously</a>
              share their thoughts about dorm buildings and rooms, as well as
              find out everything there is to know about housing at Williams.
              Much of our information is pulled from surveys that students fill
              out, so by filling out the survey for your building, you help all
              of us make the most informed decision we can about where to live.
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
            <DormtrakRecentComments
              abridged
              currentUser={currentUser}
              reviews={reviews}
            />
          </section>
        </article>
      </div>
    </DormtrakLayout>
  );
};

DormtrakIndex.propTypes = {
  dormInfo: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  max: PropTypes.number.isRequired,
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired,
  authToken: PropTypes.string.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.object),
  notice: PropTypes.string,
  warning: PropTypes.string,
};

DormtrakIndex.defaultProps = {
  notice: "",
  warning: "",
  currentUser: {},
  neighborhoods: [{ name: "Dodd" }],
};

export default DormtrakIndex;
