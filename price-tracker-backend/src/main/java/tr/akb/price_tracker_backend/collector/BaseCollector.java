package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tr.akb.price_tracker_backend.entity.ProductEntry;

import java.util.List;

public abstract class BaseCollector {

    protected final static Logger logger = LoggerFactory.getLogger(BaseCollector.class);

    protected List<PriceParsingStrategy> strategies;

    protected BaseCollector() {
        this.strategies = getCollectorParsingStrategies();
    }

    protected abstract List<PriceParsingStrategy> getCollectorParsingStrategies();

    protected abstract String getHost();

    public Double collectPrice(ProductEntry productEntry) {
        try {
            String url = productEntry.getUrl();
            Connection connection = Jsoup.connect(url);

            // Set userAgent/headers/cookies if needed
            connection = updateConnection(connection);
            connection = updateAgentHeadersCookies(connection);

            Document doc = connection.get();

            return parseThePrice(doc);
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

    protected Double parseThePrice(Document document) {
        // Try each strategy until a valid price is found
        for (PriceParsingStrategy strategy : strategies) {
            Double price = strategy.parsePrice(document);
            if (price != null && price > 0) { // Ensure price is valid (non-null and positive)
                return price;
            }
        }
        // If no strategy succeeds, return null
        return null;
    }

}
