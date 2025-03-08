// src/pages/PriceMonitoringPage.js
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

// Register Chart.js components
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
  const [priceData, setPriceData] = useState({ labels: [], datasets: [] });
  const [message, setMessage] = useState("");

  // Fetch ProductEntries on page load
  useEffect(() => {
    fetchProductEntries();
  }, []);

  const fetchProductEntries = async () => {
    try {
      const response = await api.get(`/product-entries/${username}`);
      if (response.status === 200) {
        setProductEntries(response.data);
        if (response.data.length > 0 && !selectedProductId) {
          setSelectedProductId(response.data[0].id); // Default to first product
        }
      } else {
        setMessage("Ürünler alınırken hata oluştu.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Sunucu hatası. Lütfen tekrar deneyin.");
    }
  };

  // Fetch price history when selectedProductId changes
  useEffect(() => {
    if (selectedProductId) {
      fetchPriceHistory();
    }
  }, [selectedProductId]);

  const fetchPriceHistory = async () => {
    try {
      // debug
      console.log(localStorage.getItem("token"));

      const response = await api.get(`/price-entries/${username}/${selectedProductId}`);
      if (response.status === 200) {
        const prices = response.data;
        const labels = prices.map(entry => new Date(entry.timestamp).toLocaleString());
        const data = prices.map(entry => entry.price);

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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "URL Fiyat Geçmişi",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tarih",
        },
      },
      y: {
        title: {
          display: true,
          text: "Fiyat (TRY)",
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Fiyat İzleme</h2>

      <div style={styles.selectorContainer}>
        <label style={styles.label}>URL Seçin:</label>
        <select
          value={selectedProductId}
          onChange={handleProductChange}
          style={styles.select}
        >
          {productEntries.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name} - {entry.url}
            </option>
          ))}
        </select>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {priceData.labels.length > 0 ? (
        <div style={styles.chartContainer}>
          <Line data={priceData} options={chartOptions} />
        </div>
      ) : (
        <p style={styles.noData}>Seçilen URL için fiyat verisi bulunamadı.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    background: "#fff", // Match Layout’s pageContent background if needed
    borderRadius: "8px",
  },
  header: {
    marginBottom: "20px",
    color: "#2c3e50",
  },
  selectorContainer: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginRight: "10px",
    fontSize: "16px",
    color: "#34495e",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    width: "80%",
    maxWidth: "500px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  chartContainer: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  message: {
    marginTop: "15px",
    color: "#dc3545",
    textAlign: "center",
  },
  noData: {
    marginTop: "20px",
    color: "#6c757d",
    textAlign: "center",
  },
};

export default PriceMonitoringPage;