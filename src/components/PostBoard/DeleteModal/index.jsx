// React imports
import React from "react";
import PropTypes from "prop-types";

// External imports
import Delete from "../../../assets/SVG/Delete.svg";
import {
  EuiButton,
  EuiButtonEmpty,
  EuiOverlayMask,
  EuiModal,
  EuiModalFooter,
  EuiModalBody,
} from "@elastic/eui";

const DeleteModal = ({ closeModal, deleteHandler }) => {
  return (
    <EuiOverlayMask>
      <EuiModal onClose={closeModal}>
        <EuiModalBody>
          <img src={Delete} style={{ width: "100%" }} alt="Delete" />
          Are You Sure?
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>

          <EuiButton onClick={deleteHandler} fill color="danger">
            Delete
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

DeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
};

export default DeleteModal;
