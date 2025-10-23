import re

# === Ayarlar ===
html_dosya = "12.html"      # HTML dosya adı
anahtar_kelime = "ekim"       # Eklenecek kelime (örnek: "posta")

# === HTML Dosyasını Oku ===
with open(html_dosya, "r", encoding="utf-8") as f:
    html_icerik = f.read()

# === Düzenleme (örnek: src="1/76.png" -> src="1/posta/76.png") ===
duzenlenmis_html = re.sub(
    r'src="1/(\d+)\.png"',
    rf'src="1/{anahtar_kelime}.png"',
    html_icerik
)

# === Sonucu Yeni Dosyaya Yaz ===
with open("duzenlenmis_" + html_dosya, "w", encoding="utf-8") as f:
    f.write(duzenlenmis_html)

print("✅ Düzenleme tamamlandı. Yeni dosya: duzenlenmis_" + html_dosya)
