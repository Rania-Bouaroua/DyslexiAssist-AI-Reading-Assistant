/**
 * test.js — Tests pour le module AI Tool DyslexiAssist
 *
 * Usage : node tests/test.js
 *
 * Teste :
 *   - prompts.js  (buildPrompt, getAvailableLevels)
 *   - formatter.js (toAccessibleHTML, toDyslexiaHTML, escapeHtml)
 *   - Validation des entrees (texte vide, null)
 *   - Appel API reel si GROQ_API_KEY est defini
 */

var path = require("path");

// Load env from ai-tool/.env (optional — dotenv may not be installed)
try {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
} catch (e) {
  // dotenv not installed, rely on system environment variables
}

var { buildPrompt, getAvailableLevels } = require("../prompts");
var { toAccessibleHTML, toDyslexiaHTML, escapeHtml } = require("../formatter");
var { simplifyText } = require("../simplifier");

// --- Colored output helpers ---
var GREEN = "\x1b[32m";
var RED = "\x1b[31m";
var YELLOW = "\x1b[33m";
var CYAN = "\x1b[36m";
var BOLD = "\x1b[1m";
var RESET = "\x1b[0m";

var passed = 0;
var failed = 0;
var skipped = 0;

function pass(name) {
  passed++;
  console.log(GREEN + "  PASS " + RESET + name);
}

function fail(name, detail) {
  failed++;
  console.log(RED + "  FAIL " + RESET + name);
  if (detail) console.log(RED + "       " + detail + RESET);
}

function skip(name, reason) {
  skipped++;
  console.log(YELLOW + "  SKIP " + RESET + name + (reason ? " (" + reason + ")" : ""));
}

function section(title) {
  console.log("\n" + CYAN + BOLD + "--- " + title + " ---" + RESET);
}

// ============================================================
// 1. PROMPT TESTS
// ============================================================
section("Prompts (buildPrompt / getAvailableLevels)");

// Test: getAvailableLevels returns all 3 levels
(function() {
  var levels = getAvailableLevels();
  if (
    Array.isArray(levels) &&
    levels.indexOf("light") !== -1 &&
    levels.indexOf("medium") !== -1 &&
    levels.indexOf("strong") !== -1 &&
    levels.length === 3
  ) {
    pass("getAvailableLevels returns light, medium, strong");
  } else {
    fail("getAvailableLevels returns light, medium, strong", "Got: " + JSON.stringify(levels));
  }
})();

// Test: buildPrompt returns correct structure
(function() {
  var result = buildPrompt("medium", "Texte de test");
  if (
    result &&
    typeof result.systemPrompt === "string" &&
    typeof result.userPrompt === "string" &&
    result.systemPrompt.length > 0 &&
    result.userPrompt.length > 0
  ) {
    pass("buildPrompt returns { systemPrompt, userPrompt }");
  } else {
    fail("buildPrompt returns { systemPrompt, userPrompt }", "Got: " + JSON.stringify(result));
  }
})();

// Test: buildPrompt includes the text in userPrompt
(function() {
  var result = buildPrompt("light", "Mon texte academique");
  if (result.userPrompt.indexOf("Mon texte academique") !== -1) {
    pass("buildPrompt includes input text in userPrompt");
  } else {
    fail("buildPrompt includes input text in userPrompt");
  }
})();

// Test: invalid level falls back to medium
(function() {
  var resultInvalid = buildPrompt("nonexistent", "Test");
  var resultMedium = buildPrompt("medium", "Test");
  if (resultInvalid.userPrompt === resultMedium.userPrompt) {
    pass("Invalid level falls back to medium");
  } else {
    fail("Invalid level falls back to medium", "Prompts differ");
  }
})();

// Test: each level produces different prompts
(function() {
  var light = buildPrompt("light", "Test");
  var medium = buildPrompt("medium", "Test");
  var strong = buildPrompt("strong", "Test");
  if (
    light.userPrompt !== medium.userPrompt &&
    medium.userPrompt !== strong.userPrompt &&
    light.userPrompt !== strong.userPrompt
  ) {
    pass("Each level produces a different prompt");
  } else {
    fail("Each level produces a different prompt");
  }
})();

// ============================================================
// 2. FORMATTER TESTS
// ============================================================
section("Formatter (toAccessibleHTML / toDyslexiaHTML / escapeHtml)");

