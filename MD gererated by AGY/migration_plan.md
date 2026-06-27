# Software Migration Plan: UI Prototype Integration

This document outlines the systematic integration of the **UI trials** (Project B) prototype layout and styles into the **Main Application** (Project A).

---

## Executive Summary

The main application (Project A) is a fully functional Flask application that dynamically loads and indexes Hindi Murli files from a local directory using a customized text processor (`corps.py` and `corpus.py`). It serves this content via a JSON API.

The UI trials prototype (Project B) is a static HTML/CSS/JS prototype with a premium, manuscript-inspired cream-and-gold design featuring spiritual motifs, dynamic sunrise animations, and structured card components. However, its contents are hardcoded in English.

### Core Strategy
1. **Preserve Production Engine:** Do not alter the backend Flask routes or text indexing logic.
2. **Modular Style Migration:** Import all modular stylesheets from Project B into Project A's `static/css/` directory and link them using Flask's `url_for` template helpers.
3. **Template Integration:** Reconstruct [templates/index.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/index.html) with the layout structure of [UI trials/index.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/index.html), utilizing Jinja2 placeholders.
4. **Interactive JS Fusion:** Merge the backend data fetching, search filtering, and state management of Project A with the dynamic rendering and view toggling logic of Project B.
5. **Theme Cohesion:** Restyle Project A's secondary pages ([analysis.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/analysis.html) and [elastic.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/elastic.html)) to match the new cream-and-gold manuscript theme.

---

## Detailed File Migration Map

### 1. Template Files

| Current File (Project A) | Prototype Source (Project B) | Purpose | Dependencies | Merge Strategy | Risk Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [index.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/index.html) | [index.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/index.html) | Main reading layout, file list, and reading pane. | CSS variables, fonts, logo, and icons. | Replace body container structure; map structural IDs; add dynamic JS files via `url_for`. | **High** |
| [elastic.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/elastic.html) | None (New style wrapper) | Elasticsearch documents lookup and display table. | [elastic.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js), [variables.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/variables.css). | Inject header nav menu and wrap tables in manuscript-styled panels. | **Medium** |
| [analysis.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/analysis.html) | None (New style wrapper) | Word analytics, bucket classification. | [analysis.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.css) and internal scripts. | Wrap sections in manuscript layout; apply cream/gold color theme. | **Medium** |

### 2. Stylesheets

| Current File (Project A) | Prototype Source (Project B) | Purpose | Dependencies | Merge Strategy | Risk Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| None (New CSS directory) | [css/variables.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/variables.css)<br>[css/reset.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/reset.css)<br>[css/layout.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/layout.css)<br>[css/header.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/header.css)<br>[css/sidebar.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/sidebar.css)<br>[css/content.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/content.css)<br>[css/cards.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/cards.css)<br>[css/buttons.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/buttons.css)<br>[css/decorations.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/decorations.css)<br>[css/footer.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/footer.css)<br>[css/responsive.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/css/responsive.css) | Modular stylesheets defining colors, typography, margins, and animations. | Google Fonts (Lora, Cinzel, Outfit, Playfair Display) & SVG assets. | Copy all 11 modular CSS files into a new `static/css/` directory. Update internal asset paths to point to Flask static directory. | **Low** |
| [style.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/style.css) | None | Legacy visual styles. | None | Decommission or keep only as a legacy fallback. | **Low** |

### 3. JavaScript Files

| Current File (Project A) | Prototype Source (Project B) | Purpose | Dependencies | Merge Strategy | Risk Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [static/main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js) | [js/app.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/js/app.js) | App bootstrapping & entry point. | [fileList.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileList.js), [fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js). | Keep as entry module, register startup lifecycle hooks, and initialize event binding. | **Low** |
| [static/fileList.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileList.js) | [js/app.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/js/app.js) | File listing & filtering. | `/files` API route. | Rewrite to load dynamic file lists from `/files`, support live text filtering, and populate the new sidebar. | **Medium** |
| [static/fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js) | [js/app.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/UI%20trials/js/app.js) | Contents display and parser rendering. | `/files/<filename>` API route. | Rewrite rendering engine to format dynamic Hindi content into the structured manuscript layout. | **High** |

