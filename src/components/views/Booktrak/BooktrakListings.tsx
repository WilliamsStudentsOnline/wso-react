// React Imports
import React, { useState, useEffect } from "react";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO } from "../../../lib/authSlice";
import { useNavigate } from "react-router-dom";

// Additional Imports
import {
  AutocompleteACEntry,
  ModelsBook,
  ModelsBookListing,
} from "wso-api-client/lib/services/types";
import PaginationButtons from "../../PaginationButtons";
import BooktrakListingsTable from "./BooktrakListingsTable";
import "../../stylesheets/Booktrak.css";
import BooktrakCourseSearch from "./BooktrakCourseSearch";
import {
  BookConditionEnumToString,
  BookConditionStringToEnum,
} from "./BooktrakUtils";
import Tooltip from "../../Tooltip";

const ListingTypeEnum = ModelsBookListing.ListingTypeEnum;
const BooktrakListings = ({
  book,
  showBuyListings,
  showSellListings,
  showMyListings,
}: {
  book?: ModelsBook;
  showBuyListings?: boolean;
  showSellListings?: boolean;
  showMyListings?: boolean;
}) => {
  const wso = useAppSelector(getWSO);
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [listings, updateListings] = useState<ModelsBookListing[]>([]);
  const [buyListings, updateBuyListings] = useState<ModelsBookListing[]>([]);
  const [sellListings, updateSellListings] = useState<ModelsBookListing[]>([]);
  const [courses, updateCourses] = useState<AutocompleteACEntry[]>([]);
  const [minCondition, updateMinCondition] =
    useState<ModelsBookListing.ConditionEnum>(
      ModelsBookListing.ConditionEnum.Empty
    );
  const [maxCondition, updateMaxCondition] =
    useState<ModelsBookListing.ConditionEnum>(
      ModelsBookListing.ConditionEnum.Empty
    );

  const [total, updateTotal] = useState(0);
  const [currentPage, updateCurrentPage] = useState(0);
  const maxListingsPerPage = 20;

  const loadListings = async () => {
    const params: {
      bookID?: number;
      listingType?: ModelsBookListing.ListingTypeEnum;
      courseID?: number;
      userID?: number;
      preload?: string[];
      minCondition?: ModelsBookListing.ConditionEnum;
      maxCondition?: ModelsBookListing.ConditionEnum;
      limit: number;
      offset: number;
    } = {
      preload: ["user"],
      limit: maxListingsPerPage,
      offset: maxListingsPerPage * currentPage,
    };
    if (book?.id) {
      params.bookID = book.id;
    }
    if (minCondition !== ModelsBookListing.ConditionEnum.Empty) {
      params.minCondition = minCondition;
    }
    if (maxCondition !== ModelsBookListing.ConditionEnum.Empty) {
      params.maxCondition = maxCondition;
    }
    if (courses.length > 0) {
      params.courseID = courses[0].id;
    }

    if (showMyListings) {
      // showing current user's listings
      params.userID = currUser?.id;
      params.preload = ["book"];
    } else {
      params.preload = ["user"];

      // only one type of listing is being displayed
      if (!showBuyListings || !showSellListings) {
        params.listingType = showBuyListings
          ? ListingTypeEnum.BUY
          : ListingTypeEnum.SELL;
        params.preload.push("book");
      }
    }

    try {
      if (showBuyListings && showSellListings) {
        const buyListingsResponse = await wso.booktrakService.listBookListings({
          ...params,
          listingType: ListingTypeEnum.BUY,
        });
        const sellListingsResponse = await wso.booktrakService.listBookListings(
          {
            ...params,
            listingType: ListingTypeEnum.SELL,
          }
        );

        updateBuyListings(buyListingsResponse.data ?? []);
        updateSellListings(sellListingsResponse.data ?? []);
        updateTotal(
          (buyListingsResponse.paginationTotal ?? 0) +
            (sellListingsResponse.paginationTotal ?? 0)
        );
      } else {
        const listingsResponse = await wso.booktrakService.listBookListings({
          ...params,
        });

        updateListings(listingsResponse.data ?? []);
        updateTotal(listingsResponse.paginationTotal ?? 0);
      }
    } catch (error) {
      navigateTo("/404", { replace: true, state: { error } });
    }
  };

  useEffect(() => {
    loadListings();
  }, [
    book,
    minCondition,
    maxCondition,
    courses,
    showBuyListings,
    showSellListings,
    currentPage,
    wso,
  ]);

  // return empty component when no options are given
  if (!showBuyListings && !showSellListings && !showMyListings) return <></>;

  // show book's buy & sell listings (on book page)
  if (showBuyListings && showSellListings) {
    return (
      <div className="booktrak-listings-dual-display-container">
        <div>
          <h3>Buy Listings</h3>
          <BooktrakListingsTable listings={buyListings} includeUser />
        </div>
        <div>
          <h3>Sell Listings</h3>
          <BooktrakListingsTable listings={sellListings} includeUser />
        </div>
      </div>
    );
  }

  // buy/sell/my listings page
  return (
    <div className="booktrak-listings-page-container">
      <h3>
        {showMyListings
          ? "My Listings"
          : showBuyListings
          ? "Buy Listings"
          : "Sell Listings"}
      </h3>
      {!showMyListings && (
        <div>
          <BooktrakCourseSearch
            courses={courses}
            updateCourses={updateCourses}
            placeholder="Filter By Course..."
            courseLimit={1}
          />
          <div className="condition-selection-container">
            <div className="inner-container">
              <h3>
                Minimum Condition
                <Tooltip message="The worst book condition that you would still consider buying" />
              </h3>
              <select
                className="select-course-info"
                onChange={(event) => {
                  updateMinCondition(
                    BookConditionStringToEnum(event.target.value)
                  );
                }}
                value={BookConditionEnumToString(minCondition)}
              >
                <option value="" disabled hidden>
                  Select condition
                </option>
                <option value="Poor" key="Poor">
                  Poor
                </option>
                <option value="Fair" key="Fair">
                  Fair
                </option>
                <option value="Good" key="Good">
                  Good
                </option>
                <option value="Very Good" key="Very Good">
                  Very Good
                </option>
                <option value="Like New" key="Like New">
                  Like New
                </option>
                <option value="New" key="New">
                  New
                </option>
              </select>
            </div>
            <div className="inner-container">
              <h3>
                Maximum Condition
                <Tooltip message="The best book condition that you would still consider buying (books with worse conditions may be less expensive)" />
              </h3>
              <select
                className="select-course-info"
                onChange={(event) => {
                  updateMaxCondition(
                    BookConditionStringToEnum(event.target.value)
                  );
                }}
                value={BookConditionEnumToString(maxCondition)}
              >
                <option value="" disabled hidden>
                  Select condition
                </option>
                <option value="Poor" key="Poor">
                  Poor
                </option>
                <option value="Fair" key="Fair">
                  Fair
                </option>
                <option value="Good" key="Good">
                  Good
                </option>
                <option value="Very Good" key="Very Good">
                  Very Good
                </option>
                <option value="Like New" key="Like New">
                  Like New
                </option>
                <option value="New" key="New">
                  New
                </option>
              </select>
            </div>
          </div>
        </div>
      )}
      <PaginationButtons
        selectionHandler={(newPage: number) => {
          updateCurrentPage(newPage);
        }}
        clickHandler={(increment: number) => {
          if (increment === -1 && currentPage > 0) {
            updateCurrentPage(currentPage - 1);
          } else if (
            increment === 1 &&
            total - (currentPage + 1) * maxListingsPerPage > 0
          ) {
            updateCurrentPage(currentPage + 1);
          }
        }}
        page={currentPage}
        total={total}
        perPage={maxListingsPerPage}
        showPages
      />
      <BooktrakListingsTable
        listings={listings}
        includeUser={!showMyListings}
        includeEditButtons={showMyListings}
        loadListings={() => loadListings()}
        includeTitle
      />
    </div>
  );
};

export default BooktrakListings;
