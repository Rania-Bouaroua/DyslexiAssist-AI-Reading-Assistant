/**
 * prompts.js — Prompts de simplification pour personnes dyslexiques
 * 3 niveaux : light, medium, strong
 */

const SYSTEM_PROMPT = `Tu es un expert en accessibilité et en adaptation de textes pour les personnes dyslexiques.

RÈGLES STRICTES DE FORMATAGE :
1. Utilise ## pour les titres de sections
2. Mets les mots importants en **gras**
3. Utilise des listes numérotées (1. 2. 3.) pour les étapes
4. Utilise des listes à puces (- ) pour les énumérations
5. Maximum 12 mots par phrase
6. Une idée par phrase
7. Saute une ligne entre chaque section
8. Simplifie le vocabulaire complexe
9. Réponds UNIQUEMENT avec le texte reformaté
10. Réponds dans la MÊME LANGUE que le texte fourni`;

const LEVEL_INSTRUCTIONS = {
  light: `Reformule ce texte pour le rendre plus clair :
- Garde le vocabulaire technique mais explique-le entre parenthèses
- Découpe les phrases longues en phrases de 15 mots maximum
- Ajoute des ## titres pour séparer les parties
- Mets les termes importants en **gras**
- Garde toutes les informations`,

  medium: `Simplifie ce texte pour une personne dyslexique :
- Phrases de 12 mots maximum
- Remplace les mots difficiles par des mots simples
- Utilise des ## titres pour chaque partie
- Mets les mots clés en **gras**
- Transforme en listes quand c'est possible
- Une idée = une phrase
- Saute une ligne entre chaque idée`,

  strong: `Simplifie au MAXIMUM ce texte pour une personne avec dyslexie sévère :
- Phrases de 8 mots MAXIMUM
- Uniquement des mots très simples et courants
- Chaque idée sur une ligne séparée
- TOUT en listes numérotées ou à puces
- ## Titre pour chaque partie
- **Gras** sur chaque mot important
- Ajoute des sous-titres explicatifs
- Structure : Titre > Explication simple > Liste

Exemple de format attendu :
## La Cellule
- La **cellule** est très petite
- Elle est dans notre **corps**
- Elle nous aide à **vivre**

## La Membrane
1. La **membrane** entoure la cellule
2. Elle la **protège**
3. Elle laisse passer la **nourriture**`
};

function buildPrompt(level, text) {
  var validLevel = LEVEL_INSTRUCTIONS[level] ? level : "medium";
  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: LEVEL_INSTRUCTIONS[validLevel] + "\n\n--- TEXTE ---\n" + text + "\n--- FIN ---"
  };
}

function getAvailableLevels() {
  return Object.keys(LEVEL_INSTRUCTIONS);
}

module.exports = { buildPrompt, getAvailableLevels };
