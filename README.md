# DyslexiAssist AI Tool

Plateforme d'aide pour étudiants dyslexiques.

Module d'intelligence artificielle pour DyslexiAssist. Simplifie les textes academiques et les convertit en HTML optimise pour les personnes dyslexiques.

## Ce que fait le module

1. **Extraction** — Extrait le texte des PDFs (pdfminer + OCR pytesseract)
2. **Simplification** — Envoie le texte à l'IA (Groq / LLaMA 3.3 70B) avec des prompts adaptés dyslexie
3. **Formatage** — Convertit la sortie markdown en HTML accessible et stylé

## Installation

```bash
cd ai-tool
npm install
cp .env.example .env
pip3 install pdfminer.six pytesseract pdf2image Pillow
```

Ajoutez votre clé API dans `.env` :
```
GROQ_API_KEY=gsk_your_key_here
```

## Les 3 niveaux de simplification

| Niveau | Mots/phrase max | Pour qui |
|--------|----------------|----------|
| `light` | 15 | Dyslexie légère |
| `medium` | 12 | Dyslexie modérée (défaut) |
| `strong` | 8 | Dyslexie sévère |

## Utilisation par le backend

```js
const ai = require("../ai-tool");

// Simplifier du texte
const simplified = await ai.simplifyText("Texte académique...", "strong");

// HTML pour étudiant normal (18px)
const html = ai.toAccessibleHTML(simplified);

// HTML pour étudiant dyslexique (22px, espacement large)
const dyslexiaHtml = ai.toDyslexiaHTML(simplified);

// Pipeline complet PDF → simplification → HTML
const result = await ai.processDocument(pdfBuffer, "medium");
// → { originalText, simplifiedText, accessibleHTML, dyslexiaHTML, source }
```

## Tests

```bash
npm test
```

22 tests (prompts, formatter, validation, API).
