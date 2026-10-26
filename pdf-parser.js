/**
 * pdf-parser.js — Extraction de texte depuis un PDF
 *
 * Utilise le code Python de AI2 (extract_text_auto.py)
 * qui gère automatiquement :
 *   - PDF normal → pdfminer.six
 *   - PDF scanné → OCR via pytesseract
 *
 * Fallback sur pdf-parse (Node.js) si Python n'est pas disponible
 */

var fs = require("fs");
var path = require("path");
var { execSync } = require("child_process");

var PYTHON_DIR = path.join(__dirname, "python");

/**
 * Extrait le texte d'un fichier PDF via le script Python de AI2
 * @param {Buffer} fileBuffer - Le fichier PDF en buffer
 * @returns {Promise<{source: string, text: string}>}
 */
async function extractFromPDF(fileBuffer) {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
    throw new Error("Fichier PDF invalide ou vide.");
  }

  // Écrire le buffer dans un fichier temporaire
  var tmpFile = path.join(__dirname, "tmp_extract_" + Date.now() + ".pdf");

  try {
    fs.writeFileSync(tmpFile, fileBuffer);

    // Tenter l'extraction via Python (code AI2)
    var pythonCode = "import sys; sys.path.insert(0, '" + PYTHON_DIR.replace(/'/g, "\\'") + "'); from extract_text_auto import extract_text_from_pdf; t = extract_text_from_pdf('" + tmpFile.replace(/'/g, "\\'") + "'); print(t or '')";

    var result = execSync('python3 -c "' + pythonCode + '"', {
      encoding: "utf-8",
      timeout: 60000,
      cwd: PYTHON_DIR
    }).trim();

    if (!result || result.length < 5) {
      throw new Error("Aucun texte détecté dans le PDF.");
    }

    return { source: "python-ai2", text: result };

  } catch (pythonErr) {
    // Fallback: utiliser pdf-parse (Node.js) si Python échoue
    try {
      var pdfParse = require("pdf-parse");
      var data = await pdfParse(fileBuffer);
      var text = (data.text || "").trim();
      if (text.length > 10) {
        return { source: "pdf-parse", text: text };
      }
      throw new Error("Texte insuffisant extrait du PDF.");
    } catch (nodeErr) {
      throw new Error("Extraction échouée. Python: " + pythonErr.message + " | Node: " + nodeErr.message);
    }
  } finally {
    try { fs.unlinkSync(tmpFile); } catch (e) {}
  }
}

module.exports = { extractFromPDF };
