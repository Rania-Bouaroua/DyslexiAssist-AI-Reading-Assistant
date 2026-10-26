/**
 * ocr.js — Extraction de texte via OCR
 *
 * Utilise le code Python de AI2 (ocr.py)
 * qui utilise pytesseract + pdf2image pour les PDFs scannés
 *
 * Fallback sur API OCR.Space si Python n'est pas disponible
 */

var fs = require("fs");
var path = require("path");
var { execSync } = require("child_process");

require("dotenv").config({ path: __dirname + "/.env" });

var PYTHON_DIR = path.join(__dirname, "python");

/**
 * Extrait le texte d'un PDF scanné ou d'une image via OCR
 * @param {Buffer} fileBuffer - Le fichier en buffer
 * @returns {Promise<{source: string, text: string}>}
 */
async function extractFromImage(fileBuffer) {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
    throw new Error("Fichier invalide ou vide.");
  }

  var tmpFile = path.join(__dirname, "tmp_ocr_" + Date.now() + ".pdf");

  try {
    fs.writeFileSync(tmpFile, fileBuffer);

    // Tenter OCR via Python (code AI2 - pytesseract)
    var pythonCode = "import sys; sys.path.insert(0, '" + PYTHON_DIR.replace(/'/g, "\\'") + "'); from ocr import extract_text_from_image; t = extract_text_from_image('" + tmpFile.replace(/'/g, "\\'") + "'); print(t or '')";

    var result = execSync('python3 -c "' + pythonCode + '"', {
      encoding: "utf-8",
      timeout: 60000,
      cwd: PYTHON_DIR
    }).trim();

    if (!result || result.length < 5) {
      throw new Error("Aucun texte détecté par l'OCR.");
    }

    return { source: "ocr-pytesseract", text: result };

  } catch (pythonErr) {
    // Fallback: API OCR.Space
    var OCR_API_KEY = process.env.OCR_SPACE_API_KEY;
    if (OCR_API_KEY) {
      try {
        var FormData = require("form-data");
        var base64 = "data:application/pdf;base64," + fileBuffer.toString("base64");
        var formData = new FormData();
        formData.append("base64Image", base64);
        formData.append("language", "fre");
        formData.append("filetype", "PDF");

        var response = await fetch("https://api.ocr.space/parse/image", {
          method: "POST",
          headers: { "apikey": OCR_API_KEY },
          body: formData
        });

        var data = await response.json();
        if (data.ParsedResults && data.ParsedResults[0] && data.ParsedResults[0].ParsedText) {
          return { source: "ocr-space", text: data.ParsedResults[0].ParsedText.trim() };
        }
      } catch (apiErr) {}
    }

    throw new Error("OCR échoué. Python: " + pythonErr.message);
  } finally {
    try { fs.unlinkSync(tmpFile); } catch (e) {}
  }
}

module.exports = { extractFromImage };
