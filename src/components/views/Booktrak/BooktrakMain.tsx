// React Imports
import React from "react";

// Component Imports
import Error404 from "../Errors/Error404";

// External Imports
import { Routes, Route } from "react-router-dom";
import BooktrakLayout from "./BooktrakLayout";
import BooktrakSearch from "./BooktrakSearch";
import BooktrakBook from "./BooktrakBook";
import BooktrakListingForm from "./BooktrakListingForm";
import BooktrakListings from "./BooktrakListings";

const BooktrakMain = () => {
  return (
    <BooktrakLayout>
      <Routes>
        <Route index element={<BooktrakSearch />} />
        <Route path="books" element={<BooktrakBook />} />
        <Route path="buy" element={<BooktrakListings showBuyListings />} />
        <Route path="sell" element={<BooktrakListings showSellListings />} />
        <Route path="edit" element={<BooktrakListings showMyListings />} />
        <Route path="books/:bookID" element={<BooktrakBook />} />
        <Route
          path="listings/:bookListingID"
          element={<BooktrakListingForm edit={true} />}
        />
        <Route
          path="listings/create"
          element={<BooktrakListingForm edit={false} />}
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BooktrakLayout>
  );
};

export default BooktrakMain;
