import React from "react";
import styles from "./Footer.module.scss";

import { FaInstagram } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { EuiHorizontalRule, EuiToolTip } from "@elastic/eui";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <div className={styles.socialLinks}>
          <EuiToolTip content="Check out our Instagram">
            <a
              href="https://www.instagram.com/wsogram/"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>
          </EuiToolTip>
          &emsp;
          <EuiToolTip content="Email us at wso-dev@williams.edu">
            <a
              href="mailto:wso-dev@williams.edu"
              target="_blank"
              rel="noreferrer"
            >
              <FiMail />
            </a>
          </EuiToolTip>
        </div>
        <EuiHorizontalRule />
        <small>
          Copyright &copy; {new Date().getFullYear()} Williams Students Online.
          All rights reserved.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
