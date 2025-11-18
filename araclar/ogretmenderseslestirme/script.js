document.addEventListener('DOMContentLoaded', () => {
    // HTML elementlerini seç
    const ogrenciInput = document.getElementById('ogrenci-dosyasi');
    const ogretmenInput = document.getElementById('ogretmen-dosyasi');
    const eslestirBtn = document.getElementById('eslestir-btn');
    const indirBtn = document.getElementById('indir-btn');
    const statusDiv = document.getElementById('status');
    const sonuclarAlani = document.getElementById('sonuclar-alani');

    // Dosya seçildiğinde adını gösteren yardımcı fonksiyon
    const updateFileName = (input, spanId) => {
        const span = document.getElementById(spanId);
        if (input.files.length > 0) {
            span.textContent = input.files[0].name;
        } else {
            span.textContent = '';
        }
    };

    ogrenciInput.addEventListener('change', () => updateFileName(ogrenciInput, 'ogrenci-dosya-adi'));
    ogretmenInput.addEventListener('change', () => updateFileName(ogretmenInput, 'ogretmen-dosya-adi'));

    // Sonuçları global olarak sakla ki indirme fonksiyonu erişebilsin
    let sonAtamalar, sonAtanamayanlar, sonOgretmenDurum;

    // Eşleştirme butonuna tıklandığında
    eslestirBtn.addEventListener('click', async () => {
        // Butonları ve durumu ayarla
        eslestirBtn.disabled = true;
        eslestirBtn.textContent = 'İşleniyor...';
        statusDiv.textContent = '';
        sonuclarAlani.classList.add('hidden');

        // Dosyaların seçildiğinden emin ol
        if (!ogrenciInput.files[0] || !ogretmenInput.files[0]) {
            statusDiv.textContent = 'HATA: Lütfen hem öğrenci hem de öğretmen dosyasını seçin.';
            statusDiv.style.color = 'red';
            eslestirBtn.disabled = false;
            eslestirBtn.textContent = 'Eşleştirmeyi Başlat';
            return;
        }

        try {
            // Excel dosyalarını oku ve JSON'a çevir
            const [ogrenciler, ogretmenler] = await Promise.all([
                readExcel(ogrenciInput.files[0]),
                readExcel(ogretmenInput.files[0])
            ]);

            // Ana eşleştirme mantığını çalıştır
            const sonuclar = eslestirmeYap(ogrenciler, ogretmenler);
            
            // Sonuçları global değişkenlere ata
            sonAtamalar = sonuclar.atamalar;
            sonAtanamayanlar = sonuclar.atanamayanlar;
            sonOgretmenDurum = sonuclar.ogretmenDurum;

            // Sonuçları ekrandaki tablolara yazdır
            // GÜNCELLENDİ: 'Ogrenci_KODU' sütunu eklendi
            renderTable('atama-sonuclari-tablosu', sonAtamalar, ['Ogrenci_KODU', 'Ogrenci_YAS', 'Ogrenci_SEVIYE', 'Istenen_Saat', 'Atanan_Ogretmen', 'Ogretmen_Bransi', 'Atama_Turu']);
            // GÜNCELLENDİ: 'Ogrenci_KODU' sütunu eklendi (ve sonAtanamayanlar olarak düzeltildi)
            renderTable('atanamayanlar-tablosu', sonAtanamayanlar, ['Ogrenci_KODU', 'Ogrenci_YAS', 'Ogrenci_SEVIYE', 'Istenen_Saat', 'Sebep']);
            renderTable('ogretmen-yuku-tablosu', sonOgretmenDurum, ['Ad Soyad', 'Branş', 'Atanan_Ders_Sayisi']);

            // Sonuç alanını göster
            sonuclarAlani.classList.remove('hidden');
            statusDiv.textContent = 'Eşleştirme başarıyla tamamlandı!';
            statusDiv.style.color = 'green';

        } catch (error) {
            statusDiv.textContent = `HATA: ${error.message}`;
            statusDiv.style.color = 'red';
            console.error(error);
        } finally {
            eslestirBtn.disabled = false;
            eslestirBtn.textContent = 'Eşleştirmeyi Başlat';
        }
    });

    // İndirme butonuna tıklandığında
    indirBtn.addEventListener('click', () => {
        if (!sonAtamalar || !sonAtanamayanlar || !sonOgretmenDurum) {
            alert("İndirilecek veri bulunamadı.");
            return;
        }

        // Yeni bir Excel çalışma kitabı oluştur
        const wb = XLSX.utils.book_new();

        // Her bir sonucu ayrı bir sayfaya dönüştür
        const ws1 = XLSX.utils.json_to_sheet(sonAtamalar);
        const ws2 = XLSX.utils.json_to_sheet(sonAtanamayanlar);
        const ws3 = XLSX.utils.json_to_sheet(sonOgretmenDurum);

        // Sayfaları kitaba ekle
        XLSX.utils.book_append_sheet(wb, ws1, "Atama Sonuçları");
        XLSX.utils.book_append_sheet(wb, ws2, "Atanamayan Sınıflar");
        XLSX.utils.book_append_sheet(wb, ws3, "Öğretmen Ders Yükü");

        // Dosyayı oluştur ve indir
        XLSX.writeFile(wb, "atama_sonuclari.xlsx");
    });
});

