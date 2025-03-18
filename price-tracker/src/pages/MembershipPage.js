import React, { useState, useEffect } from "react";
import api from "../api";
import styles from "./MembershipPage.module.css";

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
      <h2 className="pageHeader">Üyelik</h2>
      <div className={styles.section}>
        {fetchError && <p className={styles.error}>{fetchError}</p>}
        <p className={styles.stat}>Kullanıcı Adı: <span className={styles.statValue}>{username || "Yükleniyor"}</span> </p>
        <p className={styles.stat}>E-posta: <span className={styles.statValue}>{email || "Yükleniyor"}</span></p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.title}>Üyelik Detayları</h3>
        <p className={styles.membership}>
          Üyelik Paketi: <span className={styles.membershipValue}>Ücretsiz</span>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;