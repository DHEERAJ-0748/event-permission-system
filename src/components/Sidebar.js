import React from "react";

export default function Sidebar({ role, activePage, setActivePage, logout }) {
  const menuOptions = {
    Student: ["Home", "Events", "Profile"],
    Club: ["Home", "Create Event", "Manage Events"],
    Faculty: ["Home", "Approve Events", "Reports"],
    Admin: ["Home", "Manage Users", "System Settings"],
    Principal: ["Home", "Overview", "Approvals"]
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={{ color: "white" }}>Campus ERP</h2>

      {menuOptions[role].map((item) => (
        <div
          key={item}
          style={{
            ...styles.menuItem,
            background:
              activePage === item
                ? "rgba(255,255,255,0.2)"
                : "transparent"
          }}
          onClick={() => setActivePage(item)}
        >
          {item}
        </div>
      ))}

      <div style={styles.logout} onClick={logout}>
        Logout
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    background: "#1e3c72",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  menuItem: {
    color: "white",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px"
  },
  logout: {
    marginTop: "auto",
    color: "#ffdddd",
    cursor: "pointer",
    padding: "10px"
  }
};