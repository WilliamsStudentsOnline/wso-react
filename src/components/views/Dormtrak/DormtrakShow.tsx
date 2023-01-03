// React imports
import React, { useEffect, useState } from "react";
import DormtrakFacts from "./DormtrakFacts";
import DormtrakRooms from "./DormtrakRooms";
import DormtrakRecentComments from "./DormtrakRecentComments";
import { Line, Photo, Paragraph } from "../../Skeleton";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser } from "../../../lib/authSlice";
import { Link, useNavigate, useParams } from "react-router-dom";

// Additional imports
import { bannerHelper } from "../../../lib/imageHelper";
import { userTypeStudent } from "../../../constants/general";
import floorplanHelper from "./floorplanHelper";
import {
  ModelsDorm,
  ModelsDormtrakReview,
} from "wso-api-client/lib/services/types";

const DormtrakShow = () => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const params = useParams();

  const [reviews, updateReviews] = useState<ModelsDormtrakReview[]>([]);
  const [dorm, updateDorm] = useState<ModelsDorm | undefined>(undefined);

  useEffect(() => {
    const dormID = params.dormID ? parseInt(params.dormID, 10) : undefined;

    const loadDorm = async () => {
      try {
        if (dormID) {
          const dormResponse = await wso.dormtrakService.getDorm(dormID);
          updateDorm(dormResponse.data);
        }
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
        updateReviews(dormReviewResponse.data ?? []);
      } catch (error) {
        navigateTo("/error", { replace: true, state: error });
      }
    };

    loadDorm();
    loadDormReviews();
  }, [params.dormID, wso]);

  const checkUserCommentRights = () => {
    if (!currUser || !currUser.dormRoomID || !dorm) return false;
    return currUser.type === userTypeStudent && currUser.dormRoomID === dorm.id;
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

  const dormFloorplanLinks = (dormName: string) => {
    const floorplanLinks = floorplanHelper(dormName);
    if (!floorplanLinks) {
      return <strong>Floorplan not available.</strong>;
    }
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
      dorm.name && (
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
      )
    );
  };

  return (
    <div className="container">
      <aside className="sidebar">
        {dorm && <DormtrakFacts dorm={dorm} />}
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

          <DormtrakRecentComments reviews={reviews} abridged={false} />
        </section>
      </article>
    </div>
  );
};

export default DormtrakShow;
