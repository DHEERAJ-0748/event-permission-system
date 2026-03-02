import React, { useState } from "react";

export default function Login({ setCurrentUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student"
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and Password required");
      return;
    }

    setCurrentUser(formData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Campus Login</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <select
            style={styles.input}
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Student">Student Login</option>
            <option value="Club">Club Login</option>
            <option value="Faculty">Faculty Login</option>
            <option value="Admin">Admin Login</option>
            <option value="Principal">Principal Login</option>
          </select>

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)"
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "350px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    background: "#2a5298",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold"
  }
};