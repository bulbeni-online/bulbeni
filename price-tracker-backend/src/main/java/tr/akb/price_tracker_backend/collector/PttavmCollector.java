package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import tr.akb.price_tracker_backend.entity.ProductEntry;

@Component
public class PttavmCollector extends BaseCollector {

    @Override
    protected String getHost() {
        return "pttavm";
    }

    @Override
    protected String getPriceText(Document document) {
        return document.select("div.text-eGreen-700").text();  // Select div with class text-eGreen-700
    }

    @Override
    protected Double parseThePrice(String priceText) {
        // Assuming price is like "1.234,56 TL", clean and parse it
        String cleanedPrice = priceText.substring(0, priceText.indexOf("TL")).replaceAll("[^0-9,]", "").replace(",", ".");
        return Double.parseDouble(cleanedPrice);
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection.header("Referer", "https://www.pttavm.com/")
                .header("Origin", "https://www.pttavm.com");
    }

}

