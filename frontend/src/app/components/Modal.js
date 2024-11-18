"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import closeIcon from "/public/icons/close.svg";

export default function Modal({
  show,
  onClose,
  title,
  description,
  icon,
  onConfirm,
  confirmText = "확인",
  cancelText = "취소",
  showConfirmButton = true,
  showCancelButton = true,
  width = "45.125rem",
  height = "25.25rem",
  disabled = false, // disabled prop 추가
}) {
  if (!show) return null;

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    height: height,
    backgroundColor: "var(--ButtonText, #FFF)",
    borderRadius: "2.5rem",
    zIndex: 1000,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  };

  return (
    <>
      <div style={modalStyle}>
        <Image
          src={closeIcon}
          alt="Close"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
          onClick={() => !disabled && onClose()}
        />

        {icon && (
          <motion.div
            animate={{
              x: [0, -10, 10, -8, 8, 0],
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              repeat: 1,
            }}
            style={{ marginBottom: "1.5rem" }}
          >
            <Image src={icon} alt="Alert Icon" width={100} height={100} />
          </motion.div>
        )}

        <h2
          style={{
            color: "var(--normalText, #2F3438)",
            fontFamily: "'Tmoney RoundWind', sans-serif",
            fontSize: "1.875rem",
            fontWeight: "500",
            marginTop: "1.5rem",
            textAlign: "center",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: "var(--subText, #828C94)",
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "1.0625rem",
            lineHeight: "1.75rem",
            marginTop: "1rem",
            textAlign: "center",
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent:
              showConfirmButton && showCancelButton ? "center" : "space-evenly",
            marginTop: "2.5rem",
            width: showConfirmButton && !showCancelButton ? "12rem" : "auto",
          }}
        >
          {showCancelButton && (
            <button
              className="modal-button cancel-button"
              onClick={() => !disabled && onClose()}
              style={{
                width: "12rem",
                height: "2.5rem",
                borderRadius: "0.625rem",
                border: "1px solid var(--GreyButtonText, #C2C8CB)",
                backgroundColor: "var(--ButtonText, #FFF)",
                marginRight: showConfirmButton ? "1rem" : "0",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "1.0625rem",
                color: "var(--subText, #828C94)",
                opacity: disabled ? 0.5 : 1,
              }}
              disabled={disabled}
            >
              {cancelText}
            </button>
          )}
          {showConfirmButton && (
            <button
              className="modal-button confirm-button"
              onClick={onConfirm}
              style={{
                width: "12rem",
                height: "2.5rem",
                borderRadius: "0.625rem",
                backgroundColor: "#F6F8FA",
                border: "1px solid var(--GreyButtonText, #C2C8CB)",
                color: "#828C94",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "1.0625rem",
                opacity: disabled ? 0.5 : 1,
              }}
              disabled={disabled}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
        onClick={() => !disabled && onClose()}
      />
    </>
  );
}
