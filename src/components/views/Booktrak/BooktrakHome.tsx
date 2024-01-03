// React Imports
import React, { useState, useEffect } from "react";

// Redux/ Router imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// Additional Imports
import { ModelsBook } from "wso-api-client/lib/services/types";
import Button from "../../Components";

const BooktrakHome = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();

  const [results, updateResults] = useState<ModelsBook[]>([]);
  const perPage = 20;
  const [total, updateTotal] = useState(0);
  const [isResultsLoading, updateResultLoadStatus] = useState(false);

  const [selectedBook, updatedSelectedBook] = useState<ModelsBook | undefined>(
    undefined
  );

  const loadBooks = async () => {
    if (!searchParams?.get("q")) {
      updateResults([]);
      updateTotal(0);
      return;
    }
    updatedSelectedBook(undefined);
    const queryParams = {
      q: searchParams.get("q") ?? undefined,
      limit: perPage,
    };
    try {
      const resultsResponse = await wso.booktrakService.searchBooks(
        queryParams
      );
      updateResults(resultsResponse.data ?? []);
      updateTotal(resultsResponse.data?.length ?? 0);
      updateResultLoadStatus(false);
    } catch {
      updateResults([]);
    }
  };

  useEffect(() => {
    if (searchParams?.get("q")) {
      updateResultLoadStatus(true);
    }
    updateTotal(0);
    loadBooks();
    // eslint-disable-next-line
  }, [wso, searchParams?.get("q")]);

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

    if (total === 0 && searchParams?.get("q"))
      return (
        <>
          <br />
          <h1 className="no-matches-found">No matches were found.</h1>
        </>
      );

    return ListView();
  };

  if (!searchParams?.get("q")) {
    return null;
  }
  // This will act as a loading buffer
  if (!results) {
    return (
      <article className="facebook-results">
        <section>
          <br />
          <h1 className="no-matches-found">Loading...</h1>
        </section>
      </article>
    );
  }

  return (
    <article className="facebook-results">
      <section>{BooktrakResults()}</section>
    </article>
  );
};

export default BooktrakHome;
