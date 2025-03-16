// src/pages/ProductPage.js
import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import api from "../api";
import Swal from "sweetalert2";
import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const username = localStorage.getItem("user") || "Misafir";

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [productType, setProductType] = useState("URL");
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

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post("/product-entries", {
        userId: username,
        name,
        url,
        productType,
      });

      if (response.status === 201) {
        setMessage("Ürün başarıyla eklendi!");
        setName("");
        setUrl(""); // Clear the input field
        setProductType("");
        fetchProductEntries(); // Refresh the list
      } else {
        setMessage("Ürün eklenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Sunucu hatası. Lütfen tekrar deneyin.");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu ürünü silmek istediğinizden emin misiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "Hayır",
    });
    if (!result.isConfirmed) return;

    try {
      const response = await api.delete(`/product-entries/${username}/${id}`);

      if (response.status === 200) {
        setMessage("Ürün başarıyla silindi!");
        fetchProductEntries(); // Refresh the list after deleting
      } else {
        setMessage(`Silme hatası: ${response?.data?.message}`);
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
      header: "Id",
    },
    {
      accessorKey: "name",
      header: "Ad",
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => (
        <div className={styles.urlCell}>
          <a href={row.original.url} target="_blank" rel="noopener noreferrer">
            {row.original.url}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "productType",
      header: "Ürün Tipi",
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original.id)}
          className={styles.deleteButton}
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
    <div className={styles.container}>
      <h2 className={styles.header}>Ürün</h2>
      <form onSubmit={handleAdd} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Ürün Adı:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="Ürün adını girin"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Ürün Tipi:</label>
          <div className={styles.radioOption}>
            <input
              type="radio"
              name="productType"
              value=""
              checked={productType === ""}
              onChange={(e) => setProductType(e.target.value)}
              className={styles.radioInput}
            />
            <label className={styles.radioLabel}>Hiç</label>
          </div>
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                name="productType"
                value="URL"
                checked={productType === "URL"}
                onChange={(e) => setProductType(e.target.value)}
                className={styles.radioInput}
              />
              <label className={styles.radioLabel}>URL</label>
            </div>

            {/* Add more options here if needed, e.g., "API" or "Manual" */}
            {/* Example:
            <div className={styles.radioOption}>
              <input
                type="radio"
                name="productType"
                value="API"
                checked={productType === "API"}
                onChange={(e) => setProductType(e.target.value)}
                className={styles.radioInput}
              />
              <label className={styles.radioLabel}>API</label>
            </div>
            */}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>URL:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={styles.input}
            placeholder="https://example.com"
            required={productType === "URL"}
          />
        </div>
        
        <div className={styles.formGroup}>
          <button type="submit" className={styles.button}>
            Ekle
          </button>
        </div>
          
      </form>
      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.tableContainer}>
        <h3>Kayıtlı URL'ler</h3>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.th}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span>
          Sayfa{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};


export default ProductPage;
