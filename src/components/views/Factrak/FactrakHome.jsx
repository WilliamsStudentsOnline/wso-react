// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import { List } from "../../Skeleton";
import FactrakDeficitMessage from "./FactrakUtils";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser, getAPIToken } from "../../../selectors/auth";

// Additional imports
import { containsScopes, scopes } from "../../../lib/general";
import { Link } from "react-router5";

const FactrakHome = ({ wso, currUser, token }) => {
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

      try {
        const surveysResponse = await wso.factrakService.listSurveys(
          queryParams
        );
        updateSurveys(surveysResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    const loadAreas = async () => {
      try {
        const areasOfStudyResponse = await wso.factrakService.listAreasOfStudy();

        const areasOfStudy = areasOfStudyResponse.data;
        updateAreas(areasOfStudy.sort((a, b) => a.name > b.name));
      } catch {
        // eslint-disable-next-line no-empty
      }
    };
    if (containsScopes(token, [scopes.ScopeFactrakFull])) {
      loadSurveys();
    } else {
      updateSurveys([...Array(10)].map((_, id) => ({ id })));
    }

    loadAreas();
  }, [wso, token]);

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
                <List height="80%" center numRows={46} />
              )}
            </ul>
          </article>
        </aside>

        <article className="main">
          <section className="lead">
            <h3>Recent Comments</h3>
            <br />
            <FactrakDeficitMessage currUser={currUser} />

            {surveys
              ? surveys.map((survey) => {
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
                })
              : [...Array(10)].map((_, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={i}>
                    <FactrakCommentSkeleton />
                  </div>
                ))}
          </section>
        </article>
      </div>
    </article>
  );
};

FactrakHome.propTypes = {
  wso: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

FactrakHome.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
  currUser: getCurrUser(state),
  token: getAPIToken(state),
});

export default connect(mapStateToProps)(FactrakHome);
