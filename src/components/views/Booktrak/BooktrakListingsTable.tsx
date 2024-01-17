import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ModelsBookListing } from "wso-api-client/lib/services/types";
import { BookConditionEnumToString } from "./BooktrakUtils";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import Button from "../../Components";

const BooktrakListingsTable = ({
  listings,
  includeTitle,
  includeUser,
  includeEditButtons,
  loadListings,
}: {
  listings: ModelsBookListing[];
  includeTitle?: boolean;
  includeUser?: boolean;
  includeEditButtons?: boolean;
  loadListings?: () => void;
}) => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  return (
    <table>
      <thead>
        <tr>
          {includeTitle && <th>Title</th>}
          <th>Condition</th>
          <th>Description</th>
          {includeUser && <th>User</th>}
          {includeEditButtons && <th>Edit</th>}
        </tr>
      </thead>
      <tbody>
        {listings &&
          listings.map((listing, i) => {
            return (
              <tr key={i}>
                {includeTitle && (
                  <td>
                    <Link to={`/booktrak/books/${listing.bookID}`}>
                      {listing.book?.title ?? ""}
                    </Link>
                  </td>
                )}
                <td>
                  {BookConditionEnumToString(
                    listing.condition ?? ModelsBookListing.ConditionEnum.Empty
                  )}
                </td>
                <td>{listing.description}</td>
                {includeUser && (
                  <td>
                    <Link to={`/facebook/users/${listing.userID}`}>
                      {listing.user?.name}
                    </Link>
                  </td>
                )}
                {includeEditButtons && (
                  <td>
                    <Button
                      onClick={() =>
                        navigateTo(`/booktrak/listings/${listing.id}`)
                      }
                      className="inline-button"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={async () => {
                        const deletionConfirmed = window.confirm(
                          "Are you sure you want to delete this listing?"
                        );

                        if (deletionConfirmed) {
                          await wso.booktrakService.deleteBookListing(
                            listing.id ?? 0
                          );
                          loadListings?.();
                        }
                      }}
                      className="inline-button"
                    >
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default BooktrakListingsTable;
