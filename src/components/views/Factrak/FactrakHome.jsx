// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";
import { SkeletonList } from "../../Skeleton";

// Redux imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";

// Additional imports
import { getSurveys, getAreasOfStudy } from "../../../api/factrak";
import {
  checkAndHandleError,
  containsScopes,
  scopes,
} from "../../../lib/general";
import { Link } from "react-router5";

const FactrakHome = ({ token, currUser }) => {
  const [areas, updateAreas] = useState(null);
  const [surveys, updateSurveys] = useState(null);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadSurveys = async () => {
      const queryParams = {
        preload: ["professor", "course"],
        limit: 10,
        start: new Date(),
      };
      const surveysResponse = await getSurveys(token, queryParams);

      if (checkAndHandleError(surveysResponse)) {
        updateSurveys(surveysResponse.data.data);
      }
    };

    const loadAreas = async () => {
      const areasOfStudyResponse = await getAreasOfStudy(token);
      if (checkAndHandleError(areasOfStudyResponse)) {
        const areasOfStudy = areasOfStudyResponse.data.data;
        updateAreas(areasOfStudy.sort((a, b) => a.name > b.name));
      }
    };
    if (containsScopes(token, [scopes.ScopeFactrakFull])) {
      loadSurveys();
    } else {
      updateSurveys(
        [...Array(10)].map((_, id) => {
          return {
            id,
          };
        })
      );
    }

    loadAreas();
  }, [token]);

  // Generates the factrak survey deficit message if necessary
  const factrakSurveyDeficitMessage = () => {
    if (currUser.factrakSurveyDeficit > 0) {
      return (
        <>
          <strong>
            {`Write just ${currUser.factrakSurveyDeficit} reviews to
        make the blur go away!`}
          </strong>
          <br />
          To write a review, just search a prof&apos;s name directly above, or
          click a department on the left to see a list of profs in that
          department. Then click the link on the prof&apos;s page to write a
          review!
          <br />
          <br />
        </>
      );
    }

    return null;
  };

  return (
    <article className="dormtrak">
      <div className="container">
        <aside className="sidebar">
          <article className="home">
            <h3>Departments</h3>
            <ul id="dept_list">
              {areas ? (
                areas.map((area) => (
                  <li key={area.name}>
                    <Link
                      routeName="factrak.areasOfStudy"
                      routeParams={{ area: area.id }}
                    >
                      {area.name}
                    </Link>
                  </li>
                ))
              ) : (
                <SkeletonList height="80%" center numRows={46} />
              )}
            </ul>
          </article>
        </aside>

        <article className="main">
          <section className="lead">
            <h3>Recent Comments</h3>
            <br />
            {factrakSurveyDeficitMessage()}

            {surveys &&
              surveys.map((survey) => {
                if (containsScopes(token, [scopes.ScopeFactrakFull])) {
                  return (
                    <FactrakComment
                      comment={survey}
                      showProf
                      abridged
                      key={survey.id}
                    />
                  );
                }
                return <FactrakComment showProf abridged key={survey.id} />;
              })}
          </section>
        </article>
      </div>
    </article>
  );
};

FactrakHome.propTypes = {
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object.isRequired,
};

FactrakHome.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(FactrakHome);
