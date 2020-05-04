// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Line, Paragraph } from "../../Skeleton";

// Redux and Routing imports
import { connect } from "react-redux";
import { getAPI, getCurrUser } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

// Additional Imports
import { Link } from "react-router5";
import { bulletinTypeRide } from "../../../constants/general";

const BulletinShow = ({ api, currUser, route, navigateTo }) => {
  const [bulletin, updateBulletin] = useState(null);

  const deleteHandler = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      if (bulletin.type) {
        await api.bulletinService.deleteBulletin(bulletin.id);
      } else {
        await api.bulletinService.deleteRide(bulletin.id);
      }
      navigateTo("bulletins", {
        type: bulletin.type || bulletinTypeRide,
      });
    } catch {
      // eslint-diable-next-line no-empty
    }
  };

  useEffect(() => {
    const loadBulletin = async () => {
      if (!route.params.bulletinID) return;

      try {
        let bulletinResponse;
        if (route.params.type === bulletinTypeRide) {
          bulletinResponse = await api.bulletinService.getRide(
            route.params.bulletinID
          );
        } else {
          bulletinResponse = await api.bulletinService.getBulletin(
            route.params.bulletinID
          );
        }

        updateBulletin(bulletinResponse.data);
      } catch {
        // eslint-diable-next-line no-empty
      }
    };

    loadBulletin();
  }, [api, route.params.bulletinID, route.params.type]);

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
    if (bulletin.userID) {
      return (
        <Link
          routeName="facebook.users"
          routeParams={{ userID: bulletin.userID }}
        >
          {bulletin.user.name}
        </Link>
      );
    }

    return bulletin.user.name;
  };

  // Generate the edit button only if the current user is the bulletin starter
  const editButton = () => {
    if (currUser && currUser.id === bulletin.user.id) {
      return (
        <button
          type="button"
          onClick={() =>
            navigateTo("bulletins.edit", {
              bulletinID: bulletin.id,
              type: route.params.type,
            })
          }
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

  // Assumes that the bulletin will always work
  // TODO: Check what happens when we try to access invalid bulletin link
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
  api: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

BulletinShow.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins.show");

  return (state) => ({
    api: getAPI(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BulletinShow);
