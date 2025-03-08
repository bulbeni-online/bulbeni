package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tr.akb.price_tracker_backend.entity.ProductEntry;

public class PttavmCollector extends BaseCollector {

    private static final Logger logger = LoggerFactory.getLogger(PttavmCollector.class);


    @Override
    public Double collectPrice(ProductEntry productEntry) throws Exception {
        try {


            String url = getUrl(productEntry);
            Connection connection = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36")
                    .header("Referer", "https://www.pttavm.com/")
                    .header("Origin", "https://www.pttavm.com");


            Document doc = connection.get();

            // Use the updated CSS selector to get the price text
            String priceText = doc.select("div.text-eGreen-700").text();  // Select div with class text-eGreen-700

            //debug
            logger.info("priceText for {} is {}", productEntry.getName(), priceText);

            // Assuming price is like "1.234,56 TL", clean and parse it
            String cleanedPrice = priceText.substring(0, priceText.indexOf("TL")).replaceAll("[^0-9,]", "").replace(",", ".");
            return Double.parseDouble(cleanedPrice);

        } catch (Exception e){
            logger.error("Exception while getting price from url:{}", productEntry.getUrl(), e);
            return null;
        }
    }
}

