"""
Ülkem Yanımda – Türkçe ve Türk Kültürü Öğretmen Kadrosu
Excel dosyasından HTML kadro sayfası üretir.

Kullanım:
    pip install pandas openpyxl Pillow
    python excel_to_kadro.py ogretmenler.xlsx

Beklenen Excel sütunları (sıra önemli değil, başlık eşlemesi aşağıda):
    Ad-Soyad | Branş | Şehir | Hayat (biyografi) | Foto (dosya yolu veya URL)

Fotoğraf sütununda:
  - Dosya yolu yazılabilir  (örn: resimler/ali_veli.jpg)
  - URL yazılabilir          (örn: https://...)
  - Boş bırakılabilir       → baş harfli avatar gösterilir
"""

import sys
import os
import base64
import re
from pathlib import Path
from io import BytesIO

try:
    import pandas as pd
except ImportError:
    sys.exit("pandas yüklü değil. Lütfen: pip install pandas openpyxl")

try:
    from PIL import Image
    PIL_OK = True
except ImportError:
    PIL_OK = False
    print("Uyarı: Pillow yüklü değil. Fotoğraflar base64 gömülmeyecek.")

# ── Sütun adı eşleme (küçük harf, boşluk/tire normalize) ──────────────────────
COL_MAP = {
    "ad-soyad": "isim",
    "adsoyad":  "isim",
    "ad soyad": "isim",
    "isim":     "isim",
    "brans":    "brans",
    "branş":    "brans",
    "sehir":    "sehir",
    "şehir":    "sehir",
    "city":     "sehir",
    "hayat":    "hayat",
    "biyografi":"hayat",
    "bio":      "hayat",
    "hakkında": "hayat",
    "foto":     "foto",
    "fotoğraf": "foto",
    "fotograf":  "foto",
    "photo":    "foto",
    "resim":    "foto",
    "image":    "foto",
}

def normalize(s):
    return re.sub(r"[\s\-_]+", "", str(s).lower().strip())

def detect_columns(df):
    mapping = {}
    for col in df.columns:
        key = normalize(col)
        if key in COL_MAP:
            mapping[COL_MAP[key]] = col
    missing = [k for k in ["isim", "brans", "sehir"] if k not in mapping]
    if missing:
        print(f"UYARI: Şu sütunlar bulunamadı: {missing}")
        print(f"       Mevcut sütunlar: {list(df.columns)}")
    return mapping

def img_to_b64(path_or_url: str, size=(300, 300)) -> str | None:
    """Resmi kare kırpıp base64'e çevirir."""
    if not PIL_OK:
        return None
    try:
        if path_or_url.startswith("http"):
            import urllib.request
            with urllib.request.urlopen(path_or_url, timeout=5) as r:
                data = r.read()
            img = Image.open(BytesIO(data))
        else:
            p = Path(path_or_url)
            if not p.exists():
                return None
            img = Image.open(p)

        # Kare kırp (center crop)
        img = img.convert("RGB")
        w, h = img.size
        m = min(w, h)
        left  = (w - m) // 2
        top   = (h - m) // 2
        img   = img.crop((left, top, left + m, top + m))
        img   = img.resize(size, Image.LANCZOS)

        buf = BytesIO()
        img.save(buf, "JPEG", quality=82)
        return base64.b64encode(buf.getvalue()).decode()
    except Exception as e:
        print(f"  ! Resim işlenemedi ({path_or_url}): {e}")
        return None

def initials_svg(name: str) -> str:
    """İsim baş harflerinden SVG avatar üretir."""
    parts  = name.strip().split()
    letters = (parts[0][0] + (parts[-1][0] if len(parts) > 1 else "")).upper()
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">'
        f'<rect width="300" height="300" fill="#1a7f8e"/>'
        f'<text x="150" y="185" font-family="Georgia,serif" font-size="110" '
        f'fill="white" text-anchor="middle" font-weight="bold">{letters}</text>'
        f'</svg>'
    )

