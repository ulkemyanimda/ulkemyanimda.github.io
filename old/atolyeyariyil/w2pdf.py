import os
import comtypes.client

def doc_to_pdf(input_path, output_path):
    """Word dosyasını PDF'e dönüştürür."""
    word = comtypes.client.CreateObject('Word.Application')
    word.Visible = False

    doc = word.Documents.Open(input_path)
    doc.SaveAs(output_path, FileFormat=17)  # 17 = PDF format
    doc.Close()
    word.Quit()


def convert_all_docs_to_pdf(root_folder):
    """Klasörü ve alt klasörleri tarayıp tüm .doc ve .docx dosyalarını PDF'e dönüştürür."""
    for foldername, subfolders, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.lower().endswith(('.doc', '.docx')):
                doc_path = os.path.join(foldername, filename)
                pdf_path = os.path.splitext(doc_path)[0] + '.pdf'

                if not os.path.exists(pdf_path):  # Aynı isimde PDF yoksa dönüştür
                    print(f"Dönüştürülüyor: {doc_path}")
                    try:
                        doc_to_pdf(doc_path, pdf_path)
                        print(f"✅ {pdf_path} oluşturuldu.")
                    except Exception as e:
                        print(f"❌ {doc_path} dönüştürülürken hata: {e}")
                else:
                    print(f"⚠️ PDF zaten var: {pdf_path}")


if __name__ == "__main__":
    klasor = input("Taranacak klasör yolunu girin: ").strip('"')
    convert_all_docs_to_pdf(klasor)
