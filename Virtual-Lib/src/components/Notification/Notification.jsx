import React, { useState, useEffect } from "react";

export const Notification = ({
  message = "This is a notification.",
  type = "info",
  duration = 3000,
  accent = "#0ea5e9",
  bg = "#1e293b",
  onClose = () => {}
}) => {
  const [visible, setVisible] = useState(true);
  const alpha = (hex, op) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return "rgba(" + r + "," + g + "," + b + "," + op + ")";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    visible && (
      <div style={{
        background: bg,
        borderRadius: "12px",
        padding: "16px",
        width: "300px",
        color: "#fff",
        fontFamily: "system-ui,sans-serif",
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        transform: visible ? "translateY(0)" : "translateY(-20px)",
        transition: "transform 0.3s ease-in-out",
        border: "1px solid " + alpha(accent, 0.2),
        position: "relative",
        margin: "10px auto"
      }}>
        <span style={{ fontWeight: "700" }}>{type === "info" ? "🔔" : "⚠️"} {message}</span>
      </div>
    )
  );
};