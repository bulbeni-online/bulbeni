package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UnknownCollector extends BaseCollector {

    @Override
    protected String getHost() {
        return "--unknown--";
    }

    @Override
    protected List<PriceParsingStrategy> getCollectorParsingStrategies() {
        return List.of();
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection;
    }

    @Override
    protected Double parseThePrice(Document document) {
        return null;
    }
}

