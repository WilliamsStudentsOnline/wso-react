// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";

// Redux imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";

// API imports
import { getSurveys } from "../../../api/factrak";
import { checkAndHandleError } from "../../../lib/general";

const FactrakSurveyIndex = ({ token, currUser }) => {
  const [surveys, updateSurveys] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadUserSurveys = async () => {
      const params = { userID: currUser.id };
      const userSurveyResponse = await getSurveys(token, params);
      if (checkAndHandleError(userSurveyResponse)) {
        updateSurveys(userSurveyResponse.data.data);
      }
    };

    loadUserSurveys();
  }, [token, currUser.id]);

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
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object.isRequired,
};

FactrakSurveyIndex.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(FactrakSurveyIndex);
