import React from "react";

export const StatsWidget = ({
  title = "Active Sessions",
  value = "12,480",
  trendText = "+14.2% from last week",
  isPositive = true,
  badgeText = "Live Updates",
  accent = "#10b981",
  bg = "#0f172a",
  metricLabel = "concurrent users",
  onDetailsClick = () => {}
}) => {
  const alpha = (hex, op) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return "rgba(" + r + "," + g + "," + b + "," + op + ")";
  };
  return (
    <>
      <style>{`
        .animated-stats-card {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .animated-stats-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px ${alpha(accent, 0.12)} !important;
          border-color: ${alpha(accent, 0.4)} !important;
        }
        .stats-pulse-dot {
          animation: statsPulse 2s infinite ease-in-out;
        }
        @keyframes statsPulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; filter: brightness(1.2); }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        .stats-action-btn {
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .stats-action-btn:hover {
          background: ${alpha(accent, 0.15)} !important;
          color: #fff !important;
          transform: translateX(4px);
        }
      `}</style>

      <div className="animated-stats-card" style={{ background: bg, borderRadius: "20px", padding: "24px", width: "300px", color: "#fff", fontFamily: "system-ui,sans-serif", boxShadow: "0 10px 40px rgba(0,0,0,0.5)", border: "1px solid " + alpha(accent, 0.2), position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%", marginBottom: "16px" }}>
          {badgeText && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "100px", background: alpha(accent, 0.1), border: "1px solid " + alpha(accent, 0.25), fontSize: "11px", fontWeight: "600", color: accent, textTransform: "uppercase" }}>
              <div className="stats-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
              {badgeText}
            </div>
          )}
        </div>

        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", fontWeight: "500", marginBottom: "6px" }}>{title}</div>
        
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "38px", fontWeight: "800", letterSpacing: "-0.5px" }}>{value}</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: "500" }}>{metricLabel}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: isPositive ? "#10b981" : "#ef4444", marginBottom: "20px", fontWeight: "600" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: isPositive ? "rotate(0deg)" : "rotate(180deg)" }}><polyline points="18 15 12 9 6 15" /></svg>
          {trendText}
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "14px" }} />

        <button className="stats-action-btn" onClick={onDetailsClick} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", border: "none", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "system-ui,sans-serif" }}>
          <span>View Analytics</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </button>
      </div>
    </>
  );
};
