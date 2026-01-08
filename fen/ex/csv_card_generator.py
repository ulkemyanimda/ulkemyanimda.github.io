import csv
import os

# 1. HTML Şablonunun Başlangıcı (CSS Tasarımı Burada)
html_baslangic = """
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eğitim Materyalleri Galerisi</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f2f5;
            margin: 0;
            padding: 20px;
        }

        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 30px;
            max-width: 1400px;
            margin: 0 auto;
        }

        /* Kart Tasarımı */
        .card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            overflow: hidden;
            width: 420px; /* İstenilen resim genişliği ile uyumlu */
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Yumuşak geçiş animasyonu */
            text-decoration: none;
            color: inherit;
            position: relative;
        }

        /* Hover (Üzerine gelince) Animasyonu */
        .card:hover {
            transform: scale(1.05) translateY(-10px); /* Büyüme ve yukarı çıkma */
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
            z-index: 10;
        }

        /* Resim Ayarları */
        .card-img {
            width: 420px;
            height: 276px;
            object-fit: cover; /* Resmi kutuya sığdırır, bozulmayı önler */
            border-bottom: 4px solid #3498db;
        }

        .card-body {
            padding: 20px;
            text-align: center;
        }

        .card-title {
            font-size: 1.4rem;
            color: #333;
            margin: 0;
            font-weight: 600;
        }

        .download-link {
            display: block;
            margin-top: 10px;
            font-size: 0.9rem;
            color: #666;
            text-decoration: underline;
        }
        
        h1 { text-align: center; color: #2c3e50; margin-bottom: 40px; }
    </style>
</head>
<body>

    <h1>Eğitim Materyalleri</h1>
    <div class="container">
"""

html_bitis = """
    </div>
</body>
</html>
"""

# CSV dosyasının adı
csv_dosya_adi = 'veri.csv' 
html_cikti_adi = 'index.html'

def web_sayfasi_olustur():
    kartlar_html = ""
    
    try:
        with open(csv_dosya_adi, mode='r', encoding='utf-8') as file:
            # CSV okuyucuyu başlat (DictReader başlıkları anahtar olarak kullanır)
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                # CSV'den verileri al (Boşlukları temizle)
                baslik = row['Baslik'].strip()
                scorm_link = row['scorm'].strip()
                adres_link = row['adres'].strip()
                resim_yolu = row['resim'].strip()
                
                # Her satır için bir HTML kartı oluştur
                # Kartın kendisine tıklandığında 'adres'e gider.
                kart = f"""
        <a href="{adres_link}" class="card" target="_blank">
            <img src="{resim_yolu}" alt="{baslik}" class="card-img">
            <div class="card-body">
                <div class="card-title">{baslik}</div>
                </div>
        </a>
                """
                kartlar_html += kart
                
        # Tüm parçaları birleştir
        tam_html = html_baslangic + kartlar_html + html_bitis
        
        # Dosyayı yaz
        with open(html_cikti_adi, 'w', encoding='utf-8') as f:
            f.write(tam_html)
            
        print(f"Başarılı! '{html_cikti_adi}' dosyası oluşturuldu.")
        
    except FileNotFoundError:
        print(f"Hata: '{csv_dosya_adi}' dosyası bulunamadı. Lütfen dosya adını kontrol edin.")
    except Exception as e:
        print(f"Bir hata oluştu: {e}")

# Kodu çalıştır
if __name__ == "__main__":
    # Test için örnek veri dosyası yoksa oluşturalım (SİLİNEBİLİR)
    if not os.path.exists(csv_dosya_adi):
        with open(csv_dosya_adi, 'w', encoding='utf-8') as f:
            f.write("Baslik,scorm,adres,resim\n")
            f.write("Sayı Çiftleri,./zips/number.zip,./deneys/number.html,https://placehold.co/420x276/png\n")
            f.write("Renk Eşleştirme,./zips/color.zip,./deneys/color.html,https://placehold.co/420x276/orange/white\n")
            f.write("Hafıza Oyunu,./zips/memory.zip,./deneys/memory.html,https://placehold.co/420x276/3498db/white\n")
        print("Test için örnek 'veri.csv' oluşturuldu.")

    web_sayfasi_olustur()