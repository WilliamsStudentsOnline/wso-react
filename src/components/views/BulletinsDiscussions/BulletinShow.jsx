// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Line, Paragraph } from "../../Skeleton";

// Redux and Routing imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";

// Additional Imports
import { Link, useNavigate, useParams } from "react-router-dom";
import { bulletinTypeRide } from "../../../constants/general";

const BulletinShow = ({ currUser, wso }) => {
  const params = useParams();
  const navigateTo = useNavigate();

  const [bulletin, updateBulletin] = useState(null);

  const deleteHandler = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      if (bulletin.type) {
        await wso.bulletinService.deleteBulletin(bulletin.id);
      } else {
        await wso.bulletinService.deleteRide(bulletin.id);
      }
      navigateTo(`/bulletins/${bulletin.type || bulletinTypeRide}`);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  useEffect(() => {
    const loadBulletin = async () => {
      if (!params.bulletinID) return;

      try {
        let bulletinResponse;
        if (params.type === bulletinTypeRide) {
          bulletinResponse = await wso.bulletinService.getRide(
            params.bulletinID
          );
        } else {
          bulletinResponse = await wso.bulletinService.getBulletin(
            params.bulletinID
          );
        }

        updateBulletin(bulletinResponse.data);
      } catch (error) {
        if (error.errorCode === 404) navigateTo("/404", { replace: true });
      }
    };

    loadBulletin();
  }, [params.bulletinID, params.type, wso]);

  const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  // Creates the Bulletin Title link
  const generateBulletinTitle = () => {
    let title;

    if (bulletin.type) {
      title = bulletin.title;
    } else if (bulletin.offer) {
      title = `${bulletin.source} to ${bulletin.destination} (Offer)`;
    } else {
      title = `${bulletin.source} to ${bulletin.destination} (Request)`;
    }

    return title;
  };

  // Create the bulletin date
  const generateBulletinDate = () => {
    if (bulletin.type) {
      return new Date(bulletin.startDate).toLocaleDateString(
        "en-US",
        dateOptions
      );
    }

    return new Date(bulletin.date).toLocaleDateString("en-US", dateOptions);
  };

  // Generate bulletin creator name
  const generateBulletinStarter = () => {
    if (bulletin.userID && bulletin.user?.name) {
      return (
        <Link to={`/facebook/users/${bulletin.userID}`}>
          {bulletin.user.name}
        </Link>
      );
    }

    if (bulletin.user?.name) return bulletin.user.name;

    return "WSO User";
  };

  // Generate the edit button only if the current user is the bulletin starter
  const editButton = () => {
    if (currUser && currUser.id === bulletin.user.id) {
      return (
        <button
          type="button"
          onClick={() => navigateTo("edit")}
          className="inline-button"
        >
          Edit
        </button>
      );
    }

    return null;
  };

  // Generate the edit + delete buttons
  const editDeleteButtons = () => {
    if (currUser && (currUser.id === bulletin.user.id || currUser.admin)) {
      return (
        <>
          <br />
          {editButton()}
          <button
            type="button"
            onClick={deleteHandler}
            className="inline-button"
          >
            Delete
          </button>
        </>
      );
    }
    return null;
  };

  if (!bulletin)
    return (
      <article className="list-creation">
        <section>
          <div className="field">
            <h3>
              <br />
              <Line width="100%" />
              <br />
              <br />
            </h3>
            <Line width="30%" />
            <br />
            <br />
            <Paragraph numRows={5} />
          </div>
          <br />
        </section>
      </article>
    );

  return (
    <article className="list-creation">
      <section>
        <div className="field">
          <h3>
            <br />
            {generateBulletinTitle()}
            <br />
            <br />
          </h3>
          {`${generateBulletinDate()} by `}
          {generateBulletinStarter()}

          {editDeleteButtons()}
          <br />
          <br />
          {bulletin.body}
        </div>
        <br />
      </section>
    </article>
  );
};

BulletinShow.propTypes = {
  currUser: PropTypes.object,
  wso: PropTypes.object.isRequired,
};

BulletinShow.defaultProps = {
  currUser: null,
};

const mapStateToProps = () => {
  return (state) => ({
    currUser: getCurrUser(state),
    wso: getWSO(state),
  });
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BulletinShow);
