import React, { useState, useEffect } from "react";
import api from "../api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FormattedDate, FormattedMoney } from "../components/FormatComponents";
import { dateToStr } from "../util/DateUtil";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceMonitoringPage = () => {
  const username = localStorage.getItem("user") || "Misafir";
  const [productEntries, setProductEntries] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("lastMonth");
  const [priceData, setPriceData] = useState({ labels: [], datasets: [] });
  const [priceEntries, setPriceEntries] = useState([]);
  const [minPrice, setMinPrice] = useState(null); // Min price with date
  const [maxPrice, setMaxPrice] = useState(null); // Max price with date
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProductEntries();
  }, []);

  const fetchProductEntries = async () => {
    try {
      const response = await api.get(`/product-entries/${username}`);
      if (response.status === 200) {
        setProductEntries(response.data);
        if (response.data.length > 0 && !selectedProductId) {
          setSelectedProductId(response.data[0].id);
        }
      } else {
        setMessage("Ürünler alınırken hata oluştu.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Sunucu hatası. Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    if (selectedProductId) {
      fetchPriceHistory();
    }
  }, [selectedProductId, selectedDuration]);

  const fetchPriceHistory = async () => {
    try {
      const response = await api.get(`/price-entries/${username}/${selectedProductId}`);
      if (response.status === 200) {
        const now = new Date();
        let cutoffDate;

        // Set cutoff date based on selected duration
        switch (selectedDuration) {
          case "lastHour":
            cutoffDate = new Date(now - 60 * 60 * 1000);
            break;
          case "lastDay":
            cutoffDate = new Date(now - 24 * 60 * 60 * 1000);
            break;
          case "lastMonth":
            cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case "lastYear":
            cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
          case "allTime":
            cutoffDate = null;
            break;
          default:
            cutoffDate = null;
        }

        // Filter prices based on cutoff date
        const allPrices = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const filteredPrices = cutoffDate
          ? allPrices.filter((entry) => new Date(entry.timestamp) >= cutoffDate)
          : allPrices;

        setPriceEntries(filteredPrices);

        // Calculate min and max prices
        if (filteredPrices.length > 0) {
          const prices = filteredPrices.map((entry) => entry.price);
          const minPriceIndex = prices.indexOf(Math.min(...prices));
          const maxPriceIndex = prices.indexOf(Math.max(...prices));
          setMinPrice({
            value: filteredPrices[minPriceIndex].price,
            date: filteredPrices[minPriceIndex].timestamp
          });
          setMaxPrice({
            value:filteredPrices[maxPriceIndex].price,
            date: filteredPrices[maxPriceIndex].timestamp
          });
        } else {
          setMinPrice(null);
          setMaxPrice(null);
        }

        const chartPrices = [...filteredPrices].sort( (a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const labels = chartPrices.map((entry) => dateToStr(entry.timestamp, true, "short"));
        console.log("labels:" + labels);
        const data = chartPrices.map((entry) => entry.price);

        setPriceData({
          labels,
          datasets: [
            {
              label: "Fiyat (TRY)",
              data,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.1,
            },
          ],
        });

        if (filteredPrices.length === 0) {
          setMessage("Seçilen süre için fiyat verisi bulunamadı.");
        } else {
          setMessage("");
        }
      } else {
        setMessage("Fiyat geçmişi alınırken hata oluştu.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Sunucu hatası. Lütfen tekrar deneyin.");
    }
  };

  const handleProductChange = (e) => {
    setSelectedProductId(e.target.value);
    setMessage("");
  };

  const handleDurationChange = (e) => {
    setSelectedDuration(e.target.value);
    setMessage("");
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "URL Fiyat Geçmişi" },
    },
    scales: {
      x: { title: { display: true, text: "Tarih" } },
      y: { title: { display: true, text: "Fiyat (TRY)" } },
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Fiyat İzleme</h2>

      <div style={styles.selectorContainer}>
        <label style={styles.label}>URL Seçin:</label>
        <select value={selectedProductId} onChange={handleProductChange} style={styles.select}>
          {productEntries.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </select>
        <label style={styles.label}>Süre Seçin:</label>
        <select value={selectedDuration} onChange={handleDurationChange} style={styles.select}>
          <option value="lastHour">Son Saat</option>
          <option value="lastDay">Son Gün</option>
          <option value="lastMonth">Son Ay</option>
          <option value="lastYear">Son Yıl</option>
          <option value="allTime">Tümü</option>
        </select>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {priceData.labels.length > 0 ? (
        <>
          <div style={styles.summaryContainer}>
            <p style={styles.summaryStat}>
              Minimum Fiyat:{" "}
              <span style={styles.statValue}>
                <FormattedMoney number={minPrice.value} />{" "}
                ({<FormattedDate date={minPrice.date} format="short" />})
              </span>
            </p>
            <p style={styles.summaryStat}>
              Maksimum Fiyat:{" "}
              <span style={styles.statValue}>
                <FormattedMoney number={maxPrice.value} />{" "}
                ({<FormattedDate date={maxPrice.date} format="short" />})
              </span>
            </p>
          </div>
          <div style={styles.chartContainer}>
            <Line data={priceData} options={chartOptions} />
          </div>
          <div style={styles.gridContainer}>
            <h3 style={styles.gridHeader}>Fiyat Kayıtları ({priceEntries.length} kayıt)</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Tarih</th>
                  <th style={styles.th}>Fiyat (TRY)</th>
                </tr>
              </thead>
              <tbody>
                {priceEntries.map((entry, index) => (
                  <tr key={index}>
                    <td style={styles.td}>
                      <FormattedDate date={entry.timestamp} format="full" />
                    </td>
                    <td style={styles.td}>
                      <FormattedMoney number={entry.price} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p style={styles.noData}>Seçilen URL ve süre için fiyat verisi bulunamadı.</p>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px", background: "#fff", borderRadius: "8px" },
  header: { marginBottom: "20px", color: "#2c3e50" },
  selectorContainer: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  },
  label: { marginRight: "10px", fontSize: "16px", color: "#34495e" },
  select: {
    padding: "10px",
    fontSize: "16px",
    width: "40%",
    maxWidth: "300px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  summaryContainer: {
    marginTop: "20px",
    marginBottom: "20px",
    textAlign: "center",
  },
  summaryStat: {
    fontSize: "16px",
    margin: "10px 0",
    color: "#34495e",
  },
  statValue: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  chartContainer: { maxWidth: "800px", margin: "0 auto" },
  message: { marginTop: "15px", color: "#dc3545", textAlign: "center" },
  noData: { marginTop: "20px", color: "#6c757d", textAlign: "center" },
  gridContainer: { marginTop: "30px", maxWidth: "800px", margin: "30px auto" },
  gridHeader: { color: "#2c3e50", marginBottom: "10px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    borderBottom: "2px solid #ddd",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
  },
  td: { borderBottom: "1px solid #ddd", padding: "10px" },
};

export default PriceMonitoringPage;