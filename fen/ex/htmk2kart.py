from bs4 import BeautifulSoup
import csv
import os

def extract_cards_from_html(html_file, output_csv):
    """
    HTML dosyasından kart bilgilerini çıkarır ve CSV'ye kaydeder.
    
    Args:
        html_file: Okunacak HTML dosyasının yolu
        output_csv: Oluşturulacak CSV dosyasının yolu
    """
    
    # HTML dosyasını oku
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except FileNotFoundError:
        print(f"Hata: '{html_file}' dosyası bulunamadı!")
        return
    except Exception as e:
        print(f"Dosya okuma hatası: {e}")
        return
    
    # BeautifulSoup ile HTML'i parse et
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Tüm kartları bul (section veya div class="section")
    cards = soup.find_all('div', class_='section')
    
    # Eğer card bulunamazsa alternatif yapıları dene
    if not cards:
        print("'section' class'ı bulunamadı, alternatif yapılar deneniyor...")
        # Başka olası yapılar için arama yapabilirsiniz
    
    # Çıkarılan verileri sakla
    extracted_data = []
    
    for card in cards:
        try:
            # Başlık - data-title attribute'undan veya span.title'dan al
            title = card.get('data-title', '')
            if not title:
                title_elem = card.find('span', class_='title')
                if title_elem:
                    title = title_elem.get_text(strip=True)
                else:
                    # a etiketi içindeki text'i al (img'den sonraki br sonrası)
                    a_tag = card.find('a')
                    if a_tag:
                        # img ve br'den sonraki text
                        title = a_tag.get_text(strip=True)
            
            # Adres - href attribute'u
            link = ''
            a_tag = card.find('a', href=True)
            if a_tag:
                link = a_tag['href']
            
            # Resim linki - src attribute'u
            img_link = ''
            img_tag = card.find('img')
            if img_tag and img_tag.get('src'):
                img_link = img_tag['src']
            
            # Scorm download linki (opsiyonel)
            download_link = ''
            download_btn = card.find('a', class_='download-btn')
            if download_btn and download_btn.get('href'):
                download_link = download_btn['href']
            
            # Veriyi ekle
            extracted_data.append({
                'Baslik': title,
                'Adres': link,
                'Resim_Linki': img_link,
                'Scorm_Download': download_link
            })
            
        except Exception as e:
            print(f"Kart işleme hatası: {e}")
            continue
    
    # CSV dosyasına yaz
    if extracted_data:
        try:
            with open(output_csv, 'w', newline='', encoding='utf-8-sig') as csvfile:
                fieldnames = ['Baslik', 'Adres', 'Resim_Linki', 'Scorm_Download']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                writer.writeheader()
                writer.writerows(extracted_data)
            
            print(f"Başarılı! {len(extracted_data)} kart bulundu ve '{output_csv}' dosyasına kaydedildi.")
            
            # Önizleme göster
            print("\nİlk 3 kayıt önizlemesi:")
            for i, data in enumerate(extracted_data[:3], 1):
                print(f"\n{i}. Kart:")
                print(f"   Başlık: {data['Baslik']}")
                print(f"   Adres: {data['Adres']}")
                print(f"   Resim: {data['Resim_Linki']}")
                if data['Scorm_Download']:
                    print(f"   Scorm: {data['Scorm_Download']}")
                    
        except Exception as e:
            print(f"CSV yazma hatası: {e}")
    else:
        print("Hiç kart bulunamadı!")

# Kullanım
if __name__ == "__main__":
    # Dosya yollarını belirle
    input_html = "ornek.html"
    output_csv = "kartlar.csv"
    
    # Fonksiyonu çağır
    extract_cards_from_html(input_html, output_csv)