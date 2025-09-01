import os
from bs4 import BeautifulSoup

def listele_html_titler(klasor):
    sonuc = []
    for dosya in os.listdir(klasor):
        if dosya.lower().endswith(".html"):
            yol = os.path.join(klasor, dosya)
            with open(yol, "r", encoding="utf-8") as f:
                icerik = f.read()
                soup = BeautifulSoup(icerik, "html.parser")
                baslik = soup.title.string.strip() if soup.title else "(Başlık yok)"
                sonuc.append((dosya, baslik))
    return sonuc

# Kullanım
klasor_yolu = "./"  # kendi klasör yolunu buraya yaz
for dosya, baslik in listele_html_titler(klasor_yolu):
    print(f"{dosya}  -->  {baslik}")
