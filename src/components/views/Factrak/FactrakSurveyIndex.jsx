// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";

// Redux imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";

// API imports
import { getUserSurveys } from "../../../api/factrak";

const FactrakSurveyIndex = ({ token, currUser }) => {
  const [surveys, updateSurveys] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadUserSurveys = async () => {
      const userSurveyResponse = await getUserSurveys(token, currUser.id);
      if (userSurveyResponse.status === 200) {
        updateSurveys(userSurveyResponse.data.data);
      } else {
        // If there is an error in survey fetching, resolve to default state.
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
  currUser: PropTypes.object,
};

FactrakSurveyIndex.defaultProps = { currUser: {} };

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(FactrakSurveyIndex);
