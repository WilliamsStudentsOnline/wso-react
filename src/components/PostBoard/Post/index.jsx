// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styles from "./Post.module.scss";

import { connect } from "react-redux";
import WSO from "../../../assets/images/brand/wso_icon_white_border.svg";
import { format } from "timeago.js";
import { Link } from "react-router5";

import {
  bulletinTypeRide,
  bulletinTypeJob,
  discussionType,
  bulletinTypeLostAndFound,
  bulletinTypeExchange,
  bulletinTypeAnnouncement,
} from "../../../constants/general";
import { getWSO } from "../../../selectors/auth";

import { userToNameWithClassYear } from "../../../lib/general";

const Post = ({ post, wso }) => {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadPhoto = async () => {
      try {
        const photoResponse = await wso.userService.getUserLargePhoto(
          post.user.unixID
        );

        if (isMounted) {
          setPhoto(URL.createObjectURL(photoResponse));
        }
      } catch (error) {
        // Do nothing.
      }
    };

    if (post.user) {
      loadPhoto();
    }

    return () => {
      isMounted = false;
    };
  }, [post, wso]);

  const isRecent =
    new Date() - new Date(post.startDate) < 7 * 1000 * 24 * 60 * 60;

  // Converts the typeWord to the type of bulletin/discussion to be obtained.
  const linkMap = new Map([
    ["Announcement", bulletinTypeAnnouncement],
    ["Exchange", bulletinTypeExchange],
    ["Lost And Found", bulletinTypeLostAndFound],
    ["Jobs", bulletinTypeJob],
    ["Ride", bulletinTypeRide],
    ["Discussion", discussionType],
  ]);

  const renderPhoto = () => {
    if (!photo) return <img src={WSO} alt="WSO icon" />;

    return <img src={photo} alt="User profile" />;
  };

  return (
    <div className={isRecent ? styles.postRecent : styles.post}>
      <div className={styles.userPhoto}>{renderPhoto()}</div>
      <div>
        <div>
          <span className={styles.postUser}>
            {userToNameWithClassYear(post.user)}
          </span>{" "}
          <span className={styles.datePosted}>
            posted about {format(post.startDate)}
          </span>
        </div>
        <div className={styles.userPronouns}>{post.user?.pronoun}</div>
        <div className={styles.postTitle}>
          <Link
            routeName="bulletins.show"
            routeParams={{ type: linkMap.get(post.type), bulletinID: post.id }}
          >
            {post.title}
          </Link>
        </div>
        <div className={styles.postType}>{post.type}</div>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  wso: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

export default connect(mapStateToProps)(Post);
