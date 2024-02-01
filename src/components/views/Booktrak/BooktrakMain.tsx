// React Imports
import React, { useEffect, useState } from "react";

// Component Imports
import Error404 from "../Errors/Error404";

// Redux/Routing imports
import { useAppSelector } from "../../../lib/store";
import { getAPIToken, getWSO } from "../../../lib/authSlice";

// External Imports
import { Routes, Route } from "react-router-dom";
import BooktrakLayout from "./BooktrakLayout";
import BooktrakSearch from "./BooktrakSearch";
import BooktrakBook from "./BooktrakBook";
import BooktrakListingForm from "./BooktrakListingForm";
import BooktrakListings from "./BooktrakListings";
import "../../stylesheets/Booktrak.css";
import RequireScope from "../../../router-permissions";

const BooktrakMain = () => {
  const wso = useAppSelector(getWSO);
  const token = useAppSelector(getAPIToken);

  const [apiAvailable, updateApiAvailable] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    let isMounted = true;
    const checkApi = async () => {
      try {
        const response = await wso.booktrakService.healthCheck();
        if (isMounted) {
          updateApiAvailable(response.data?.ok ?? false);
        }
      } catch {
        updateApiAvailable(false);
      }
    };
    checkApi();
    return () => {
      isMounted = false;
    };
  }, [wso]);

  return apiAvailable ? (
    <BooktrakLayout>
      <Routes>
        <Route index element={<BooktrakSearch />} />
        <Route path="books" element={<BooktrakBook />} />
        <Route path="buy" element={<BooktrakListings showBuyListings />} />
        <Route path="sell" element={<BooktrakListings showSellListings />} />
        <Route
          path="edit"
          element={
            <RequireScope token={token} name="booktrak.write">
              <BooktrakListings showMyListings />
            </RequireScope>
          }
        />
        <Route path="books/:bookID" element={<BooktrakBook />} />
        <Route
          path="listings/:bookListingID"
          element={
            <RequireScope token={token} name="booktrak.write">
              <BooktrakListingForm edit={true} />
            </RequireScope>
          }
        />
        <Route
          path="listings/create"
          element={
            <RequireScope token={token} name="booktrak.write">
              <BooktrakListingForm edit={false} />
            </RequireScope>
          }
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BooktrakLayout>
  ) : (
    <section className="booktrak-unavailable-container">
      <h1>BookTrak is currently unavailable.</h1>
    </section>
  );
};

export default BooktrakMain;
