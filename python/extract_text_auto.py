# extract_text_auto.py

from pdfminer.high_level import extract_text
from ocr import extract_text_from_image

# Si tu as déjà ton OCR, tu peux l'importer ici
# from ocr import extract_text_from_image  

def extract_text_from_pdf(pdf_path):
    """
    Tente d'extraire le texte d'un PDF.
    - Si le PDF contient du texte normal → retourne le texte
    - Si le PDF est scanné ou vide → appelle OCR
    """
    try:
        # Extraction avec pdfminer (PDF normal)
        text = extract_text(pdf_path).strip()
        if text and len(text) > 50:
            # PDF normal
            return text
        else:
            # PDF scanné ou vide → appeler OCR
            text_ocr = extract_text_from_image(pdf_path)
            if text_ocr and len(text_ocr.strip()) > 10:
                return text_ocr
            else:
                print(f"PDF {pdf_path} ne contient pas de texte détectable.")
                return None
    except Exception as e:
        print(f"Erreur lors de l'extraction du PDF {pdf_path} :", e)
        return None


# ----------------------
# Tests simples
# ----------------------
if __name__ == "__main__":
    pdfs = ["test_text.pdf", "test2.pdf"]

    for pdf_path in pdfs:
        print(f"\n=== Test du PDF : {pdf_path} ===")
        text = extract_text_from_pdf(pdf_path)
        if text:
            print(text[:500], "...\n")  # affiche les 500 premiers caractères
        else:
            print("Aucun texte détecté\n")