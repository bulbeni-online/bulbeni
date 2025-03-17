package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

@Component
public class UnknownCollector extends BaseCollector {

    @Override
    protected String getHost() {
        return "--unknown--";
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection;
    }

    @Override
    protected String getPriceText(Document document) {
        return null;
    }

    @Override
    protected Double parseThePrice(String priceText) {
        return null;
    }
}

