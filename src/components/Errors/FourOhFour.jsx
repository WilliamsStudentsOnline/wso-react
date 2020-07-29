// React imports
import React from "react";

import styles from "./Errors.module.scss";
import PageNotFound from "../../assets/SVG/PageNotFound.svg";

const FourOhFour = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <img className={styles.svg} src={PageNotFound} alt="Page not found" />
        <span className={styles.message}>Page not found!</span>
      </div>
    </div>
  );
};

export default FourOhFour;
