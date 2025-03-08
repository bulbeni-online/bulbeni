import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";  // Axios yapılandırmasını içe aktar

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Ensure backend returns { token: "..." }
        localStorage.setItem("user", username);
        navigate("/dashboard");
      } else {
        setError("Giriş başarısız.");
      }

    } catch (err) {
      setError("Giriş başarısız! Lütfen bilgilerinizi kontrol edin.");
      alert("Hata: Giriş başarısız! Lütfen bilgilerinizi kontrol edin."); // Hata mesajını göster
      navigate("/");  // Login sayfasına geri yönlendir
    }
  };

  return (
    <div style={styles.container}>
      <h2>Giriş Yap</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Giriş Yap</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};

export default LoginPage;
