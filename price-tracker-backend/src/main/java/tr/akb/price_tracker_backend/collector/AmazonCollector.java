package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class AmazonCollector extends BaseCollector {

    @Override
    protected String getHost() {
        return "amazon";
    }

    @Override
    protected List<PriceParsingStrategy> getCollectorParsingStrategies() {
        return List.of(
                new PriceParsingStrategy() {
                    @Override
                    protected String getPriceText(Document document) {
                        return document.selectFirst("span.a-price-whole").text();
                    }
                }
        );
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection.header("Referer", "https://www.amazon.com.tr/")
                .header("Origin", "https://www.amazon.com.tr");
    }

    public static void main(String[] args) {
        String[] urlArr = {
                "https://www.amazon.com.tr/Samsung-Galaxy-Telefonu-T%C3%BCrkiye-Garantili/dp/B0CYH4YK95/ref=sr_1_1?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2B0BUGGJHJJ1M&dib=eyJ2IjoiMSJ9.IGFCus_0ge0JRkPfdg-5Y46qoHS0cmv3WPwuQka5VcsRTYYNvMCIVKd7o7XAsy0Kr0nmmzXCz8KZNivOjj3WTBmEQCfPbi-50cZn5gEu2FwDVwH63vbsz1FCHEgLkYatnsl-w8IV_rTGBufJWgUmzFBYuNTkzK2x264bIGSKYtOoEdZm5W04NoppJqsBmNGpYW_SaL8aLbhTbIY14p__GtghFfSfSvsMJLkxgaemkwe3QmQSNytoCQbC9euJFwd2QKp6MFCUVgtNTCvDhz__1r1-LD3Qf8bNi5G197XppLKLsfeJ_m-JOu1hTAkR28bQesBmA9dF4U0UJv0Q4rzqW5TvE_TBhz3J1EH8c--LLfR9XxpBWOyU15CkoAL4Bp7fGfqVuvmppqmsfSkCRS-Z1e7AQmvD7_-oltNR0iCh8I9TAaKdmVOvdBjy3y_DH8dS.fwU1nZEfbay7Zw8lCdVdFkL2FJXo7ImJ8zZSELbC1t8&dib_tag=se&keywords=samsung%2Ba55&qid=1742219660&sprefix=samsung%2Ba55%2Caps%2C156&sr=8-1&th=1"
        };
        CollectorMain.executeMain(new AmazonCollector(), urlArr);
    }
}
