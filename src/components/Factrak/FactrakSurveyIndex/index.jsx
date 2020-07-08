// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FactrakComment from "../FactrakComment";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser, getWSO } from "../../../selectors/auth";
import { actions } from "redux-router5";

import styles from "./FactrakSurveyIndex.module.scss";

import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

const FactrakSurveyIndex = ({ currUser, navigateTo, wso }) => {
  const [surveys, updateSurveys] = useState([]);

  useEffect(() => {
    const loadUserSurveys = async () => {
      const params = {
        userID: currUser.id,
        preload: ["professor", "course"],
        populateAgreements: true,
      };

      try {
        const userSurveyResponse = await wso.factrakService.listSurveys(params);

        updateSurveys(userSurveyResponse.data);
      } catch {
        navigateTo("500");
      }
    };

    loadUserSurveys();
  }, [navigateTo, currUser.id, wso]);

  return (
    <div>
      <section>
        <EuiFlexGroup
          className={styles.reviewList}
          direction="column"
          gutterSize="xl"
        >
          {surveys.length > 0 ? (
            <>
              <br />
              {surveys.map((survey) => (
                <EuiFlexItem className={styles.personalReviews}>
                  <FactrakComment
                    comment={survey}
                    showProf
                    abridged={false}
                    key={survey.id}
                  />
                </EuiFlexItem>
              ))}
            </>
          ) : (
            <h1>No reviews yet.</h1>
          )}
        </EuiFlexGroup>
      </section>
    </div>
  );
};

FactrakSurveyIndex.propTypes = {
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

FactrakSurveyIndex.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakSurveyIndex);
