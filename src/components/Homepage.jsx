// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Component imports
import styles from "./Homepage.module.scss";
import Post from "./PostBoard/Post";
import BulletinBox from "./PostBoard/BulletinBox";

// Redux Imports
import { Link } from "react-router5";
import { connect } from "react-redux";
import { EuiAvatar, EuiSpacer, EuiTextArea } from "@elastic/eui";
import { getWSO } from "../selectors/auth";
import Discussion from "../assets/SVG/Discussion1.svg";
import JobOffers from "../assets/SVG/JobOffers.svg";
import RideShare from "../assets/SVG/RideShare2.svg";
import Exchange from "../assets/SVG/Exchange2.svg";

import WSO from "../assets/images/brand/wso_icon_white_border.svg";

const Category = ({ image, title, routeName, routeParams }) => {
  return (
    <Link
      routeName={routeName}
      routeParams={routeParams}
      className={styles.category}
    >
      <img src={image} alt={`${title} category`} />
      <div className={styles.categoryTitle}>{title}</div>
    </Link>
  );
};

Category.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  routeName: PropTypes.string.isRequired,
  routeParams: PropTypes.object,
};

Category.defaultProps = {
  routeParams: {},
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
        });

        const ridesResponse = await wso.bulletinService.listRides({
          limit: 10,
          preload: ["user"],
        });

        const discussionsResponse = await wso.bulletinService.listDiscussions({
          limit: 10,
          preload: ["postsUsers"],
        });

        const discussionPosts = [];

        for (const discussion of discussionsResponse.data) {
          for (const discussionPost of discussion.posts) {
            discussionPosts.push({
              ...discussionPost,
              type: "discussion",
              title: discussion.title,
              discussionId: discussion.id,
              numComments: discussion.posts.length,
            });
          }
        }

        const recentPosts = [
          ...postResponse.data,
          ...ridesResponse.data,
          ...discussionPosts,
        ];

        const mostRecentPosts = recentPosts
          .sort((a, b) => {
            let aTime = a.createdTime;
            let bTime = b.createdTime;

            if (a.startDate) aTime = a.startDate;
            if (b.startDate) bTime = b.startDate;

            return aTime > bTime;
          })
          .slice(0, recentPosts.length > 10 ? 10 : recentPosts.length);

        if (isMounted) {
          setPosts(mostRecentPosts);
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
        <Category
          image={Discussion}
          title="Discussions"
          routeName="bulletins"
          routeParams={{ type: "discussions" }}
        />
        <Category
          image={Exchange}
          title="Exchange"
          routeName="bulletins"
          routeParams={{ type: "exchange" }}
        />
        <Category
          image={JobOffers}
          title="Jobs"
          routeName="bulletins"
          routeParams={{ type: "job" }}
        />
        <Category
          image={RideShare}
          title="Ride Share"
          routeName="bulletins"
          routeParams={{ type: "ride" }}
        />
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
