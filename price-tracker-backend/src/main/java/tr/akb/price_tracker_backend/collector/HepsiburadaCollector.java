package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class HepsiburadaCollector extends BaseCollector {

    private static final Map<String, String> STATIC_COOKIES = new HashMap<>();
    private static final String BASE_URL = "https://www.hepsiburada.com/";

    static {
        STATIC_COOKIES.put("OptanonConsent", "isGpcEnabled=0&datestamp=Mon+Mar+17+2025+22%3A30%3A41+GMT%2B0300+(GMT%2B03%3A00)&version=6.38.0&isIABGlobal=false&hosts=&consentId=0707fbe2-ab82-4652-ac76-eff5b52083f3&interactionCount=1&landingPath=NotLandingPage&groups=C0004%3A0%2CC0001%3A1%2CC0003%3A0%2CC0002%3A0&geolocation=TR%3B06&AwaitingReconsent=false");
        STATIC_COOKIES.put("OptanonAlertBoxClosed", "2025-03-17T19:30:40.184Z");
        STATIC_COOKIES.put("hbCountryCode", "TR");
        STATIC_COOKIES.put("hbus_anonymousId", "876f61a3-2191-4ebb-b672-0a550e89b896");
        STATIC_COOKIES.put("hbus_sessionId", "caf77b3a-b3d4-4f63-a17b-835637fe6fd2%7C1742241642322");
        STATIC_COOKIES.put("_abck", "DBB344DF12E0D874D4B9B1CEBA74B260~0~YAAQhYYUAuo7m5KVAQAAVDKWpQ2eLyGzn+xO0ocZeQQhd/Whg6AS622DTsSRwrw/1dA/t/RPARZQIfl5NCCmGgk6JOqoztRkY8xvsu9oDlZlqTKGaiUugyOx4shtEZHlx3IuCpfc1SdttGngd0L7xl5NA6FS7niCM2nwbth3XUKZUaoU1mUnKSmdKUdXAw/AJoPaogDWqpnkT8UQx1Dearg9ze88TgHNboyZ0e5n5o0u/l/ayQUwmJURrIwpSUqSYlx4iB8V8ei5v/TALjJW+A8UGRuuyVK0NNCmGBRX7kiwBNyj6dPMkASAdvO8j1qFTU4owL3ikAng0wFaQnrVRYdGNjrrjZo51XmkJuWlfTn0nIJo31U0egLn+1P/0NXRH84ashVVPQYaRgT8p8LYC6ANRafYj67WU/LZ+eQijwt6JfTd/7igowoLFie8jsuAKmQrQ0SB18JXy3yuTjEZ7ZzbsWEZRXWzW4dKnHfnsGdoFZh+NA==~-1~-1~-1");
        STATIC_COOKIES.put("_ga", "GA1.1.1905236393.1742239827");
        STATIC_COOKIES.put("_gid", "GA1.2.1820530526.1742239827");
        STATIC_COOKIES.put("NID", "522=rWnz9y_6C8iwPnCaJqjIQDoofaMDm8aChpXEo0xxnR1bqiK5TDYBPL5usZMcJHumA6Yp2NbGlkDZWRzHsMFdjyLJRjdzD4toHGZHROsfAH53cF54OQLKXsPCLX61HI0kYFkRV0UL3wb4nBeP3JnHNXKILgyQuTX6QH9r_55BhHWMSkQ_hPm2zUMgLOlv3a5h8t9VNQDBBNQ16Co0qsifUv_u3peiqwKjqE9ErQ5onrRSs4e5avLV2VuvWNFlyYySXFHJiJzQO0ATQp6gVWuCsby0rkvALyF0khzli6ZagYYGeyg2ppLjS8vICAnFs5NmoXCvefxY0iF02qZ64sGwe3qpLudwZTuIKi7Rl1PGwBBVwqA9RTAks5CZ-_vbNrw2_EAlsFdG5GMMxUCFcaefUUFJe_itk9i1Vz4d8clWEFQcjZHgZyBojUkCbcwqdDQkoooKk-1NPo_rBPdmi7tJG914Bm1l8ZBe1QYE3gP70DN4jXGnwEUlqgK_qg6i_ETamUoUlmVcIxwSJ_YfRk4SG87O_GgS1I0Aj_j5u7bbBJ_Mrfz8nQZcRCu1eg-ZkTiJ8dP6QtWbpf4b9yJ2Upv6qLTjdpZmXFdYKkWn_S8ydtcagh59IgM4Ibng1o-w0JFiX1zCHj4esFPWhIcOr8wKyPajwbe8b8DLp2SvsdBnW-A_LpxkmrWjY3-dbvtHmFa_X62kqQC-ABEvvhgp8alyb-ZNtO1e864KfEbVxXZYCnkl9MX75XBd7iAV22nXtanLyD3sYLZNsx02QMA2");
        STATIC_COOKIES.put("SID", "g.a000uggKU30ad0uNxmfG54MQceSYnxT_Wi2DWr9wDCzjUnGOaK2pIJ_Xqoq-RFD5BkgidXhSuQACgYKAWISAQ4SFQHGX2MiwjF4OtExn4nnRBlYcXK6jBoVAUF8yKpuhreNqGv-c3uKqOT3e3Ft0076");

        STATIC_COOKIES.forEach((name, value) -> {
            if (name == null || name.trim().isEmpty()) {
                logger.warn("Invalid static cookie name: null or empty");
            }
            if (value == null) {
                logger.warn("Invalid static cookie value: null for name={}", name);
            }
        });
    }

    @Override
    protected String getHost() {
        return "hepsiburada";
    }

    @Override
    protected List<PriceParsingStrategy> getCollectorParsingStrategies() {
        return Arrays.asList(
                new PriceParsingStrategy() {
                    @Override
                    protected String getPriceText(Document document) {
                        return document.selectFirst("div[data-test-id='price'] span") != null ?
                                document.selectFirst("div[data-test-id='price'] span").text() : null;
                    }
                },
                new PriceParsingStrategy() {
                    @Override
                    protected String getPriceText(Document document) {
                        return document.selectFirst("span[data-bind=\"markupText: 'currentPrice'\"]") != null ?
                                document.selectFirst("span[data-bind=\"markupText: 'currentPrice'\"]").text() : null;
                    }
                }
        );
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
        connection.header("User-Agent", userAgent)
                .header("Referer", BASE_URL)
                .header("Origin", BASE_URL)
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                .header("Accept-Language", "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7");

        Map<String, String> dynamicCookies = fetchDynamicCookies();
        Map<String, String> allCookies = new HashMap<>(STATIC_COOKIES);
        allCookies.putAll(dynamicCookies);

        allCookies.forEach((name, value) -> {
            if (name != null && !name.trim().isEmpty() && value != null) {
                logger.info("Setting cookie: {}={}", name, value.substring(0, Math.min(value.length(), 50)) + "...");
                connection.cookie(name, value);
            } else {
                logger.warn("Skipping invalid cookie: name={}, value={}", name, value);
            }
        });

        return connection;
    }

    private Map<String, String> fetchDynamicCookies() {
        try {
            Connection initialConnection = Jsoup.connect(BASE_URL)
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                    .header("Accept-Language", "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7")
                    .timeout(10000); // Increase timeout to 10 seconds
            STATIC_COOKIES.forEach(initialConnection::cookie);

            Connection.Response response = initialConnection.execute();
            Map<String, String> cookies = response.cookies();
            logger.info("Fetched dynamic cookies: {}", cookies.keySet());
            logger.info("Initial request status code: {}", response.statusCode());
            return cookies;
        } catch (IOException e) {
            logger.error("Failed to fetch dynamic cookies: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    public static void main(String[] args) {
        String[] urlArr = {
                "https://www.hepsiburada.com/logitech-mx-master-3s-mac-icin-yuksek-performansli-8-000-dpi-optik-sensorlu-sessiz-kablosuz-mouse-beyaz-p-HBCV00003PI9KK"
//                ,"https://www.hepsiburada.com/apple-mac-mini-m4-16gb-256gb-ssd-macos-mini-pc-mu9d3tu-a-p-HBCV000078Z0DF"
        };
        CollectorMain.executeMain(new HepsiburadaCollector(), urlArr);
    }
}