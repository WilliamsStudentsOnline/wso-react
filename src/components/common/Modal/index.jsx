// React imports
import React from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.scss";

import {
  EuiButtonEmpty,
  EuiButton,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiOverlayMask,
} from "@elastic/eui";

const DeleteModal = ({
  alt,
  closeModal,
  deleteHandler,
  image,
  message,
  title,
}) => {
  return (
    <EuiOverlayMask>
      <EuiModal className={styles.modal} onClose={closeModal}>
        <EuiModalBody>
          <img src={image} className={styles.modalImage} alt={alt} />
          <div className={styles.modalTitle}>{title}</div>
          <div className={styles.modalMessage}>{message}</div>
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
  alt: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  message: PropTypes.string,
  title: PropTypes.string,
};

DeleteModal.defaultProps = {
  message: "",
  title: "Are you sure?",
};

const InfoModal = ({ alt, closeModal, image, message, title }) => {
  return (
    <EuiOverlayMask>
      <EuiModal className={styles.modal} onClose={closeModal}>
        <EuiModalBody>
          <img src={image} className={styles.modalImage} alt={alt} />
          <div className={styles.modalTitle}>{title}</div>
          <div className={styles.modalMessage}>{message}</div>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButton onClick={closeModal} fill>
            Got it!
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

InfoModal.propTypes = {
  alt: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  message: PropTypes.string,
  title: PropTypes.string,
};
InfoModal.defaultProps = {
  message: "",
  title: "",
};

export { DeleteModal, InfoModal };
