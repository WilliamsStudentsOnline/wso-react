// React Imports
import React, { useState, useEffect } from "react";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { Link, useNavigate } from "react-router-dom";

// Additional Imports
import {
  ModelsBook,
  ModelsBookListing,
} from "wso-api-client/lib/services/types";
import { BookConditionEnumToString } from "./BooktrakUtils";

const BooktrakListings = ({ book }: { book: ModelsBook }) => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const [buyListings, updateBuyListings] = useState<ModelsBookListing[]>([]);
  const [sellListings, updateSellListings] = useState<ModelsBookListing[]>([]);

  useEffect(() => {
    const loadListings = async () => {
      if (!book.id) {
        return;
      }
      try {
        const ListingTypeEnum = ModelsBookListing.ListingTypeEnum;
        const buyListingsResponse = await wso.booktrakService.listBookListings({
          bookID: book.id,
          listingType: ListingTypeEnum.BUY,
        });
        const sellListingsResponse = await wso.booktrakService.listBookListings(
          {
            bookID: book.id,
            listingType: ListingTypeEnum.SELL,
          }
        );
        updateBuyListings(buyListingsResponse.data ?? []);
        updateSellListings(sellListingsResponse.data ?? []);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigateTo("/404", { replace: true });
      }
    };
    loadListings();
  }, [wso]);

  const listingsTable = (listings: ModelsBookListing[]) => {
    return (
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Condition</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {listings &&
            listings.map((listing, i) => {
              return (
                <tr key={i}>
                  <td>
                    <Link to={`/facebook/users/${listing.userID}`}>
                      {listing.user?.name}
                    </Link>
                  </td>
                  <td>
                    {BookConditionEnumToString(
                      listing.condition ?? ModelsBookListing.ConditionEnum.Empty
                    )}
                  </td>
                  <td>{listing.description}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  };
  return (
    <div
      style={{
        display: "flex",
        paddingLeft: "10%",
        paddingRight: "10%",
        gap: "5%",
      }}
    >
      <div>
        <h3>Buy Listings</h3>
        {listingsTable(buyListings)}
      </div>
      <div>
        <h3>Sell Listings</h3>
        {listingsTable(sellListings)}
      </div>
    </div>
  );
};

export default BooktrakListings;
