import React from "react";
import "./confirm-modal.css"
import { ButtonGroup, Modal, Button } from "react-bootstrap";

/**
 * @param {object} props 
 * @param {boolean} props.show
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setShow
 * @param {string} props.title 
 * @param {string} props.bodyText
 * @param {string} props.OkText
 * @param {string} props.cancelText
 * @param {() => void | undefined} props.onOk
 * @param {() => void | undefined} props.onCancel
 * @returns {React.ReactNode}
 */
const ConfirmModal = ({
  show,
  setShow,
  title,
  bodyText,
  OkText,
  cancelText,
  onOk,
  onCancel,
}) => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText}</Modal.Body>
      <Modal.Footer>
        <ButtonGroup>
          <Button
            onClick={() => {
              setShow(false);
              if (onOk) {
                onOk();
              }
            }}
            variant="primary"
          >
            {OkText}
          </Button>
          <Button
            onClick={() => {
              setShow(false);
              if (onCancel) {
                onCancel();
              }
            }}
            variant="danger"
          >
            {cancelText}
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;