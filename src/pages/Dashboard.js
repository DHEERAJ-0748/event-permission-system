import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard({ currentUser, setCurrentUser }) {
  const [activePage, setActivePage] = useState("Home");

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <div style={styles.layout}>
      <Sidebar
        role={currentUser.role}
        activePage={activePage}
        setActivePage={setActivePage}
        logout={logout}
      />

      <div style={styles.main}>
        <Header user={currentUser} />

        <div style={styles.content}>
          <h2>{activePage}</h2>
          <p>
            This is the {activePage} section for {currentUser.role}.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: "flex", height: "100vh" },
  main: { flex: 1, background: "#f4f6f9", display: "flex", flexDirection: "column" },
  content: { padding: "30px" }
};