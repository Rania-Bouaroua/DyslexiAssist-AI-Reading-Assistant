# ocr.py

from pdf2image import convert_from_path
import pytesseract
from PIL import Image

def extract_text_from_image(pdf_path):
    """
    Extrait le texte d'un PDF scanné ou d'une image.
    Retourne le texte détecté.
    """
    try:
        # Convertit le PDF en images (une par page)
        images = convert_from_path(pdf_path)
        
        full_text = ""
        for img in images:
            # OCR sur chaque image
            text = pytesseract.image_to_string(img, lang='fra')  # 'fra' pour français, 'eng' pour anglais
            full_text += text + "\n"
        
        return full_text.strip()
    except Exception as e:
        print(f"Erreur OCR pour {pdf_path} :", e)
        return None


# ----------------------
# Test simple
# ----------------------
if __name__ == "__main__":
    test_pdf = "test2.pdf"
    text = extract_text_from_image(test_pdf)
    if text and len(text.strip()) > 10:  # seuil arbitraire, par exemple 10 caractères
        print("=== Texte extrait via OCR ===\n")
        print(text[:500], "...")
    else:
        print("OCR a échoué ou PDF ne contient pas de texte détectable")