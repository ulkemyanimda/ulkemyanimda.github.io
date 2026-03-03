import re
import random
import shutil
from pathlib import Path

# Ayarlar
start_file = 1      # 1.html'den başla
end_file = 12       # 12.html'e kadar
min_value = 1       # rastgele minimum
max_value = 71      # rastgele maksimum
preserve_width = True  # True ise orijinal Y'nin basamak sayısını korur (zfill)

# Regex: src="(klasor)/(dosya.png)" -> grup1 = klasor, grup2 = dosya sayısı
pattern = re.compile(r'(src\s*=\s*")(\s*?)(\d+)/(\d+)\.png(")', re.IGNORECASE)

def replace_match(m):
    prefix = m.group(1)   # 'src="'
    spacer = m.group(2)   # eğer arada boşluk varsa (genelde yok)
    folder = m.group(3)   # ilk sayı (klasör)
    old_num = m.group(4)  # değiştireceğimiz ikinci sayı
    suffix = m.group(5)   # closing quote

    new_num = str(random.randint(min_value, max_value))
    if preserve_width:
        new_num = new_num.zfill(len(old_num))

    return f'{prefix}{spacer}{folder}/{new_num}.png{suffix}'

def process_file(path: Path):
    text = path.read_text(encoding='utf-8')
    new_text, count = pattern.subn(replace_match, text)
    if count > 0:
        # yedek oluştur
        bak = path.with_suffix(path.suffix + '.bak')
        shutil.copy2(path, bak)
        path.write_text(new_text, encoding='utf-8')
    return count

if __name__ == "__main__":
    total_replacements = 0
    for i in range(start_file, end_file + 1):
        file_path = Path(f"{i}.html")
        if not file_path.exists():
            print(f"[ATLANIYOR] {file_path} bulunamadı.")
            continue
        c = process_file(file_path)
        total_replacements += c
        print(f"{file_path}: {c} eşleşme değiştirildi. (yedek: {file_path.name}.bak)")

    print(f"Tamamlandı. Toplam değiştirilen eşleşme sayısı: {total_replacements}")
