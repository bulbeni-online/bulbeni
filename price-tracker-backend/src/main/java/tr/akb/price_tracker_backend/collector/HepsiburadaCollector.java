package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

@Component
public class HepsiburadaCollector extends BaseCollector {

    @Override
    protected String getHost() {
        return "hepsiburada";
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection.header("Referer", "https://www.hepsiburada.com/")
                .header("Origin", "https://www.hepsiburada.com");
    }

    @Override
    protected String getPriceText(Document document) {
        return document.select("div[data-test-id='price'] span").text();
    }

    @Override
    protected Double parseThePrice(String priceText) {
        // Assuming price is like "1.234,56 TL", clean and parse it
        String cleanedPrice = priceText.replaceAll("[^0-9,]", "").replace(",", ".");
        return Double.parseDouble(cleanedPrice);
    }
}

