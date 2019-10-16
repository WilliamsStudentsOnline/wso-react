// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";
import { doUpdateUser } from "../../../actions/auth";

// Additional imports
import { patchCurrUser } from "../../../api/users";
import { checkAndHandleError } from "../../../lib/general";

const EphcatchOptOut = ({ token, currUser, updateUser }) => {
  // optOutEphcatch might be null
  const [optOut, updateOptOut] = useState(
    currUser.optOutEphcatch ? currUser.optOutEphcatch : false
  );

  // Handles clicking
  const clickHandler = (event) => {
    updateOptOut(event.target.checked);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const updateParams = {
      optOutEphcatch: optOut,
    };
    const response = await patchCurrUser(token, updateParams);

    // PATCH succeeded, update user
    if (checkAndHandleError(response)) {
      updateUser(response.data.data);
    }

    return optOut;
  };

  return (
    <div className="article">
      <section>
        <article>
          <h3>Opt Out</h3>
          <br />
          <p>
            Choosing to opt out means you cannot select fellow seniors or view
            matches. Your picture and name will also not be shown to other
            users. You may opt back in at anytime.
          </p>

          <form onSubmit={(event) => submitHandler(event)}>
            <p>
              <input
                type="checkbox"
                onChange={(event) => clickHandler(event)}
                checked={optOut}
              />
              I do not want to participate in Ephcatch.
            </p>
            <br />
            <input type="submit" value="Save" data-disable-with="Save" />
          </form>
        </article>
      </section>
    </div>
  );
};

EphcatchOptOut.propTypes = {
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
};

EphcatchOptOut.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (updatedUser) => dispatch(doUpdateUser(updatedUser)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EphcatchOptOut);
