import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useError } from '../context/ErrorContext';

const ForbiddenModal: React.FC = () => {
  const { t } = useTranslation();
  const { showForbiddenModal, setForbiddenModal, authMessage } = useError(); // Destructure authMessage

  // The modal is blocking, so there's no close button for the user.
  // It will only be hidden if the application logic decides so (e.g., if permissions change).
  const handleClose = () => {
    console.log("Forbidden modal cannot be closed by user action.");
    // setForbiddenModal(false); // Do not allow user to close directly
  };

  return (
    <Modal show={showForbiddenModal} onHide={handleClose} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>{t('errors.forbiddenTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{authMessage || t('errors.forbiddenMessage')}</p> {/* Display authMessage or default */}
      </Modal.Body>
      {/* No close button in footer as per requirements */}
    </Modal>
  );
};

export default ForbiddenModal;