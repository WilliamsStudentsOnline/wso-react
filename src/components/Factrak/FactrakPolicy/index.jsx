// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./FactrakPolicy.module.scss";

// Redux imports
import { actions } from "redux-router5";
import { connect } from "react-redux";
import { getCurrUser, getWSO } from "../../../selectors/auth";

// Elastic imports
import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

const FactrakPolicy = ({ currUser, navigateTo, wso }) => {
  const [acceptPolicy, updateAcceptPolicy] = useState(false);
  const [updated, setUpdated] = useState(false);

  // Handles clicking of the accept policy checkbox
  const clickHandler = (event) => {
    updateAcceptPolicy(event.target.checked);
  };

  // Handles submission of the survey
  const submitHandler = async (event) => {
    event.preventDefault();

    const updateParams = {
      hasAcceptedFactrakPolicy: acceptPolicy,
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
      navigateTo("factrak", {}, { reload: true });
    }

    return () => {
      isMounted = false;
    };
  }, [navigateTo, updated, wso]);

  return (
    <div>
      <section>
        <EuiFlexGroup
          direction="column"
          className={styles.factrakPolicy}
          alignItems="center"
        >
          <EuiFlexItem>
            <h1>Policy</h1>
          </EuiFlexItem>
          <EuiFlexItem>
            <br />
            <h4>IMPORTANT &mdash; new in 2016:</h4>
          </EuiFlexItem>
          <EuiFlexItem>
            <p>
              <strong>
                Factrak is only helpful if we have a lot of recent reviews from
                lots of different people, so we&apos;ve introduced a few
                changes.
              </strong>
            </p>
          </EuiFlexItem>
          <EuiFlexItem>
            <p>
              In order to access Factrak,{" "}
              <strong>
                you must contribute at least 2 reviews per semester.{" "}
              </strong>
              This requirement is waived if you have reviewed at least all but 2
              of your courses in your time at Williams. The requirement is not
              retroactive. The year is divided into 2 periods: March -
              September, and October - February. To view Factrak during one of
              these two periods, the above requirements must have been met
              during that period. For example, to see Factrak in December, you
              must have submitted at least 2 reviews since October.
            </p>
          </EuiFlexItem>
          <EuiFlexItem>
            <p>
              Factrak now supports bubble-sheet style reviews for courses and
              professors. This is entirely optional, and you can still submit
              just the traditional text comment. The statistics gathered will
              not be visible until enough data is collected.
            </p>
            <br />
          </EuiFlexItem>
          <EuiFlexItem>
            <p>
              To create a forum where students can openly and honestly share
              their opinions of their professors in a manner that is anonymous
              and only visible to other students. This feedback is primarily
              designed to help other students find courses and professors which
              are the best matches for them.
            </p>
          </EuiFlexItem>
          <EuiFlexItem>
            <p>
              While Factrak is designed to be as open as possible, inappropriate
              comments will not be tolerated, and comments can be removed or
              edited at the discretion of the student moderator to bring them
              into accordance with this policy. Inappropriate comments include,
              but are not limited to, comments that name other students, that
              contain racial or ethnic slurs, and those that harass others.
              Users may flag comments for moderator review using the button at
              the bottom of each comment. Use this if you feel the comment has
              violated the acceptable use policy.
            </p>
          </EuiFlexItem>
          <EuiFlexItem>
            <p>
              By using Factrak users agree to abide by this policy. The use of
              Factrak is also governed by the wider WSO policy and the{" "}
              <a href="http://oit.williams.edu/w/?u=docs/Computing+Ethics+and+Responsibilities">
                OIT Computing Ethics and Responsibilities Statement
              </a>
              .
            </p>
          </EuiFlexItem>
          {currUser.hasAcceptedFactrakPolicy ? (
            <EuiFlexItem>
              <p>
                <b>You have already accepted the Factrak policy.</b>
              </p>
            </EuiFlexItem>
          ) : (
            <EuiFlexItem>
              <form onSubmit={(event) => submitHandler(event)}>
                <p>
                  <input
                    type="checkbox"
                    id="accept"
                    onChange={(event) => clickHandler(event)}
                  />
                  I agree to the Factrak policy.
                </p>
                <input
                  type="submit"
                  value="continue"
                  data-disable-with="continue"
                />
              </form>
              <br />
              <br />
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </section>
    </div>
  );
};

FactrakPolicy.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(FactrakPolicy);