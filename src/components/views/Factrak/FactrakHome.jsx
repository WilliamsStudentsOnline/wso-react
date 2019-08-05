// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";

// Redux imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";

// External imports
import { getSurveys, getAreasOfStudy } from "../../../api/factrak";

const FactrakHome = ({ token, currUser }) => {
  const [areas, updateAreas] = useState([]);
  const [surveys, updateSurveys] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadSurveys = async () => {
      const surveys = await getSurveys(token, 10);
      if (surveys) {
        updateSurveys(surveys);
      } else {
        // @TODO: Error handling?
      }
    };

    const loadAreas = async () => {
      const response = await getAreasOfStudy(token);
      if (response) {
        updateAreas(response.data.data.sort((a, b) => a.name > b.name));
      } else {
        // @TODO: Error handling?
      }
    };
    loadSurveys();
    loadAreas();
  }, [token]);

  return (
    <article className="dormtrak">
      <div className="container">
        <aside className="sidebar">
          <article className="home">
            <h3>Departments</h3>
            <ul id="dept_list">
              {areas.map((area) => (
                <li key={area.name}>
                  <a href={`/factrak/areasOfStudy/${area.id}`}>{area.name}</a>
                </li>
              ))}
            </ul>
          </article>
        </aside>

        <article className="main">
          <section className="lead">
            <h3>Recent Comments</h3>
            <br />
            {currUser.factrakSurveyDeficit > 0 ? (
              <>
                <strong>
                  {`Write just ${currUser.factrakSurveyDeficit} reviews to
                  make the blur go away!`}
                </strong>
                <br />
                To write a review, just search a prof&apos;s name directly
                above, or click a department on the left to see a list of profs
                in that department. Then click the link on the prof&apos;s page
                to write a review!
                <br />
                <br />
              </>
            ) : null}

            {surveys.map((survey) => (
              <FactrakComment
                comment={survey}
                showProf
                abridged
                key={survey.id}
              />
            ))}
          </section>
        </article>
      </div>
    </article>
  );
};

FactrakHome.propTypes = {
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object,
};

FactrakHome.defaultProps = {
  currUser: {},
};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(FactrakHome);
