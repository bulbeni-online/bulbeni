import React, { useState, useEffect } from "react";
import api from "../api";
import { FormattedMoney } from "../components/FormatComponents";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const username = localStorage.getItem("user") || "Misafir";
  const [urlCount, setUrlCount] = useState(0); // Total number of URLs
  const [priceCount, setPriceCount] = useState(0); // Total number of price entries
  const [urlData, setUrlData] = useState([]); // Array of all URLs with details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const urlResponse = await api.get(`/product-entries/${username}`);
        if (urlResponse.status !== 200) {
          throw new Error("URL bilgileri alınırken hata oluştu.");
        }
        const urls = urlResponse.data;
        setUrlCount(urls.length);
    
        const pricePromises = urls.map((url) =>
          api
            .get(`/price-entries/${username}/${url.id}`)
            .then((res) => {
              const prices = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
              return {
                url: url.url,
                name: url.name,
                priceCount: prices.length,
                latestPrice: prices.length > 0 ? prices[0].price : null,
              };
            })
            .catch((err) => {
              console.warn(`Fiyat bilgileri alınamadı: ${url.id}`, err);
              return { url: url.url, name: url.name, priceCount: 0, latestPrice: null };
            })
        );
        const allUrlData = await Promise.all(pricePromises);
    
        const totalPriceCount = allUrlData.reduce((sum, url) => sum + url.priceCount, 0);
        setPriceCount(totalPriceCount);
        setUrlData(allUrlData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Sunucu hatası. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [username]);

  return (
    <div className={styles.container}>
      <h2>Dashboard</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.statsContainer}>
          <p className={styles.stat}>
            Eklenmiş URL Sayısı: <span className={styles.statValue}>{urlCount}</span>
          </p>
          <p className={styles.stat}>
            Kaydedilmiş Fiyat Bilgisi Sayısı: <span className={styles.statValue}>{priceCount}</span>
          </p>
          <div className={styles.tableContainer}>
            <h3 className={styles.tableHeader}>Tüm URL'ler</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>İsim</th>
                  <th className={styles.th}>URL</th>
                  <th className={styles.th}>Fiyat Sayısı</th>
                  <th className={styles.th}>Son Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {urlData.length > 0 ? (
                  urlData.map((url, index) => (
                    <tr key={index}>
                      <td className={styles.td}>{url.name}</td>
                      <td className={styles.td}>{url.url}</td>
                      <td className={styles.td}>{url.priceCount}</td>
                      <td className={styles.td}>
                        {url.latestPrice !== null ? (
                          <FormattedMoney number={url.latestPrice}/>
                        ) : (
                          "Fiyat yok"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className={styles.tdNoData}>
                      Henüz URL eklenmemiş.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};



export default DashboardPage;