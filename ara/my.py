import os
import re

# HTML dosyalarının bulunduğu klasör yolu
HTML_DIR = "videos"   # gerekirse değiştir

# Benzersiz başlıkları saklamak için set
unique_titles = set()

# Başlık için regex deseni
pattern = re.compile(r'<h2>\s*([^<\n]+)', re.IGNORECASE)

# Klasör içindeki tüm HTML dosyalarını tara
for root, dirs, files in os.walk(HTML_DIR):
    for file in files:
        if file.lower().endswith(".html"):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()

                    # h2 etiketi içindeki ilk satırı bul
                    match = pattern.search(content)
                    if match:
                        title = match.group(1).strip()
                        if title not in unique_titles:
                            unique_titles.add(title)
            except Exception as e:
                print(f"Hata ({path}): {e}")

# Benzersiz başlıkları yazdır
print("\n=== Benzersiz Başlıklar ===")
for title in sorted(unique_titles):
    print(title)
