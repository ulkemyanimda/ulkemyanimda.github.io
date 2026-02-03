import os
from bs4 import BeautifulSoup
from openpyxl import Workbook

# Ana klasör (altının altı dahil tamamı taranır)
ANA_KLASOR = "./"   # <-- burayı değiştir
CIKTI_EXCEL = "linkler_ve_basliklar.xlsx"

# Excel oluştur
wb = Workbook()
ws = wb.active
ws.title = "Linkler"

# Başlık satırı
ws.append(["Dosya Yolu", "Başlık", "Link"])

kayit_sayisi = 0

for root, dirs, files in os.walk(ANA_KLASOR):
    for dosya in files:
        if dosya.endswith(".html"):
            dosya_yolu = os.path.join(root, dosya)

            try:
                with open(dosya_yolu, "r", encoding="utf-8") as f:
                    soup = BeautifulSoup(f, "html.parser")

                    for a in soup.find_all("a", href=True):
                        baslik = a.get_text(strip=True)
                        link = a["href"]

                        if baslik:
                            ws.append([
                                os.path.relpath(dosya_yolu, ANA_KLASOR),
                                baslik,
                                link
                            ])
                            kayit_sayisi += 1

            except Exception as e:
                print(f"⚠️ Okunamadı: {dosya_yolu} → {e}")

# Excel kaydet
wb.save(CIKTI_EXCEL)

print(f"✅ {kayit_sayisi} kayıt '{CIKTI_EXCEL}' dosyasına yazıldı.")
