// React imports
import React from "react";
import BulletinLayout from "./BulletinLayout";
import BulletinIndex from "./BulletinIndex";
import BulletinShow from "./BulletinShow";
import BulletinForm from "./BulletinForm";

// Redux imports
import { connect } from "react-redux";

// External Imports
import { Routes, Route, useParams } from "react-router-dom";
import {
  bulletinTypeLostAndFound,
  bulletinTypeJob,
  bulletinTypeRide,
  bulletinTypeExchange,
  bulletinTypeAnnouncement,
} from "../../../constants/general";
import { getAPIToken } from "../../../selectors/auth";
import Error404 from "../Errors/Error404";

const BulletinMain = () => {
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
            <Route index element={<BulletinIndex type={params.type} />} />
            <Route path=":bulletinID" element={<BulletinShow />} />
            {/* TODO: pass in a boolean prop to tell BulletinForm if it's in edit mode */}
            <Route path=":bulletinID/edit" element={<BulletinForm />} />
            <Route path="new" element={<BulletinForm />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BulletinLayout>
      );
    }
  }

  // otherwise, return 404 page
  return <Error404 />;
};

const mapStateToProps = () => {
  return (state) => ({
    token: getAPIToken(state),
  });
};

export default connect(mapStateToProps)(BulletinMain);
