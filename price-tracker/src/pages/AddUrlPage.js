// src/pages/AddUrlPage.js
import React, { useState } from "react";

const AddUrlPage = () => {
  const [url, setUrl] = useState("");

  const handleAddUrl = (e) => {
    e.preventDefault();
    console.log("URL Eklendi:", url);
  };

  return (
    <div style={styles.container}>
      <h2>URL Ekle</h2>
      <form onSubmit={handleAddUrl}>
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Ekle</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    margin: "100px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
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
};

export default AddUrlPage;
