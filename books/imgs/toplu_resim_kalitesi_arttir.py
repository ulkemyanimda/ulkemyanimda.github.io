import os
from PIL import Image, ImageFilter
from pathlib import Path

def enhance_image_quality(input_path, output_path, scale=2):
    try:
        img = Image.open(input_path).convert("RGB")

        # Yeni boyutu hesapla
        new_size = (img.width * scale, img.height * scale)

        # Yeniden boyutlandır + filtre
        img = img.resize(new_size, Image.LANCZOS)
        img = img.filter(ImageFilter.SHARPEN)

        # Çıktı klasörüne kaydet
        img.save(output_path, quality=95)
        print(f"✅ {Path(input_path).name} işlendi.")
    except Exception as e:
        print(f"❌ {input_path} işlenemedi: {e}")

def batch_enhance_images(input_folder, output_folder, scale=2):
    # Klasörleri oluştur
    input_folder = Path(input_folder)
    output_folder = Path(output_folder)
    output_folder.mkdir(parents=True, exist_ok=True)

    supported_exts = [".jpg", ".jpeg", ".png"]

    files = [f for f in input_folder.iterdir() if f.suffix.lower() in supported_exts]

    print(f"📂 Toplam {len(files)} resim bulundu.")
    
    for file in files:
        out_path = output_folder / file.name
        enhance_image_quality(file, out_path, scale=scale)

    print("🎉 Tüm resimler işlendi.")

# Örnek kullanım
if __name__ == "__main__":
    input_dir = input("📂 Giriş klasörü: ").strip().strip('"')
    output_dir = input("📁 Çıkış klasörü: ").strip().strip('"')
    scale_str = input("🔍 Büyütme oranı (varsayılan 2): ").strip()
    scale = int(scale_str) if scale_str.isdigit() else 2

    batch_enhance_images(input_dir, output_dir, scale)
