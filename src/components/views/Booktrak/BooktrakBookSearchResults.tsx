import React from "react";
import { Link, NavigateFunction } from "react-router-dom";
import {
  ModelsBook,
  ModelsBookListing,
} from "wso-api-client/lib/services/types";
import Button from "../../Components";
import "../../stylesheets/Booktrak.css";

const BooktrakBookSearchResults = ({
  results,
  listingResults,
  navigateTo,
}: {
  results: ModelsBook[];
  listingResults: (ModelsBookListing[] | undefined)[];
  navigateTo: NavigateFunction;
}) => {
  const filterListings = (
    listings: ModelsBookListing[] | undefined,
    listingType: ModelsBookListing.ListingTypeEnum
  ) => {
    if (!listings || listings.length === 0) return [];
    return listings.filter((listing) => listing.listingType === listingType);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Authors</th>
          <th className="unix-column">ISBN</th>
          <th>Cover</th>
          <th>Buy/Sell Listings</th>
          <th>Create Buy/Sell Listing</th>
        </tr>
      </thead>
      <tbody>
        {results &&
          results
            .filter((book) => book.isbn13)
            .map((book, i) => (
              <tr key={i}>
                <td>
                  <Link to={"/booktrak/books"} state={{ book }}>
                    {book.title}
                  </Link>
                </td>
                <td>{book.authors?.join(", ")}</td>
                <td>{book.isbn13}</td>
                <td style={{ textAlign: "center" }}>
                  <a href={book.infoLink}>
                    {book.imageLink ? (
                      <img
                        src={book.imageLink}
                        alt="No cover available"
                        className="book-image"
                        onMouseDown={(event) => {
                          event.currentTarget.style.transform =
                            "translateY(2px)";
                          event.currentTarget.style.boxShadow =
                            "0 0 5px rgba(0, 0, 0, 0.3)";
                        }}
                        onMouseUp={(event) => {
                          event.currentTarget.style.transform = "translateY(0)";
                          event.currentTarget.style.boxShadow =
                            "0 2px 5px rgba(0, 0, 0, 0.3)";
                        }}
                      />
                    ) : (
                      <div className="book-missing-image">
                        No Cover Available
                      </div>
                    )}
                  </a>
                </td>
                <td>
                  {(listingResults[i]?.length ?? 0) > 0 ? (
                    <Link to={"/booktrak/books"} state={{ book }}>
                      Browse{" "}
                      {
                        filterListings(
                          listingResults[i],
                          ModelsBookListing.ListingTypeEnum.BUY
                        ).length
                      }{" "}
                      buy listings and{" "}
                      {
                        filterListings(
                          listingResults[i],
                          ModelsBookListing.ListingTypeEnum.SELL
                        ).length
                      }{" "}
                      sell listings
                    </Link>
                  ) : (
                    "This book currently has no listings"
                  )}
                </td>
                <td>
                  <Button
                    onClick={() =>
                      navigateTo(`/booktrak/listings/create`, {
                        state: {
                          book,
                        },
                      })
                    }
                    className="inline-button create-listing-button"
                  >
                    Buy
                  </Button>
                  <Button
                    onClick={() =>
                      navigateTo(`/booktrak/listings/create`, {
                        state: {
                          book,
                        },
                      })
                    }
                    className="inline-button create-listing-button"
                  >
                    Sell
                  </Button>
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};

export default BooktrakBookSearchResults;
