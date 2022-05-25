// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import { List } from "../../Skeleton";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getAPIToken } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

// Additional imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { Link } from "react-router5";
import FactrakTopProfs from "./FactrakTopProfs";

const FactrakRankings = ({ navigateTo, token, wso, route }) => {
  const [areas, updateAreas] = useState(null);

  useEffect(() => {
    // Loads in the departments
    const loadAreas = async () => {
      try {
        const areasOfStudyResponse = await wso.factrakService.listAreasOfStudy();
        const areasOfStudy = areasOfStudyResponse.data;
        updateAreas(areasOfStudy.sort((a, b) => a.name > b.name));
      } catch (error) {
        navigateTo("error", { error }, { replace: true });
      }
    };

    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadAreas();
    } else {
      updateAreas([...Array(10)].map((_, id) => ({ id })));
    }
  }, [navigateTo, token, wso, route]);

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
                      routeName="factrak.rankings"
                      routeParams={{ aos: area.id }}
                      title={`${area.name} Rankings`}
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

        <FactrakTopProfs />
      </div>
    </article>
  );
};

FactrakRankings.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  wso: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

FactrakRankings.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.rankings");

  return (state) => ({
    token: getAPIToken(state),
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakRankings);
