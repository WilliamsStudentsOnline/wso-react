// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PaginationButtons from "../../common/PaginationButtons";
import { Paragraph } from "../../common/Skeleton";
import Post from "../Post";

// Redux and routing imports
import { getCurrUser, getWSO } from "../../../selectors/auth";
import { connect } from "react-redux";

// Additional imports
// import { Link } from "react-router5";
import { actions, createRouteNodeSelector } from "redux-router5";
import { bulletinTypeRide, discussionType } from "../../../constants/general";

const PostBoardIndex = ({ navigateTo, route, wso }) => {
  const [posts, setPosts] = useState(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const perPage = 20;

  const loadBulletins = async (newPage) => {
    const params = {
      type: route.params.type,
      preload: ["user"],
      limit: 20,
      offset: perPage * newPage,
    };
    try {
      const bulletinsResponse = await wso.bulletinService.listBulletins(params);
      setPosts(bulletinsResponse.data);
      setTotal(bulletinsResponse.paginationTotal);
    } catch {
      navigateTo("500");
    }
  };

  const loadRides = async (newPage) => {
    const params = {
      preload: ["user"],
      limit: 20,
      offset: perPage * newPage,
      // We don't generally need to add start as a param because the backend automatically
      // filters for only future rides.
    };
    try {
      const ridesResponse = await wso.bulletinService.listRides(params);
      setPosts(ridesResponse.data);
      setTotal(ridesResponse.paginationTotal);
    } catch {
      navigateTo("500");
    }
  };

  const loadDiscussions = async (newPage) => {
    const params = {
      preload: ["user"],
      limit: 20,
      offset: perPage * newPage,
    };
    try {
      const postsResponse = await wso.bulletinService.listDiscussions(params);
      const threads = postsResponse.data;

      setPosts(threads.map((thread) => ({ ...thread, type: discussionType })));
      setTotal(postsResponse.paginationTotal);
    } catch {
      navigateTo("500");
    }
  };

  // Loads the next page appropriately
  const loadNext = (newPage) => {
    // Different because the wso endpoints are different

    if (route.params?.type === discussionType) loadDiscussions(newPage);
    else if (route.params?.type === bulletinTypeRide) loadRides(newPage);
    else loadBulletins(newPage);
  };

  // Handles clicking of the next/previous page
  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      loadNext(page - 1);
      setPage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      loadNext(page + 1);
      setPage(page + 1);
    }
  };

  // Handles selection of page
  const selectionHandler = (newPage) => {
    setPage(newPage);
    loadNext(newPage);
  };

  useEffect(() => {
    loadNext(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, wso]);

  // Creates the Bulletin Title link
  //   const generateBulletinTitle = (bulletin) => {
  //     let title;

  //     if (route.params.type === bulletinTypeRide) {
  //       if (bulletin.offer) {
  //         title = `${bulletin.source} to ${bulletin.destination} (Offer)`;
  //       } else {
  //         title = `${bulletin.source} to ${bulletin.destination} (Request)`;
  //       }
  //     } else {
  //       title = bulletin.title;
  //     }

  //     return (
  //       <Link
  //         routeName="bulletins.show"
  //         routeParams={{ type: route.params.type, bulletinID: bulletin.id }}
  //         routeOptions={{ reload: true }}
  //       >
  //         {title}
  //       </Link>
  //     );
  //   };

  // Link to edit bulletin
  //   const editLink = (bulletin) => {
  //     if (currUser?.id === bulletin.user.id) {
  //       return (
  //         <>
  //           <Link
  //             routeName="bulletins.edit"
  //             routeParams={{ bulletinID: bulletin.id, type: route.params.type }}
  //           >
  //             Edit
  //           </Link>
  //           &nbsp;|&nbsp;
  //         </>
  //       );
  //     }
  //     return null;
  //   };

  // Edit/Delete Links
  //   const editDeleteLinks = (bulletin) => {
  //     if (currUser?.id === bulletin.user.id || currUser?.admin) {
  //       return (
  //         <>
  //           &nbsp;[&nbsp;
  //           {editLink(bulletin)}
  //           <Link
  //             routeName="bulletins"
  //             routeParams={{ type: route.params.type }}
  //             onClick={(event) => deleteHandler(event, bulletin.id)}
  //           >
  //             Delete
  //           </Link>
  //           &nbsp;]
  //         </>
  //       );
  //     }
  //     return null;
  //   };

  const deleteHandler = async (id) => {
    try {
      if (route.params.type === bulletinTypeRide) {
        await wso.bulletinService.deleteRide(id);
      } else {
        await wso.bulletinService.deleteBulletin(id);
      }
      loadNext(page);
    } catch {
      navigateTo("500");
    }
  };

  const bulletinSkeleton = (key) => <Paragraph key={key} />;

  // Generate Bulletin Table
  const renderBulletins = () => {
    if (posts?.length === 0) {
      return <h1 className="no-posts">No Posts</h1>;
    }
    return (
      <div>
        {posts
          ? posts.map((bulletin) => (
              <Post
                key={bulletin.id}
                post={bulletin}
                deleteHandler={deleteHandler}
                showType={false}
              />
            ))
          : [...Array(20)].map((_, i) => bulletinSkeleton(i))}
      </div>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <PaginationButtons
        selectionHandler={selectionHandler}
        clickHandler={clickHandler}
        page={page}
        total={total}
        perPage={perPage}
        showPages
      />
      {renderBulletins()}
      <PaginationButtons
        selectionHandler={selectionHandler}
        clickHandler={clickHandler}
        page={page}
        total={total}
        perPage={perPage}
        showPages
      />
    </div>
  );
};

PostBoardIndex.propTypes = {
  // currUser: PropTypes.object,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  wso: PropTypes.object.isRequired,
};

PostBoardIndex.defaultProps = {
  // currUser: null,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins");

  return (state) => ({
    currUser: getCurrUser(state),
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostBoardIndex);
