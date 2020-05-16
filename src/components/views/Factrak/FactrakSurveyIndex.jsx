// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";

const FactrakSurveyIndex = ({ wso, currUser }) => {
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
        // eslint-disable-next-line no-empty
      }
    };

    loadUserSurveys();
  }, [wso, currUser.id]);

  return (
    <div className="article">
      <section>
        <article>
          {surveys.length > 0 ? (
            <>
              <h3>Your Reviews</h3>
              <br />
              <br />
              {surveys.map((survey) => (
                <FactrakComment
                  comment={survey}
                  showProf
                  abridged={false}
                  key={survey.id}
                />
              ))}
            </>
          ) : (
            <h1 className="no-matches-found">No reviews yet.</h1>
          )}
        </article>
      </section>
    </div>
  );
};

FactrakSurveyIndex.propTypes = {
  wso: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
};

FactrakSurveyIndex.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(FactrakSurveyIndex);
