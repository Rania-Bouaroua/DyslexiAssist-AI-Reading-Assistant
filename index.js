/**
 * index.js — Point d'entree du module AI Tool DyslexiAssist
 *
 * Usage par le backend :
 *   const ai = require("../ai-tool");
 *
 *   // Simplifier du texte
 *   const simplified = await ai.simplifyText(text, "medium");
 *
 *   // Convertir en HTML accessible
 *   const html = ai.toAccessibleHTML(simplified);
 *   const dyslexiaHtml = ai.toDyslexiaHTML(simplified);
 *
 *   // Extraire texte d'un PDF puis simplifier
 *   const result = await ai.processDocument(buffer, "strong");
 */

const { simplifyText } = require("./simplifier");
const { buildPrompt, getAvailableLevels } = require("./prompts");
const { toAccessibleHTML, toDyslexiaHTML, escapeHtml } = require("./formatter");

// PDF extraction (may not be available yet)
var extractFromPDF, extractFromImage;
try {
  extractFromPDF = require("./pdf-parser").extractFromPDF;
} catch (e) {
  extractFromPDF = async function() { throw new Error("Module pdf-parser non disponible"); };
}
try {
  extractFromImage = require("./ocr").extractFromImage;
} catch (e) {
  extractFromImage = async function() { throw new Error("Module OCR non disponible"); };
}

/**
 * Pipeline complet : extraction PDF -> simplification -> formatage
 * @param {Buffer} fileBuffer - Le contenu du fichier PDF
 * @param {string} level - Niveau de simplification ("light", "medium", "strong")
 * @returns {Promise<Object>} Resultat avec texte original, simplifie et HTML
 */
async function processDocument(fileBuffer, level) {
  var extracted = await extractFromPDF(fileBuffer);
  var simplified = await simplifyText(extracted.text, level || "medium");
  return {
    originalText: extracted.text,
    simplifiedText: simplified,
    accessibleHTML: toAccessibleHTML(simplified),
    dyslexiaHTML: toDyslexiaHTML(simplified),
    source: extracted.source
  };
}

module.exports = {
  // AI1 — Simplification
  simplifyText,
  getAvailableLevels,

  // AI2 — Extraction
  extractFromPDF,
  extractFromImage,

  // AI3 — Formatage
  toAccessibleHTML,
  toDyslexiaHTML,
  escapeHtml,

  // Pipeline complet
  processDocument
};
