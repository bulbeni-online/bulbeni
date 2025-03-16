import React, { useState, useEffect } from "react";
import api from "../api";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/me");
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (err) {
        setFetchError("Kullanıcı bilgileri yüklenemedi.");
        console.error("Fetch user error:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      setSuccess("Şifreniz başarıyla değiştirildi!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data || "Geçerli şifre yanlış veya yeni şifre geçersiz.");
      } else {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
      console.error("Change password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.title}>Profil</h2>
        {fetchError && <p className={styles.error}>{fetchError}</p>}
        <p className={styles.info}>Kullanıcı Adı: {username || "Yükleniyor..."}</p>
        <p className={styles.info}>E-posta: {email || "Yükleniyor..."}</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.title}>Şifre Değiştir</h3>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <form onSubmit={handleChangePassword} className={styles.form}>
          <input
            type="password"
            placeholder="Mevcut Şifre"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className={styles.input}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Yeni Şifre"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={styles.input}
            disabled={loading}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h3 className={styles.title}>Üyelik Detayları</h3>
        <p className={styles.membership}>
          Üyelik: <span className={styles.membershipValue}>Free</span>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;