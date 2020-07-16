// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DeleteModal from "../DeleteModal";

// Redux/Routing imports
import { connect } from "react-redux";
import { Link } from "react-router5";
import { getCurrUser, getWSO } from "../../../selectors/auth";

// External imports
import { EuiButton } from "@elastic/eui";
import { format } from "timeago.js";
import styles from "./Post.module.scss";
import { userToNameWithClassYear } from "../../../lib/general";
import WSO from "../../../assets/images/brand/wso_icon_white_border.svg";
import { bulletinTypeRide } from "../../../constants/general";

const Post = ({ currUser, deleteHandler, post, wso }) => {
  const [photo, setPhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

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
        // Do nothing - the default WSO icon should handle it.
      }
    };

    if (post.user) loadPhoto();

    return () => {
      isMounted = false;
    };
  }, [post, wso]);

  const renderPhoto = () => {
    if (!photo) return <img src={WSO} alt="WSO icon" />;
    return <img src={photo} alt="User profile" />;
  };

  const isBulletin = post.type;

  // Generates thread Date
  const threadDate = () => {
    if (!isBulletin) return post.lastActive;
    if (post.type === bulletinTypeRide) return post.date;

    return post.startDate;
  };

  // Define a post as recent if it was made in the last 7 days.
  const isRecent =
    new Date() - new Date(threadDate()) < 7 * 1000 * 24 * 60 * 60;

  const renderPostTitleLink = () => {
    if (isBulletin) {
      return (
        <Link
          routeName="bulletins.show"
          routeParams={{ type: post.type, bulletinID: post.id }}
        >
          {post.title}
        </Link>
      );
    }

    // Otherwise, it must be a discussion
    return (
      <Link
        routeName="discussions.show"
        routeParams={{ discussionID: post.id }}
      >
        {post.title}
      </Link>
    );
  };

  const renderPostType = () => {
    if (!isBulletin) return null;
    return <div className={styles.postType}>{post.type}</div>;
  };

  const renderDeleteButton = () => {
    if (currUser?.id === post.user.id || currUser?.admin) {
      return <EuiButton onClick={openModal}>Delete</EuiButton>;
    }
    return null;
  };

  const renderModal = () => {
    if (isModalVisible) {
      return (
        <DeleteModal
          closeModal={closeModal}
          deleteHandler={() => deleteHandler(post.id)}
        />
      );
    }

    return null;
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

        <div className={styles.postTitle}>{renderPostTitleLink()}</div>
        {renderPostType()}
        {renderDeleteButton()}
        {renderModal()}
      </div>
    </div>
  );
};

Post.propTypes = {
  currUser: PropTypes.object.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  wso: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

export default connect(mapStateToProps)(Post);
