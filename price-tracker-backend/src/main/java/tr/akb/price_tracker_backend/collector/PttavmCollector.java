package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class PttavmCollector extends BaseCollector {

    @Override
    protected String getHost() {
        return "pttavm";
    }

    @Override
    protected List<PriceParsingStrategy> getCollectorParsingStrategies() {
        return Arrays.asList(
                new PriceParsingStrategy() {
                    @Override
                    protected String getPriceText(Document document) {
                        return document.select("div.text-eGreen-700").text();
                    }
                }

        );
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection.header("Referer", "https://www.pttavm.com/")
                .header("Origin", "https://www.pttavm.com");
    }

}

