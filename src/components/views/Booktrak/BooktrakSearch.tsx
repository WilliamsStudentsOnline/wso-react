// React Imports
import React, { useState, useEffect } from "react";

// Redux/ Router imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

// Additional Imports
import {
  ModelsBook,
  ModelsBookListing,
} from "wso-api-client/lib/services/types";
import "../../stylesheets/Booktrak.css";
import BooktrakBookSearchResults from "./BooktrakBookSearchResults";

const BooktrakSearch = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, updateQuery] = useState("");

  const [results, updateResults] = useState<ModelsBook[]>([]);
  const [listingResults, updateListingResults] = useState<
    (ModelsBookListing[] | undefined)[]
  >(new Array(20));
  const resultsPerPage = 20;
  const [total, updateTotal] = useState(0);
  const [isResultsLoading, updateIsResultsLoading] = useState(false);
  const urlQueryName = "book_query";

  const loadBooks = async () => {
    const bookQuery = searchParams?.get(urlQueryName);
    if (!bookQuery) {
      updateResults([]);
      updateTotal(0);
      return;
    }

    const queryParams = {
      q: bookQuery,
      limit: resultsPerPage,
    };

    try {
      const resultsResponse = await wso.booktrakService.searchBooks(
        queryParams
      );
      const responseData =
        resultsResponse.data?.filter((book) => book.isbn13) ?? [];

      // get listings associated with books
      for (let i = 0; i < responseData.length; i++) {
        wso.booktrakService
          .listBookListings({
            isbn: responseData[i].isbn13,
          })
          .then((response) => {
            updateListingResults((prevResults) => {
              const newResults = [...prevResults];
              newResults[i] = response.data ?? [];
              return newResults;
            });
          });
      }

      updateResults(responseData);
      updateTotal(responseData.length ?? 0);
      updateIsResultsLoading(false);
    } catch {
      updateResults([]);
      updateTotal(0);
    }
  };

  useEffect(() => {
    if (searchParams?.get(urlQueryName)) {
      updateQuery(searchParams.get(urlQueryName) ?? "");
      updateIsResultsLoading(true);
    } else {
      updateQuery("");
    }

    loadBooks();
  }, [wso, searchParams?.get(urlQueryName)]);

  // Returns the results of the search
  const BooktrakResults = () => {
    if (isResultsLoading) {
      return (
        <>
          <br />
          <h1 className="no-matches-found">Loading...</h1>
        </>
      );
    }

    if (total === 0 && searchParams?.get(urlQueryName))
      return (
        <>
          <br />
          <h1 className="no-matches-found">No matches were found.</h1>
        </>
      );

    return BooktrakBookSearchResults({ results, listingResults, navigateTo });
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    searchParams.set(urlQueryName, query);
    navigateTo(`/booktrak?${searchParams.toString()}`);
  };

  return (
    <div className="booktrak-home-page-container">
      <form onSubmit={submitHandler} className="search-form">
        <input
          className="search-bar"
          id="search"
          type="search"
          placeholder="Search for a book..."
          autoFocus
          onChange={(event) => updateQuery(event.target.value)}
          value={query}
        />
        <input
          data-disable-with="Search"
          type="submit"
          value="Search"
          className="submit"
        />
      </form>
      {searchParams?.get(urlQueryName) ? (
        results ? (
          <article className="facebook-results">
            <section>{BooktrakResults()}</section>
          </article>
        ) : (
          <article className="facebook-results">
            <section>
              <br />
              <h1 className="no-matches-found">Loading...</h1>
            </section>
          </article>
        )
      ) : (
        <p className="info-blurb">
          {
            "BookTrak is where students connect to buy and sell used books with ease. We link courses to their textbooks, so you can quickly find what you need and see who's selling. Listing your books is straightforward too: just search for the title or the ISBN of the book you want to list, make sure the ISBN matches your book, and you're ready to go. It's a simple, student-friendly way to keep those textbooks circulating."
          }
        </p>
      )}
    </div>
  );
};

export default BooktrakSearch;
