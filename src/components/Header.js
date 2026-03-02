import React from "react";

export default function Header({ user }) {
  return (
    <div style={styles.header}>
      Welcome, {user.role}
    </div>
  );
}

const styles = {
  header: {
    padding: "20px",
    background: "white",
    fontWeight: "bold",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  }
};