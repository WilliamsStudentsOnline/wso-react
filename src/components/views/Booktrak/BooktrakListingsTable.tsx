import React from "react";
import { Link } from "react-router-dom";
import { ModelsBookListing } from "wso-api-client/lib/services/types";
import { BookConditionEnumToString } from "./BooktrakUtils";

const BooktrakListingsTable = ({
  listings,
  reducedListing,
}: {
  listings: ModelsBookListing[];
  reducedListing?: boolean;
}) => {
  return (
    <table>
      <thead>
        <tr>
          {!reducedListing && (
            <>
              <th>Book Name</th>
              <th>Listing Type</th>
            </>
          )}
          <th>Condition</th>
          <th>Description</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        {listings &&
          listings.map((listing, i) => {
            return (
              <tr key={i}>
                {!reducedListing && (
                  <>
                    <td>Placeholder Bookname</td>
                    <td>Placeholder Listing Type</td>
                  </>
                )}
                <td>
                  {BookConditionEnumToString(
                    listing.condition ?? ModelsBookListing.ConditionEnum.Empty
                  )}
                </td>
                <td>{listing.description}</td>
                <td>
                  <Link to={`/facebook/users/${listing.userID}`}>
                    {listing.user?.name}
                  </Link>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default BooktrakListingsTable;
