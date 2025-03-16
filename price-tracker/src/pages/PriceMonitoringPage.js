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
import styles from "./PriceMonitoringPage.module.css";

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
          case "lastWeek":
            cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
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
              borderColor: "#1abc9c", // Teal
              backgroundColor: "rgba(26, 188, 156, 0.2)",
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
    <div className={styles.container}>
      <h2 className={styles.header}>Fiyat İzleme</h2>

      <div className={styles.selectorContainer}>
        <label className={styles.label}>URL Seçin:</label>
        <select value={selectedProductId} onChange={handleProductChange} className={styles.select}>
          {productEntries.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </select>
        <label className={styles.label}>Süre Seçin:</label>
        <select value={selectedDuration} onChange={handleDurationChange} className={styles.select}>
          <option value="lastHour">Son Saat</option>
          <option value="lastDay">Son Gün</option>
          <option value="lastWeek">Son Hafta</option>
          <option value="lastMonth">Son Ay</option>
          <option value="lastYear">Son Yıl</option>
          <option value="allTime">Tümü</option>
        </select>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      {priceData.labels.length > 0 ? (
        <>
          <div className={styles.summaryContainer}>
            <p className={styles.summaryStat}>
              Minimum Fiyat:{" "}
              <span className={styles.statValue}>
                <FormattedMoney number={minPrice.value} />{" "}
                ({<FormattedDate date={minPrice.date} format="short" />})
              </span>
            </p>
            <p className={styles.summaryStat}>
              Maksimum Fiyat:{" "}
              <span className={styles.statValue}>
                <FormattedMoney number={maxPrice.value} />{" "}
                ({<FormattedDate date={maxPrice.date} format="short" />})
              </span>
            </p>
          </div>
          <div className={styles.chartContainer}>
            <Line data={priceData} options={chartOptions} />
          </div>
          <div className={styles.gridContainer}>
            <h3 className={styles.gridHeader}>Fiyat Kayıtları ({priceEntries.length} kayıt)</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Tarih</th>
                  <th className={styles.th}>Fiyat (TRY)</th>
                </tr>
              </thead>
              <tbody>
                {priceEntries.map((entry, index) => (
                  <tr key={index}>
                    <td className={styles.td}>
                      <FormattedDate date={entry.timestamp} format="full" />
                    </td>
                    <td className={styles.td}>
                      <FormattedMoney number={entry.price} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p ></p>
      )}
    </div>
  );
};



export default PriceMonitoringPage;