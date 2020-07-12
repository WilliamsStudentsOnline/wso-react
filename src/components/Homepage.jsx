// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Component imports
import styles from "./Homepage.module.scss";
import Post from "./PostBoard/Post";
import BulletinBox from "./Bulletins/BulletinBox";

// Redux Imports
import { connect } from "react-redux";
import { EuiAvatar, EuiSpacer, EuiTextArea } from "@elastic/eui";
import { getWSO } from "../selectors/auth";
import Discussion from "../assets/SVG/Discussion1.svg";
import JobOffers from "../assets/SVG/JobOffers.svg";
import RideShare from "../assets/SVG/RideShare2.svg";
import Exchange from "../assets/SVG/Exchange2.svg";

import WSO from "../assets/images/brand/wso_icon_white_border.svg";

const Category = ({ image, title }) => {
  return (
    <div className={styles.category}>
      <img src={image} alt={`${title} category`} />
      <div className={styles.categoryTitle}>{title}</div>
    </div>
  );
};

Category.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const Homepage = ({ wso }) => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        const postResponse = await wso.bulletinService.listBulletins({
          limit: 10,
          preload: ["user"],
          type: "announcements",
        });

        if (isMounted) {
          setPosts(postResponse.data);
        }
      } catch (error) {
        // TODO
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [wso]);

  const renderNewPost = () => {
    return (
      <div className={styles.newPost}>
        <EuiAvatar name="avatar" imageUrl={WSO} size="xl" />
        <EuiTextArea
          value={post}
          onChange={(event) => setPost(event.target.value)}
          resize="none"
        />
      </div>
    );
  };

  const renderCategories = () => {
    return (
      <div className={styles.categories}>
        <Category image={Discussion} title="Discussions" />
        <Category image={Exchange} title="Exchange" />
        <Category image={JobOffers} title="Jobs" />
        <Category image={RideShare} title="Ride Share" />
      </div>
    );
  };

  const renderRecentPosts = () => {
    if (!posts) return null;

    return (
      <div className={styles.recentPosts}>
        <div className={styles.title}>Recent Posts</div>
        {posts.map((recentPost) => (
          <Post key={recentPost.id} post={recentPost} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <div className={styles.title}>PostBoard</div>
        {renderNewPost()}
        <EuiSpacer />
        {renderCategories()}
        <EuiSpacer size="xxl" />
        <div className={styles.bulletins}>
          {renderRecentPosts()}
          <div>
            <BulletinBox typeWord="Discussions" />
            <BulletinBox typeWord="Lost And Found" />
            <BulletinBox typeWord="Announcements" />
          </div>
        </div>
        <EuiSpacer size="xl" />
      </div>
    </div>
  );
};

Homepage.propTypes = {
  wso: PropTypes.object.isRequired,
};

Homepage.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

export default connect(mapStateToProps)(Homepage);
