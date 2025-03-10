import React from "react";

// Reusable Date Formatting Component
export const FormattedDate = ({ date, format = "dd.MM.yyyy HH:mm:ss" }) => {
  const dateObj = new Date(date);
  const defaultOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return dateObj.toLocaleString("tr-TR", {
    ...defaultOptions, // Default format
    ...formatOptions(format), // Override with specified format
  });
};

// Reusable Number Formatting Component (plain number)
export const FormattedNumber = ({ number, options = {} }) => {
  const defaultOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  return number.toLocaleString("tr-TR", { ...defaultOptions, ...options });
};

// Reusable Money Formatting Component (currency)
export const FormattedMoney = ({ number, currency = "TRY", options = {} }) => {
  const moneyOptions = {
    style: "currency",
    currency,
  };
  return (
    <FormattedNumber
      number={number}
      options={{ ...moneyOptions, ...options }}
    />
  );
};

// Helper function to parse custom date format
const formatOptions = (format) => {
  switch (format) {
    case "short":
      return { day: "2-digit", month: "2-digit", year: "2-digit" };
    case "full":
      return { day: "2-digit", month: "long", year: "numeric" };
    case "long": // New "long" format
      return { dateStyle: "long", timeStyle: "long" };
    default:
      return {};
  }
};
