// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { getToken, getCurrUser } from "../../../selectors/auth";

import {
  getBulletin,
  getRide,
  deleteBulletin,
  deleteRide,
} from "../../../api/bulletins";

import { checkAndHandleError } from "../../../lib/general";
import { createRouteNodeSelector, actions } from "redux-router5";
import { connect } from "react-redux";
import { Link } from "react-router5";

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
      navigateTo("bulletins", { type: bulletin.type ? bulletin.type : "ride" });
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

      if (route.params.type === "ride") {
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

  return (
    <article className="list-creation">
      <section>
        <div className="field">
          <h3>
            <br />
            {bulletin.type
              ? bulletin.title
              : `${bulletin.source} to ${bulletin.destination} (${
                  bulletin.offer ? "Offer" : "Request"
                })`}
            <br />
            <br />
          </h3>

          {`${
            bulletin.type
              ? new Date(bulletin.startDate).toLocaleDateString(
                  "en-US",
                  dateOptions
                )
              : new Date(bulletin.date).toLocaleDateString("en-US", dateOptions)
          } by `}
          {bulletin.userID ? (
            <a href={`/facebook/users/${bulletin.user.id}`}>
              {bulletin.user.name}
            </a>
          ) : (
            bulletin.user.name
          )}
          {currUser.id === bulletin.user.id || currUser.admin ? (
            <>
              &nbsp;[&nbsp;
              <Link
                routeName="bulletins.edit"
                routeParams={{ bulletinID: bulletin.id, type: bulletin.type }}
              >
                Edit
              </Link>
              &nbsp;|&nbsp;
              <button
                type="button"
                onClick={deleteHandler}
                className="inline-button"
              >
                Delete
              </button>
              &nbsp;]
            </>
          ) : null}

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
