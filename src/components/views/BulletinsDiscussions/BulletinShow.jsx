// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux and Routing imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

// Additional Imports
import {
  getBulletin,
  getRide,
  deleteBulletin,
  deleteRide,
} from "../../../api/bulletins";
import { checkAndHandleError } from "../../../lib/general";
import { Link } from "react-router5";
import { bulletinTypeRide } from "../../../constants/general";

const BulletinShow = ({ currUser, token, route, navigateTo }) => {
  const [bulletin, updateBulletin] = useState(null);

  const deleteHandler = async () => {
    // eslint-disable-next-line no-restricted-globals
    const confirmDelete = confirm("Are you sure?"); // eslint-disable-line no-alert
    if (!confirmDelete) return;

    let response;

    if (bulletin.type) {
      response = await deleteBulletin(token, bulletin.id);
    } else {
      response = await deleteRide(token, bulletin.id);
    }

    if (checkAndHandleError(response)) {
      navigateTo("bulletins", {
        type: bulletin.type ? bulletin.type : bulletinTypeRide,
      });
    }
  };

  useEffect(() => {
    const loadBulletin = async () => {
      if (!route.params.bulletinID) {
        // Just in case, to deal with special cases.
        updateBulletin(null);
        return;
      }

      let bulletinResponse;

      if (route.params.type === bulletinTypeRide) {
        bulletinResponse = await getRide(token, route.params.bulletinID);
      } else {
        bulletinResponse = await getBulletin(token, route.params.bulletinID);
      }

      if (checkAndHandleError(bulletinResponse)) {
        updateBulletin(bulletinResponse.data.data);
      } else updateBulletin(null);
    };

    loadBulletin();
  }, [token, route.params.bulletinID, route.params.type]);

  const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  if (!bulletin) return null;

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
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

BulletinShow.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins.show");

  return (state) => ({
    token: getToken(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BulletinShow);
