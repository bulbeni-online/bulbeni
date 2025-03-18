package tr.akb.price_tracker_backend.collector;

import org.jsoup.nodes.Document;

public abstract class PriceParsingStrategy {

    // Template method with common logic
    public Double parsePrice(Document document) {
        try {
            String priceText = getPriceText(document);
            if (priceText == null || priceText.trim().isEmpty()) {
                return null;
            }

            // Clean the price text (remove non-numeric except comma, replace comma with dot)
            String cleanedPrice = priceText.trim().replaceAll("[^0-9,]", "").replace(",", ".");
            return Double.parseDouble(cleanedPrice);
        } catch (Exception e) {
            return null; // Return null on any failure (e.g., parsing error, null text)
        }
    }

    // Abstract method for concrete strategies to implement
    protected abstract String getPriceText(Document document);
}