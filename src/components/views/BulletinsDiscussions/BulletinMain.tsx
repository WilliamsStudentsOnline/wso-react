// React imports
import React from "react";
import BulletinLayout from "./BulletinLayout";
import BulletinIndex from "./BulletinIndex";
import BulletinShow from "./BulletinShow";
import BulletinForm from "./BulletinForm";

// Redux imports
import { getAPIToken } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";

// External Imports
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Error404 from "../Errors/Error404";
import RequireScope from "../../../router-permissions";
import { PostType } from "../../../lib/types";

const TypeFilteredIndex = () => {
  const { type } = useParams();
  if (!type || !Object.values<string>(PostType).includes(type)) {
    return <Error404 />;
  }
  if (type === PostType.Discussions) {
    return <Navigate to="/bulletins?types=discussions" replace />;
  }
  return <Navigate to={`/bulletins?types=${type}`} replace />;
};

const BulletinMain = () => {
  const token = useAppSelector(getAPIToken);

  return (
    <BulletinLayout>
      <Routes>
        <Route
          index
          element={
            <RequireScope token={token} name="bulletins">
              <BulletinIndex />
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
        <Route
          path=":type/new"
          element={
            <RequireScope token={token} name="bulletins.new">
              <BulletinForm />
            </RequireScope>
          }
        />
        <Route
          path=":type/:bulletinID/edit"
          element={
            <RequireScope token={token} name="bulletins.edit">
              <BulletinForm />
            </RequireScope>
          }
        />
        <Route
          path=":type/:bulletinID"
          element={
            <RequireScope token={token} name="bulletins">
              <BulletinShow />
            </RequireScope>
          }
        />
        <Route
          path=":type"
          element={
            <RequireScope token={token} name="bulletins">
              <TypeFilteredIndex />
            </RequireScope>
          }
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BulletinLayout>
  );
};

export default BulletinMain;
