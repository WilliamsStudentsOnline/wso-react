// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DormtrakFacts from "./DormtrakFacts";
import DormtrakRooms from "./DormtrakRooms";
import DormtrakRecentComments from "./DormtrakRecentComments";

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
  const [reviews, updateReviews] = useState([]);
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

  return (
    <div className="container">
      <aside className="sidebar">
        {dorm ? <DormtrakFacts dorm={dorm} token={token} /> : null}
        <hr />

        <section className="building-rooms">
          <h3 id="roomstop">Rooms</h3>
          <small>(Courtesy of OSL)</small>
          <br />
          {dorm ? <DormtrakRooms rooms={dorm.dormRooms} perPage={15} /> : null}
        </section>
      </aside>

      <article className="main">
        <section className="lead">
          <h2>
            {dorm ? (
              <Link
                routeName="dormtrak.dorms"
                routeParams={{ dormID: dorm.id }}
              >
                {dorm.name}
              </Link>
            ) : null}
          </h2>
          <div>
            {dorm ? (
              <img alt={`${dorm.name} avatar`} src={bannerHelper(dorm.name)} />
            ) : null}
          </div>

          <strong>Summary</strong>
          <p>{dorm ? dorm.description : ""}</p>
        </section>

        <section>
          {checkUserCommentRights() ? (
            <strong>
              <Link routeName="dormtrak.newReview">Fill out survey</Link>
            </strong>
          ) : null}
          {reviews.length > 0 ? (
            <DormtrakRecentComments
              reviews={reviews}
              abridged={false}
              currUser={currUser}
            />
          ) : (
            <>None yet</>
          )}
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
