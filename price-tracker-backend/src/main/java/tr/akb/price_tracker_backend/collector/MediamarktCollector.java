package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tr.akb.price_tracker_backend.entity.ProductEntry;

public class MediamarktCollector extends BaseCollector {

    private static final Logger logger = LoggerFactory.getLogger(MediamarktCollector.class);


    @Override
    public Double collectPrice(ProductEntry productEntry) throws Exception {
        try {
            String url = getUrl(productEntry);
            Connection connection = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36")
                    .header("Referer", "https://www.mediamarkt.com.tr")
                    .header("Origin", "https://www.mediamarkt.com.tr");


            Document doc = connection.get();

            Elements priceSpans = doc.select("span[data-test=branded-price-whole-value]");

            String cleanedPrice;
            if (!priceSpans.isEmpty()) {
                Element priceSpan = priceSpans.first();
                String priceText = priceSpan.text().trim();
                cleanedPrice = priceText.replace("₺", "")
                        .replaceAll("[^0-9,]", "")
                        .replace(",", ".");
            } else {
                return null;
            }

            //debug
            logger.info("cleanedPrice for {} is {}", productEntry.getName(), cleanedPrice);
            return Double.parseDouble(cleanedPrice);

        } catch (Exception e) {
            logger.error("Exception while getting price from url:{}", productEntry.getUrl(), e);
            return null;
        }
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

