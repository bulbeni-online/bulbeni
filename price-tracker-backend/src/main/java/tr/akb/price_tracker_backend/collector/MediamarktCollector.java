package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;
import tr.akb.price_tracker_backend.entity.ProductEntry;

@Component
public class MediamarktCollector extends BaseCollector {

    @Override
    protected String getHost() {
        return "mediamarkt";
    }

    @Override
    protected String getPriceText(Document document) {
        Elements priceSpans = document.select("span[data-test=branded-price-whole-value]");

        String cleanedPrice;
        if (!priceSpans.isEmpty()) {
            Element priceSpan = priceSpans.first();
            return priceSpan.text().trim();
        } else {
            return null;
        }
    }

    @Override
    protected Double parseThePrice(String priceText) {
        String cleanedPrice = priceText.replace("₺", "")
                .replaceAll("[^0-9,]", "")
                .replace(",", ".");

        return Double.parseDouble(cleanedPrice);
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection.header("Referer", "https://www.mediamarkt.com.tr")
                .header("Origin", "https://www.mediamarkt.com.tr");
    }

    public static void main(String[] args) {
        String url = "https://www.mediamarkt.com.tr/tr/product/_apple-mx2e3tuamacbook-proapple-m4-pro-islemci12-cekirdek-cpu-16-cekirdek-gpu24gb-ram512gb-ssd142gumus-1241377.html"; // Buraya ürün URL'sini girin
        url = "https://www.mediamarkt.com.tr/tr/product/_lg-75qned86t-75-inc-195-ekran-4k-smart-ai-sihirli-kumanda-hdr10-webos24-qned-tv-1237461.html";

        ProductEntry productEntry = new ProductEntry();
        productEntry.setUrl(url);
        productEntry.setName("testProduct");

        BaseCollector c = new MediamarktCollector();
        Double price = null;
        try {
            price = c.collectPrice(productEntry);
        } catch (Exception e) {
            if (price != null) {
                System.out.println("Ürün fiyatı: " + price);
            } else {
                System.out.println("Ürün fiyatı bulunamadı.");
            }
        }

    }
}

