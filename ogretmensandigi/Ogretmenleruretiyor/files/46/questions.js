const LEVEL_QUESTIONS = {
  1: [
    { word:"KALP", options:["YÜREK","BİLEK","KAFA","EL","GÖZ"], correct:"YÜREK" },
    { word:"GÖREV", options:["VAZİFE","İŞ","OKUL","YOL","DERS"], correct:"VAZİFE" },
    { word:"YAŞLI", options:["İHTİYAR","GENÇ","ZAYIF","HIZLI","UZUN"], correct:"İHTİYAR" },
    { word:"CEVAP", options:["YANIT","SORU","SÖZ","SES","YAZI"], correct:"YANIT" },
    { word:"KÖTÜ", options:["FENA","İYİ","GÜZEL","ZOR","YENİ"], correct:"FENA" },
    { word:"KAFA", options:["BAŞ","KOL","AYAK","GÖVDE","EL"], correct:"BAŞ" },
    { word:"VAPUR", options:["GEMİ","UÇAK","TREN","ARABA","BİSİKLET"], correct:"GEMİ" },
    { word:"KIRMIZI", options:["AL","AK","KARA","SARI","MAVİ"], correct:"AL" },
    { word:"BEYAZ", options:["AK","KARA","AL","SARI","YEŞİL"], correct:"AK" },
    { word:"SENE", options:["YIL","AY","GÜN","HAFTA","SAAT"], correct:"YIL" }
  ],
  2: [
    { word:"ARABA", options:["OTOMOBİL","UÇAK","GEMİ","TREN","VAPUR"], correct:"OTOMOBİL" },
    { word:"KONUT", options:["EV","OKUL","PARK","BAHÇE","YOL"], correct:"EV" },
    { word:"İSİM", options:["AD","SOYAD","SÖZ","SES","HARF"], correct:"AD" },
    { word:"ACEMİ", options:["TOY","USTA","YAŞLI","HIZLI","ZAYIF"], correct:"TOY" },
    { word:"KOLAY", options:["BASİT","ZOR","AĞIR","YAVAŞ","BÜYÜK"], correct:"BASİT" },
    { word:"HEKİM", options:["DOKTOR","HAKİM","SAVCI","AVUKAT","POLİS"], correct:"DOKTOR" },
    { word:"SINAV", options:["İMTİHAN","DERS","KİTAP","DEFTER","OKUL"], correct:"İMTİHAN" },
    { word:"SÖZCÜK", options:["KELİME","CÜMLE","HARF","HECE","SÖZ"], correct:"KELİME" },
    { word:"ADET", options:["SAYI","TANE","BİRİM","ÖLÇÜ","SIRA"], correct:"SAYI" },
    { word:"OLAY", options:["HADİSE","DURUM","VAKA","MASAL","OYUN"], correct:"HADİSE" }
  ],
  3: [
    { word:"MEKTEP", options:["OKUL","EV","BAHÇE","DERS","SINIF"], correct:"OKUL" },
    { word:"YAPIT", options:["ESER","BİNA","YOL","KÖPRÜ","KİTAP"], correct:"ESER" },
    { word:"ÖRNEK", options:["MİSAL","SORU","CEVAP","DERS","KONU"], correct:"MİSAL" },
    { word:"SIRA", options:["DİZİ","MASA","SANDALYE","DOLAP","TAHTA"], correct:"DİZİ" },
    { word:"ARZU", options:["İSTEK","KORKU","ÖFKE","SEVİNÇ","HAYAL"], correct:"İSTEK" },
    { word:"ÖZLEM", options:["HASRET","SEVGİ","SAYGI","GÜVEN","UMUT"], correct:"HASRET" },
    { word:"GÜZ", options:["SONBAHAR","İLKBAHAR","YAZ","KIŞ","MEVSİM"], correct:"SONBAHAR" },
    { word:"VİLAYET", options:["İL","İLÇE","KÖY","KASABA","MAHALLE"], correct:"İL" },
    { word:"ÖNDER", options:["LİDER","ASKER","MEMUR","İŞÇİ","ÖĞRENCİ"], correct:"LİDER" },
    { word:"DÜŞÜNCE", options:["FİKİR","HAYAL","RÜYA","MASAL","SÖZ"], correct:"FİKİR" }
  ],
  4: [
    { word:"HIZLI", options:["ACELE","YAVAŞ","DURGUN","SAKİN","AĞIR"], correct:"ACELE" },
    { word:"GÜÇLÜ", options:["KUVVETLİ","ZAYIF","CILIZ","HAFİF","KÜÇÜK"], correct:"KUVVETLİ" },
    { word:"ZAYIF", options:["CILIZ","GÜÇLÜ","KİLOLU","BÜYÜK","UZUN"], correct:"CILIZ" },
    { word:"TEMEL", options:["ESAS","YAN","EK","SON","ÜST"], correct:"ESAS" },
    { word:"TAM", options:["EKSİKSİZ","YARIM","AZ","ÇOK","BOŞ"], correct:"EKSİKSİZ" },
    { word:"ATİK", options:["SERİ","YAVAŞ","TEMBEL","AĞIR","HANTAL"], correct:"SERİ" },
    { word:"PABUÇ", options:["AYAKKABI","TERLİK","ÇORAP","ELBİSE","ŞAPKA"], correct:"AYAKKABI" },
    { word:"KONUK", options:["MİSAFİR","EV SAHİBİ","ARKADAŞ","KOMŞU","AKRABA"], correct:"MİSAFİR" },
    { word:"AŞ", options:["YEMEK","SU","EKMEK","MEYVE","SEBZE"], correct:"YEMEK" },
    { word:"KENAR", options:["KIYI","ORTA","İÇ","DIŞ","ALT"], correct:"KIYI" }
  ],
  5: [
    { word:"IRMAK", options:["NEHİR","DENİZ","GÖL","DERE","OKYANUS"], correct:"NEHİR" },
    { word:"YEL", options:["RÜZGÂR","FIRTINA","YAĞMUR","KAR","DOLU"], correct:"RÜZGÂR" },
    { word:"SEMA", options:["GÖKYÜZÜ","YERYÜZÜ","DENİZ","TOPRAK","HAVA"], correct:"GÖKYÜZÜ" },
    { word:"DEPREM", options:["ZELZELE","HEYELAN","SEL","FIRTINA","YANGIN"], correct:"ZELZELE" },
    { word:"HAK", options:["ADALET","CEZA","SUÇ","YASA","KURAL"], correct:"ADALET" },
    { word:"TASA", options:["ÜZÜNTÜ","SEVİNÇ","KORKU","ÖFKE","ŞAŞKINLIK"], correct:"ÜZÜNTÜ" },
    { word:"HİS", options:["DUYGU","DÜŞÜNCE","HAYAL","RÜYA","MASAL"], correct:"DUYGU" },
    { word:"CÖMERT", options:["BONKÖR","PİNTİ","CİMRİ","ZENGİN","FAKİR"], correct:"BONKÖR" },
    { word:"PİNTİ", options:["CİMRİ","CÖMERT","BONKÖR","ZENGİN","FAKİR"], correct:"CİMRİ" },
    { word:"EHİL", options:["USTA","ACEMİ","TOY","ÖĞRENCİ","ÇIRAK"], correct:"USTA" }
  ],
  6: [
    { word:"FEDAKÂR", options:["ÖZVERİLİ","BENCİL","KORKAK","ZALİM","KÖTÜ"], correct:"ÖZVERİLİ" },
    { word:"ALELADE", options:["SIRADAN","ÖZEL","FARKLI","İLGİNÇ","TUHAF"], correct:"SIRADAN" },
    { word:"NADİR", options:["ENDER","SIK","YAYGIN","BOL","ÇOK"], correct:"ENDER" },
    { word:"MİLLET", options:["ULUS","HALK","İNSAN","TOPLUM","DEVLET"], correct:"ULUS" },
    { word:"MEDENİYET", options:["UYGARLIK","KÜLTÜR","TARİH","BİLİM","SANAT"], correct:"UYGARLIK" },
    { word:"KUŞAK", options:["NESİL","AİLE","SOY","ZAMAN","YIL"], correct:"NESİL" },
    { word:"GÜVEN", options:["EMNİYET","KORKU","ŞÜPHE","ENDİŞE","TEHLİKE"], correct:"EMNİYET" },
    { word:"İKAZ", options:["UYARI","DUR","BAK","GEÇ","BEKLE"], correct:"UYARI" },
    { word:"REHBER", options:["KILAVUZ","YOLCU","SÜRÜCÜ","HANCİ","YOL"], correct:"KILAVUZ" },
    { word:"DAVET", options:["ÇAĞRI","SORU","CEVAP","İSTEK","EMİR"], correct:"ÇAĞRI" }
  ],
  7: [
    { word:"LUGAT", options:["SÖZLÜK","KİTAP","YAZI","DİL","SÖZ"], correct:"SÖZLÜK" },
    { word:"TÖREN", options:["MERASİM","DÜĞÜN","BAYRAM","EĞLENCE","YEMEK"], correct:"MERASİM" },
    { word:"VATAN", options:["YURT","ÜLKE","ŞEHİR","KÖY","EV"], correct:"YURT" },
    { word:"ALENİ", options:["AÇIK","GİZLİ","SAKLI","KAPALI","KOYU"], correct:"AÇIK" },
    { word:"SABİT", options:["DURAĞAN","HAREKETLİ","HIZLI","YAVAŞ","DEĞİŞKEN"], correct:"DURAĞAN" },
    { word:"KAİDE", options:["KURAL","YOL","YÖNTEM","ŞEKİL","TARZ"], correct:"KURAL" },
    { word:"REY", options:["OY","SÖZ","FİKİR","CARAR","SEÇİM"], correct:"OY" },
    { word:"BAYTAR", options:["VETERİNER","DOKTOR","ÇİFTÇİ","KASAP","AVCI"], correct:"VETERİNER" },
    { word:"METALİK", options:["ZIRNIK","ALTIN","GÜMÜŞ","BAKIR","DEMİR"], correct:"ZIRNIK" },
    { word:"SEYYAH", options:["GEZGİN","YOLCU","ŞOFÖR","KAPTAN","PİLOT"], correct:"GEZGİN" }
  ],
  8: [
    { word:"SİMA", options:["YÜZ","GÖZ","SAÇ","EL","KOL"], correct:"YÜZ" },
    { word:"AFFETME", options:["BAĞIŞLAMA","CEZALANDIRMA","KIZMA","KÜSME","DÖVME"], correct:"BAĞIŞLAMA" },
    { word:"BASINÇ", options:["TAZYİK","SICAKLIK","SOĞUKLUK","HIZ","GÜÇ"], correct:"TAZYİK" },
    { word:"GÜÇSÜZ", options:["ACİZ","GÜÇLÜ","KUVVETLİ","BÜYÜK","HIZLI"], correct:"ACİZ" },
    { word:"BIKMAK", options:["YILMAK","SEVMEK","İSTEMEK","GÜLMEK","KOŞMAK"], correct:"YILMAK" },
    { word:"KUTSAL", options:["MÜBAREK","KÖTÜ","SIRADAN","BASİT","YENİ"], correct:"MÜBAREK" },
    { word:"NAMZET", options:["ADAY","SEÇİLEN","BAŞKAN","ÜYE","TEMSİLCİ"], correct:"ADAY" },
    { word:"ÜN", options:["ŞÖHRET","İSİM","AD","SES","DUYURU"], correct:"ŞÖHRET" },
    { word:"ESBAB", options:["ELBİSE","AYAKKABI","ŞAPKA","ÇANTA","SAAT"], correct:"ELBİSE" },
    { word:"META", options:["MAL","PARA","ALTIN","BORÇ","ALACAK"], correct:"MAL" }
  ],
  9: [
    { word:"YAS", options:["MATEM","DÜĞÜN","BAYRAM","SEVİNÇ","EĞLENCE"], correct:"MATEM" },
    { word:"BÜYÜK", options:["AKA","KÜÇÜK","MİNİK","KISA","İNCE"], correct:"AKA" },
    { word:"DOST", options:["HISIM","DÜŞMAN","YABANCI","TANIDIK","KOMŞU"], correct:"HISIM" },
    { word:"UMAR", options:["ÇARE","DERD","SORUN","ENGEL","YOL"], correct:"ÇARE" },
    { word:"YAZIN", options:["EDEBİYAT","TARİH","COĞRAFYA","BİLİM","SANAT"], correct:"EDEBİYAT" },
    { word:"YÜCE", options:["ULU","ALÇAK","KÜÇÜK","ZAYIF","KISA"], correct:"ULU" },
    { word:"SAVAŞ", options:["MUHAREBE","BARIŞ","DOSTLUK","OYUN","YARIŞ"], correct:"MUHAREBE" },
    { word:"TÖREN", options:["MERASİM","YEMEK","GEZİ","DERS","İŞ"], correct:"MERASİM" },
    { word:"AYRIM", options:["FARK","BENZERLİK","AYNI","BİRLİK","TEK"], correct:"FARK" },
    { word:"GÖREV", options:["VAZİFE","HAK","SORUMLULUK","İŞ","YOL"], correct:"VAZİFE" }
  ],
  10: [
    { word:"ÇAMUR", options:["BALÇIK","TOPRAK","KUM","TAŞ","SU"], correct:"BALÇIK" },
    { word:"DELİL", options:["KANIT","ŞÜPHE","İPUCU","SORU","CEVAP"], correct:"KANIT" },
    { word:"MEKTUP", options:["NAME","MESAJ","YAZI","NOT","HABER"], correct:"NAME" },
    { word:"İSTASYON", options:["GAR","DURAK","LİMAN","HAVAALANI","YOL"], correct:"GAR" },
    { word:"RASAT", options:["GÖZLEM","BAKIŞ","GÖRÜŞ","DİNLEME","OKUMA"], correct:"GÖZLEM" },
    { word:"GELECEK", options:["İSTİKBAL","MAZİ","GEÇMİŞ","ŞİMDİ","BUGÜN"], correct:"İSTİKBAL" },
    { word:"İVEDİ", options:["ÇABUK","YAVAŞ","AĞIR","SAKİN","DURGUN"], correct:"ÇABUK" },
    { word:"ABİDE", options:["ANIT","HEYKEL","BİNA","KÖPRÜ","KALE"], correct:"ANIT" },
    { word:"FAKİR", options:["YOKSUL","ZENGİN","VARLIKLI","CÖMERT","PİNTİ"], correct:"YOKSUL" },
    { word:"MUTLULUK", options:["SAADET","KEDER","HÜZÜN","ÖFKE","KORKU"], correct:"SAADET" }
  ]
};
const LEVEL_NAMES = ["Başlangıç","Çaylak","Gözlemci","Kâşif","Uzman","Usta","Bilge","Efsane","Kahraman","Yenilmez"];
const TOTAL_LEVELS = 10;
