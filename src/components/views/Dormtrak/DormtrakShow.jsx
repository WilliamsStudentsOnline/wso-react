// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DormtrakFacts from "./DormtrakFacts";
import DormtrakRooms from "./DormtrakRooms";
import DormtrakRecentComments from "./DormtrakRecentComments";
import { Line, Photo, Paragraph } from "../../Skeleton";

// Redux/ Routing imports
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";

// Additional imports
import { bannerHelper } from "../../../lib/imageHelper";
import { Link } from "react-router5";
import { userTypeStudent } from "../../../constants/general";

const DormtrakShow = ({ wso, route, currUser }) => {
  const [reviews, updateReviews] = useState(null);
  const [dorm, updateDorm] = useState(null);

  useEffect(() => {
    const dormID = route.params.dormID;

    const loadDorm = async () => {
      try {
        const dormResponse = await wso.dormtrakService.getDorm(dormID);
        updateDorm(dormResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    const loadDormReviews = async () => {
      const queryParams = { dormID, commented: true };
      try {
        const dormReviewResponse = await wso.dormtrakService.listReviews(
          queryParams
        );
        updateReviews(dormReviewResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadDorm();
    loadDormReviews();
  }, [wso, route.params.dormID]);

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
        <DormtrakFacts dorm={dorm || undefined} wso={wso} />
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
  wso: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

DormtrakShow.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak.dorms");

  return (state) => ({
    wso: getWSO(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DormtrakShow);
