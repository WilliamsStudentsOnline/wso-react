// React imports
import React from "react";
import PropTypes from "prop-types";
import styles from "./Errors.module.scss";
import ServerError from "../../assets/SVG/ServerError.svg";

const FiveOhOh = ({ error }) => {
  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <img className={styles.svg} src={ServerError} alt="Server Error" />
        <span className={styles.message}>Something bad happened!</span>
        <p className={styles.explanation}> {error?.message}</p>
        <p className={styles.explanation}>
          Try waiting for a few minutes and trying what you did again to see if
          your issue is resolved! Otherwise, contact us at{" "}
          <a href="mailto:wso-dev@williams.edu">wso-dev@williams.edu</a>!
        </p>
      </div>
    </div>
  );
};

FiveOhOh.propTypes = {
  error: PropTypes.object,
};

FiveOhOh.defaultProps = {
  error: null,
};

export default FiveOhOh;
