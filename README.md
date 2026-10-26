
<div align="center">

# DyslexiAssist
### AI-Powered Text Simplification & Accessible Reading

**Making academic content easier to understand through Generative AI, intelligent document extraction and dyslexia-friendly formatting.**

![Node.js](https://img.shields.io/badge/Node.js-JavaScript-339933?logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-OCR_%26_PDF-3776AB?logo=python&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLM_Inference-F55036)
![LLaMA](https://img.shields.io/badge/LLaMA-3.3_70B-8B5CF6)
![OCR](https://img.shields.io/badge/OCR-Tesseract-2563EB)
![Accessibility](https://img.shields.io/badge/Focus-Digital_Accessibility-10B981)
![Status](https://img.shields.io/badge/Status-Academic_Prototype-blue)

**Natural Language Processing • Generative AI • Document Understanding • Accessibility**

</div>

---

## Overview

**DyslexiAssist** is an AI-powered reading assistance module designed to make academic documents more understandable for students with dyslexia.

The project combines Large Language Models (LLMs), document text extraction, Optical Character Recognition (OCR), and accessible HTML formatting.

It transforms complex academic content into simplified, structured text with adjustable levels of complexity.

The current repository contains the **AI processing module and its supporting utilities**, not a complete standalone web application.

## The Challenge

Academic documents often contain long sentences, complex vocabulary and dense formatting that can create additional reading difficulties.

DyslexiAssist explores how AI-assisted text transformation can make educational content easier to navigate.

The system focuses on three complementary tasks:

1. Extracting text from academic documents.
2. Simplifying the extracted content using an LLM.
3. Presenting the result through reading-friendly HTML formatting.

---

## Core Features

### AI-Powered Text Simplification

- Simplifies complex academic text using an LLM.
- Integrates the Groq API with the LLaMA 3.3 70B model.
- Provides three configurable simplification levels.
- Uses structured prompts tailored to different reading needs.
- Produces organized Markdown content for downstream formatting.

### Intelligent Document Extraction

- Extracts text from standard PDF documents.
- Supports scanned documents through OCR.
- Uses Python-based extraction with `pdfminer.six`.
- Integrates `pytesseract` and `pdf2image`.
- Provides a Node.js PDF parsing fallback.
- Includes optional OCR.Space API integration.

### Dyslexia-Friendly Formatting

- Converts simplified Markdown into structured HTML.
- Uses readable font sizes and increased line spacing.
- Adds visually differentiated headings.
- Highlights important text.
- Formats lists into clearly separated reading blocks.
- Provides standard accessible and enhanced dyslexia-oriented HTML modes.

### Reusable AI Module

- Exposes JavaScript functions through a centralized entry point.
- Designed for integration into an existing Node.js backend.
- Combines extraction, simplification and formatting into one pipeline.

---

## System Architecture

```text
                    USER DOCUMENT
                  PDF / SCANNED PDF
                          |
                          v
              +-----------------------+
              | DOCUMENT EXTRACTION   |
              |                       |
              | pdfminer.six          |
              | pytesseract / OCR     |
              | Node.js fallback      |
              +-----------+-----------+
                          |
                          v
                    EXTRACTED TEXT
                          |
                          v
              +-----------------------+
              | AI SIMPLIFICATION     |
              |                       |
              | Groq API              |
              | LLaMA 3.3 70B         |
              | Adaptive Prompts      |
              +-----------+-----------+
                          |
                          v
                   SIMPLIFIED TEXT
                          |
                          v
              +-----------------------+
              | ACCESSIBLE FORMATTING |
              |                       |
              | Standard HTML         |
              | Dyslexia-Oriented HTML|
              +-----------+-----------+
                          |
                          v
                 READING-FRIENDLY
                     CONTENT
```

The pipeline is orchestrated through `index.js`, which exposes the main functions for integration with other application components.

---

## Three Simplification Levels

DyslexiAssist offers three levels of text simplification.

| Level | Target sentence length | Intended use |
|---|---|---|
| `light` | Up to 15 words | Light simplification |
| `medium` | Up to 12 words | Balanced simplification |
| `strong` | Up to 8 words | Maximum simplification |

The default level is `medium`.

These limits are prompt instructions rather than guaranteed constraints, and the levels are not clinically validated classifications of dyslexia severity.

---

## Technology Stack

| Component | Technologies |
|---|---|
| Main language | JavaScript / Node.js |
| Supporting language | Python |
| AI inference | Groq API |
| Language model | LLaMA 3.3 70B |
| Prompt engineering | Custom adaptive prompts |
| PDF extraction | pdfminer.six, pdf-parse |
| OCR | Tesseract, pytesseract, pdf2image |
| OCR fallback | OCR.Space API |
| HTML processing | JavaScript, Markdown conversion |
| Configuration | dotenv |
| Testing | Node.js test script |

---

## Project Structure

```text
dyslexi-assist/
|
|-- index.js
|-- simplifier.js
|-- prompts.js
|-- formatter.js
|-- pdf-parser.js
|-- ocr.js
|
|-- python/
|   |-- extract_pdf.py
|   |-- extract_text_auto.py
|   `-- ocr.py
|
|-- tests/
|   `-- test.js
|
|-- package.json
|-- package-lock.json
|-- .env.example
|-- .gitignore
`-- README.md
```

### Main Modules

| File | Responsibility |
|---|---|
| `index.js` | Public entry point and processing pipeline |
| `simplifier.js` | LLM requests and response handling |
| `prompts.js` | Simplification instructions and available levels |
| `formatter.js` | Accessible HTML generation |
| `pdf-parser.js` | PDF text extraction |
| `ocr.js` | OCR processing and fallback |
| `python/` | Supporting document extraction scripts |
| `tests/test.js` | Automated module tests |

---

## Installation & Setup

### Prerequisites

- Node.js 18 or later
- npm
- Python 3
- Groq API key
- Tesseract OCR and Poppler for scanned PDFs
- Optional OCR.Space API key

### 1. Clone the Repository

```bash
git clone https://github.com/Rania-Bouaroua/DyslexiAssist-AI-Reading-Assistant.git

cd DyslexiAssist-AI-Reading-Assistant
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Install Python Dependencies

```bash
python -m pip install pdfminer.six pytesseract pdf2image Pillow
```

For OCR functionality, install the Tesseract OCR executable. Poppler may also be required for converting scanned PDFs into images.

### 4. Configure Environment Variables

Copy the example configuration.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure `.env` with your own credentials:

```dotenv
GROQ_API_KEY=your_groq_api_key
API_URL=https://api.groq.com/openai/v1/chat/completions
MODEL=llama-3.3-70b-versatile

OCR_SPACE_API_KEY=your_optional_ocr_space_key
```

**Security:** Never commit a real `.env` file or publish API keys.

### 5. Run Tests

```bash
npm test
```

The repository includes tests for prompt construction, HTML formatting, input validation and API-related behavior.

---

## Usage Examples

### Simplify Academic Text

```javascript
const ai = require("./index");

async function main() {
  const text =
    "Machine learning algorithms identify patterns in data.";

  const simplified = await ai.simplifyText(
    text,
    "medium"
  );

  console.log(simplified);
}

main().catch(console.error);
```

### Generate Accessible HTML

```javascript
const ai = require("./index");

const markdown = `
## Introduction

**Artificial Intelligence** helps machines
learn from data.

- Machine learning
- Natural language processing
`;

const accessibleHTML = ai.toAccessibleHTML(markdown);

const dyslexiaHTML = ai.toDyslexiaHTML(markdown);

console.log(accessibleHTML);
console.log(dyslexiaHTML);
```

### Complete PDF Processing Pipeline

```javascript
const fs = require("fs");
const ai = require("./index");

async function main() {
  const pdfBuffer = fs.readFileSync(
    "./document.pdf"
  );

  const result = await ai.processDocument(
    pdfBuffer,
    "medium"
  );

  console.log("Original text:");
  console.log(result.originalText);

  console.log("Simplified text:");
  console.log(result.simplifiedText);

  console.log("Accessible HTML:");
  console.log(result.accessibleHTML);

  console.log("Enhanced dyslexia HTML:");
  console.log(result.dyslexiaHTML);
}

main().catch(console.error);
```

Replace `document.pdf` with the path to your own document.

---

## Accessible Formatting Modes

### Standard Accessible HTML

`toAccessibleHTML()` applies:

- 18px text sizing
- Increased line height
- Wider character and word spacing
- Highlighted headings and important words
- Structured lists

### Enhanced Dyslexia-Oriented HTML

`toDyslexiaHTML()` provides:

- 22px text sizing
- Additional line and character spacing
- Distinctive visual sections
- Color-highlighted keywords
- More prominent list elements

These options are configurable presentation approaches. Accessibility needs vary by user, and the formatting has not been established as universally effective for people with dyslexia.

---

## Testing

Run the JavaScript test suite:

```bash
npm test
```

The original project documentation describes 22 tests covering:

- Simplification prompts
- Markdown-to-HTML formatting
- Input validation
- API behavior

Actual test results depend on the local environment and configuration.

---

## Privacy & Security

The system may process sensitive educational documents.

Recommended precautions:

- Never commit API keys or credentials.
- Avoid publishing user documents and OCR outputs.
- Obtain appropriate permission before processing personal documents through external APIs.
- Validate uploaded document types and sizes.
- Restrict access to temporary files.
- Review document retention and deletion behavior.
- Avoid treating AI-generated simplifications as guaranteed faithful interpretations of the original content.

The current implementation is an academic prototype and requires additional security and accessibility testing before production deployment.

---

## Current Limitations

- AI-generated simplifications may occasionally omit or alter information.
- Word-count constraints depend on LLM compliance.
- OCR quality depends on scan resolution and document layout.
- The PDF/OCR pipeline relies on external tools and may require environment-specific adjustments.
- The repository provides a reusable AI module rather than a full web frontend.
- No formal user study or clinical accessibility validation is included.

---

## Future Improvements

- Interactive reading dashboard
- Text-to-speech integration
- User-configurable font and spacing preferences
- Multilingual simplification
- Document summarization
- Improved OCR accuracy
- Evaluation of meaning preservation
- Accessibility testing with end users
- Secure document upload and storage

---

## Academic Context

DyslexiAssist explores the intersection of:

- Artificial Intelligence
- Natural Language Processing
- Human-Centered Computing
- Document Understanding
- Digital Accessibility

The project demonstrates how LLMs and document processing technologies can be integrated into accessible learning tools.

---

<div align="center">

### DyslexiAssist

**Technology designed to make learning materials easier to read and understand.**

*AI • NLP • OCR • Accessibility*

</div>
