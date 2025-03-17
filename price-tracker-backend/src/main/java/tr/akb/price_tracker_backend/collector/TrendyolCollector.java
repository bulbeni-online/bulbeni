package tr.akb.price_tracker_backend.collector;

import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;
import tr.akb.price_tracker_backend.entity.ProductEntry;

@Component
public class TrendyolCollector extends BaseCollector {

    @Override
    protected String getHost() {
        return "trendyol";
    }

    @Override
    protected Connection updateAgentHeadersCookies(Connection connection) {
        return connection.header("Referer", "https://www.trendyol.com/")
                .header("Origin", "https://www.trendyol.com");
    }

    @Override
    protected String getPriceText(Document document) {

        Element priceWholeSpan  = document.selectFirst("span.prc-dsc");
        return priceWholeSpan.text().trim();
    }

    @Override
    protected Double parseThePrice(String priceText) {
        String cleanedPrice = priceText.replaceAll("[^0-9,]", "").replace(",", ".");
        return Double.parseDouble(cleanedPrice);
    }

    public static void main(String[] args) {
        String url = "https://www.trendyol.com/apple/macbook-pro-m3-max-30c-gpu-36gb-1tb-ssd-mrw73tu-a-p-777662367?boutiqueId=61&merchantId=369055&sav=true";

        ProductEntry productEntry = new ProductEntry();
        productEntry.setUrl(url);
        productEntry.setName("testProduct");

        BaseCollector c = new TrendyolCollector();
        Double price = null;
        try {
            price = c.collectPrice(productEntry);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (price != null) {
            System.out.println("Ürün fiyatı: " + price);

        } else {
            System.out.println("Ürün fiyatı bulunamadı.");
        }

    }
}
