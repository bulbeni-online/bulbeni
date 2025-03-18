package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class TrendyolCollector extends BaseCollector {

    @Override
    protected String getHost() {
        return "trendyol";
    }

    @Override
    protected List<PriceParsingStrategy> getCollectorParsingStrategies() {
        return Arrays.asList(
                //Strategy 1 : Discounted price
                new PriceParsingStrategy() {
                    @Override
                    protected String getPriceText(Document document) {
                        return document.selectFirst("span.prc-dsc").text();
                    }
                },

                //Strategy 2 : Campaigned price
                new PriceParsingStrategy() {
                    @Override
                    protected String getPriceText(Document document) {
                        return document.selectFirst("p.campaign-price").text();
                    }
                }
        );
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection.header("Referer", "https://www.trendyol.com/")
                .header("Origin", "https://www.trendyol.com");
    }


    public static void main(String[] args) {
        String[] testUrls = {
                "https://www.trendyol.com/adidas/herren-halbschuhe-halbschuhe-wanderschuhe-terrex-daroga-plus-kanvas-hp8632-schwarz-cblack-ftwht-clb-p-770005646",
                "https://www.trendyol.com/apple/macbook-pro-m3-max-30c-gpu-36gb-1tb-ssd-mrw73tu-a-p-777662367?boutiqueId=61&merchantId=369055&sav=true",
                "https://www.trendyol.com/roborock/q7-max-beyaz-akilli-robot-supurge-p-316610701"
        };
        CollectorMain.executeMain(new TrendyolCollector(), testUrls);
    }
}