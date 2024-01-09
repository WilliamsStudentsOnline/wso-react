// React Imports
import React, { useState, useEffect } from "react";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { useNavigate } from "react-router-dom";

// Additional Imports
import {
  ModelsBook,
  ModelsBookListing,
} from "wso-api-client/lib/services/types";
import PaginationButtons from "../../PaginationButtons";
import BooktrakListingsTable from "./BooktrakListingsTable";
import "../../stylesheets/Booktrak.css";

type ServerError = {
  errorCode: number;
  message: string;
};

function isServerError(error: unknown): error is ServerError {
  return (
    typeof error === "object" &&
    error !== null &&
    "errorCode" in error &&
    "message" in error
  );
}

const ListingTypeEnum = ModelsBookListing.ListingTypeEnum;
const BooktrakListings = ({
  book,
  onlyShowBuyListings,
  displayBuyAndSell,
}: {
  book?: ModelsBook;
  onlyShowBuyListings?: boolean;
  displayBuyAndSell?: boolean;
}) => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const [listings, updateListings] = useState<ModelsBookListing[]>([]);
  const [buyListings, updateBuyListings] = useState<ModelsBookListing[]>([]);
  const [sellListings, updateSellListings] = useState<ModelsBookListing[]>([]);

  const [currentPage, updateCurrentPage] = useState(0);
  const maxListingsPerPage = 2;

  useEffect(() => {
    const loadListings = async () => {
      const params: {
        bookID?: number;
        listingType?: ModelsBookListing.ListingTypeEnum;
      } = {};
      if (book?.id) {
        params.bookID = book.id;
      }
      if (onlyShowBuyListings !== undefined) {
        params.listingType = onlyShowBuyListings
          ? ListingTypeEnum.BUY
          : ListingTypeEnum.SELL;
      }

      try {
        if (displayBuyAndSell) {
          const buyListingsResponse =
            await wso.booktrakService.listBookListings({
              ...params,
              listingType: ListingTypeEnum.BUY,
            });
          const sellListingsResponse =
            await wso.booktrakService.listBookListings({
              ...params,
              listingType: ListingTypeEnum.SELL,
            });
          updateBuyListings(buyListingsResponse.data ?? []);
          updateSellListings(sellListingsResponse.data ?? []);
        } else {
          const listingsResponse = await wso.booktrakService.listBookListings({
            ...params,
          });
          updateListings(listingsResponse.data ?? []);
        }
      } catch (error) {
        if (isServerError(error)) {
          console.log(error.message, error.errorCode);
        } else {
          navigateTo("/404", { replace: true });
        }
      }
    };
    loadListings();
  }, [wso]);

  if (displayBuyAndSell) {
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
    <div className="booktrak-listings-container">
      <h3 className="booktrak-inner-page-title">
        {onlyShowBuyListings ? "Buy Listings" : "Sell Listings"}
      </h3>
      <PaginationButtons
        selectionHandler={(newPage: number) => {
          updateCurrentPage(newPage);
        }}
        clickHandler={(increment: number) => {
          if (increment === -1 && currentPage > 0) {
            updateCurrentPage(currentPage - 1);
          } else if (
            increment === 1 &&
            listings.length - (currentPage + 1) * maxListingsPerPage > 0
          ) {
            updateCurrentPage(currentPage + 1);
          }
        }}
        page={currentPage}
        total={listings.length}
        perPage={maxListingsPerPage}
        showPages
      />
      <BooktrakListingsTable
        listings={listings.slice(
          maxListingsPerPage * currentPage,
          maxListingsPerPage * currentPage + maxListingsPerPage
        )}
      />
    </div>
  );
};

export default BooktrakListings;
