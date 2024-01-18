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
  ModelsBookListing,
} from "wso-api-client/lib/services/types";
import { BooktrakBookState } from "./BooktrakBook";
import CourseEdit from "./BooktrakCourseEdit";
import {
  BookConditionEnumToString,
  BookConditionStringToEnum,
} from "./BooktrakUtils";

const ListingTypeEnum = ModelsBookListing.ListingTypeEnum;
const ListingConditionEnum = ModelsBookListing.ConditionEnum;
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
  const [condition, updateCondition] =
    useState<ModelsBookListing.ConditionEnum>(ListingConditionEnum.Empty);
  const [listingType, updateListingType] =
    useState<ModelsBookListing.ListingTypeEnum>(ListingTypeEnum.Empty);

  const [errors, updateErrors] = useState<string[]>([]);

  const bookListingIDParam = params.bookListingID;

  useEffect(() => {
    const loadListing = async (listingID: number) => {
      try {
        const listingResponse = await wso.booktrakService.getBookListing(
          listingID
        );
        const listingData = listingResponse.data;

        const bookResponse = await wso.booktrakService.getBook(
          listingData?.bookID ?? 0
        );
        if (
          bookResponse.data?.id === undefined &&
          bookResponse.data?.isbn13 === undefined
        ) {
          navigateTo("/error", { replace: true });
        }

        updateListing(listingData ?? undefined);
        updateDescription(listingData?.description ?? "");
        updateCondition(listingData?.condition ?? ListingConditionEnum.Empty);
        updateListingType(listingData?.listingType ?? ListingTypeEnum.Empty);
        updateBook(bookResponse.data ?? {});
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    if (bookListingIDParam) loadListing(parseInt(bookListingIDParam, 10));
    else if (book?.id === undefined && book?.isbn13 === undefined) {
      navigateTo("/error", { replace: true });
    }
  }, [bookListingIDParam, wso]);

  const createBook = async (book: ModelsBook) => {
    const isbn = book.isbn13 ?? undefined;

    // Should never be reached
    if (isbn === undefined) {
      navigateTo("/error", { replace: true });
      return;
    }

    try {
      const resp = await wso.booktrakService.createBook({
        isbn: isbn,
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
    if (condition === ListingConditionEnum.Empty) {
      updateErrors(["Please enter the condition of the book!"]);
      return;
    }
    if (listingType === ListingTypeEnum.Empty) {
      updateErrors(["Please enter the type of listing!"]);
      return;
    }

    if (!courses) {
      updateErrors(["Please add at least one course!"]);
      return;
    }

    let bookID = book?.id;
    if (!bookID) {
      const resp = await createBook(book);
      bookID = resp?.data?.id;
    }

    // Make sure we created a book in DB
    if (!bookID) {
      navigateTo("/error", { replace: true });
      return;
    }

    try {
      const courseIDs = courses.map((course) => course.id ?? -1);
      if (courseIDs) {
        await wso.booktrakService.updateBookCourses(bookID, { courseIDs });
      }

      const listingParams: BooktrakCreateBookListingParams = {
        bookID,
        condition: condition,
        description: description,
        listingType: listingType,
      };
      if (edit && listing?.id) {
        await wso.booktrakService.updateBookListing(listingParams, listing?.id);
      } else {
        await wso.booktrakService.createBookListing(listingParams);
      }
      navigateTo("/booktrak/edit");
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
        <h3>{`${edit ? "Edit listing of " : "Creating listing for"} ${
          book.title
        }`}</h3>
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
                        onChange={(event) => {
                          updateCondition(
                            BookConditionStringToEnum(event.target.value)
                          );
                        }}
                        value={BookConditionEnumToString(condition)}
                      >
                        <option value="" disabled hidden>
                          Select book condition
                        </option>
                        <option value="Poor" key="Poor">
                          Poor
                        </option>
                        <option value="Fair" key="Fair">
                          Fair
                        </option>
                        <option value="Good" key="Good">
                          Good
                        </option>
                        <option value="Very Good" key="Very Good">
                          Very Good
                        </option>
                        <option value="Like New" key="Like New">
                          Like New
                        </option>
                        <option value="New" key="New">
                          New
                        </option>
                      </select>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <strong>Are you offering to buy or sell this book?*</strong>
                  </td>
                  <td align="left">
                    <div>
                      <select
                        className="select-course-info"
                        onChange={(event) =>
                          updateListingType(
                            event.target.value === "Buy"
                              ? ListingTypeEnum.BUY
                              : ListingTypeEnum.SELL
                          )
                        }
                        value={
                          listingType === ListingTypeEnum.Empty
                            ? ""
                            : listingType === ListingTypeEnum.BUY
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
