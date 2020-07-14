// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PaginationButtons from "../../common/PaginationButtons";
import { Line } from "../../common/Skeleton";

// Redux and routing imports
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { connect } from "react-redux";

// Additional imports
// import { Link } from "react-router5";
import { actions, createRouteNodeSelector } from "redux-router5";
import { bulletinTypeRide } from "../../../constants/general";

import Post from "../Post";

const PostBoardIndex = ({ navigateTo, route, wso }) => {
  const [bulletins, updateBulletins] = useState(null);
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const perPage = 20;
  const loadBulletins = async (newPage) => {
    const params = {
      type: route.params.type,
      preload: ["user"],
      limit: 20,
      offset: perPage * newPage,
      all: true,
    };
    try {
      const bulletinsResponse = await wso.bulletinService.listBulletins(params);
      updateBulletins(bulletinsResponse.data);
      updateTotal(bulletinsResponse.paginationTotal);
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
      updateBulletins(ridesResponse.data);
      updateTotal(ridesResponse.paginationTotal);
    } catch {
      navigateTo("500");
    }
  };

  // Loads the next page appropriately
  const loadNext = (newPage) => {
    // Different because the wso endpoints are different
    if (route.params?.type === bulletinTypeRide) loadRides(newPage);
    else loadBulletins(newPage);
  };

  // Handles clicking of the next/previous page
  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      loadNext(page - 1);
      updatePage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      loadNext(page + 1);
      updatePage(page + 1);
    }
  };

  // Handles selection of page
  const selectionHandler = (newPage) => {
    updatePage(newPage);
    loadNext(newPage);
  };

  useEffect(() => {
    loadNext(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, wso]);

  //   const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  // Handles deletion
  //   const deleteHandler = async (event, bulletinID) => {
  //     event.preventDefault();
  //     // eslint-disable-next-line no-restricted-globals, no-alert
  //     const confirmDelete = confirm("Are you sure?");
  //     if (!confirmDelete) return;

  //     try {
  //       if (route.params.type === bulletinTypeRide) {
  //         await wso.bulletinService.deleteRide(bulletinID);
  //       } else {
  //         await wso.bulletinService.deleteBulletin(bulletinID);
  //       }
  //       loadNext(page);
  //     } catch {
  //       navigateTo("500");
  //     }
  //   };

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

  // Generate Bulletin date
  //   const generateBulletinDate = (bulletin) => {
  //     if (route.params.type === bulletinTypeRide) {
  //       return new Date(bulletin.date).toLocaleDateString("en-US", dateOptions);
  //     }

  //     return new Date(bulletin.startDate).toLocaleDateString(
  //       "en-US",
  //       dateOptions
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

  const bulletinSkeleton = (key) => (
    <tr key={key}>
      <td className="col-60">
        <Line width="70%" />
      </td>
      <td className="col-20">
        <Line width="80%" />
      </td>
      <td className="col-20">
        <Line width="80%" />
      </td>
    </tr>
  );

  // Generate Bulletin Table
  const renderBulletins = () => {
    if (bulletins && bulletins.length === 0) {
      return <h1 className="no-posts">No Posts</h1>;
    }
    return (
      <div>
        {bulletins
          ? bulletins.map((bulletin) => <Post post={bulletin} />)
          : [...Array(20)].map((_, i) => bulletinSkeleton(i))}
      </div>
    );
  };

  return (
    <div>
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
  type: PropTypes.string.isRequired,
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
