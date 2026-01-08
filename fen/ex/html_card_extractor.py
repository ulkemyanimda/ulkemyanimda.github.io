import csv
import os

# 1. HTML Şablonu ve CSS Tasarımı
html_baslangic = """
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eğitim Materyalleri</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; }
        .container { display: flex; flex-wrap: wrap; justify-content: center; gap: 30px; max-width: 1400px; margin: 0 auto; }

        /* Kart Kutusu */
        .card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            overflow: hidden;
            width: 420px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            flex-direction: column;
            position: relative;
        }

        /* Kart Hover Animasyonu (Büyüme) */
        .card:hover { transform: scale(1.05) translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); z-index: 10; }

        /* Link Kapsayıcısı (Resim ve Başlık için) */
        .card-link-wrapper { text-decoration: none; color: inherit; flex-grow: 1; }

        .card-img { width: 420px; height: 276px; object-fit: cover; border-bottom: 4px solid #3498db; display: block; }
        
        .card-body { padding: 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        
        .card-title { font-size: 1.4rem; color: #333; margin: 0; font-weight: 600; }

        /* İndir Butonu Tasarımı */
        .btn-indir {
            background-color: #27ae60;
            color: white;
            padding: 10px 25px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: background-color 0.3s;
            display: inline-block;
            margin-bottom: 15px; /* Alttan boşluk */
        }
        
        .btn-indir:hover { background-color: #219150; }

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

csv_dosya_adi = 'veri.csv' 
html_cikti_adi = 'index.html'

def web_sayfasi_olustur():
    kartlar_html = ""
    
    try:
        # utf-8-sig ile gizli BOM karakterlerini temizliyoruz
        with open(csv_dosya_adi, mode='r', encoding='utf-8-sig') as file:
            
            # Ayırıcıyı (virgül veya noktalı virgül) otomatik bul
            ilk_satir = file.readline()
            file.seek(0)
            ayirici = ';' if ';' in ilk_satir else ','
            print(f"Bilgi: Ayırıcı '{ayirici}' olarak ayarlandı.")
            
            csv_reader = csv.DictReader(file, delimiter=ayirici)
            
            print(f"Sütunlar: {csv_reader.fieldnames}")

            for row in csv_reader:
                if not row or row[csv_reader.fieldnames[0]] is None: continue

                try:
                    baslik = row['Baslik'].strip()
                    scorm_link = row['scorm'].strip()
                    adres_link = row['adres'].strip()
                    resim_yolu = row['resim'].strip()
                except KeyError as e:
                    print(f"HATA: Sütun eksik -> {e}")
                    return

                # HTML Yapısı:
                # 1. card-link-wrapper: Resim ve başlığı kapsar, web sayfasına gider.
                # 2. btn-indir: Sadece butondur, scorm dosyasını indirir.
                kart = f"""
        <div class="card">
            <a href="{adres_link}" target="_blank" class="card-link-wrapper">
                <img src="{resim_yolu}" alt="{baslik}" class="card-img">
                <div class="card-body">
                    <div class="card-title">{baslik}</div>
                </div>
            </a>
            <div style="text-align: center;">
                <a href="{scorm_link}" class="btn-indir" download>⬇ SCORM İndir</a>
            </div>
        </div>
                """
                kartlar_html += kart
                
        tam_html = html_baslangic + kartlar_html + html_bitis
        
        with open(html_cikti_adi, 'w', encoding='utf-8') as f:
            f.write(tam_html)
            
        print(f"Başarılı! '{html_cikti_adi}' dosyası oluşturuldu.")
        
    except FileNotFoundError:
        print(f"Hata: '{csv_dosya_adi}' bulunamadı.")
    except Exception as e:
        print(f"Hata oluştu: {e}")

if __name__ == "__main__":
    web_sayfasi_olustur()