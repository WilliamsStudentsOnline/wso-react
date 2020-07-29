// React imports
import React from "react";
import PropTypes from "prop-types";
import styles from "./ContactField.module.scss";

// External imports
import { AiFillPhone } from "react-icons/ai";
import { FaSnapchatGhost, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ContactField = ({ ephmatcherProfile, ephmatcher }) => {
  const { messagingPlatform, messagingUsername } = ephmatcherProfile;
  const unixID = ephmatcher.unixID;

  let icon;
  let link;
  switch (messagingPlatform) {
    case "Phone":
      icon = <AiFillPhone className={styles.messageIcon} />;
      link = <a href={`sms:${messagingUsername}`}>{messagingUsername}</a>;
      break;
    case "Snapchat":
      icon = <FaSnapchatGhost className={styles.messageIcon} />;
      link = (
        <a href={`https://www.snapchat.com/add/${messagingUsername}`}>
          {messagingUsername}
        </a>
      );
      break;
    case "Instagram":
      icon = <FaInstagram className={styles.messageIcon} />;
      link = (
        <a href={`https://www.instagram.com/${messagingUsername}`}>
          {messagingUsername}
        </a>
      );
      break;
    default:
      icon = "";
      link = "";
  }

  if (!messagingPlatform || !messagingUsername || !link) {
    icon = <MdEmail className={styles.messageIcon} />;
    link = <a href={`mailto:${unixID}@williams.edu`}>{unixID}@williams.edu</a>;
  }

  return (
    <div className={styles.contactField}>
      {icon} {link}
    </div>
  );
};

ContactField.propTypes = {
  ephmatcher: PropTypes.object.isRequired,
  ephmatcherProfile: PropTypes.object.isRequired,
};

export default ContactField;
