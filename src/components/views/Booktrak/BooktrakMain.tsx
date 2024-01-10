// React Imports
import React from "react";

// Component Imports
import Error404 from "../Errors/Error404";

// External Imports
import { Routes, Route } from "react-router-dom";
import BooktrakLayout from "./BooktrakLayout";
import BooktrakHome from "./BooktrakHome";
import BooktrakBook from "./BooktrakBook";
import BooktrakListing from "./BooktrakListing";

const BooktrakMain = () => {
  return (
    <BooktrakLayout>
      <Routes>
        <Route index element={<BooktrakHome />} />
        <Route path="books" element={<BooktrakBook />} />
        <Route path="books/:bookID" element={<BooktrakBook />} />
        <Route
          path="listings/:bookListingID"
          element={<BooktrakListing edit={true} />}
        />
        <Route
          path="listings/create"
          element={<BooktrakListing edit={false} />}
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BooktrakLayout>
  );
};

export default BooktrakMain;