def build_html(teachers: list[dict]) -> str:
    cards_html = ""
    for i, t in enumerate(teachers):
        isim  = t.get("isim", "—")
        brans = t.get("brans", "")
        sehir = t.get("sehir", "")
        hayat = t.get("hayat", "")
        b64   = t.get("b64")

        if b64:
            img_tag = f'<img src="data:image/jpeg;base64,{b64}" alt="{isim}" loading="lazy">'
        else:
            svg = initials_svg(isim)
            svg_b64 = base64.b64encode(svg.encode()).decode()
            img_tag = f'<img src="data:image/svg+xml;base64,{svg_b64}" alt="{isim}">'

        hayat_escaped = hayat.replace('"', "&quot;").replace("'", "&#39;")
        brans_escaped  = brans.replace('"', "&quot;")
        sehir_escaped  = sehir.replace('"', "&quot;")

        cards_html += f"""
        <div class="card" data-index="{i}"
             data-isim="{isim}" data-brans="{brans_escaped}"
             data-sehir="{sehir_escaped}" data-hayat="{hayat_escaped}">
          <div class="avatar">{img_tag}</div>
          <div class="info">
            <span class="name">{isim}</span>
            <span class="brans">{brans}</span>
            <span class="sehir">📍 {sehir}</span>
          </div>
        </div>"""

    toplam = len(teachers)

    return f"""<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ülkem Yanımda – Öğretmen Kadrosu</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet">
<style>
:root {{
  --turquoise : #009DAE;
  --turq-dark : #006B78;
  --turq-light: #E0F7FA;
  --red       : #C0392B;
  --red-light : #FDE8E6;
  --white     : #FFFFFF;
  --off-white : #F7F9FA;
  --black     : #1A1A1A;
  --grey      : #5A6472;
  --grey-light: #DEE3E8;
}}

* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: "Source Sans 3", sans-serif; background: var(--off-white); color: var(--black); }}

/* ── HEADER ────────────────────────────────────────────────────────── */
header {{
  background: linear-gradient(135deg, var(--turq-dark) 0%, var(--turquoise) 60%, #00BCD4 100%);
  padding: 48px 24px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}}
header::before {{
  content: "";
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}}
.flag-stripe {{
  display: flex; justify-content: center; gap: 6px; margin-bottom: 20px;
}}
.flag-stripe span {{
  display: block; height: 5px; border-radius: 3px;
}}
.flag-stripe .s1 {{ width: 50px; background: var(--red); }}
.flag-stripe .s2 {{ width: 80px; background: var(--white); opacity:.7; }}
.flag-stripe .s3 {{ width: 50px; background: var(--red); }}

header h1 {{
  font-family: "Playfair Display", serif;
  font-size: clamp(2rem, 5vw, 3.6rem);
  font-weight: 900;
  color: var(--white);
  letter-spacing: -.5px;
  line-height: 1.15;
  position: relative;
}}
header h1 em {{
  font-style: normal;
  color: #FFE082;
}}
header p.subtitle {{
  margin-top: 10px;
  color: rgba(255,255,255,.82);
  font-size: 1.05rem;
  font-weight: 300;
  letter-spacing: .5px;
  position: relative;
}}
.badge {{
  display: inline-block;
  margin-top: 18px;
  background: rgba(255,255,255,.18);
  border: 1px solid rgba(255,255,255,.3);
  color: white;
  padding: 5px 16px;
  border-radius: 20px;
  font-size: .85rem;
  letter-spacing: .5px;
  position: relative;
}}

/* ── SEARCH ─────────────────────────────────────────────────────────── */
.search-bar {{
  max-width: 480px;
  margin: -22px auto 0;
  padding: 0 16px;
  position: relative;
  z-index: 10;
}}
.search-bar input {{
  width: 100%;
  padding: 14px 48px 14px 20px;
  border-radius: 40px;
  border: none;
  box-shadow: 0 6px 24px rgba(0,0,0,.15);
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  color: var(--black);
}}
.search-bar input:focus {{ box-shadow: 0 0 0 3px var(--turquoise), 0 6px 24px rgba(0,0,0,.15); }}
.search-icon {{
  position: absolute; right: 30px; top: 50%; transform: translateY(-50%);
  color: var(--turquoise); font-size: 1.2rem; pointer-events: none;
}}

/* ── GRID ────────────────────────────────────────────────────────────── */
.container {{ max-width: 1280px; margin: 0 auto; padding: 50px 20px 60px; }}
.count-label {{
  text-align: center; margin-bottom: 28px;
  color: var(--grey); font-size: .9rem; letter-spacing: .3px;
}}
.count-label strong {{ color: var(--turq-dark); }}

.grid {{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
}}

/* ── CARD ────────────────────────────────────────────────────────────── */
.card {{
  background: var(--white);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0,0,0,.07);
  transition: transform .22s ease, box-shadow .22s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid var(--grey-light);
}}
.card:hover {{
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0,157,174,.22);
  border-color: var(--turquoise);
}}
.card.hidden {{ display: none; }}

.avatar {{
  width: 100%; aspect-ratio: 1;
  overflow: hidden;
  background: var(--turq-light);
}}
.avatar img {{
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}}

.info {{
  padding: 12px 10px 14px;
  display: flex; flex-direction: column; gap: 4px;
  width: 100%;
}}
.name {{
  font-weight: 700;
  font-size: .93rem;
  color: var(--black);
  line-height: 1.3;
}}
.brans {{
  font-size: .78rem;
  background: var(--turq-light);
  color: var(--turq-dark);
  border-radius: 20px;
  padding: 2px 10px;
  display: inline-block;
  font-weight: 600;
  letter-spacing: .2px;
}}
.sehir {{
  font-size: .78rem;
  color: var(--grey);
}}

/* ── MODAL ───────────────────────────────────────────────────────────── */
.overlay {{
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(4px);
  z-index: 100;
  align-items: center;
  justify-content: center;
  padding: 20px;
}}
.overlay.active {{ display: flex; }}

.modal {{
  background: var(--white);
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,.25);
  animation: popIn .25s cubic-bezier(.34,1.56,.64,1);
}}
@keyframes popIn {{
  from {{ transform: scale(.88); opacity: 0; }}
  to   {{ transform: scale(1);   opacity: 1; }}
}}

.modal-header {{
  background: linear-gradient(135deg, var(--turq-dark), var(--turquoise));
  padding: 32px 28px 24px;
  display: flex; align-items: center; gap: 20px;
}}
.modal-avatar {{
  width: 90px; height: 90px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255,255,255,.5);
  flex-shrink: 0;
}}
.modal-avatar img {{
  width: 100%; height: 100%; object-fit: cover;
}}
.modal-title {{ color: white; }}
.modal-title h2 {{ font-family: "Playfair Display",serif; font-size: 1.45rem; line-height: 1.2; }}
.modal-title .m-brans {{
  display: inline-block; margin-top: 6px;
  background: rgba(255,255,255,.2);
  color: white; font-size: .8rem; font-weight: 600;
  padding: 3px 12px; border-radius: 20px;
}}
.modal-title .m-sehir {{
  display: block; margin-top: 6px;
  color: rgba(255,255,255,.8); font-size: .85rem;
}}

.modal-body {{
  padding: 24px 28px 28px;
}}
.modal-body h3 {{
  font-size: .75rem; font-weight: 700; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--turquoise);
  margin-bottom: 10px;
  border-left: 3px solid var(--turquoise); padding-left: 10px;
}}
.modal-body p {{
  font-size: .95rem; line-height: 1.7;
  color: var(--grey);
  white-space: pre-line;
}}
.modal-body .empty {{ color: var(--grey-light); font-style: italic; }}

.close-btn {{
  display: block;
  margin: 0 28px 22px auto;
  padding: 10px 28px;
  background: var(--red);
  color: white; font-size: .9rem; font-weight: 600;
  border: none; border-radius: 8px; cursor: pointer;
  transition: background .18s;
}}
.close-btn:hover {{ background: #a93226; }}

/* ── FOOTER ──────────────────────────────────────────────────────────── */
footer {{
  text-align: center; padding: 28px;
  color: var(--grey); font-size: .8rem;
  border-top: 1px solid var(--grey-light);
  background: var(--white);
}}

/* ── NO-RESULT ───────────────────────────────────────────────────────── */
.no-result {{
  display: none; text-align: center;
  padding: 60px 20px; color: var(--grey);
}}
.no-result.active {{ display: block; }}
</style>
</head>
<body>

<header>
  <div class="flag-stripe">
    <span class="s1"></span><span class="s2"></span><span class="s3"></span>
  </div>
  <h1>Ülkem <em>Yanımda</em></h1>
  <p class="subtitle">Türkçe ve Türk Kültürü Dersi Öğretmen Kadrosu</p>
  <div class="badge">👩‍🏫 {toplam} Öğretmen</div>
</header>

<div class="search-bar">
  <input type="text" id="searchInput" placeholder="İsim, branş veya şehir ara…">
  <span class="search-icon">🔍</span>
</div>

<div class="container">
  <p class="count-label">
    <strong id="visibleCount">{toplam}</strong> öğretmen gösteriliyor
  </p>
  <div class="grid" id="grid">
    {cards_html}
  </div>
  <div class="no-result" id="noResult">Arama sonucu bulunamadı.</div>
</div>

<!-- MODAL -->
<div class="overlay" id="overlay">
  <div class="modal" id="modal">
    <div class="modal-header">
      <div class="modal-avatar"><img id="modalImg" src="" alt=""></div>
      <div class="modal-title">
        <h2 id="modalIsim"></h2>
        <span class="m-brans" id="modalBrans"></span>
        <span class="m-sehir" id="modalSehir"></span>
      </div>
    </div>
    <div class="modal-body">
      <h3>Biyografi</h3>
      <p id="modalHayat"></p>
    </div>
    <button class="close-btn" id="closeBtn">Kapat</button>
  </div>
</div>

<footer>© Ülkem Yanımda – Tüm hakları saklıdır.</footer>

<script>
const cards  = document.querySelectorAll(".card");
const search = document.getElementById("searchInput");
const visibleCount = document.getElementById("visibleCount");
const noResult = document.getElementById("noResult");

function filterCards(q) {{
  q = q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let n = 0;
  cards.forEach(c => {{
    const text = [c.dataset.isim, c.dataset.brans, c.dataset.sehir]
      .join(" ").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const show = text.includes(q);
    c.classList.toggle("hidden", !show);
    if (show) n++;
  }});
  visibleCount.textContent = n;
  noResult.classList.toggle("active", n === 0);
}}

search.addEventListener("input", e => filterCards(e.target.value.trim()));

// Modal
const overlay  = document.getElementById("overlay");
const modalImg  = document.getElementById("modalImg");
const modalIsim = document.getElementById("modalIsim");
const modalBrans= document.getElementById("modalBrans");
const modalSehir= document.getElementById("modalSehir");
const modalHayat= document.getElementById("modalHayat");
const closeBtn  = document.getElementById("closeBtn");

cards.forEach(c => {{
  c.addEventListener("click", () => {{
    modalIsim.textContent  = c.dataset.isim;
    modalBrans.textContent = c.dataset.brans;
    modalSehir.textContent = "📍 " + c.dataset.sehir;
    const hay = c.dataset.hayat.trim();
    modalHayat.textContent = hay || "—";
    modalHayat.className   = hay ? "" : "empty";
    const img = c.querySelector("img");
    modalImg.src = img ? img.src : "";
    modalImg.alt = c.dataset.isim;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }});
}});

function closeModal() {{
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}}
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", e => {{ if (e.target === overlay) closeModal(); }});
document.addEventListener("keydown", e => {{ if (e.key === "Escape") closeModal(); }});
</script>
</body>
</html>"""


