package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tr.akb.price_tracker_backend.entity.ProductEntry;

public abstract class BaseCollector {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    protected abstract String getHost();

    public Double collectPrice(ProductEntry productEntry) {
        try {
            String url = productEntry.getUrl();
            Connection connection = Jsoup.connect(url);

            // Set userAgent/headers/cookies if needed
            connection = updateConnection(connection);
            connection = updateAgentHeadersCookies(connection);

            Document doc = connection.get();

            // Use the updated CSS selector to get the price text
            String priceText = getPriceText(doc);
            logger.info("priceText for {} is {}", productEntry.getName(), priceText);


            return parseThePrice(priceText);
        } catch (Exception e){
            logger.error("Exception while getting price from url:{}", productEntry.getUrl(), e);
            return null;
        }
    }

    protected Connection updateConnection(Connection connection){
        return connection
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36");
    }

    protected abstract Connection updateAgentHeadersCookies(Connection connection);

    protected abstract String getPriceText(Document document);

    protected abstract Double parseThePrice(String priceText);

}