// Test: escapeHtml handles special characters
(function() {
  var result = escapeHtml('<script>alert("xss")</script> & more');
  if (
    result.indexOf("<") === -1 &&
    result.indexOf(">") === -1 &&
    result.indexOf("&lt;") !== -1 &&
    result.indexOf("&gt;") !== -1 &&
    result.indexOf("&amp;") !== -1 &&
    result.indexOf("&quot;") !== -1
  ) {
    pass("escapeHtml escapes <, >, &, and quotes");
  } else {
    fail("escapeHtml escapes <, >, &, and quotes", "Got: " + result);
  }
})();

// Test: escapeHtml handles empty/null
(function() {
  if (escapeHtml("") === "" && escapeHtml(null) === "" && escapeHtml(undefined) === "") {
    pass("escapeHtml returns empty string for falsy input");
  } else {
    fail("escapeHtml returns empty string for falsy input");
  }
})();

// Test: toAccessibleHTML converts **bold**
(function() {
  var html = toAccessibleHTML("This is **important** text");
  if (html.indexOf("<strong") !== -1 && html.indexOf("important") !== -1) {
    pass("toAccessibleHTML converts **bold** to <strong>");
  } else {
    fail("toAccessibleHTML converts **bold** to <strong>", "Got: " + html);
  }
})();

// Test: toAccessibleHTML converts ## headers
(function() {
  var html = toAccessibleHTML("## Mon Titre");
  if (html.indexOf("<h2") !== -1 && html.indexOf("Mon Titre") !== -1) {
    pass("toAccessibleHTML converts ## headers to <h2>");
  } else {
    fail("toAccessibleHTML converts ## headers to <h2>", "Got: " + html);
  }
})();

// Test: toAccessibleHTML converts numbered lists
(function() {
  var html = toAccessibleHTML("1. Premier\n2. Deuxieme");
  if (html.indexOf("Premier") !== -1 && html.indexOf("Deuxieme") !== -1 && html.indexOf("1.") !== -1) {
    pass("toAccessibleHTML converts numbered lists");
  } else {
    fail("toAccessibleHTML converts numbered lists", "Got: " + html);
  }
})();

// Test: toAccessibleHTML converts bullet lists
(function() {
  var html = toAccessibleHTML("- Item un\n- Item deux");
  if (html.indexOf("Item un") !== -1 && html.indexOf("Item deux") !== -1 && (html.indexOf("\u25CF") !== -1 || html.indexOf("&#x25CF;") !== -1)) {
    pass("toAccessibleHTML converts bullet lists with bullet character");
  } else {
    fail("toAccessibleHTML converts bullet lists with bullet character", "Got: " + html);
  }
})();

// Test: toAccessibleHTML returns empty for falsy input
(function() {
  if (toAccessibleHTML("") === "" && toAccessibleHTML(null) === "" && toAccessibleHTML(undefined) === "") {
    pass("toAccessibleHTML returns empty string for falsy input");
  } else {
    fail("toAccessibleHTML returns empty string for falsy input");
  }
})();

// Test: toAccessibleHTML wraps in container div with dyslexia-friendly styles
(function() {
  var html = toAccessibleHTML("Hello");
  if (
    html.indexOf("font-size:18px") !== -1 &&
    html.indexOf("line-height:2.0") !== -1 &&
    html.indexOf("letter-spacing") !== -1
  ) {
    pass("toAccessibleHTML wraps output with dyslexia-friendly container styles");
  } else {
    fail("toAccessibleHTML wraps output with dyslexia-friendly container styles");
  }
})();

// Test: toDyslexiaHTML produces larger styling than toAccessibleHTML
(function() {
  var accessible = toAccessibleHTML("Hello **world**");
  var dyslexia = toDyslexiaHTML("Hello **world**");
  if (
    dyslexia.indexOf("font-size:22px") !== -1 &&
    dyslexia.indexOf("line-height:2.2") !== -1 &&
    dyslexia.indexOf("max-width:750px") !== -1
  ) {
    pass("toDyslexiaHTML uses larger font-size, line-height, and max-width");
  } else {
    fail("toDyslexiaHTML uses larger font-size, line-height, and max-width");
  }
})();

// Test: toDyslexiaHTML converts all markdown elements
(function() {
  var md = "## Titre\n\n**mot** important\n\n1. Etape un\n2. Etape deux\n\n- Point un\n- Point deux";
  var html = toDyslexiaHTML(md);
  var hasTitle = html.indexOf("Titre") !== -1 && html.indexOf("<h2") !== -1;
  var hasBold = html.indexOf("<strong") !== -1 && html.indexOf("mot") !== -1;
  var hasNumbers = html.indexOf("Etape un") !== -1;
  var hasBullets = html.indexOf("Point un") !== -1;
  if (hasTitle && hasBold && hasNumbers && hasBullets) {
    pass("toDyslexiaHTML converts headers, bold, numbered and bullet lists");
  } else {
    fail("toDyslexiaHTML converts headers, bold, numbered and bullet lists");
  }
})();

