/**
 * formatter.js — Convertit le markdown simplifie en HTML adapte dyslexie
 *
 * Le texte simplifie par l'IA contient du markdown :
 *   ## Titre -> titre colore
 *   **mot** -> gras colore
 *   1. item -> liste numerotee
 *   - item -> liste a puces
 *
 * Ce module le transforme en HTML riche et lisible.
 */

/**
 * Convertit le markdown en HTML adapte pour la dyslexie
 * @param {string} markdown - Le texte markdown de l'IA
 * @returns {string} HTML formate pour les dyslexiques
 */
function toAccessibleHTML(markdown) {
  if (!markdown) return "";

  var html = escapeHtml(markdown);

  // ## Titres -> h2 avec couleur et taille
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 style="color:#2563eb;font-size:1.4em;font-weight:800;margin:28px 0 14px 0;padding-bottom:8px;border-bottom:3px solid #dbeafe;letter-spacing:0.05em;">$1</h2>'
  );

  // **gras** -> strong avec couleur distincte
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong style="color:#1e3a5f;font-weight:800;background:#e8f4fd;padding:1px 4px;border-radius:3px;">$1</strong>'
  );

  // Listes numerotees : 1. texte
  html = html.replace(
    /^(\d+)\.\s+(.+)$/gm,
    '<div style="display:flex;align-items:flex-start;gap:12px;margin:10px 0;padding:10px 14px;background:#f0f7ff;border-radius:10px;border-left:4px solid #3b82f6;"><span style="font-weight:800;color:#2563eb;font-size:1.2em;min-width:28px;">$1.</span><span>$2</span></div>'
  );

  // Listes a puces : - texte
  html = html.replace(
    /^[\-\*]\s+(.+)$/gm,
    '<div style="display:flex;align-items:flex-start;gap:12px;margin:8px 0;padding:10px 14px;background:#f0fdf4;border-radius:10px;border-left:4px solid #10b981;"><span style="color:#10b981;font-size:1.3em;line-height:1;">&#x25CF;</span><span>$1</span></div>'
  );

  // Double saut de ligne -> separation visuelle
  html = html.replace(/\n\n/g, '<div style="margin:16px 0;"></div>');

  // Simple saut de ligne -> br
  html = html.replace(/\n/g, '<br>');

  return '<div style="font-size:18px;line-height:2.0;letter-spacing:0.04em;word-spacing:0.08em;color:#1a1a2e;">' + html + '</div>';
}

/**
 * Version encore plus adaptee pour les dyslexiques severes
 * Police plus grande, espacement max, fond colore par section
 */
function toDyslexiaHTML(markdown) {
  if (!markdown) return "";

  var html = escapeHtml(markdown);

  // ## Titres -> tres gros, colores, avec fond degrade
  html = html.replace(
    /^## (.+)$/gm,
    '<div style="background:linear-gradient(135deg,#dbeafe,#ede9fe);padding:16px 20px;border-radius:14px;margin:32px 0 16px 0;"><h2 style="color:#1d4ed8;font-size:1.6em;font-weight:800;margin:0;letter-spacing:0.08em;line-height:1.4;">$1</h2></div>'
  );

  // **gras** -> tres visible avec soulignement
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong style="color:#1e3a5f;font-weight:800;background:#fef3c7;padding:2px 6px;border-radius:4px;border-bottom:2px solid #f59e0b;">$1</strong>'
  );

  // Listes numerotees
  html = html.replace(
    /^(\d+)\.\s+(.+)$/gm,
    '<div style="display:flex;align-items:flex-start;gap:16px;margin:12px 0;padding:16px 20px;background:#eff6ff;border-radius:14px;border-left:5px solid #3b82f6;font-size:1.1em;"><span style="font-weight:800;color:#2563eb;font-size:1.3em;min-width:32px;">$1.</span><span style="line-height:1.8;">$2</span></div>'
  );

  // Listes a puces
  html = html.replace(
    /^[\-\*]\s+(.+)$/gm,
    '<div style="display:flex;align-items:flex-start;gap:16px;margin:10px 0;padding:16px 20px;background:#ecfdf5;border-radius:14px;border-left:5px solid #10b981;font-size:1.1em;"><span style="color:#10b981;font-size:1.4em;line-height:1;">&#x25CF;</span><span style="line-height:1.8;">$1</span></div>'
  );

  // Double saut de ligne
  html = html.replace(/\n\n/g, '<div style="margin:20px 0;"></div>');
  html = html.replace(/\n/g, '<br>');

  return '<div style="font-size:22px;line-height:2.2;letter-spacing:0.12em;word-spacing:0.16em;color:#2c2c2c;max-width:750px;">' + html + '</div>';
}

/**
 * Escape HTML entities to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { toAccessibleHTML, toDyslexiaHTML, escapeHtml };
