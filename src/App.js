import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <>
      {!currentUser ? (
        <Login setCurrentUser={setCurrentUser} />
      ) : (
        <Dashboard currentUser={currentUser} setCurrentUser={setCurrentUser} />
      )}
    </>
  );
}