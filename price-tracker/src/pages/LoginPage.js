import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", username);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Giriş Yap</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
          disabled={loading}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
      <p className={styles.signupLink}>
        Henüz hesabınız yok mu? <Link to="/signup">Kayıt Ol</Link>
      </p>
    </div>
  );
};

export default LoginPage;