// Test: toDyslexiaHTML uses gradient background for headers
(function() {
  var html = toDyslexiaHTML("## Test Titre");
  if (html.indexOf("linear-gradient") !== -1) {
    pass("toDyslexiaHTML uses gradient background for headers");
  } else {
    fail("toDyslexiaHTML uses gradient background for headers");
  }
})();

// ============================================================
// 3. VALIDATION TESTS
// ============================================================
section("Validation (simplifyText input checks)");

// Test: empty text throws error
(function() {
  simplifyText("", "medium")
    .then(function() { fail("Empty text should throw an error"); })
    .catch(function(err) {
      if (err.message && err.message.indexOf("vide") !== -1) {
        pass("Empty text throws error with 'vide' message");
      } else {
        fail("Empty text throws error with 'vide' message", "Got: " + err.message);
      }
    });
})();

// Test: null text throws error
(function() {
  simplifyText(null, "medium")
    .then(function() { fail("Null text should throw an error"); })
    .catch(function(err) {
      if (err.message && err.message.indexOf("vide") !== -1) {
        pass("Null text throws error with 'vide' message");
      } else {
        fail("Null text throws error with 'vide' message", "Got: " + err.message);
      }
    });
})();

// Test: whitespace-only text throws error
(function() {
  simplifyText("   \n\t  ", "medium")
    .then(function() { fail("Whitespace-only text should throw an error"); })
    .catch(function(err) {
      if (err.message) {
        pass("Whitespace-only text throws an error");
      } else {
        fail("Whitespace-only text throws an error");
      }
    });
})();

// ============================================================
// 4. API INTEGRATION TEST (only if GROQ_API_KEY is set)
// ============================================================
section("API Integration (requires GROQ_API_KEY)");

var API_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

if (!API_KEY) {
  skip("Simplify short academic text", "GROQ_API_KEY not set");
  skip("Result contains markdown formatting", "GROQ_API_KEY not set");

  // Print summary after a short delay for async validation tests
  setTimeout(printSummary, 500);
} else {
  (async function() {
    var testText = "La photosynthese est un processus biochimique par lequel les organismes chlorophylliens " +
      "convertissent l'energie lumineuse en energie chimique, permettant la synthese de molecules organiques " +
      "a partir de dioxyde de carbone et d'eau, avec liberation de dioxygene.";

    try {
      var result = await simplifyText(testText, "medium");
      if (result && result.length > 20) {
        pass("simplifyText returns non-empty simplified text (" + result.length + " chars)");
      } else {
        fail("simplifyText returns non-empty simplified text", "Result too short: " + (result || "").length);
      }

      // Check if the result contains some markdown elements
      var hasMarkdown = result.indexOf("**") !== -1 || result.indexOf("##") !== -1 || result.indexOf("- ") !== -1;
      if (hasMarkdown) {
        pass("Simplified text contains markdown formatting");
      } else {
        fail("Simplified text contains markdown formatting", "No markdown found in result");
      }

      // Test that formatting the result produces valid HTML
      var html = toAccessibleHTML(result);
      if (html.indexOf("<div") !== -1 && html.length > result.length) {
        pass("toAccessibleHTML successfully formats API result into HTML");
      } else {
        fail("toAccessibleHTML successfully formats API result into HTML");
      }
    } catch (err) {
      fail("API simplification test", err.message);
    }

    // Print summary after all async tests complete
    setTimeout(printSummary, 200);
  })();
}

// ============================================================
// SUMMARY
// ============================================================
function printSummary() {
  var total = passed + failed + skipped;
  console.log("\n" + BOLD + "========================================" + RESET);
  console.log(BOLD + " RESULTS" + RESET);
  console.log(BOLD + "========================================" + RESET);
  console.log(GREEN + "  Passed:  " + passed + RESET);
  if (failed > 0) {
    console.log(RED + "  Failed:  " + failed + RESET);
  } else {
    console.log("  Failed:  0");
  }
  if (skipped > 0) {
    console.log(YELLOW + "  Skipped: " + skipped + RESET);
  }
  console.log("  Total:   " + total);
  console.log(BOLD + "========================================" + RESET);

  if (failed > 0) {
    console.log("\n" + RED + BOLD + "Some tests failed!" + RESET);
    process.exit(1);
  } else {
    console.log("\n" + GREEN + BOLD + "All tests passed!" + RESET);
  }
}
