// React imports
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// External imports
import axios from "axios";
// import COURSE_INFO from "../constants/courses.json";

// Component imports
import "../../stylesheets/Scheduler.css";
import googleAPI from "google-client-api";
import Catalog from "./Catalog";
import NotificationList from "./NotificationList";
import SubMenu from "./SubMenu";
import Search from "./Search";
import Timetable from "./Timetable";
import Help from "./Help";
import AdditionalOptions from "./AdditionalOptions";

// Redux (Selector, Reducer, Actions) imports
import {
  getCurrSubMenu,
  getGAPI,
  getSignInStatus,
} from "../../../selectors/schedulerUtils";
import {
  updateGAPI,
  updateSignIn,
  addNotif,
} from "../../../actions/schedulerUtils";
import { FAILURE } from "../../../constants/actionTypes";
import { doLoadCatalog } from "../../../actions/course";

class Scheduler extends Component {
  constructor(props) {
    super(props);

    this.getActive = this.getActive.bind(this);
  }

  componentDidMount() {
    googleAPI().then((gapi) => {
      const CLIENT_ID =
        "99903103727-mcppob91tlqitcd7g11ud46vg0gr90im.apps.googleusercontent.com";
      const SCOPES = "https://www.googleapis.com/auth/calendar";
      const DISCOVERY_DOCS = [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ];
      const API_KEY = "AIzaSyAxGwi55Zk2mg-Hs-O3qLBcoEMx__cceD0";

      gapi.client
        .init({
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: DISCOVERY_DOCS,
          apiKey: API_KEY,
        })
        .then(() => {
          const { doUpdateGAPI, doUpdateSignIn } = this.props;

          // Listen for sign-in state changes.
          doUpdateGAPI(gapi);
          doUpdateSignIn(gapi.auth2.getAuthInstance().isSignedIn.get());
        })
        .catch((error) =>
          addNotif({
            type: FAILURE,
            title: "Failed to execute Google Authentication.",
            body: error,
          })
        );
    });

    // Use this code for testing purposes, remember to import above.
    // this.props.loadCatalog(COURSE_INFO.courses);

    axios({
      url: "/courses/courses.json",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }).then((response) => {
      this.props.loadCatalog(response.data);
    });
  }

  getActive() {
    const { active } = this.props;

    if (active === "Catalog") {
      return (
        <div className="row">
          <div className="column">
            <Search />
            <Catalog />
          </div>
          <AdditionalOptions />
        </div>
      );
    }

    if (active === "Timetable") {
      return (
        <div className="row">
          <Timetable />
        </div>
      );
    }

    if (active === "Help") {
      return (
        <div className="row">
          <Help />
        </div>
      );
    }

    return null;
  }

  render() {
    const { active } = this.props;
    return (
      <div className="app">
        <div className="app-header">
          <h1>Course Scheduler</h1>
        </div>
        <NotificationList />
        <div className="row">
          <div className="sub-menu-column">
            <SubMenu />
          </div>
          <div
            className={
              active === "Catalog"
                ? "main-container"
                : "main-container overflow-hidden"
            }
          >
            {this.getActive()}
          </div>
        </div>
      </div>
    );
  }
}

Scheduler.propTypes = {
  doUpdateGAPI: PropTypes.func.isRequired,
  doUpdateSignIn: PropTypes.func.isRequired,
  loadCatalog: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  active: getCurrSubMenu(state),
  gapi: getGAPI(state),
  signedIn: getSignInStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  doUpdateGAPI: (gapi) => dispatch(updateGAPI(gapi)),
  doUpdateSignIn: (signedIn) => dispatch(updateSignIn(signedIn)),
  ddNotif: (notification) => dispatch(addNotif(notification)),
  loadCatalog: (catalog) => dispatch(doLoadCatalog(catalog)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scheduler);
