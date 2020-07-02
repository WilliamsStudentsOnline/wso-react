// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/ Router imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// Additional imports
import { Link } from "react-router5";
import styles from "./FactrakLayout.module.scss";
import SearchIcon from "../../../assets/SVG/VectorsearchIcon.svg";
import SearchIconPurple from "../../../assets/SVG/VectorsearchIconPurple.svg";

// Elastic Imports
import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

const FactrakLayout = ({ wso, children, currUser, navigateTo, route }) => {
  const [query, setQuery] = useState("");
  const [setSuggestions] = useState([]);
  const [setShowSuggestions] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadQuery = () => {
      if (route.params.q) setQuery(route.params.q);
      else setQuery(""); // Needed to reset if user clears the box.
    };

    if (isMounted) {
      loadQuery();
      setShowSuggestions(false);
    }

    return () => {
      isMounted = false;
    };
  }, [route.params.q, route.path]);

  // Initiates new autocomplete
  const factrakAutocomplete = async (event) => {
    setQuery(event.target.value);
    let suggestData = [];

    try {
      const factrakResponse = await wso.autocompleteService.autocompleteFactrak(
        query
      );

      suggestData = factrakResponse.data;
    } catch {
      // No need to do anything - it's alright if we don't have autocomplete.
    }

    // Limit the number of factrak suggestions to 5.
    if (suggestData.length > 5) {
      setSuggestions(suggestData.slice(0, 5));
    } else {
      setSuggestions(suggestData);
    }
    setShowSuggestions(true);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    navigateTo("factrak.search", { q: query }, { reload: true });
  };

  const focusHandler = () => {
    setShowSuggestions(true);
  };

  const blurHandler = () => {
    setShowSuggestions(false);
  };

  // Might be removed //

  /*
  const suggestionRow = (suggestion) => {
    if (suggestion.type && suggestion.type === "area") {
      return (
        <Link
          routeName="factrak.areasOfStudy"
          routeParams={{ area: suggestion.id }}
          onMouseDown={(e) => e.preventDefault()}
          successCallback={() => setShowSuggestions(false)}
        >
          {suggestion.value}
        </Link>
      );
    }
    if (suggestion.type && suggestion.type === "course") {
      return (
        <Link
          routeName="factrak.courses"
          routeParams={{ courseID: suggestion.id }}
          onMouseDown={(e) => e.preventDefault()}
          successCallback={() => setShowSuggestions(false)}
        >
          {suggestion.value}
        </Link>
      );
    }
    if (suggestion.type && suggestion.type === "professor") {
      return (
        <Link
          routeName="factrak.professors"
          routeParams={{ profID: suggestion.id }}
          onMouseDown={(e) => e.preventDefault()}
          successCallback={() => setShowSuggestions(false)}
        >
          {suggestion.value}
        </Link>
      );
    }

    // Just to handle weird cases
    return null;
  };

  const factrakSuggestions = () => {
      return (
          <EuiFlexGroup className={styles.autocomplete} direction="column">
                {suggestions.length > 0 &&
                  showSuggestions &&
                  suggestions.map((suggestion) => (
                    <EuiFlexItem grow={false} className={styles.autocompleteItem}>
                      {suggestionRow(suggestion)}
                    </EuiFlexItem>

                  ))}
          </EuiFlexGroup>
      );
  };
  */
  if (currUser) {
    if (!currUser.hasAcceptedFactrakPolicy) {
      navigateTo("factrak.policy");
    }

    return (
      <>
        <header>
          <EuiFlexGroup className={styles.pageHead} alignItems="flexStart">
            <EuiFlexItem grow={1}>
              <h1>
                <Link routeName="factrak">Factrak</Link>
              </h1>
            </EuiFlexItem>
            <EuiFlexItem grow={4}>
              <EuiFlexGroup direction="column">
                <EuiFlexItem>
                  <form
                    onSubmit={submitHandler}
                    onFocus={focusHandler}
                    onBlur={blurHandler}
                    className={styles.searchBar}
                  >
                    <EuiFlexGroup>
                      <EuiFlexItem className={styles.searchWrapper}>
                        <img
                          className={styles.searchIcon}
                          src={SearchIcon}
                          alt=""
                        />
                        <img
                          className={styles.searchIconPurple}
                          src={SearchIconPurple}
                          alt=""
                        />
                        <input
                          className={styles.search}
                          onChange={factrakAutocomplete}
                          placeholder="Search Factrak"
                          type="text"
                        />
                      </EuiFlexItem>
                      <EuiFlexItem grow={false}>
                        <EuiButton fill color="#644a98" onClick={submitHandler}>
                          Search
                        </EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </form>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFlexGroup
                    direction="row"
                    className={styles.factrakText}
                    justifyContent="flexStart"
                  >
                    <EuiFlexItem grow={false}>
                      <Link routeName="factrak.surveys">My Reviews</Link>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <Link routeName="factrak.policy">Policy</Link>
                    </EuiFlexItem>
                    {currUser.factrakAdmin && (
                      <EuiFlexItem grow={false}>
                        <Link routeName="factrak.moderate">Moderate</Link>
                      </EuiFlexItem>
                    )}
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={3} />
          </EuiFlexGroup>
          <hr className={styles.lineBreak} />
        </header>
        {children}
      </>
    );
  }

  // Just to handle weird cases
  return null;
};

FactrakLayout.propTypes = {
  wso: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  currUser: PropTypes.object,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
};

FactrakLayout.defaultProps = { currUser: {} };

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    wso: getWSO(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakLayout);
