// src/components/ConfirmDialog.js
import React from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const LABEL = {
  "nafad-basmah.html": "Nafad-Basmah",
  // … add prettier labels for other pages if desired
};

export default function ConfirmDialog({
  show,
  page,
  onConfirm,
  onDecline,
  onClose,
}) {
  if (!show) return null;
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={true}
    >
      <Modal.Header>
        <Modal.Title>
          Redirect <strong>{LABEL[page] || page}</strong>?
        </Modal.Title>
        <Button variant="link" onClick={onClose} style={{ fontSize: "1.5rem" }}>
          &times;
        </Button>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Button variant="success" onClick={onConfirm} className="mx-2">
          Yes
        </Button>
        <Button variant="danger" onClick={onDecline} className="mx-2">
          No
        </Button>
      </Modal.Body>
    </Modal>
  );
}
