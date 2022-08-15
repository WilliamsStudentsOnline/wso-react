// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DormtrakFacts from "./DormtrakFacts";
import DormtrakRooms from "./DormtrakRooms";
import DormtrakRecentComments from "./DormtrakRecentComments";
import { Line, Photo, Paragraph } from "../../Skeleton";

// Redux/ Routing imports
import { getCurrUser, getWSO } from "../../../selectors/auth";
import { connect } from "react-redux";

// Additional imports
import { bannerHelper } from "../../../lib/imageHelper";
import { Link, useNavigate, useParams } from "react-router-dom";
import { userTypeStudent } from "../../../constants/general";
import floorplanHelper from "./floorplanHelper";

const DormtrakShow = ({ currUser, wso }) => {
  const navigateTo = useNavigate();
  const params = useParams();

  const [reviews, updateReviews] = useState(null);
  const [dorm, updateDorm] = useState(null);

  useEffect(() => {
    const dormID = params.dormID;

    const loadDorm = async () => {
      try {
        const dormResponse = await wso.dormtrakService.getDorm(dormID);
        updateDorm(dormResponse.data);
      } catch (error) {
        navigateTo("/error", { replace: true, state: error });
      }
    };

    const loadDormReviews = async () => {
      const queryParams = { dormID, commented: true };
      try {
        const dormReviewResponse = await wso.dormtrakService.listReviews(
          queryParams
        );
        updateReviews(dormReviewResponse.data);
      } catch (error) {
        navigateTo("/error", { replace: true, state: error });
      }
    };

    loadDorm();
    loadDormReviews();
  }, [params.dormID, wso]);

  const checkUserCommentRights = () => {
    if (!currUser || !currUser.dorm) return false;
    return currUser.type === userTypeStudent && currUser.dorm.id === dorm.id;
  };

  // Link to survey.
  const surveyLink = () => {
    if (checkUserCommentRights()) {
      return (
        <Link to="/dormtrak/reviews/new">
          <button type="button">Click here to review your dorm room!</button>
        </Link>
      );
    }
    return null;
  };

  const dormFloorplanLinks = (dormName) => {
    const floorplanLinks = floorplanHelper(dormName);

    if (floorplanLinks.length === 1) {
      return (
        <strong>
          Floorplan available{" "}
          <a href={floorplanLinks[0]} target="_blank" rel="noopener noreferrer">
            here
          </a>
        </strong>
      );
    }

    if (floorplanLinks.length > 1) {
      return (
        <strong>
          Floorplans available here:{" "}
          {floorplanLinks.map((link, i) => (
            <a key={link} href={link} target="_blank" rel="noopener noreferrer">
              &nbsp;{i + 1}&nbsp;
            </a>
          ))}
        </strong>
      );
    }

    return <strong>Floorplan not available.</strong>;
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
          <Link to={`/dormtrak/dorms/${dorm.id}`}>{dorm.name}</Link>
        </h2>
        <div>
          <img alt={`${dorm.name} avatar`} src={bannerHelper(dorm.name)} />
        </div>

        <strong>Summary</strong>
        <p>{dorm.description}</p>
        {dormFloorplanLinks(dorm.name)}
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
          {surveyLink()}

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
  wso: PropTypes.object.isRequired,
};

DormtrakShow.defaultProps = {};

const mapStateToProps = () => {
  return (state) => ({
    currUser: getCurrUser(state),
    wso: getWSO(state),
  });
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DormtrakShow);
