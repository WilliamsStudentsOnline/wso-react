// React imports
import React from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../selectors/auth";

// External imports
import { getSurveys } from "../api/factrak";

const FactrakHome = ({ areas, token }) => {
  let surveys = [];
  const loadSurveys = async () => {
    surveys = await getSurveys(token);
  };
  console.log(surveys);

  loadSurveys();
  return (
    <article className="dormtrak">
      <div className="container">
        <aside className="sidebar">
          <article className="home">
            <h3>Departments</h3>
            <ul id="dept_list">
              {areas.map((area) => (
                <li key={area.name}>
                  <a href={`/factrak/areas_of_study/${area.id}`}>{area.name}</a>
                </li>
              ))}
            </ul>
          </article>
        </aside>

        <article className="main">
          <section className="lead">
            <h3>Recent Comments</h3>
            <br />
            {
              // Pluralize
              /*
              currentUser.factrak_survey_deficit > 0 ? (
                <>
                  <strong>
                    {`Write just ${currentUser.factrak_survey_deficit} reviews to
                  make the blur go away!`}
                  </strong>
                  <br />
                  To write a review, just search a prof&apos;s name directly
                  above, or click a department on the left to see a list of
                  profs in that department. Then click the link on the
                  prof&apos;s page to write a review!
                  <br />
                  <br />
                </>
              ) : null*/
            }

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
  areas: PropTypes.arrayOf(PropTypes.object),
};

FactrakHome.defaultProps = {
  areas: [{ name: "hi", id: "1" }],
};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(FactrakHome);
