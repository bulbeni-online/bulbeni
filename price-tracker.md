# Price Tracker Changelog

## v0.01 - İlk Versiyon

### Authentication
- **Kullanıcı girişi zorunlu** olacak. Authenticate olmamış kullanıcılar için giriş yapılamayacak.  
- **Giriş yapmamış kullanıcıların** yaptığı tüm istekler başarısız olacak ve login sayfasına yönlendirilecek.  

### Görevler

#### 1. AddUrlPage Authentication
- `AddUrlPage` sayfasında **authentication** şu an devre dışı.  
- **Token kullanımı aktif hale getirilmeli** ve sayfa yalnızca authenticate olmuş kullanıcılar tarafından erişilebilir olmalı.  

#### 2. React Table Component
- Mevcut **React Table component'inden** memnun kalınmadı.  
- Daha kullanıcı dostu ve daha iyi performans gösteren **alternatif bir kütüphane** ile değiştirilmesi gerekiyor.  

#### 3. Stil Güncellemeleri
- Mevcut stil düzeni **tatmin edici değil**. Görünümün daha modern ve kullanıcı dostu hale getirilmesi gerekiyor.  
- **bulbeni-frontend** örnek alınarak daha şık ve profesyonel bir tasarım elde edilmeli.  

### Hedef
Bu maddelerin tamamlanmasıyla `v0.01` sürümü production ortamına deploy edilecek.  
Uygulama **[bulbeni.online](https://bulbeni.online)** adresinden kullanılmaya başlanacak.  

---

## v0.02 - Fiyat Takibi ve Kayıt

### Özellikler
- Kullanıcıların kaydettiği **URL'lere gidip, ürün fiyatlarını çekip sisteme kaydeden** bir servis/batch job eklenecek.  
- Bu özellik sayesinde:  
  - Kaydedilen her ürünün **fiyat değişimleri takip** edilebilecek.  
  - Fiyat hareketleri **grafiklerle** kullanıcıya sunulacak.  

### Görevler

#### 1. Servis/Batch Job
- URL'lerden **fiyat bilgisi çekecek** ve veritabanına kaydedecek servis tasarlanacak.  
- İşlemin **düzenli aralıklarla** tekrarlanması için batch job konfigürasyonu yapılacak.  

#### 2. Veritabanı Düzenlemeleri
- Fiyat değişimlerini takip edebilmek için **gerekli veritabanı tabloları** ve ilişkilendirmeler tasarlanacak.  

#### 3. Fiyat Grafikleri
- Ürünlerin fiyat değişimlerini **grafiksel olarak** gösterecek bir bileşen tasarlanacak.  
- Kullanıcılar fiyat hareketlerini **tarihsel olarak** inceleyebilecek.  

#### 4. UI/UX Güncellemeleri
- Fiyat takibi ve grafik gösterimi için **kullanıcı dostu ve estetik** arayüz tasarımları yapılacak.  
