// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment, { FactrakCommentSkeleton } from "../FactrakComment";
import { List } from "../../common/Skeleton";
import FactrakDeficitMessage from "../FactrakUtils";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser, getAPIToken } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { Link } from "react-router5";
import styles from "./FactrakHome.module.scss";

// Elastic imports
import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

const FactrakHome = ({ currUser, navigateTo, token, wso }) => {
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
        navigateTo("500");
      }
    };

    const loadAreas = async () => {
      try {
        const areasOfStudyResponse = await wso.factrakService.listAreasOfStudy();

        const areasOfStudy = areasOfStudyResponse.data;
        updateAreas(areasOfStudy.sort((a, b) => a.name > b.name));
      } catch {
        navigateTo("500");
      }
    };
    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadSurveys();
    } else {
      updateSurveys([...Array(10)].map((_, id) => ({ id })));
    }

    loadAreas();
  }, [navigateTo, token, wso]);

  return (
    <article className={styles.factrak}>
      <EuiFlexGroup
        className="container"
        direction="rowReverse"
        justifyContent="space-around"
      >
        <EuiFlexItem className="sidebar" grow={2}>
          <h3>Departments</h3>
          <div className={styles.departmentCard} description="">
            <EuiFlexGroup
              className="squares"
              direction="row"
              justifyContent="space-between"
            >
              <EuiFlexItem className={styles.square} grow={false} />
              <EuiFlexItem />
              <EuiFlexItem className={styles.square} grow={false} />
            </EuiFlexGroup>
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
            <EuiFlexGroup
              className="squares"
              direction="row"
              justifyContent="space-between"
            >
              <EuiFlexItem className={styles.square} grow={false} />
              <EuiFlexItem />
              <EuiFlexItem className={styles.square} grow={false} />
            </EuiFlexGroup>
          </div>
        </EuiFlexItem>

        <EuiFlexItem className="main" grow={3}>
          <section className="lead">
            <h3>Recent Reviews</h3>
            <br />
            <FactrakDeficitMessage currUser={currUser} />
            <EuiFlexGroup direction="column">
              {surveys
                ? surveys.map((survey) => {
                    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
                      return (
                        <EuiFlexItem>
                          <hr />
                          <br />
                          <FactrakComment
                            className={styles.factrakComment}
                            comment={survey}
                            showProf
                            abridged
                            key={survey.id}
                          />
                        </EuiFlexItem>
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
            </EuiFlexGroup>
          </section>
        </EuiFlexItem>
      </EuiFlexGroup>
    </article>
  );
};

FactrakHome.propTypes = {
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  wso: PropTypes.object.isRequired,
};

FactrakHome.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  token: getAPIToken(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakHome);
