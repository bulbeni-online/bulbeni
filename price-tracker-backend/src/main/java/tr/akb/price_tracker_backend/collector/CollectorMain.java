package tr.akb.price_tracker_backend.collector;

import tr.akb.price_tracker_backend.entity.ProductEntry;

public class CollectorMain {

    public static void executeMain(BaseCollector collector, String[] urlArr){

        for (String url : urlArr) {
            ProductEntry productEntry = new ProductEntry();
            productEntry.setUrl(url);
            productEntry.setName("testProduct");

            Double price = null;
            try {
                price = collector.collectPrice(productEntry);
            } catch (Exception e) {
                e.printStackTrace();
            }

            String className = collector.getClass().getName();

            if (price != null) {
                System.out.println(className + ":Ürün fiyatı (" + url + "): " + price);
            } else {
                System.out.println(className + ":Ürün fiyatı bulunamadı (" + url + ").");
            }
        }
    }
}
