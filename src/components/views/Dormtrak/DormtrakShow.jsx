// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DormtrakFacts from "./DormtrakFacts";
import DormtrakRooms from "./DormtrakRooms";
import DormtrakRecentComments from "./DormtrakRecentComments";
import { Line, Photo, Paragraph } from "../../Skeleton";

// Redux/ Routing imports
import { getCurrUser, getToken } from "../../../selectors/auth";
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";

// Additional imports
import { getDormtrakDorm, getDormtrakDormReviews } from "../../../api/dormtrak";
import { checkAndHandleError } from "../../../lib/general";
import { bannerHelper } from "../../../lib/imageHelper";
import { Link } from "react-router5";
import { userTypeStudent } from "../../../constants/general";

const DormtrakShow = ({ route, currUser, token }) => {
  const [reviews, updateReviews] = useState(null);
  const [dorm, updateDorm] = useState(null);

  useEffect(() => {
    const dormID = route.params.dormID;

    const loadDorm = async () => {
      const dormResponse = await getDormtrakDorm(token, dormID);
      if (checkAndHandleError(dormResponse)) {
        updateDorm(dormResponse.data.data);
      }
    };

    const loadDormReviews = async () => {
      const queryParams = { dormID, commented: true };
      const dormReviewResponse = await getDormtrakDormReviews(
        token,
        queryParams
      );
      if (checkAndHandleError(dormReviewResponse)) {
        updateReviews(dormReviewResponse.data.data);
      }
    };

    loadDorm();
    loadDormReviews();
  }, [token, route.params.dormID]);

  const checkUserCommentRights = () => {
    if (!currUser || !currUser.dorm) return false;
    return currUser.type === userTypeStudent && currUser.dorm.id === dorm.id;
  };

  const dormInfo = () => {
    if (!dorm)
      return (
        <section className="lead">
          <h2>
            <Line width="25%" />
          </h2>
          <div>
            <Photo width="100%" />
          </div>

          <strong>Summary</strong>
          <Paragraph numRows={3} />
        </section>
      );

    return (
      <section className="lead">
        <h2>
          <Link routeName="dormtrak.dorms" routeParams={{ dormID: dorm.id }}>
            {dorm.name}
          </Link>
        </h2>
        <div>
          <img alt={`${dorm.name} avatar`} src={bannerHelper(dorm.name)} />
        </div>

        <strong>Summary</strong>
        <p>{dorm.description}</p>
      </section>
    );
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <DormtrakFacts dorm={dorm || undefined} token={token} />
        <hr />

        <section className="building-rooms">
          <h3>Rooms</h3>
          <small>(Courtesy of OSL)</small>
          <br />
          <DormtrakRooms rooms={dorm ? dorm.dormRooms : undefined} />
        </section>
      </aside>

      <article className="main">
        {dormInfo()}
        <section>
          {checkUserCommentRights() && (
            <strong>
              <Link routeName="dormtrak.newReview">Fill out survey</Link>
            </strong>
          )}

          <DormtrakRecentComments
            reviews={reviews}
            abridged={false}
            currUser={currUser}
          />
        </section>
      </article>
    </div>
  );
};

DormtrakShow.propTypes = {
  currUser: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
};

DormtrakShow.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak.dorms");

  return (state) => ({
    currUser: getCurrUser(state),
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DormtrakShow);