/**
 * Bir Excel dosyasını okuyup içindeki ilk sayfayı JSON formatında döndürür.
 * @param {File} file - Kullanıcının seçtiği dosya.
 * @returns {Promise<Array<Object>>} - Excel satırlarını içeren bir nesne dizisi.
 */
function readExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                resolve(json);
            } catch (e) {
                reject(e);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Python'daki brans_belirle fonksiyonunun JavaScript versiyonu.
 */
function bransBelirle(ogrenci) {
    if (ogrenci['YAS'] === 'Freshman') {
        return 'Okul Öncesi Öğretmeni';
    } else if (ogrenci['SEVIYE'] === 'Türkçeyi_anlayabilir_konuşabilir_fakat_yazamaz') {
        return 'Sınıf Öğretmeni';
    } else if (ogrenci['SEVIYE'] === 'Türkçeyi_hiç_bilmez') {
        return 'İngilizce';
    } else {
        return 'Diğer';
    }
}

/**
 * Ana eşleştirme mantığı. Python betiğinin JavaScript'e uyarlanmış hali.
 * @param {Array<Object>} df_ogrenciler
 * @param {Array<Object>} df_ogretmenler
 * @returns {Object} - Atamaları, atanamayanları ve öğretmen durumunu içeren nesne.
 */
function eslestirmeYap(df_ogrenciler, df_ogretmenler) {
    // Sütun isimlerindeki olası boşlukları temizle (genellikle sheet_to_json bunu halleder ama garanti olsun)
    const cleanData = (data) => data.map(row => {
        const newRow = {};
        for (const key in row) {
            newRow[key.trim()] = row[key];
        }
        return newRow;
    });
    df_ogrenciler = cleanData(df_ogrenciler);
    df_ogretmenler = cleanData(df_ogretmenler);
    
    // Öğretmen ve öğrenci verilerine ek alanlar ekle
    df_ogretmenler.forEach(ogretmen => ogretmen.Atanan_Ders_Sayisi = 0);
    df_ogrenciler.forEach(ogrenci => ogrenci.Atandi = false);

    const atamalar = [];
    const atanamayan_ogrenciler = [];

    // --- AŞAMA 1: Öncelikli Eşleştirme ---
    df_ogrenciler.forEach((ogrenci, index) => {
        const musait_saat = String(ogrenci['gun_saat_tr']).trim();
        const gereken_brans = bransBelirle(ogrenci);

        if (gereken_brans === 'Diğer') return; // continue

        let uygun_ogretmenler = df_ogretmenler.filter(ogretmen =>
            ogretmen['Branş'] === gereken_brans &&
            String(ogretmen[musait_saat]).toLowerCase() === 'x' &&
            ogretmen.Atanan_Ders_Sayisi < 3
        );

        if (uygun_ogretmenler.length > 0) {
            // En az dersi olanı seç
            uygun_ogretmenler.sort((a, b) => a.Atanan_Ders_Sayisi - b.Atanan_Ders_Sayisi);
            const atanacak_ogretmen = uygun_ogretmenler[0];

            atamalar.push({
                Ogrenci_ID: index,
                Ogrenci_KODU: ogrenci['Kod'], // EKLENDİ
                Ogrenci_YAS: ogrenci['YAS'],
                Ogrenci_SEVIYE: ogrenci['SEVIYE'],
                Istenen_Saat: musait_saat,
                Atanan_Ogretmen: atanacak_ogretmen['Ad Soyad'],
                Ogretmen_Bransi: gereken_brans,
                Atama_Turu: 'Öncelikli'
            });

            atanacak_ogretmen.Atanan_Ders_Sayisi++;
            atanacak_ogretmen[musait_saat] = 'DOLU';
            ogrenci.Atandi = true;
        }
    });

    // --- AŞAMA 2: Alternatif Eşleştirme ---
    const atanmamis_ogrenciler = df_ogrenciler.filter(o => !o.Atandi);
    atanmamis_ogrenciler.forEach((ogrenci, index) => {
        const musait_saat = String(ogrenci['gun_saat_tr']).trim();

        let uygun_ogretmenler = df_ogretmenler.filter(ogretmen =>
            String(ogretmen[musait_saat]).toLowerCase() === 'x' &&
            ogretmen.Atanan_Ders_Sayisi < 3
        );

        if (uygun_ogretmenler.length > 0) {
            uygun_ogretmenler.sort((a, b) => a.Atanan_Ders_Sayisi - b.Atanan_Ders_Sayisi);
            const atanacak_ogretmen = uygun_ogretmenler[0];

            atamalar.push({
                Ogrenci_ID: df_ogrenciler.indexOf(ogrenci), // Orijinal indexi bul
                Ogrenci_KODU: ogrenci['Kod'], // EKLENDİ
                Ogrenci_YAS: ogrenci['YAS'],
                Ogrenci_SEVIYE: ogrenci['SEVIYE'],
                Istenen_Saat: musait_saat,
                Atanan_Ogretmen: atanacak_ogretmen['Ad Soyad'],
                Ogretmen_Bransi: atanacak_ogretmen['Branş'],
                Atama_Turu: 'Alternatif (Branş Esnetildi)'
            });

            atanacak_ogretmen.Atanan_DERS_Sayisi++;
            atanacak_ogretmen[musait_saat] = 'DOLU';
            ogrenci.Atandi = true;
        } else {
            atanamayan_ogrenciler.push({
                Ogrenci_ID: df_ogrenciler.indexOf(ogrenci),
                Ogrenci_KODU: ogrenci['Kod'], // EKLENDİ
                Ogrenci_YAS: ogrenci['YAS'],
                Ogrenci_SEVIYE: ogrenci['SEVIYE'],
                Istenen_Saat: musait_saat,
                Sebep: 'Uygun ve müsait öğretmen bulunamadı.'
            });
        }
    });
    
    // Öğretmen durumunu hazırla
    const df_ogretmen_durum = df_ogretmenler.map(o => ({
        'Ad Soyad': o['Ad Soyad'],
        'Branş': o['Branş'],
        'Atanan_Ders_Sayisi': o.Atanan_Ders_Sayisi
    }));

    return {
        atamalar: atamalar,
        atanamayanlar: atanamayan_ogrenciler,
        ogretmenDurum: df_ogretmen_durum
    };
}

/**
 * Verilen veriyi bir HTML tablosuna yazar.
 * @param {string} tableId - Sonuçların yazılacağı tablonun ID'si.
 * @param {Array<Object>} data - Tabloya yazılacak veri dizisi.
 * @param {Array<string>} columns - Gösterilecek sütunlar.
 */
function renderTable(tableId, data, columns) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Eski veriyi temizle

    if (data.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = columns.length;
        cell.textContent = 'Bu kategoride gösterilecek veri bulunamadı.';
        cell.style.textAlign = 'center';
    } else {
        data.forEach(item => {
            const row = tbody.insertRow();
            columns.forEach(col => {
                const cell = row.insertCell();
                cell.textContent = item[col] || '';
            });
        });
    }
}