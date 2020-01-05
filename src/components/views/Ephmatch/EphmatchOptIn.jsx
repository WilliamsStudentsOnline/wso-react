// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ephmatcher from "./Ephmatcher";

// Redux/routing imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { checkAndHandleError } from "../../../lib/general";
import { createEphmatchProfile } from "../../../api/ephmatch";
import { getUser } from "../../../api/users";
import { Link } from "react-router5";

// Page created to handle both opting in and out.
const EphmatchOptIn = ({ token, navigateTo }) => {
  // Note that this is different from Ephcatch
  const [optIn, updateOptIn] = useState(null);
  const [description, updateDescription] = useState("");
  const [userInfo, updateUserInfo] = useState(null);
  useEffect(() => {
    let isMounted = true;

    const loadUserInfo = async () => {
      const ownProfile = await getUser(token);
      if (checkAndHandleError(ownProfile) && isMounted) {
        updateUserInfo(ownProfile.data.data);
      }
    };

    loadUserInfo();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const params = { description, gender: "" };
    const response = await createEphmatchProfile(token, params);

    // Update succeeded -> redirect them to main ephmatch page.
    if (checkAndHandleError(response)) {
      navigateTo("ephmatch");
    }
  };

  const dummyEphmatchProfile = {
    id: 0,
    description,
  };

  return (
    <div className="article">
      <section>
        <article>
          <p>
            Ephmatch is an exclusive feature for a limited time created to spark
            encounters between yourself and other Ephs. If you opt in, you will
            be able to see the profiles of other Ephs who have chosen to opt
            into the system. After opting in, you may choose to opt out at any
            time as well.
          </p>
          <br />
          <br />
          <form
            onSubmit={submitHandler}
            style={{ padding: "20px", boxShadow: "0 6px 10px #888" }}
          >
            <h3>Create your Ephmatch Profile</h3>
            <br />
            <div style={{ width: "50%", margin: "auto" }}>
              <Ephmatcher
                ephmatcherProfile={dummyEphmatchProfile}
                ephmatcher={userInfo}
                token={token}
              />
            </div>
            <br />
            <br />
            <h5>Profile Description:</h5>
            <p>
              <input
                type="text"
                value={description || ""}
                onChange={(event) => updateDescription(event.target.value)}
                placeholder="Add a short description to your profile to help others know you
                better!"
              />
              <br />
              You may also edit your display picture and other parts of your
              profile <Link routeName="facebook.edit">here</Link>.
            </p>
            <br />
            <h5>Opting In</h5>
            <b>
              Opting in is entirely optional - we respect your wishes, and you
              will not be added into Ephmatch should you not choose to opt in.
            </b>
            <br />
            <br />
            <input
              type="checkbox"
              onChange={(event) => updateOptIn(event.target.checked)}
              defaultChecked={optIn}
              required
            />
            I want to opt into Ephmatch.
            <br />
            <br />
            <br />
            <input
              type="submit"
              value="Explore Ephmatch"
              data-disable-with="Entering Ephmatch..."
            />
          </form>
        </article>
      </section>
    </div>
  );
};

EphmatchOptIn.propTypes = {
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

EphmatchOptIn.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchOptIn);
