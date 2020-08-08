// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment, { FactrakCommentSkeleton } from "../FactrakComment";
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

  // List of Departments according to specific letter
  const depChildren = (letter) => {
    const letteredNames = [];
    for (let i = 0; i < areas.length; i += 1) {
      if (letter === areas[i].name.charAt(0)) {
        letteredNames.push(areas[i]);
      }
    }
    return letteredNames.map((area) => (
      <EuiFlexItem>
        <Link
          routeName="factrak.areasOfStudy"
          routeParams={{ area: area.id }}
          className={styles.depListItem}
        >
          {area.name}
        </Link>
      </EuiFlexItem>
    ));
  };

  // Get List of Departments
  const depNames = () => {
    if (areas != null) {
      const letters = [];
      for (let i = 0; i < areas.length; i += 1) {
        const currentLetter = areas[i].name.charAt(0);
        if (!letters.includes(currentLetter)) {
          letters.push(currentLetter);
        }
      }
      return letters.map((letter) => (
        <EuiFlexItem>
          <EuiFlexGroup direction="column" gutterSize="none">
            {depChildren(letter)}
          </EuiFlexGroup>
        </EuiFlexItem>
      ));
    }
    return null;
  };

  return (
    <article className={styles.factrak}>
      <EuiFlexGroup
        justifyContent="spaceAround"
        className={styles.homeContainer}
      >
        <EuiFlexItem grow={10}>
          <section>
            <h3>Recent Reviews</h3>
            <FactrakDeficitMessage currUser={currUser} />
            <EuiFlexGroup
              direction="column"
              className={styles.comments}
              gutterSize="xl"
            >
              {surveys
                ? surveys.map((survey) => {
                    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
                      return (
                        <EuiFlexItem>
                          <FactrakComment
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
        <EuiFlexItem grow={7}>
          <h3>Departments</h3>
          <div className={styles.departmentCard} description="">
            <EuiFlexGroup direction="column" gutterSize="m">
              {depNames()}
            </EuiFlexGroup>
          </div>
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
