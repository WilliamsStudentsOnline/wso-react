// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser, getToken } from "../../../selectors/auth";
import { actions } from "redux-router5";
import { doUpdateUser } from "../../../actions/auth";

// API imports
import { patchCurrUser } from "../../../api/users";
import { checkAndHandleError } from "../../../lib/general";

const DormtrakPolicy = ({ currUser, token, navigateTo, updateUser }) => {
  const [acceptPolicy, updateAcceptPolicy] = useState(false);

  const clickHandler = (event) => {
    updateAcceptPolicy(event.target.checked);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!acceptPolicy) return null;

    const updateParams = {
      hasAcceptedDormtrakPolicy: acceptPolicy,
    };
    const response = await patchCurrUser(token, updateParams);

    // PATCH succeeded, update user
    if (checkAndHandleError(response)) {
      updateUser(response.data.data);
      navigateTo("dormtrak");
    }

    return acceptPolicy;
  };

  return (
    <div className="article">
      <section>
        <article>
          <h3>Policy</h3>
          {currUser.hasAcceptedDormtrakPolicy ? null : (
            <p className="intro-paragraph">
              To proceed, read the policy below, then click Agree
            </p>
          )}

          <br />

          <p>
            Comments should be true, and based on personal experience. You can
            only review your current room and building, but that may change in
            the future.
          </p>
          <p>
            Currently, we do not have enough information on Co-op or First-year
            housing to make them available.
          </p>
          <p>
            When you post a review, you&apos;ll see an option for making it
            anonymous. If you choose to make your review anonymous, we will hide
            both your noise and general comment until the next school year.
          </p>
          <p>
            While Dormtrak is designed to be as open as possible, inappropriate
            comments will not be tolerated, and comments can be removed or
            edited at the discretion of the student moderator to bring them into
            accordance with this policy. Inappropriate comments include, but are
            not limited to, comments that name other students, that contain
            racial or ethnic slurs, and those that harass others. Spamming a
            building or room with incorrect information, for example in an
            effort to dissuade others from potentially choosing that dorm, will
            result in being banned from further use of Dormtrak.
          </p>
          <p>
            You are allowed a max of one review per room. You can edit and
            delete your reviews, but when you delete your review we hold onto
            some of the statistical information you provide us (like whether or
            not your room has a keypad to get in).
          </p>
          <p>By using Dormtrak, you agree to abide by this policy.</p>

          {currUser.hasAcceptedDormtrakPolicy ? (
            <p> You have already accepted the Dormtrak policy.</p>
          ) : (
            <form onSubmit={(event) => submitHandler(event)}>
              <p>
                <input
                  type="checkbox"
                  id="accept"
                  onChange={(event) => clickHandler(event)}
                />
                I agree to the Dormtrak policy.
              </p>
              <input
                type="submit"
                value="continue"
                data-disable-with="continue"
              />
            </form>
          )}
        </article>
      </section>
    </div>
  );
};

DormtrakPolicy.propTypes = {
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  token: getToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
  updateUser: (updatedUser) => dispatch(doUpdateUser(updatedUser)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DormtrakPolicy);
