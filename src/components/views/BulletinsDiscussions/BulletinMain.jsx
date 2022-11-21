// React imports
import React from "react";
import BulletinLayout from "./BulletinLayout";
import BulletinIndex from "./BulletinIndex";
import BulletinShow from "./BulletinShow";
import BulletinForm from "./BulletinForm";

// Redux imports
import { getAPIToken } from "../../../reducers/authSlice";
import { useAppSelector } from "../../../lib/store";

// External Imports
import { Routes, Route, useParams } from "react-router-dom";
import {
  bulletinTypeLostAndFound,
  bulletinTypeJob,
  bulletinTypeRide,
  bulletinTypeExchange,
  bulletinTypeAnnouncement,
} from "../../../constants/general";
import Error404 from "../Errors/Error404";
import RequireScope from "../../../router-permissions";

const BulletinMain = () => {
  const token = useAppSelector(getAPIToken);
  const params = useParams();

  if (params.type) {
    const validBulletinTypes = [
      bulletinTypeLostAndFound,
      bulletinTypeRide,
      bulletinTypeJob,
      bulletinTypeExchange,
      bulletinTypeAnnouncement,
    ];

    if (validBulletinTypes.indexOf(params.type) !== -1) {
      // if contains param type and type is valid, then return content
      return (
        <BulletinLayout type={params.type}>
          <Routes>
            <Route
              index
              element={
                <RequireScope token={token} name="bulletins">
                  <BulletinIndex type={params.type} />
                </RequireScope>
              }
            />
            <Route
              path=":bulletinID"
              element={
                <RequireScope token={token} name="bulletins">
                  <BulletinShow />
                </RequireScope>
              }
            />
            {/* TODO: pass in a boolean prop to tell BulletinForm if it's in edit mode */}
            <Route
              path=":bulletinID/edit"
              element={
                <RequireScope token={token} name="bulletins.edit">
                  <BulletinForm />
                </RequireScope>
              }
            />
            <Route
              path="new"
              element={
                <RequireScope token={token} name="bulletins.new">
                  <BulletinForm />
                </RequireScope>
              }
            />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BulletinLayout>
      );
    }
  }

  // otherwise, return 404 page
  return <Error404 />;
};

export default BulletinMain;
