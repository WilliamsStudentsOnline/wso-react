// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getCurrUser, getWSO } from "../../../selectors/auth";
import { actions } from "redux-router5";

import styles from "./DormtrakPolicy.module.scss";

const DormtrakPolicy = ({ currUser, navigateTo, wso }) => {
  const [acceptPolicy, updateAcceptPolicy] = useState(false);
  const [updated, setUpdated] = useState(false);

  const clickHandler = (event) => {
    updateAcceptPolicy(event.target.checked);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const updateParams = {
      hasAcceptedDormtrakPolicy: acceptPolicy,
    };
    try {
      await wso.userService.updateUser("me", updateParams);
      setUpdated(true);
    } catch {
      navigateTo("500");
    }
  };

  // Wait until the api handler is updated before navigating!
  useEffect(() => {
    let isMounted = true;
    if (updated && isMounted) {
      navigateTo("dormtrak", {}, { reload: true });
    }

    return () => {
      isMounted = false;
    };
  }, [navigateTo, updated, wso]);

  return (
    <div className={styles.article}>
      <section>
        <article>
          {!currUser.hasAcceptedDormtrakPolicy && (
            <p className="intro-paragraph">
              To proceed, read the policy below, then click Agree
            </p>
          )}

          <br />
          <p>
            <b>Dormtrak</b> is a forum where students can share their
            experiences living in a particular dorm and building. This feedback
            is primarily designed to help other students decide on their campus
            housing arrangements for the future. Users can only review their
            current room and building, but this may change in the future.
          </p>
          <br />
          <p>
            Reviewers will see an option to make their post anonymous. If one
            chooses to do so, their noise and general comments will be hidden
            until the next school year.
          </p>
          <br />
          <p>
            While Dormtrak is designed to be as open as possible, inappropriate
            comments will not be tolerated, and comments can be removed or
            edited at the discretion of the student moderators to bring them
            into accordance with this policy. Inappropriate comments include,
            but are not limited to, comments that name other students, that
            contain racial or ethnic slurs, and those that harass others.
            Spamming a building or room with incorrect information, for example,
            in an effort to dissuade others from potentially choosing that dorm,
            will result in being banned from further use of Dormtrak and
            possibly other features of Williams Student Online.
          </p>
          <br />
          <p>
            Users are allowed a maximum of one review per room. Reviews can be
            edited and deleted, but the system will still hold onto some of the
            statistical information provided, such as whether the room has
            carpeting.
          </p>
          <br />
          <p>
            By using Dormtrak, you have already agreed to abide by this policy.
            The use of Dormtrak is also governed by the wider WSO policy and the{" "}
            <a
              className={styles.link}
              href="https://oit.williams.edu/policies/ethics/"
            >
              OIT Computing Ethics and Responsibilities Statement
            </a>
            .
          </p>
          <br />
          <p>
            In order to access Dormtrak, you must contribute one review per
            year.
          </p>

          {currUser.hasAcceptedDormtrakPolicy ? (
            <p>
              <b>
                By using Dormtrak, you have already agree to abide by these
                policies.
              </b>
            </p>
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

          <br />
          <br />
        </article>
      </section>
    </div>
  );
};

DormtrakPolicy.propTypes = {
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DormtrakPolicy);
