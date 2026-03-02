import pandas as pd
import os
from bs4 import BeautifulSoup
import re

def html_linklerini_guncelle(excel_dosyasi, html_klasoru):
    """
    Excel dosyasındaki bilgilere göre HTML dosyalarındaki linkleri günceller.
    Dosya adı eşleşmesi aramaz, tüm HTML dosyalarında isim eşleşmesi arar.
    
    Parameters:
    excel_dosyasi (str): Excel dosyasının yolu
    html_klasoru (str): HTML dosyalarının bulunduğu klasör yolu
    """
    
    # Excel dosyasını oku
    try:
        if excel_dosyasi.endswith('.xlsx'):
            df = pd.read_excel(excel_dosyasi)
        else:
            try:
                df = pd.read_csv(excel_dosyasi, encoding='utf-8')
            except UnicodeDecodeError:
                try:
                    df = pd.read_csv(excel_dosyasi, encoding='latin-1')
                except:
                    df = pd.read_csv(excel_dosyasi, encoding='cp1254')
    except Exception as e:
        print(f"❌ Excel dosyası okunamadı: {e}")
        print("\nDosya formatını kontrol edin:")
        print("  • .xlsx dosyası mı?")
        print("  • CSV ise virgül ile mi ayrılmış?")
        print("  • Başlıklar: sira,dosya,isim,link")
        return
    
    print(f"✓ Excel dosyası okundu: {len(df)} satır bulundu\n")
    
    # Klasördeki tüm HTML dosyalarını bul
    html_dosyalari = []
    for dosya in os.listdir(html_klasoru):
        if dosya.endswith('.html') or dosya.endswith('.htm'):
            html_dosyalari.append(dosya)
    
    print(f"✓ {len(html_dosyalari)} HTML dosyası bulundu\n")
    print("=" * 60)
    
    # İstatistikler
    guncellenen_kayitlar = []
    bulunamayan_kayitlar = []
    
    # Her Excel satırı için tüm HTML dosyalarında ara
    for index, row in df.iterrows():
        isim = row['isim'].strip()
        yeni_link = row['link']
        
        bulundu = False
        
        # Tüm HTML dosyalarını tara
        for dosya_adi in html_dosyalari:
            dosya_yolu = os.path.join(html_klasoru, dosya_adi)
            
            # HTML dosyasını oku
            with open(dosya_yolu, 'r', encoding='utf-8') as file:
                html_icerik = file.read()
            
            soup = BeautifulSoup(html_icerik, 'html.parser')
            
            # İsmi içeren download-btn butonunu bul
            for a_tag in soup.find_all('a', class_='download-btn'):
                if isim in a_tag.get_text():
                    # Bir önceki a etiketini bul (link-wrapper)
                    parent = a_tag.find_previous('a', class_='link-wrapper')
                    if parent and parent.get('href'):
                        eski_link = parent['href']
                        parent['href'] = yeni_link
                        
                        # Güncellenmiş HTML'i kaydet
                        with open(dosya_yolu, 'w', encoding='utf-8') as file:
                            file.write(str(soup))
                        
                        print(f"✓ '{isim}' güncellendi")
                        print(f"  Dosya: {dosya_adi}")
                        print(f"  Eski: {eski_link[:50]}...")
                        print(f"  Yeni: {yeni_link[:50]}...\n")
                        
                        guncellenen_kayitlar.append({
                            'isim': isim,
                            'dosya': dosya_adi
                        })
                        bulundu = True
                        break
            
            if bulundu:
                break
        
        if not bulundu:
            print(f"⚠ '{isim}' hiçbir HTML dosyasında bulunamadı\n")
            bulunamayan_kayitlar.append(isim)
    
    # Özet bilgi
    print("=" * 60)
    print(f"ÖZET:")
    print(f"Toplam kayıt: {len(df)}")
    print(f"Güncellenen: {len(guncellenen_kayitlar)}")
    print(f"Bulunamayan: {len(bulunamayan_kayitlar)}")
    print("=" * 60)
    
    if guncellenen_kayitlar:
        print("\n✓ Güncellenen kayıtlar:")
        for kayit in guncellenen_kayitlar:
            print(f"  • {kayit['isim']} → {kayit['dosya']}")
    
    if bulunamayan_kayitlar:
        print("\n⚠ Bulunamayan isimler:")
        for isim in bulunamayan_kayitlar:
            print(f"  • {isim}")

# KULLANIM
if __name__ == "__main__":
    # Excel dosyasının yolunu belirtin
    excel_yolu = "linkler.xlsx"  # veya "linkler.csv"
    
    # HTML dosyalarının bulunduğu klasörü belirtin
    html_klasor_yolu = "x"
    
    # Güncellemeyi başlat
    html_linklerini_guncelle(excel_yolu, html_klasor_yolu)
    
    print("\n✓ İşlem tamamlandı!")