// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { EmptyState, Pagination } from "../../ui";
import ThreadListItem from "./ThreadListItem";

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
  const [page, updatePage] = useState(0);
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
    };
    try {
      const ridesResponse = await wso.bulletinService.listRides(params);
      updateBulletins(ridesResponse.data);
      updateTotal(ridesResponse.paginationTotal ?? 0);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const loadNext = (newPage: number) => {
    if (type === PostType.Rides) loadRides(newPage);
    else loadBulletins(newPage);
  };

  const clickHandler = (number: number) => {
    if (number === -1 && page > 0) {
      loadNext(page - 1);
      updatePage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      loadNext(page + 1);
      updatePage(page + 1);
    }
  };

  const selectionHandler = (newPage: number) => {
    updatePage(newPage);
    loadNext(newPage);
  };

  useEffect(() => {
    loadNext(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, wso]);

  const deleteHandler = async (bulletinID?: number) => {
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

  const bulletinUser = (bulletin: Bulletin) => {
    if (bulletin.user) return bulletin.user.name;
    return "WSO User";
  };

  const canDelete = (bulletin: Bulletin) =>
    Boolean(
      (bulletin.user && currUser?.id === bulletin.user.id) || currUser?.admin
    );

  if (bulletins && bulletins.length === 0) {
    return (
      <section className="margin-vertical-small">
        <EmptyState variant="no-posts">No Posts</EmptyState>
      </section>
    );
  }

  return (
    <section className="margin-vertical-small">
      <Pagination
        selectionHandler={selectionHandler}
        clickHandler={clickHandler}
        page={page}
        total={total}
        perPage={perPage}
        showPages
      />
      {bulletins
        ? bulletins.map((bulletin) => (
            <ThreadListItem
              key={bulletin.id}
              title={
                <Link to={`/bulletins/${type}/${bulletin.id}`}>
                  {generateBulletinTitle(bulletin)}
                </Link>
              }
              meta={`Posted ${generateBulletinDate(bulletin)} by ${bulletinUser(
                bulletin
              )}`}
              showDelete={canDelete(bulletin)}
              onDelete={() => deleteHandler(bulletin.id)}
            />
          ))
        : [...Array(20)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <ThreadListItem key={i} skeleton />
          ))}

      <Pagination
        selectionHandler={selectionHandler}
        clickHandler={clickHandler}
        page={page}
        total={total}
        perPage={perPage}
        showPages
      />
    </section>
  );
};

BulletinIndex.propTypes = {
  type: PropTypes.string.isRequired,
};

export default BulletinIndex;
