// React imports
import React, { useState, useEffect } from "react";
import PaginationButtons from "../../PaginationButtons";
import Select from "../../Select";

// Redux/ routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { useNavigate } from "react-router-dom";

// Additional imports
import Ephmatcher from "./Ephmatcher";

const EphmatchHome = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const perPage = 20; // Number of results per page
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const [ephmatchers, updateEphmatchers] = useState([]);
  const [sort, updateSort] = useState("recommended");

  useEffect(() => {
    let isMounted = true;

    const loadNextEphmatchers = async (newPage) => {
      const params = {
        limit: perPage,
        offset: newPage * perPage,
        preload: ["tags", "relation", "matched"],
        sort,
      };

      try {
        const ephmatchersResponse = await wso.ephmatchService.listProfiles(
          params
        );

        if (isMounted) {
          updateEphmatchers(ephmatchersResponse.data);
          updateTotal(ephmatchersResponse.paginationTotal);
        }
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    loadNextEphmatchers(page);

    return () => {
      isMounted = false;
    };
  }, [page, sort, wso]);

  const selectEphmatcher = async (event, index) => {
    // Alternatively, use the classname to determine the method to be called.
    // That way works but is more hacky.
    const ephmatcher = ephmatchers[index];
    const target = event.currentTarget;

    try {
      if (ephmatcher.relation === "like" || ephmatcher.relation === "dislike") {
        await wso.ephmatchService.undoProfileRelation(ephmatcher.userID);
        target.className = "ephmatch-select-link";
      } else {
        await wso.ephmatchService.likeProfile(ephmatcher.userID);
        target.className = "ephmatch-select-link ephmatch-selected";
      }
      const updatedEphmatcher = await wso.ephmatchService.getProfile(
        ephmatcher.userID
      );

      ephmatchers.splice(index, 1, updatedEphmatcher.data);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  // Handles clicking of pagination buttons
  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      updatePage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      updatePage(page + 1);
    }
    window.scrollTo(0, 0);
  };

  // Handles selection of page
  const selectionHandler = (newPage) => {
    updatePage(newPage - 1);
  };

  return (
    <article className="facebook-results">
      <section>
        <div>
          <p>
            Select as many people as you want by clicking on their profile. You
            can also come back later and modify your selections. To check if you
            have matches, click &ldquo;Matches&rdquo; above or refresh the page.
            Have fun, and good luck!
            <br />
            <strong>Note:</strong>
            &nbsp;You can&apos;t see yourself in the list below, but everyone
            else can.
          </p>
          <br />

          {ephmatchers.length > 0 ? (
            <>
              <div className="added-sort">
                <strong>Sort By:</strong>
                <Select
                  onChange={(event) => {
                    updateSort(event.target.value);
                  }}
                  options={[
                    "Recommended",
                    "Recently Updated",
                    "Newest",
                    "Alphabetical (A-Z)",
                  ]}
                  value={sort}
                  valueList={["recommended", "updated", "new", "alphabetical"]}
                  style={{
                    display: "inline",
                    margin: "5px 0px 5px 20px",
                    padding: "4px",
                  }}
                />
              </div>
              <PaginationButtons
                selectionHandler={selectionHandler}
                clickHandler={clickHandler}
                page={page}
                total={total}
                perPage={perPage}
                showPages
              />
              <div className="ephmatch-results">
                {ephmatchers.map(
                  (ephmatcher, index) =>
                    ephmatcher.user && (
                      <Ephmatcher
                        wso={wso}
                        ephmatcher={ephmatcher.user}
                        ephmatcherProfile={ephmatcher}
                        selectEphmatcher={selectEphmatcher}
                        index={index}
                        matched={ephmatcher.matched}
                        key={ephmatcher.id}
                      />
                    )
                )}
              </div>
              <br />
              <PaginationButtons
                selectionHandler={selectionHandler}
                clickHandler={clickHandler}
                page={page}
                total={total}
                perPage={perPage}
                showPages
              />
            </>
          ) : (
            <h1 className="no-matches-found">
              Invite your friends to join Ephmatch!
            </h1>
          )}
        </div>
      </section>
    </article>
  );
};

export default EphmatchHome;
