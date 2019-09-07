// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

// External Imports
import { getCurrUser, getToken } from "../../../selectors/auth";
import {
  getBulletin,
  patchBulletin,
  postBulletin,
} from "../../../api/bulletins";
import { checkAndHandleError } from "../../../lib/general";

// External Imports
import { createRouteNodeSelector, actions } from "redux-router5";

const BulletinForm = ({ token, currUser, route, navigateTo }) => {
  const [type, updateType] = useState("");

  // For non-rides bulletins
  const [title, updateTitle] = useState("");

  // For rides
  const [source, updateSource] = useState("");
  const [destination, updateDestination] = useState("");
  const [offer, updateOffer] = useState(false);

  const [body, updateBody] = useState("");
  const [errors, updateErrors] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    // @TODO: redirect when a person wants to edit a post without authorization
    const loadBulletin = async () => {
      const bulletinResponse = await getBulletin(
        token,
        route.params.bulletinID
      );
      if (checkAndHandleError(bulletinResponse)) {
        if (bulletinResponse.data.data.userID === currUser.id) {
          updateBody(bulletinResponse.data.data.body);
          if (route.params.type) {
            updateTitle(bulletinResponse.data.data.title);
          } else {
            updateSource(bulletinResponse.data.data.source);
            updateDestination(bulletinResponse.data.data.destination);
            updateOffer(bulletinResponse.data.date.offer);
          }
        } else {
          navigateTo("403");
        }
      }
    };

    // Load Bulletin if it is a proper path
    if (route.name === "bulletins.edit" && route.params.bulletinID) {
      loadBulletin();
    } else {
      navigateTo("403");
    }

    if (route.params.type) {
      updateType(route.params.type);
    } else {
      updateType("rides");
    }
  }, [
    token,
    currUser.id,
    navigateTo,
    route.name,
    route.params.bulletinID,
    route.params.type,
  ]);

  const startDate = () => {
    if (type !== "announcement" && type !== "ride") return null;

    return (
      <div className="field">
        <h5>
          <b>Show my post starting on</b>
        </h5>
        <input type="text" id="ride_start_date" />
      </div>
    );
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    // Parse integers here rather than below to minimize the expensive operation
    let bulletinParams;

    if (type === "ride") {
      bulletinParams = {
        type,
        source,
        offer,
        destination,
        body,
      };
    } else {
      bulletinParams = { type, title, body };
    }

    const response =
      route.name === "bulletins.edit"
        ? await patchBulletin(token, route.params.bulletinID, bulletinParams)
        : await postBulletin(token, bulletinParams);

    if (checkAndHandleError(response)) {
      navigateTo("bulletins.show", { type, bulletinID: response.data.data.id });
    } else if (response.data.error.errors) {
      updateErrors(response.data.error.errors);
    } else {
      updateErrors([response.data.error.message]);
    }
  };

  return (
    <article className="list-creation">
      <section>
        <form onSubmit={submitHandler}>
          <br />
          {errors && errors.length > 0 ? (
            <div id="errors">
              <b>Please correct the following error(s):</b>
              {errors.map((msg) => (
                <p key={msg}>{msg}</p>
              ))}
            </div>
          ) : null}

          {type === "ride" ? (
            <>
              <div className="field">
                <label htmlFor="ride_offer">
                  <input
                    type="checkbox"
                    value={offer}
                    onChange={(event) => updateOffer(event.target.checked)}
                  />
                  I&apos;m offering this ride
                </label>
              </div>

              <div className="field">
                <h5>
                  <b>Source</b>
                </h5>
                <input
                  type="text"
                  value={source}
                  onChange={(event) => updateSource(event.target.value)}
                />
              </div>

              <div className="field">
                <h5>
                  <b>Destination</b>
                </h5>
                <input
                  type="text"
                  value={destination}
                  onChange={(event) => updateDestination(event.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="field">
              <h5>
                <b>Title</b>
              </h5>
              <input
                type="text"
                value={title}
                onChange={(event) => updateTitle(event.target.value)}
              />
            </div>
          )}

          {startDate()}

          <div className="field">
            <h5>
              <b>Message</b>
            </h5>
            <textarea
              value={body}
              onChange={(event) => updateBody(event.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Submit"
            className="submit"
            data-disable-with="Submit"
          />
        </form>
      </section>
    </article>
  );
};

BulletinForm.propTypes = {
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

BulletinForm.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins");

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
)(BulletinForm);
