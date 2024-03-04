// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PaginationButtons from "../../PaginationButtons";
import { Line } from "../../Skeleton";

// Redux and routing imports
import { getWSO, getCurrUser } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";

// Additional imports
import { Link, useNavigate } from "react-router-dom";
import { PostType } from "../../../lib/types";
import {
  Bulletin,
  generateBulletinDate,
  generateBulletinTitle,
} from "./BulletinUtils";

const BulletinIndex = ({ type }: { type: PostType }) => {
  const wso = useAppSelector(getWSO);
  const currUser = useAppSelector(getCurrUser);

  const navigateTo = useNavigate();

  const [bulletins, updateBulletins] = useState<Bulletin[] | undefined>(
    undefined
  );
  const [page, updatePage] = useState(0); // 0-indexed page number (i.e. 0 represents the first page)
  const [total, updateTotal] = useState(0);
  const perPage = 20;
  const loadBulletins = async (newPage: number) => {
    const params = {
      type,
      preload: ["user"],
      limit: 20,
      offset: perPage * newPage,
    };
    try {
      const bulletinsResponse = await wso.bulletinService.listBulletins(params);
      updateBulletins(bulletinsResponse.data);
      updateTotal(bulletinsResponse.paginationTotal ?? 0);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const loadRides = async (newPage: number) => {
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
      updateTotal(ridesResponse.paginationTotal ?? 0);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  // Loads the next page appropriately
  const loadNext = (newPage: number) => {
    // Different because the wso endpoints are different
    if (type === PostType.Rides) loadRides(newPage);
    else loadBulletins(newPage);
  };

  // Handles clicking of the next/previous page
  const clickHandler = (number: number) => {
    if (number === -1 && page > 0) {
      loadNext(page - 1);
      updatePage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      loadNext(page + 1);
      updatePage(page + 1);
    }
  };

  // Handles selection of page
  const selectionHandler = (newPage: number) => {
    updatePage(newPage);
    loadNext(newPage);
  };

  useEffect(() => {
    loadNext(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, wso]);

  // Handles deletion
  const deleteHandler = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    bulletinID?: number
  ) => {
    event.preventDefault();
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      if (!bulletinID) {
        throw new Error("No bulletin ID could be found. Fail to delete.");
      }
      if (type === PostType.Rides) {
        await wso.bulletinService.deleteRide(bulletinID);
      } else {
        await wso.bulletinService.deleteBulletin(bulletinID);
      }
      loadNext(page);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  // Creates the Bulletin Title link
  const generateBulletinTitleLink = (bulletin: Bulletin) => {
    const title = generateBulletinTitle(bulletin);

    return <Link to={`/bulletins/${type}/${bulletin.id}`}>{title}</Link>;
  };

  // Link to edit bulletin
  const editLink = (bulletin: Bulletin) => {
    if (currUser && currUser?.id === bulletin?.user?.id) {
      return (
        <>
          <Link to={`/bulletins/${type}/${bulletin.id}/edit`}>Edit</Link>
          &nbsp;|&nbsp;
        </>
      );
    }
    return null;
  };

  // Edit/Delete Links
  const editDeleteLinks = (bulletin: Bulletin) => {
    if (
      (bulletin.user && currUser?.id === bulletin.user.id) ||
      currUser?.admin
    ) {
      return (
        <>
          &nbsp;[&nbsp;
          {editLink(bulletin)}
          <Link
            to={`/bulletins/${type}`}
            onClick={(event) => deleteHandler(event, bulletin.id)}
          >
            Delete
          </Link>
          &nbsp;]
        </>
      );
    }
    return null;
  };

  // Returns the name of the bulletin user
  const bulletinUser = (bulletin: Bulletin) => {
    if (bulletin.user) return bulletin.user.name;

    return "WSO User";
  };

  // Populate Bulletin
  const generateBulletin = (bulletin: Bulletin) => {
    return (
      <tr key={bulletin.id}>
        <td className="col-60">
          {generateBulletinTitleLink(bulletin)}
          {editDeleteLinks(bulletin)}
        </td>
        <td className="col-20">{bulletinUser(bulletin)}</td>
        <td className="col-20">{generateBulletinDate(bulletin)}</td>
      </tr>
    );
  };

  const bulletinSkeleton = (key: React.Key) => (
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
  const generateBulletinTable = () => {
    if (bulletins && bulletins.length === 0) {
      return <h1 className="no-posts">No Posts</h1>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th className="col-60">Summary</th>
            <th className="col-6020">Posted by</th>
            <th className="col-20">Date</th>
          </tr>
        </thead>
        <tbody>
          {bulletins
            ? bulletins.map((bulletin) => generateBulletin(bulletin))
            : [...Array(20)].map((_, i) => bulletinSkeleton(i))}
        </tbody>
      </table>
    );
  };

  return (
    <article className="main-table">
      <section>
        <PaginationButtons
          selectionHandler={selectionHandler}
          clickHandler={clickHandler}
          page={page}
          total={total}
          perPage={perPage}
          showPages
        />
        {generateBulletinTable()}

        <PaginationButtons
          selectionHandler={selectionHandler}
          clickHandler={clickHandler}
          page={page}
          total={total}
          perPage={perPage}
          showPages
        />
      </section>
    </article>
  );
};

BulletinIndex.propTypes = {
  type: PropTypes.string.isRequired,
};

export default BulletinIndex;