def main():
    if len(sys.argv) < 2:
        print("Kullanım: python excel_to_kadro.py <excel_dosyasi.xlsx> [cikti.html]")
        sys.exit(1)

    excel_path = sys.argv[1]
    out_path   = sys.argv[2] if len(sys.argv) > 2 else "kadro.html"

    print(f"Excel okunuyor: {excel_path}")
    df = pd.read_excel(excel_path, dtype=str).fillna("")

    mapping = detect_columns(df)
    print(f"Sütun eşlemesi: {mapping}")

    excel_dir = Path(excel_path).parent
    teachers  = []

    for idx, row in df.iterrows():
        t = {}
        for key, col in mapping.items():
            t[key] = str(row[col]).strip()

        # Fotoğraf
        foto_path = t.get("foto", "").strip()
        b64 = None
        if foto_path:
            # Göreceli yol denemesi
            if not foto_path.startswith("http"):
                candidates = [
                    Path(foto_path),
                    excel_dir / foto_path,
                ]
                for c in candidates:
                    if c.exists():
                        foto_path = str(c)
                        break
            b64 = img_to_b64(foto_path)
        t["b64"] = b64

        teachers.append(t)
        if (idx + 1) % 10 == 0:
            print(f"  {idx+1} satır işlendi…")

    print(f"\nToplam {len(teachers)} öğretmen işlendi.")
    html = build_html(teachers)
    Path(out_path).write_text(html, encoding="utf-8")
    print(f"✅  Sayfa kaydedildi: {out_path}")


if __name__ == "__main__":
    main()
