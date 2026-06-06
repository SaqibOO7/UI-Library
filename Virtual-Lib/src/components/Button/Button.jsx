import React,{ useState } from "react";

export const Button = ({
  label       = "Click me",
  onClick,
  variant     = "primary",
  size        = "md",
  disabled    = false,
  fullWidth   = false,
  icon        = null,
}) => {
  const [hovered, setHovered] = useState(false);
  const [active,  setActive]  = useState(false);

  const palette = {
    primary:   { bg: "#534AB7", hover: "#3C3489", text: "#fff", border: "transparent" },
    secondary: { bg: "transparent", hover: "#EEEDFE", text: "#534AB7", border: "#534AB7" },
    danger:    { bg: "#E24B4A", hover: "#A32D2D", text: "#fff", border: "transparent" },
  };

  const sizes = {
    sm: { padding: "6px 14px",  fontSize: "13px", borderRadius: "6px"  },
    md: { padding: "10px 22px", fontSize: "15px", borderRadius: "8px"  },
    lg: { padding: "14px 30px", fontSize: "17px", borderRadius: "10px" },
  };

  const { bg, hover, text, border } = palette[variant] ?? palette.primary;
  const sz = sizes[size] ?? sizes.md;

  const style = {
    display:        fullWidth ? "flex" : "inline-flex",
    width:          fullWidth ? "100%" : "auto",
    alignItems:     "center",
    justifyContent: "center",
    gap:            "8px",
    padding:        sz.padding,
    fontSize:       sz.fontSize,
    fontWeight:     "500",
    fontFamily:     "inherit",
    color:          disabled ? "#aaa" : text,
    background:     disabled ? "#e0e0e0" : hovered ? hover : bg,
    border:         `1.5px solid ${disabled ? "#ccc" : border || bg}`,
    borderRadius:   sz.borderRadius,
    cursor:         disabled ? "not-allowed" : "pointer",
    opacity:        disabled ? "0.6" : "1",
    transform:      active && !disabled ? "scale(0.97)" : "scale(1)",
    transition:     "background 0.15s, transform 0.1s, border-color 0.15s",
    userSelect:     "none",
    outline:        "none",
  };

  return (
    <button
      style={style}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
    </button>
  );
};
