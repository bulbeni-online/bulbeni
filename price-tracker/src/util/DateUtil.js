// Utility functions for date formatting and manipulation

/**
 * Converts a date to a string with a specified format using Turkish locale.
 * @param {Date|string} date - The date to format (can be a Date object or a string parsable by Date).
 * @param {string} [format="short"] - The format to use ("short", "full", "long", or custom options).
 * @returns {string} - The formatted date string.
 */
export const dateToStr = (date, timeOn = true, format = "short") => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Geçersiz Tarih";
  
    const defaultOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    const timeOptions = {};
    if (timeOn){
        timeOptions.hour = "2-digit";
        timeOptions.minute = "2-digit";
        timeOptions.second = "2-digit";
    }

  
    switch (format) {
      case "short":
        return dateObj.toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" , ...timeOptions});
      case "full":
        return dateObj.toLocaleString("tr-TR", { day: "2-digit", month: "long", year: "numeric", ...timeOptions });
      case "long":
        return dateObj.toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "medium", ...timeOptions });
      case "datetime":
        return dateObj.toLocaleString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      default:
        // Custom format can be passed as a string (e.g., "dd.MM.yyyy HH:mm:ss") but we'll use defaultOptions for now
        return dateObj.toLocaleString("tr-TR", defaultOptions);
    }
  };
  
  /**
   * Gets the month name from a date in Turkish.
   * @param {Date|string} date - The date to extract the month from.
   * @returns {string} - The full month name (e.g., "Mart").
   */
  export const getMonthName = (date) => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Geçersiz Tarih";
    return dateObj.toLocaleString("tr-TR", { month: "long" });
  };
  
  /**
   * Adds a specified number of days to a date.
   * @param {Date|string} date - The starting date.
   * @param {number} days - Number of days to add (can be negative).
   * @returns {Date} - A new Date object with the added days.
   */
  export const addDays = (date, days) => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return null;
    const result = new Date(dateObj);
    result.setDate(dateObj.getDate() + days);
    return result;
  };
  
  /**
   * Checks if a date is within a specified range.
   * @param {Date|string} date - The date to check.
   * @param {Date|string} start - The start of the range.
   * @param {Date|string} end - The end of the range.
   * @returns {boolean} - True if the date is within the range (inclusive).
   */
  export const isDateInRange = (date, start, end) => {
    const dateObj = new Date(date);
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(dateObj.getTime()) || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;
    return dateObj >= startDate && dateObj <= endDate;
  };
  
  /**
   * Formats a date as an ISO string (e.g., "2025-03-09T12:00:00.000Z").
   * @param {Date|string} date - The date to format.
   * @returns {string} - The ISO formatted string.
   */
  export const toISODate = (date) => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Geçersiz Tarih";
    return dateObj.toISOString();
  };