// React Imports
import React, { useState, useEffect } from "react";

// Redux/ Router imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// Additional Imports
import { ModelsBook } from "wso-api-client/lib/services/types";
import Button from "../../Components";
import "../../stylesheets/Booktrak.css";

const BooktrakHome = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, updateQuery] = useState("");

  const [results, updateResults] = useState<ModelsBook[]>([]);
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
      updateResults(resultsResponse.data ?? []);
      updateTotal(resultsResponse.data?.length ?? 0);
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

  // Displays results in a list view when there are too many results
  const ListView = () => {
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th className="unix-column">ISBN</th>
              <th>Cover</th>
              <th>Buy/Sell</th>
            </tr>
          </thead>
          <tbody>
            {results &&
              results.map((book, i) => {
                console.log(book.imageLink);
                if (book)
                  return (
                    <tr key={i}>
                      <td>
                        <Link to={"/booktrak/books"} state={{ book: book }}>
                          {book.title}
                        </Link>
                      </td>
                      <td>{book.authors?.join(", ")}</td>
                      <td>{book.isbn13 ?? book.isbn10}</td>
                      <td style={{ textAlign: "center" }}>
                        <a href={book.infoLink}>
                          {book.imageLink ? (
                            <img
                              src={book.imageLink}
                              alt="No cover available"
                              style={{
                                cursor: "pointer",
                                borderRadius: "5px",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                              }}
                              onMouseDown={(event) => {
                                event.currentTarget.style.transform =
                                  "translateY(2px)";
                                event.currentTarget.style.boxShadow =
                                  "0 0 5px rgba(0, 0, 0, 0.3)";
                              }}
                              onMouseUp={(event) => {
                                event.currentTarget.style.transform =
                                  "translateY(0)";
                                event.currentTarget.style.boxShadow =
                                  "0 2px 5px rgba(0, 0, 0, 0.3)";
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                display: "inline-block",
                                cursor: "pointer",
                                borderRadius: "5px",
                                padding: "10px",
                                border: "1px solid #ccc",
                                backgroundColor: "#f9f9f9",
                                color: "#999",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                              }}
                            >
                              No Cover Available
                            </div>
                          )}
                        </a>
                      </td>
                      <td>
                        <Button
                          onClick={() =>
                            navigateTo(`/booktrak/listings/create`, {
                              state: {
                                book: book,
                              },
                            })
                          }
                          className="inline-button"
                        >
                          Buy
                        </Button>{" "}
                        <Button
                          onClick={() =>
                            navigateTo(`/booktrak/listings/create`, {
                              state: {
                                book: book,
                              },
                            })
                          }
                          className="inline-button"
                        >
                          Sell
                        </Button>{" "}
                      </td>
                    </tr>
                  );
                else return null;
              })}
          </tbody>
        </table>
      </>
    );
  };

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

    return ListView();
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    searchParams.set(urlQueryName, query);
    navigateTo(`/booktrak?${searchParams.toString()}`);
  };

  return (
    <div className="booktrak-page-container">
      <form onSubmit={submitHandler} className="booktrak-search-form">
        <input
          className="search-bar"
          id="search"
          type="search"
          placeholder="Search Booktrak"
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
      {searchParams?.get(urlQueryName) &&
        (results ? (
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
        ))}
    </div>
  );
};

export default BooktrakHome;
