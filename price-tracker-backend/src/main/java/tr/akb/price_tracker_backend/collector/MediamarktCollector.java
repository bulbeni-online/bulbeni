package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;
import tr.akb.price_tracker_backend.entity.ProductEntry;

import java.util.Arrays;
import java.util.List;

@Component
public class MediamarktCollector extends BaseCollector {

    @Override
    protected String getHost() {
        return "mediamarkt";
    }

    @Override
    protected List<PriceParsingStrategy> getCollectorParsingStrategies() {
        return Arrays.asList(
                new PriceParsingStrategy() {
                    @Override
                    protected String getPriceText(Document document) {
                        return document.selectFirst("span[data-test=branded-price-whole-value]").text();
                    }
                }
        );
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection.header("Referer", "https://www.mediamarkt.com.tr")
                .header("Origin", "https://www.mediamarkt.com.tr");
    }

    public static void main(String[] args) {
        String[] testUrls = {
                "https://www.mediamarkt.com.tr/tr/product/_apple-mx2e3tuamacbook-proapple-m4-pro-islemci12-cekirdek-cpu-16-cekirdek-gpu24gb-ram512gb-ssd142gumus-1241377.html",
                "https://www.mediamarkt.com.tr/tr/product/_lg-75qned86t-75-inc-195-ekran-4k-smart-ai-sihirli-kumanda-hdr10-webos24-qned-tv-1237461.html"
        };
        CollectorMain.executeMain(new MediamarktCollector(), testUrls);
    }
}

