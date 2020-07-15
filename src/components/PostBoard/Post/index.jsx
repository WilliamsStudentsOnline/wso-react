// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styles from "./Post.module.scss";

import { connect } from "react-redux";
import WSO from "../../../assets/images/brand/wso_icon_white_border.svg";
import { format } from "timeago.js";
import { Link } from "react-router5";

import { getCurrUser, getWSO } from "../../../selectors/auth";

import { userToNameWithClassYear } from "../../../lib/general";
import { EuiButton } from "@elastic/eui";
import DeleteModal from "../DeleteModal";

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

  const renderPhoto = () => {
    if (!photo) return <img src={WSO} alt="WSO icon" />;

    return <img src={photo} alt="User profile" />;
  };

  const renderPostTitle = () => {
    // If it is a bulletin
    if (post.type) {
      return (
        <div className={styles.postTitle}>
          <Link
            routeName="bulletins.show"
            routeParams={{ type: post.type, bulletinID: post.id }}
          >
            {post.title}
          </Link>
        </div>
      );
    }

    // Otherwise, it must be a discussion
    return (
      <div className={styles.postTitle}>
        <Link
          routeName="discussions.show"
          routeParams={{ discussionID: post.id }}
        >
          {post.title}
        </Link>
      </div>
    );
  };

  const renderPostType = () => {
    if (!post.type) return null;

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
        {renderPostTitle()}
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
