import React from "react";
import styles from "./Footer.module.scss";

import { EuiSpacer } from "@elastic/eui";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <small>
        &copy;
        {new Date().getFullYear()} Williams Students Online
      </small>
      <EuiSpacer size="s" />
      <small>Contact Us at wso-dev [at] wso.williams.edu</small>
    </footer>
  );
};

export default Footer;
