import React, { useState, useEffect } from "react";
import api from "../api";
import { FormattedMoney } from "../components/FormatComponents";
import { MONEY_OPTIONS } from "../constants";

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
    <div style={styles.container}>
      <h2>Dashboard</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <div style={styles.statsContainer}>
          <p style={styles.stat}>
            Eklenmiş URL Sayısı: <span style={styles.statValue}>{urlCount}</span>
          </p>
          <p style={styles.stat}>
            Kaydedilmiş Fiyat Bilgisi Sayısı: <span style={styles.statValue}>{priceCount}</span>
          </p>
          <div style={styles.tableContainer}>
            <h3 style={styles.tableHeader}>Tüm URL'ler</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>URL</th>
                  <th style={styles.th}>İsim</th>
                  <th style={styles.th}>Fiyat Sayısı</th>
                  <th style={styles.th}>Son Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {urlData.length > 0 ? (
                  urlData.map((url, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{url.url}</td>
                      <td style={styles.td}>{url.name}</td>
                      <td style={styles.td}>{url.priceCount}</td>
                      <td style={styles.td}>
                        {url.latestPrice !== null ? (
                          <FormattedMoney number={url.latestPrice} options={MONEY_OPTIONS} />
                        ) : (
                          "Fiyat yok"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={styles.tdNoData}>
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

const styles = {
  container: {
    width: "700px", // Kept width for table
    margin: "100px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  statsContainer: {
    marginTop: "20px",
  },
  stat: {
    fontSize: "16px",
    margin: "10px 0",
    color: "#34495e",
  },
  statValue: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  tableContainer: {
    marginTop: "20px",
  },
  tableHeader: {
    fontSize: "18px",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold",
    color: "#34495e",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    color: "#2c3e50",
  },
  tdNoData: {
    padding: "10px",
    color: "#6c757d",
    textAlign: "center",
  },
  error: {
    color: "#dc3545",
    marginTop: "20px",
  },
};

export default DashboardPage;