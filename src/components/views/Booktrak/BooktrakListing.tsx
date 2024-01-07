// React imports
import React, { useState, useEffect } from "react";
import "../../stylesheets/FactrakSurvey.css";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  AutocompleteACEntry,
  BooktrakCreateBookListingParams,
  ModelsBook,
  ModelsBookCondition,
  ModelsBookListing,
} from "wso-api-client/lib/services/types";
import { BooktrakBookState } from "./BooktrakBook";
import CourseEdit from "./BooktrakCourseEdit";
import { pascalToTitleCase } from "../../../lib/general";

const BooktrakListing = ({ edit }: { edit: boolean }) => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const params = useParams();
  const bookState = useLocation().state as BooktrakBookState | null;
  const [listing, updateListing] = useState<ModelsBookListing | undefined>(
    undefined
  );
  const [book, updateBook] = useState<ModelsBook>(bookState?.book ?? {});
  const [courses, updateCourses] = useState<AutocompleteACEntry[]>([]);
  const [description, updateDescription] = useState("");
  const [condition, updateCondition] = useState<ModelsBookCondition>(
    ModelsBookCondition.MAX
  );
  const [isBuyListing, updateIsBuyListing] = useState<boolean | undefined>(
    undefined
  );

  const [errors, updateErrors] = useState<string[]>([]);

  const bookListingIDParam = params.bookListingID;

  useEffect(() => {
    const loadListing = async (listingID: number) => {
      try {
        const listingResponse = await wso.booktrakService.getBookListing(
          listingID
        );
        const listingData = listingResponse.data;

        updateListing(listingData ?? undefined);
        updateDescription(listingData?.description ?? "");
        updateCondition(listingData?.condition ?? ModelsBookCondition.MAX);
        updateIsBuyListing(listingData?.isBuyListing);
        updateBook(listingData?.book ?? {});
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    if (bookListingIDParam) loadListing(parseInt(bookListingIDParam, 10));

    if (
      book?.id === undefined &&
      book?.isbn10 === undefined &&
      book?.isbn13 === undefined
    ) {
      navigateTo("/error", { replace: true });
    }
  }, [bookListingIDParam, wso]);

  const createBook = async (book: ModelsBook, courseIDs: number[]) => {
    const isbn = book.isbn13 ?? book.isbn10 ?? undefined;

    // Should never be reached
    if (isbn === undefined || !courseIDs) {
      navigateTo("/error", { replace: true });
      return;
    }

    try {
      const resp = await wso.booktrakService.createOrUpdateBook({
        isbn: isbn,
        courseIDs: courseIDs,
      });
      updateBook(resp.data ?? {});
      return resp;
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };
  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    // Some error checking
    if (condition >= ModelsBookCondition.MAX || condition < 0) {
      updateErrors(["Please enter the condition of the book!"]);
      return;
    }
    if (isBuyListing === undefined) {
      updateErrors(["Please enter the type of listing!"]);
      return;
    }

    if (!courses) {
      updateErrors(["Please add at least one course!"]);
      return;
    }

    let bookID = book?.id;
    if (!bookID) {
      const resp = await createBook(
        book,
        courses.map((course) => course.id ?? -1)
      );
      bookID = resp?.data?.id;
    }

    // Make sure we created a book in DB
    if (!bookID) {
      navigateTo("/error", { replace: true });
      return;
    }

    try {
      if (edit && listing?.id) {
        // TODO: Update listing
      } else {
        const listingParams: BooktrakCreateBookListingParams = {
          bookID,
          condition: condition,
          description: description,
          isBuyListing: isBuyListing,
        };
        await wso.booktrakService.createBookListing(listingParams);
      }
      navigateTo("/factrak/surveys");
    } catch (error) {
      // TODO: Add error type from wso-api-client
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateErrors([(error as any).message, ...((error as any)?.errors || [])]);
    }
  };

  // Generates the title of the listing
  const listingTitle = () => {
    return (
      <>
        {edit && listing ? (
          <h3>
            Editing listing of
            {book.title}
          </h3>
        ) : null}
        <h3>{`Creating listing for ${book.title}`}</h3>
      </>
    );
  };

  return (
    <div className="article">
      <section>
        <article>
          <div id="errors">
            {errors ? errors.map((msg) => <p key={msg}>{msg}</p>) : null}
          </div>

          <form onSubmit={(event) => submitHandler(event)}>
            {listingTitle()}
            <table id="factrak-survey-table">
              <tbody>
                <tr>
                  <td align="left">
                    <strong>What courses use this book?*</strong>
                  </td>
                  <td align="left">
                    <CourseEdit
                      courses={courses}
                      updateCourses={updateCourses}
                      updateErrors={updateErrors}
                    />
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <strong>What is the condition of the book?*</strong>
                  </td>
                  <td align="left">
                    <div>
                      <select
                        className="select-course-info"
                        onChange={(event) =>
                          updateCondition(
                            parseInt(
                              event.target.value,
                              10
                            ) as ModelsBookCondition
                          )
                        }
                        value={
                          condition === ModelsBookCondition.MAX ? "" : condition
                        }
                      >
                        <option value="" disabled hidden>
                          Select book condition
                        </option>
                        {[...Array(ModelsBookCondition.MAX)].map((_, i) => (
                          <option value={i} key={i}>
                            {pascalToTitleCase(ModelsBookCondition[i])}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <strong>Are you offering to buy or sell this book?</strong>
                  </td>
                  <td align="left">
                    <div>
                      <select
                        className="select-course-info"
                        onChange={(event) =>
                          updateIsBuyListing(event.target.value === "Buy")
                        }
                        value={
                          isBuyListing === undefined
                            ? ""
                            : isBuyListing
                            ? "Buy"
                            : "Sell"
                        }
                      >
                        <option value="" disabled hidden>
                          Select listing type
                        </option>
                        <option value="Buy" key="Buy">
                          Buy
                        </option>
                        <option value="Sell" key="Sell">
                          Sell
                        </option>
                      </select>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <br />
                    <strong>Description*</strong>
                    <textarea
                      style={{ minHeight: "100px" }}
                      placeholder="Maximum 500 characters"
                      value={description}
                      onChange={(event) =>
                        updateDescription(event.target.value)
                      }
                    />
                    <input
                      type="submit"
                      value="Save"
                      data-disable-with="Save"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </article>
      </section>
    </div>
  );
};

export default BooktrakListing;
