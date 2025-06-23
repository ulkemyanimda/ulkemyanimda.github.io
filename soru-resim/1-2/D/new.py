import os
import shutil

# Ayar: kaynak dizin ve n değeri
source_folder = "4"   # Örn: ./dosyalar
n = 6  # Kaça kadar kopyalanacak (örn: 10'a kadar)

# Mevcut dosyaları al (1-a.jpg, 1-b.jpg, ...)
template_files = [f for f in os.listdir(source_folder) if f.startswith("1-") and f.endswith(".jpg")]

# 2'den n'e kadar kopyala
for i in range(2, n + 1):
    for file in template_files:
        parts = file.split("-", 1)  # "1-a.jpg" → ["1", "a.jpg"]
        new_name = f"{i}-{parts[1]}"
        src_path = os.path.join(source_folder, file)
        dst_path = os.path.join(source_folder, new_name)
        shutil.copyfile(src_path, dst_path)
        print(f"Kopyalandı: {src_path} → {dst_path}")
