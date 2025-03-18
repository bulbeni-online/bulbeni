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
                        return document.selectFirst("div.text-eGreen-700").text();
                    }
                }

        );
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection.header("Referer", "https://www.pttavm.com/")
                .header("Origin", "https://www.pttavm.com");
    }

    public static void main(String[] args) {
        String[] urlArr = new String[]{
                "https://www.pttavm.com/apple-iphone-16-pro-max-256-gb-col-titanyum-ithalatci-garantili-p-1045860690",
                "https://www.pttavm.com/selpak-3-katli-32li-tuvalet-kagidi-p-548247534"
        };
        CollectorMain.executeMain(new PttavmCollector(), urlArr);
    }

}

