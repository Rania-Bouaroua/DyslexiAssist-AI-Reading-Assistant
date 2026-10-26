from pdfminer.high_level import extract_text

# Chemin vers ton PDF de test
pdf_path = "test.pdf"

try:
    text = extract_text(pdf_path)
    print("=== Contenu du PDF ===")
    print(text[:500])  # affiche les 500 premiers caractères
except Exception as e:
    print("Erreur lors de l'extraction :", e)
