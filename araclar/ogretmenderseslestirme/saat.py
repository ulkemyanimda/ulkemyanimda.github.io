import pandas as pd

# Saat farkları (TR saati ile fark)
saat_farklari = {
    "Bulgaristan": 0,
    "Çin": -8,
    "Hollanda": 1,
    "Iskandinavya": 1,
    "Amerika_Birleik_Devletleri": 7
}

# Excel veya CSV dosyasını oku
df = pd.read_excel("veriler.xlsx")  # dosya adı değiştirilebilir

# Türkiye saatini hesaplayan fonksiyon
def tr_saat(row):
    ulke = row["ULKE"]
    saat = row["NET"]
    fark = saat_farklari.get(ulke, 0)
    yeni_saat = (saat + fark) % 24  # 24 saati geçerse modulo
    return yeni_saat

# Yeni sütun ekle
df["saat_tr"] = df.apply(tr_saat, axis=1)

# Yeni dosya olarak kaydet
df.to_excel("veriler_tr.xlsx", index=False)
print("Yeni Excel dosyası oluşturuldu: veriler_tr.xlsx")