---

## Technical Merge Details

### 1. Dynamic Text Parsing (Hindi to Structured Cards)
The prototype layout expects structured properties (`essence`, `dharna` points array, `blessing`, `slogan`) which are hardcoded in the mock data. However, the production API returns raw, sentence-split Hindi text. 

To bridge this gap, we will implement a client-side parser in [static/fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js) to inspect the text lines and map them:

```javascript
function parseMurliSentences(sentences) {
  let essence = "";
  const dharnaPoints = [];
  let blessing = "";
  let slogan = "";
  const originalParagraphs = [];

  let currentSection = "body";

  Object.values(sentences).forEach(sentenceObj => {
    const text = sentenceObj.original.trim();
    originalParagraphs.push(text);

    // Identify sections by looking for key Hindi terms
    if (text.startsWith("“मीठे बच्चे") || text.includes("मीठे बच्चे")) {
      essence = text;
    } else if (text.includes("धारणा के लिए मुख्य सार")) {
      currentSection = "dharna";
    } else if (text.includes("वरदान:-") || text.includes("वरदानः-")) {
      currentSection = "blessing";
      blessing = text.replace(/वरदान[:-]/, "").trim();
    } else if (text.includes("स्लोगन:-") || text.includes("स्लोगनः-")) {
      currentSection = "slogan";
      slogan = text.replace(/स्लोगन[:-]/, "").trim();
    } else if (currentSection === "dharna") {
      // Collect numbered items or bullet points
      if (/^[०-९\d]+\)/.test(text) || text.startsWith("1)") || text.startsWith("2)")) {
        dharnaPoints.push(text);
      } else if (text.includes("वरदान") || text.includes("स्लोगन")) {
        currentSection = "body"; // Exit dharna context if headers are hit out of order
      }
    }
  });

  return {
    essence: essence || "BapDada's spiritual nectar...",
    dharna: dharnaPoints.length > 0 ? dharnaPoints : ["सदा श्रीमत पर श्रेष्ठ दैवी गुण धारण करते रहें।"],
    blessing: blessing || "सदा एकरस उमंग-उत्साह में रहने वाले गुणमूर्त भव।",
    slogan: slogan || "बेहद की वैराग्य वृत्ति द्वारा सेकण्ड में अशरीरी बनो।",
    originalText: originalParagraphs
  };
}
```

### 2. Search & Filtration Merge
The search input inside the prototype sidebar (`#search-input`) will be hooked up to filter the files list dynamically. Since the `/files` endpoint returns a simple list of filenames, the filter will run locally on the filenames (e.g., date and title matching).

### 3. Fonts and Assets Copying
- Fonts are loaded directly from Google Web Fonts in [templates/index.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/index.html).
- Vector assets (`logo.svg`, `lotus.svg`, `file.svg`, `search.svg`) will be copied into `static/assets/`.
- Paths inside CSS files (e.g., `background-image: url('../assets/lotus.svg')`) will be mapped correctly to `/static/assets/lotus.svg`.

---

## Risk Analysis & Mitigation

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Missing Sections in Raw Files** | Some Murlis might not have a Blessing or Slogan, causing empty cards in the structured view. | Provide fallback placeholders in Hindi (as shown in the parser logic) so cards always render beautifully. |
| **Search Functionality Breaking** | Custom filters on the sidebar could break search bindings. | Maintain exact hook elements (`#search-input`) and bind them correctly to the loaded lists. |
| **Mobile Sidebar unresponsive** | The hamburger toggle might fail. | Port the inline toggle styles and mobile viewport listeners directly from the prototype into the main app. |
