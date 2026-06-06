import React,{ useState } from "react";

export const Card = ({
  title        = "Card title",
  description  = "",
  image        = null,
  imageBg      = "#EEEDFE",
  badge        = null,
  footer       = null,
  hoverable    = true,
  onClick      = null,
  width        = "320px",
  borderRadius = "12px",
}) => {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    width,
    borderRadius,
    background:   "var(--color-background-primary)",
    border:       hovered && hoverable
                    ? "0.5px solid var(--color-border-secondary)"
                    : "0.5px solid var(--color-border-tertiary)",
    overflow:     "hidden",
    cursor:       onClick ? "pointer" : "default",
    transform:    hovered && hoverable ? "translateY(-2px)" : "none",
    transition:   "border-color 0.15s, transform 0.15s",
    fontFamily:   "inherit",
  };

  const imageAreaStyle = {
    width:          "100%",
    height:         "160px",
    background:     imageBg,
    overflow:       "hidden",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
  };

  const badgeStyle = {
    display:      "inline-block",
    fontSize:     "11px",
    fontWeight:   "500",
    padding:      "3px 10px",
    borderRadius: "20px",
    marginBottom: "8px",
    background:   badge?.bg  ?? "#EEEDFE",
    color:        badge?.color ?? "#3C3489",
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {(image !== null) && (
        <div style={imageAreaStyle}>
          {typeof image === "string"
            ? <img src={image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : image}
        </div>
      )}

      <div style={{ padding: "14px 16px" }}>
        {badge && <span style={badgeStyle}>{badge.label}</span>}
        <p style={{ fontSize:"15px", fontWeight:"500", margin:"0 0 4px", color:"var(--color-text-primary)" }}>
          {title}
        </p>
        {description && (
          <p style={{ fontSize:"13px", color:"var(--color-text-secondary)", margin:"0", lineHeight:"1.5" }}>
            {description}
          </p>
        )}
      </div>

      {footer && (
        <div style={{ borderTop:"0.5px solid var(--color-border-tertiary)", padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:"12px", color:"var(--color-text-secondary)" }}>{footer.left}</span>
          {footer.action && (
            <button
              onClick={(e) => { e.stopPropagation(); footer.action.onClick?.(); }}
              style={{ fontSize:"12px", padding:"5px 14px", borderRadius:"6px", border:"0.5px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-primary)", cursor:"pointer", fontFamily:"inherit" }}
            >
              {footer.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

