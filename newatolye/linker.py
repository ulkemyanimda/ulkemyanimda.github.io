import os

# HTML dosyalarının bulunduğu klasör
klasor_yolu = "html_dosyalar"  # burayı kendi klasör yolunla değiştir

# Değiştirilecek ve yeni linkler
eski_link = 'https://www.wikipedia.org'
yeni_link = 'https://ulkemyanimda.github.io/atolye/anons.html'

# Klasördeki tüm dosyaları gez
for dosya_adi in os.listdir(klasor_yolu):
    if dosya_adi.endswith(".html"):
        dosya_yolu = os.path.join(klasor_yolu, dosya_adi)
        
        # Dosyayı oku
        with open(dosya_yolu, "r", encoding="utf-8") as file:
            icerik = file.read()
        
        # Linki değiştir
        yeni_icerik = icerik.replace(eski_link, yeni_link)
        
        # Dosyayı tekrar yaz
        with open(dosya_yolu, "w", encoding="utf-8") as file:
            file.write(yeni_icerik)

print("Tüm linkler başarıyla değiştirildi.")
