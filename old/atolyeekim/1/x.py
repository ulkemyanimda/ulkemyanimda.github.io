import os
import shutil

# 'x' klasörünün yolu
source_folder = 'x'

# Bu py dosyasının bulunduğu klasör
target_folder = os.path.dirname(os.path.abspath(__file__))

# 'x' klasöründeki tüm PNG dosyalarını al
png_files = [f for f in os.listdir(source_folder) if f.lower().endswith('.png')]

# Sıralama (dosya sırasını garantiye almak için)
png_files.sort()

# Her bir dosyayı taşı ve yeniden adlandır
for i, filename in enumerate(png_files, start=1):
    old_path = os.path.join(source_folder, filename)
    new_filename = f"{i}.png"
    new_path = os.path.join(target_folder, new_filename)
    
    # Taşı ve yeniden adlandır
    shutil.move(old_path, new_path)

print("Tüm PNG dosyaları yeniden adlandırıldı ve taşındı!")
