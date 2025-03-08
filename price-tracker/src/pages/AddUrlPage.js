// src/pages/AddUrlPage.js
import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import api from "../api";

const AddUrlPage = () => {
  const username = localStorage.getItem("user") || "Misafir";

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [productType, setProductType] = useState("");
  const [message, setMessage] = useState("");
  const [productEntries, setProductEntries] = useState([]);

  // Fetch product entries on page load
  useEffect(() => {
    fetchProductEntries();
  }, []);

  const fetchProductEntries = async () => {

    try {
      // debug
      console.log(localStorage.getItem("token"));

      const response = await api.get(`/product-entries/${username}`);
      if (response.status === 200) {
        setProductEntries(response.data);
      } else {
        setMessage("Veriler alınırken hata oluştu.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Sunucu hatası. Lütfen tekrar deneyin.");
    }
  };

  const handleAddUrl = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post("/product-entries", {
        "userId": username,
        name,
        url,
        productType
      });

      if (response.status === 201) {
        setMessage("URL başarıyla eklendi!");
        setName("");
        setUrl(""); // Clear the input field
        setProductType("");
        fetchProductEntries(); // Refresh the list
      } else {
        setMessage("URL eklenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Sunucu hatası. Lütfen tekrar deneyin.");
    }
  };

  const handleDelete = async (id) => {
    
    try {
      const response = await api.delete(`/product-entries/${username}/${id}`);

      if (response.status === 200) {
        setMessage("URL başarıyla silindi!");
        fetchProductEntries(); // Refresh the list after deleting
      } else {
        setMessage("Silme işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Sunucu hatası. Lütfen tekrar deneyin.");
    }
  };

  // React Table configuration
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "NAME",
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => (
        <div style={styles.urlCell}>
          <a href={row.original.url} target="_blank" rel="noopener noreferrer">
            {row.original.url}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "productType",
      header: "PRODUCT TYPE",
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original.id)}
          style={styles.deleteButton}
        >
          🗑️
        </button>
      ),
    },
  ];

  const table = useReactTable({
    columns,
    data: productEntries,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <div style={styles.container}>
      <h2>URL Ekle</h2>
      <form onSubmit={handleAddUrl} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={styles.input}
        />
        <select
          name="productType"
          value={productType}
          onChange={ (e) => setProductType(e.target.value)}
          style={styles.select}
        >
          <option value="">None</option>
          <option value="URL">URL</option>
        </select>
        <button type="submit" style={styles.button}>
          Ekle
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}

      <h3>Kayıtlı URL'ler</h3>
      <table style={styles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={styles.th}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={styles.td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.pagination}>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {"<"}
        </button>
        <span>
          Sayfa <strong>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</strong>
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {">"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "95%",
    margin: "50px auto",
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
    width: "80%",
    padding: "10px",
    margin: "10px 0",
    fontSize: "16px",
  },
  select: {
    width: "80%",
    padding: "10px",
    margin: "10px 0",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    marginTop: "20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    background: "transparent",
    border: "none",
    color: "red",
    cursor: "pointer",
    fontSize: "20px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid black", // Add border to headers
    padding: "8px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
  },
  td: {
    border: "1px solid black", // Add border to cells
    padding: "8px",
    textAlign: "left",
  },
  urlCell: {
    maxWidth: "300px", // Set max width to prevent stretching
    //wordWrap: "break-word", // Allow word wrapping
    whiteSpace: "normal", // Enable multi-line text
    overflow: "hidden",
  },
  pagination: {
    marginTop: "10px"
  },
  message: {
    marginTop: "15px",
    color: "#28a745",
  }
};

export default AddUrlPage;
