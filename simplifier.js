/**
 * simplifier.js — Appel API Groq pour simplifier les textes
 * Utilise Groq (compatible OpenAI) avec LLaMA 3.3 70B
 */

require("dotenv").config({ path: __dirname + "/.env" });
const { buildPrompt } = require("./prompts");

const API_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
const API_URL = process.env.API_URL || "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.MODEL || "llama-3.3-70b-versatile";

/**
 * Simplifie un texte académique pour les personnes dyslexiques
 * @param {string} text - Le texte à simplifier
 * @param {string} level - "light", "medium" ou "strong"
 * @returns {Promise<string>} Le texte simplifié en markdown structuré
 */
async function simplifyText(text, level) {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Le texte fourni est vide ou invalide.");
  }
  if (!API_KEY) {
    throw new Error("GROQ_API_KEY manquante. Ajoutez-la dans le fichier .env");
  }

  var prompt = buildPrompt(level || "medium", text.trim());

  var response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: prompt.systemPrompt },
          { role: "user", content: prompt.userPrompt }
        ],
        max_tokens: 4096,
        temperature: 0.3
      })
    });
  } catch (err) {
    throw new Error("Impossible de contacter l'API : " + err.message);
  }

  if (!response.ok) {
    var errData = await response.json().catch(function() { return {}; });
    throw new Error("Erreur API (" + response.status + ") : " + (errData.error?.message || response.statusText));
  }

  var data = await response.json();
  var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error("Réponse vide de l'API.");

  return content.trim();
}

module.exports = { simplifyText };
