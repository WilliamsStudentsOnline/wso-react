// React Imports
import React, { useState, useEffect } from "react";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
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
import CourseEdit from "./BooktrakCourseEdit";

const ListingTypeEnum = ModelsBookListing.ListingTypeEnum;
const BooktrakListings = ({
  book,
  showBuyListings,
  showSellListings,
}: {
  book?: ModelsBook;
  showBuyListings?: boolean;
  showSellListings?: boolean;
}) => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const [listings, updateListings] = useState<ModelsBookListing[]>([]);
  const [buyListings, updateBuyListings] = useState<ModelsBookListing[]>([]);
  const [sellListings, updateSellListings] = useState<ModelsBookListing[]>([]);
  const [courses, updateCourses] = useState<AutocompleteACEntry[]>([]);

  const [total, updateTotal] = useState(0);
  const [currentPage, updateCurrentPage] = useState(0);
  const maxListingsPerPage = 20;

  const loadListings = async () => {
    const params: {
      bookID?: number;
      listingType?: ModelsBookListing.ListingTypeEnum;
      courseID?: number;
      preload?: string[];
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
    if (courses.length > 0) {
      params.courseID = courses[0].id;
    }

    // if only one type of listing should be displayed
    if (!showBuyListings || !showSellListings) {
      params.listingType = showBuyListings
        ? ListingTypeEnum.BUY
        : ListingTypeEnum.SELL;
      params.preload = ["user", "book"];
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
  }, [book, courses, showBuyListings, showSellListings, currentPage, wso]);

  if (!showBuyListings && !showSellListings) return <></>;
  if (showBuyListings && showSellListings) {
    return (
      <div className="booktrak-listings-dual-display-container">
        <div>
          <h3>Buy Listings</h3>
          <BooktrakListingsTable listings={buyListings} reducedListing />
        </div>
        <div>
          <h3>Sell Listings</h3>
          <BooktrakListingsTable listings={sellListings} reducedListing />
        </div>
      </div>
    );
  }

  return (
    <div className="booktrak-listings-page-container">
      <h3>{showBuyListings ? "Buy Listings" : "Sell Listings"}</h3>
      <CourseEdit courses={courses} updateCourses={updateCourses} />
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
      <BooktrakListingsTable listings={listings} />
    </div>
  );
};

export default BooktrakListings;
