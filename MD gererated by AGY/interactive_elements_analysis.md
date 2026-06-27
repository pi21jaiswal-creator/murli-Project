# Interactive Elements Analysis

This document details all interactive elements in the application.

---

## 1. Main Application Home Page (`templates/index.html`)

### A. Load Files Button
* **HTML Element:** `<button>`
* **ID:** `loadFilesBtn`
* **Class:** None
* **JavaScript File:** [static/main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
* **Event Listener:** `onclick="loadFiles()"` and `DOMContentLoaded` listener in [main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
* **API Endpoint:** `/files`
* **Purpose:** Fetches the list of all Murli files from the local directory and populates the sidebar menu.

### B. File List Navigation Items (Sidebar)
* **HTML Element:** `<li>` inside `<ul>`
* **ID:** None
* **Class:** `file-item`
* **JavaScript File:** [static/fileList.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileList.js)
* **Event Listener:** Click event listener registered via `addEventListener('click')` inside `renderFileList()`
* **API Endpoint:** `/files/<filename>`
* **Purpose:** Fetches the parsed sentence blocks of a specific Murli file from the server and updates the reading pane viewport.

### C. Original View Mode Toggle Option
* **HTML Element:** `<span>`
* **ID:** `originalBtn`
* **Class:** `toggle-option`
* **JavaScript File:** [static/main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
* **Event Listener:** `onclick="showOriginal()"` and click event listener bound in [main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
* **API Endpoint:** None
* **Purpose:** Instructs the renderer to display original Hindi sentences from the current file.

### D. Extracted View Mode Toggle Option
* **HTML Element:** `<span>`
* **ID:** `extractedBtn`
* **Class:** `toggle-option`
* **JavaScript File:** [static/main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
* **Event Listener:** `onclick="showExtracted()"` and click event listener bound in [main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
* **API Endpoint:** None
* **Purpose:** Instructs the renderer to build and show the parsed structured cards (*Essence*, *Dharna*, *Blessing*, *Slogan*).

### E. Sidebar Search Input Box
* **HTML Element:** `<input type="text">`
* **ID:** `search-input`
* **Class:** `search-input`
* **JavaScript File:** [static/main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
* **Event Listener:** Input event listener `addEventListener('input')` bound in [main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
* **API Endpoint:** None
* **Purpose:** Filters the sidebar list of files dynamically as the user types.

### F. Mobile Hamburger Menu Toggle Button
* **HTML Element:** `<button>`
* **ID:** `btn-menu-toggle`
* **Class:** `btn-icon`
* **JavaScript File:** [static/main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
* **Event Listener:** Click event listener `addEventListener('click')`
* **API Endpoint:** None
* **Purpose:** Opens and closes the sidebar navigation drawer overlay on mobile screen layouts.

---

## 2. Word Analysis Page (`templates/analysis.html`)

### A. Load Statistics Button
* **HTML Element:** `<button>`
* **ID:** None
* **Class:** None
* **JavaScript File:** [static/analysis/analysis.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.js)
* **Event Listener:** `onclick="loadFrequency()"`
* **API Endpoint:** `/api/word-frequency`
* **Purpose:** Queries word-count counts and renders the initial list of draggable cards.

### B. Word Search Box
* **HTML Element:** `<input type="text">`
* **ID:** `searchBox`
* **Class:** None
* **JavaScript File:** [static/analysis/events.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js)
* **Event Listener:** Input listener registered in [events.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js)
* **API Endpoint:** None
* **Purpose:** Dynamically hides/shows frequency cards matching the user query.

### C. Character Count Filter Buttons
* **HTML Element:** `<button>`
* **ID:** None
* **Class:** None
* **JavaScript File:** [static/analysis/render.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js)
* **Event Listener:** Click listener registered dynamically
* **API Endpoint:** `/api/character-bucket/<count>`
* **Purpose:** Loads and renders words of the selected character length (e.g. 5-letter words).

### D. Word Frequency Cards
* **HTML Element:** `<div>`
* **ID:** None
* **Class:** `word-card`
* **JavaScript File:** [static/analysis/events.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js)
* **Event Listener:** HTML5 Drag & Drop event listeners (`dragstart`, `dragend`)
* **API Endpoint:** None
* **Purpose:** Allows the user to select and drag a word to place it in different classification buckets.

### E. Spiritual Drop Buckets
* **HTML Element:** `<div>`
* **ID:** `excludedBucket`, `yogaBucket`, `knowledgeBucket`, `favoriteBucket`
* **Class:** `drop-zone`
* **JavaScript File:** [static/analysis/events.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js)
* **Event Listener:** HTML5 Drag & Drop event listeners (`dragover`, `dragenter`, `dragleave`, `drop`)
* **API Endpoint:** None
* **Purpose:** Collects dropped cards and places the word in the respective list.

---

## 3. Elasticsearch Documents View Page (`templates/elastic.html`)

### A. Refresh Documents Button
* **HTML Element:** `<button>`
* **ID:** `refreshBtn`
* **Class:** None
* **JavaScript File:** [static/elastic.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js)
* **Event Listener:** Click listener registered in [elastic.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js)
* **API Endpoint:** `/documents`
* **Purpose:** Queries index database and updates the document grids.
