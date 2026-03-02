import pandas as pd
import os
from bs4 import BeautifulSoup
import re

def html_linklerini_guncelle(excel_dosyasi, html_klasoru):
    """
    Excel dosyasındaki bilgilere göre HTML dosyalarındaki linkleri günceller.
    
    Parameters:
    excel_dosyasi (str): Excel dosyasının yolu
    html_klasoru (str): HTML dosyalarının bulunduğu klasör yolu
    """
    
    # Excel dosyasını oku
    try:
        # Önce xlsx formatını dene
        if excel_dosyasi.endswith('.xlsx'):
            df = pd.read_excel(excel_dosyasi)
        else:
            # CSV için farklı encodingleri dene
            try:
                df = pd.read_csv(excel_dosyasi, encoding='utf-8')
            except UnicodeDecodeError:
                try:
                    df = pd.read_csv(excel_dosyasi, encoding='latin-1')
                except:
                    df = pd.read_csv(excel_dosyasi, encoding='cp1254')  # Türkçe Windows
    except Exception as e:
        print(f"❌ Excel dosyası okunamadı: {e}")
        print("\nDosya formatını kontrol edin:")
        print("  • .xlsx dosyası mı?")
        print("  • CSV ise virgül ile mi ayrılmış?")
        print("  • Başlıklar: sira,dosya,isim,link")
        return
    
    print(f"✓ Excel dosyası okundu: {len(df)} satır bulundu\n")
    
    # Her satır için işlem yap
    guncellenen_dosyalar = []
    bulunamayan_dosyalar = []
    
    for index, row in df.iterrows():
        dosya_adi = row['dosya']
        isim = row['isim'].strip()
        yeni_link = row['link']
        
        dosya_yolu = os.path.join(html_klasoru, dosya_adi)
        
        # HTML dosyası var mı kontrol et
        if not os.path.exists(dosya_yolu):
            bulunamayan_dosyalar.append(dosya_adi)
            print(f"⚠ Dosya bulunamadı: {dosya_adi}")
            continue
        
        # HTML dosyasını oku
        with open(dosya_yolu, 'r', encoding='utf-8') as file:
            html_icerik = file.read()
        
        soup = BeautifulSoup(html_icerik, 'html.parser')
        
        # İsmi içeren download-btn butonunu bul
        guncellendi = False
        for a_tag in soup.find_all('a', class_='download-btn'):
            # Buton içeriğinde isim geçiyor mu kontrol et
            if isim in a_tag.get_text():
                # Bir önceki a etiketini bul (link-wrapper)
                parent = a_tag.find_previous('a', class_='link-wrapper')
                if parent and parent.get('href'):
                    eski_link = parent['href']
                    parent['href'] = yeni_link
                    guncellendi = True
                    print(f"✓ {dosya_adi} - {isim}")
                    print(f"  Eski: {eski_link[:50]}...")
                    print(f"  Yeni: {yeni_link[:50]}...\n")
                    break
        
        if guncellendi:
            # Güncellenmiş HTML'i kaydet
            with open(dosya_yolu, 'w', encoding='utf-8') as file:
                file.write(str(soup))
            guncellenen_dosyalar.append(dosya_adi)
        else:
            print(f"⚠ {dosya_adi} dosyasında '{isim}' ismi bulunamadı\n")
    
    # Özet bilgi
    print("=" * 60)
    print(f"ÖZET:")
    print(f"Toplam işlem: {len(df)}")
    print(f"Güncellenen dosya: {len(guncellenen_dosyalar)}")
    print(f"Bulunamayan dosya: {len(bulunamayan_dosyalar)}")
    print("=" * 60)
    
    if guncellenen_dosyalar:
        print("\nGüncellenen dosyalar:")
        for dosya in guncellenen_dosyalar:
            print(f"  • {dosya}")
    
    if bulunamayan_dosyalar:
        print("\nBulunamayan dosyalar:")
        for dosya in bulunamayan_dosyalar:
            print(f"  • {dosya}")

# KULLANIM
if __name__ == "__main__":
    # Excel dosyasının yolunu belirtin
    excel_yolu = "linkler.xlsx"  # veya "linkler.xlsx"
    
    # HTML dosyalarının bulunduğu klasörü belirtin
    html_klasor_yolu = "x"  # Mevcut klasör için "." kullanın
    
    # Güncellemeyi başlat
    html_linklerini_guncelle(excel_yolu, html_klasor_yolu)
    
    print("\n✓ İşlem tamamlandı!")
