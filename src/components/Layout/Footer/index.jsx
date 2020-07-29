// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux/Routing imports
import { getCurrUser, getAPIToken } from "../../../selectors/auth";
import { connect } from "react-redux";
import { Link } from "react-router5";

// Asset Imports
import styles from "./Footer.module.scss";
import WSOWhite from "../../../assets/SVG/WSOWhite.svg";

// External Imports
import { EuiHorizontalRule, EuiToolTip, EuiButton } from "@elastic/eui";
import { FaInstagram } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { userTypeStudent } from "../../../constants/general";
import { containsOneOfScopes, scopes } from "../../../lib/general";

const Footer = ({ currUser, token }) => {
  return (
    <footer className={styles.footer}>
      <div>
        <div className={styles.footerInformation}>
          <div className={styles.wsoInformation}>
            <div>
              <img
                src={WSOWhite}
                alt="Williams Students Online"
                className={styles.logo}
              />
            </div>
            <div className={styles.socialLinks}>
              <EuiToolTip content="Check out our Instagram">
                <a
                  href="https://www.instagram.com/wsogram/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
              </EuiToolTip>
              &emsp;
              <EuiToolTip content="Email us at wso-dev@williams.edu">
                <a
                  href="mailto:wso-dev@williams.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiMail />
                </a>
              </EuiToolTip>
            </div>
            <div className={styles.linkButtons}>
              <EuiButton
                href="https://forms.gle/NqYdAAbZKPQmPq866"
                className={styles.linkButton}
              >
                Feedback Form
              </EuiButton>
              <EuiButton
                href="https://docs.google.com/forms/d/e/1FAIpQLSeRAHhBnQ7qeJsiVIidnIjtuljenif-1M3OKaHpyQT1vlHgZg/viewform"
                className={styles.linkButton}
              >
                Join The Team
              </EuiButton>
            </div>
          </div>
          <div className={styles.siteLinks}>
            <div>
              <Link
                routeName="bulletins"
                routeParams={{ type: "announcement" }}
                className={styles.sectionLink}
              >
                PostBoard
              </Link>
              <Link routeName="discussions">Discussions</Link>
              <Link
                routeName="bulletins"
                routeParams={{ type: "announcement" }}
              >
                Announcements
              </Link>
              <Link routeName="bulletins" routeParams={{ type: "exchange" }}>
                Exchange
              </Link>
              <Link
                routeName="bulletins"
                routeParams={{ type: "lostAndFound" }}
              >
                Lost And Found
              </Link>
              <Link routeName="bulletins" routeParams={{ type: "job" }}>
                Jobs
              </Link>
              <Link routeName="bulletins" routeParams={{ type: "ride" }}>
                Ride Share
              </Link>
            </div>
            <div>
              <Link routeName="facebook" className={styles.sectionLink}>
                Facebook
              </Link>
              <Link routeName="facebook">Search</Link>
              {currUser && (
                <Link
                  routeName="facebook.users"
                  routeParams={{ userID: currUser.id }}
                >
                  My Profile
                </Link>
              )}
              <Link routeName="dormtrak" className={styles.sectionLink}>
                Dormtrak
              </Link>
              <Link routeName="scheduler" className={styles.sectionLink}>
                Course Scheduler
              </Link>
            </div>

            {currUser?.type === userTypeStudent && (
              <div>
                <Link routeName="ephmatch" className={styles.sectionLink}>
                  Ephmatch
                </Link>
                {containsOneOfScopes(token, [
                  scopes.ScopeEphmatchMatches,
                  scopes.ScopeEphmatchProfiles,
                ]) && (
                  <>
                    <Link routeName="ephmatch.matches">My Matches</Link>

                    <Link routeName="ephmatch.profile">My Profile</Link>

                    <Link routeName="ephmatch.settings">Settings</Link>
                  </>
                )}
                <Link routeName="factrak" className={styles.sectionLink}>
                  Factrak
                </Link>
                <Link routeName="factrak.surveys">My Reviews</Link>
              </div>
            )}
            <div>
              <a className={styles.sectionLink} href="/wiki">
                Wiki
              </a>

              <Link routeName="about" className={styles.sectionLink}>
                About
              </Link>
              <Link routeName="about">WSO</Link>
            </div>
          </div>
        </div>

        <EuiHorizontalRule />
        <div className={styles.boring}>
          <small>
            Copyright &copy; {new Date().getFullYear()} Williams Students
            Online. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  // No isRequired because it must work for non-authenticated users too
  currUser: PropTypes.object,
  token: PropTypes.string,
};

Footer.defaultProps = { currUser: null, token: "" };

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  token: getAPIToken(state),
});

export default connect(mapStateToProps)(Footer);
