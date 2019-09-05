// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { getToken, getCurrUser } from "../../../selectors/auth";

import { getBulletin, getRide } from "../../../api/bulletins";

import { checkAndHandleError } from "../../../lib/general";
import { createRouteNodeSelector } from "redux-router5";
import { connect } from "react-redux";

const BulletinShow = ({ currUser, token, route }) => {
  const [bulletin, updateBulletin] = useState(null);

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
        console.log(bulletinResponse.data.data);
      } else updateBulletin(null);
    };

    loadBulletin();
  }, [token, route.params.userID]);

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
              <a href={`${window.location.href}/edit`}>Edit</a>
              &nbsp;|&nbsp;
              <a
                data-confirm="Are you sure?"
                rel="nofollow"
                data-method="delete"
                href={`/bulletins/${bulletin.id}`}
              >
                Delete
              </a>
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

export default connect(mapStateToProps)(BulletinShow);
