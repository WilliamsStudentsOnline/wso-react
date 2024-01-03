// React Imports
import React, { useState, useEffect } from "react";
import { Line, Photo } from "../../Skeleton";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Additional Imports
import { ModelsBook } from "wso-api-client/lib/services/types";
import BooktrakListings from "./BooktrakListings";

export type BooktrakBookState = {
  book: ModelsBook;
};

const BooktrakBook = () => {
  const wso = useAppSelector(getWSO);
  const state = useLocation().state as BooktrakBookState | null;

  const navigateTo = useNavigate();
  const params = useParams();

  const [viewBook, updateViewBook] = useState<ModelsBook | undefined>(
    state?.book ?? undefined
  );
  useEffect(() => {
    const loadTarget = async () => {
      // Check if current book is in DB
      if (viewBook) {
        const isbn = viewBook.isbn13 ?? viewBook.isbn10 ?? null;
        console.log(viewBook);
        if (!isbn) {
          return;
        }
        try {
          const bookResponse = await wso.booktrakService.listBooks({
            isbn_10: isbn.length === 10 ? isbn : undefined,
            isbn_13: isbn.length === 13 ? isbn : undefined,
          });
          const books = bookResponse.data;
          console.log(books);
          if (books) {
            navigateTo(`/booktrak/books/${books[0].id}`);
            updateViewBook(books[0]);
            return;
          }
        } catch {
          return;
        }
      }
      // No book ID found and no viewBook
      if (!params.bookID) {
        navigateTo("/404", { replace: true });
        return;
      }

      // Fetch book by ID
      const bookID = parseInt(params.bookID, 10);
      try {
        const targetResponse = await wso.booktrakService.getBook(bookID);
        updateViewBook(targetResponse.data);
      } catch (error) {
        // 404 means book does not exist in DB
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = error as any;
        if (e.errorCode === 404) {
          navigateTo("/404", { replace: true });
          return;
        }
      }
    };
    loadTarget();
  }, [wso]);

  // Returns the room/ office information of the user.
  const bookAuthors = (book?: ModelsBook) => {
    if (!book) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h4>
            <Line width="25%" />
          </h4>
          <br />
        </>
      );
    }
    if (book.authors) {
      return (
        <>
          <h5>Authors:</h5>
          {book.authors.map((author, i) => {
            return <h4 key={i}>{author}</h4>;
          })}
          <br />
        </>
      );
    }
    return null;
  };

  const bookISBN = (book?: ModelsBook) => {
    if (!book) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h4>
            <Line width="10%" />
          </h4>
          <br />
        </>
      );
    }

    return (
      <>
        {book.isbn10 ? (
          <>
            <h5>ISBN-10:</h5>
            <h4>{book.isbn10}</h4>
            <br />
          </>
        ) : null}
        {book?.isbn13 ? (
          <>
            <h5>ISBN-13:</h5>
            <h4>{book.isbn13}</h4>
            <br />
          </>
        ) : null}{" "}
      </>
    );
  };

  const picture = (book?: ModelsBook) => {
    if (book?.imageLinks === undefined) return <Photo />;

    return <img src={book?.imageLinks} alt="avatar" />;
  };

  const bookTitle = (book?: ModelsBook) => {
    if (book) {
      return `${book.title}`;
    }

    return <Line width="40%" />;
  };

  const bookListings = (book?: ModelsBook) => {
    if (book && book.id) {
      return <BooktrakListings book={book} />;
    }
    return null;
  };

  return (
    <>
      <article className="facebook-profile">
        <section>
          <aside className="picture">{picture(viewBook)}</aside>

          <aside className="info">
            <h3>{bookTitle(viewBook)}</h3>
            <br />
            {bookAuthors(viewBook)}
            {bookISBN(viewBook)}
          </aside>
        </section>
      </article>
      {bookListings(viewBook)}
    </>
  );
};

export default BooktrakBook;
