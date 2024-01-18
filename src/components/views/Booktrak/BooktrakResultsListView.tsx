import React from "react";
import { Link, NavigateFunction } from "react-router-dom";
import { ModelsBook } from "wso-api-client/lib/services/types";
import Button from "../../Components";
import "../../stylesheets/Booktrak.css";

const BooktrakResultsListView = ({
  results,
  navigateTo,
}: {
  results: ModelsBook[];
  navigateTo: NavigateFunction;
}) => {
  return (
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
          results.map((book, i) => (
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
                        event.currentTarget.style.transform = "translateY(2px)";
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
                    <div className="book-missing-image">No Cover Available</div>
                  )}
                </a>
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
                  className="inline-button"
                >
                  Buy
                </Button>{" "}
                <Button
                  onClick={() =>
                    navigateTo(`/booktrak/listings/create`, {
                      state: {
                        book,
                      },
                    })
                  }
                  className="inline-button"
                >
                  Sell
                </Button>{" "}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default BooktrakResultsListView;
