import React, { useState, useEffect } from "react";

export const BeautifulNavbar = ({
  logo = "MyBrand",
  links = ["Home", "About", "Services", "Contact"],
  ctaText = "Join Us",
  accent = "#0ea5e9",
  bg = "#0d1117",
  onCtaClick = () => {},
  onLinkClick = () => {}
}) => {
  const [active, setActive] = useState("Home");
  const [isMobile, setIsMobile] = useState(false);
  const alpha = (hex, op) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return "rgba(" + r + "," + g + "," + b + "," + op + ")";
  };
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return (
    <nav style={{ background: bg, borderBottom: "1px solid rgba(255,255,255,0.1)", fontFamily: "system-ui,sans-serif", width: "100%", boxSizing: "border-box", padding: "10px 20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "10px", background: accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700" }}>{logo[0]}</div>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>{logo}</span>
        </div>
        {!isMobile && (
          <div style={{ display: "flex", gap: "15px" }}>
            {links.map(link => (
              <button key={link} onClick={() => { setActive(link); onLinkClick(link); }} style={{ background: active === link ? alpha(accent, 0.2) : "transparent", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: active === link ? "700" : "500", color: active === link ? accent : "rgba(255,255,255,0.7)", cursor: "pointer", fontFamily: "inherit" }}>{link}</button>
            ))}
          </div>
        )}
        <button onClick={onCtaClick} style={{ padding: "8px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, " + accent + ", rgba(14,165,233,0.7) )" , color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>{ctaText}</button>
      </div>
    </nav>
  );
};