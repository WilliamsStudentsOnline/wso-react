// React imports
import React from "react";
import styles from "./Errors.module.scss";
import AccessDenied from "../../assets/SVG/AccessDenied.svg";

const FourOhThree = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <img className={styles.svg} src={AccessDenied} alt="Forbidden" />
        <span className={styles.message}>Access Denied!</span>
        <p className={styles.explanation}>
          You do not seem to have the necessary privileges to access this page.
          If you think this is an error, contact us at{" "}
          <a href="mailto:wso-dev@williams.edu">wso-dev@williams.edu</a>!
        </p>
      </div>
    </div>
  );
};

export default FourOhThree;
