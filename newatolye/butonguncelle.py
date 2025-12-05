import re
import os

# === HTML dosyalarının bulunduğu klasör ===
klasor = "."  # aynı dizindeyse "." bırak
dosya_sayisi = 12  # 1'den 12'ye kadar

for i in range(1, dosya_sayisi + 1):
    dosya_adi = f"{i}.html"
    dosya_yolu = os.path.join(klasor, dosya_adi)

    if not os.path.exists(dosya_yolu):
        print(f"⚠️ {dosya_adi} bulunamadı, atlanıyor...")
        continue

    with open(dosya_yolu, "r", encoding="utf-8") as f:
        html = f.read()

    # Buton linkini güncelle (örnek: href="etkinlik/1.zip")
    duzenlenmis_html = re.sub(
        r'<a href="#" class="download-btn" onclick="[^"]*">',
        f'<a href="etkinlik/{i}.zip" class="download-btn">',
        html
    )

    # Yeni dosya üzerine yaz
    with open(dosya_yolu, "w", encoding="utf-8") as f:
        f.write(duzenlenmis_html)

    print(f"✅ {dosya_adi} dosyasında indirme linkleri güncellendi → etkinlik/{i}.zip")

print("🎯 Tüm HTML dosyaları başarıyla düzenlendi.")
