# Project UI Link Map

This document maps all the visible UI components of the project to their underlying code files, stylesheets, client scripting logic, network API connections, backend routing controllers, logic classes, and database/storage engines.

---

## 1. Trace Overview Schema

Every visible component on the screen is connected to storage through a specific layer trace, represented below:

```
[Screen Elements]
       ↓
[HTML Element (IDs/Classes)] 
       ↓   (Styled by CSS Files)
[Client-Side JavaScript Modules (Trigger / Event / Render)]
       ↓   (Serializes JSON)
[Network Route (REST API Endpoint)]
       ↓
[Flask Server Controller (flask.Flask app routes)]
       ↓
[Logic Layer Class Method (Tokenizers & Statistical Engines)]
       ↓
[Data Sources / Client Connectors (Filesystem / Elasticsearch)]
```

---

## 2. Component Mappings & Traces

### Component 1: Sidebar File List (index.html)

*   **HTML Element**: `<ul class="file-list-menu" id="fileList">` and dynamically appended `<li class="file-item">`
*   **CSS Files**: [static/css/sidebar.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/sidebar.css), [static/css/variables.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/variables.css)
*   **JavaScript Functions**: 
    *   `loadFiles()` in [static/fileList.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileList.js) (Invoked by DOM load listener in [static/main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js))
    *   `renderFileList(files)` in [static/fileList.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileList.js) (Converts file names e.g., `01-06-2026.md` into titles like `Avyakt Murli 01.06.2026`)
*   **API Endpoints**: `GET /files`
*   **Python Functions**: `get_files()` in [reaDirectroy.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py)
*   **Data Source**: Disk directory search in folder: `G:\My Drive\Obsidian Daily Murli\Daily Murli`

```
[File List Item on Sidebar]
       ↓
HTML: <li class="file-item">
       ↓
JavaScript: loadFiles() -> renderFileList()
       ↓
API Endpoint: GET /files
       ↓
Flask Controller: get_files() [reaDirectroy.py]
       ↓
Filesystem Scan: Path(DIRECTORY_PATH).iterdir()
```

---

### Component 2: Sidebar Filter Search Box (index.html)

*   **HTML Element**: `<input type="text" id="search-input" class="search-input">`
*   **CSS Files**: [static/css/sidebar.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/sidebar.css)
*   **JavaScript Functions**:
    *   Listener: Input event listener on `search-input` initialized in [static/main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
    *   Engine: `filterFiles(query)` in [static/fileList.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileList.js)
*   **API Endpoints**: *None* (Operates locally in client memory).
*   **Python Functions**: *None*.
*   **Data Source**: Client-side JavaScript cache array `allFiles` populated during startup via `GET /files`.

```
[Sidebar Search Field Input]
       ↓
HTML: <input id="search-input">
       ↓
JavaScript: Event Listener [main.js] -> filterFiles(query) [fileList.js]
       ↓
State Cache: allFiles (JavaScript array in memory)
       ↓
Network: (Initialized once by GET /files API call on startup)
```

---

### Component 3: Murli Reader Panel - Original Text View (index.html)

*   **HTML Element**: `<div class="content-viewport" id="content">` hosting text nodes `<p class="murli-paragraph sentence-row">`
*   **CSS Files**: [static/css/content.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/content.css), [static/css/variables.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/variables.css)
*   **JavaScript Functions**:
    *   `loadFile(filename)` in [static/fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js) (Handles file fetch)
    *   `setViewMode('original')` in [static/fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js) (Toggles visibility state)
    *   `renderMurliContent(data)` in [static/fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js) (Appends sentence elements to viewport)
*   **API Endpoints**: `GET /files/<filename>`
*   **Python Functions**: `get_file_content(filename)` in [reaDirectroy.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py)
*   **Data Source**: Logic Orchestrator caching layer: `CORPS.get_file_sentences(filename)` which retrieves data from the `Corpus.sentences` dictionary populated from file storage.

```
[Hindi Sentence Paragraphs in Viewport]
       ↓
HTML: <p class="murli-paragraph sentence-row">
       ↓
JavaScript: loadFile() -> renderMurliContent() with currentView = 'original'
       ↓
API Endpoint: GET /files/01-06-2026.md
       ↓
Flask Controller: get_file_content("01-06-2026.md") [reaDirectroy.py]
       ↓
Logic Layer: CORPS.get_file_sentences() -> Corpus.sentences
       ↓
Physical Storage: Individual markdown files (e.g. Daily Murli/01-06-2026.md)
```

---

### Component 4: Murli Reader Panel - Extracted Points View (index.html)

*   **HTML Element**: `<div class="content-viewport" id="content">` hosting Essence card (`div.card-panel`), Dharna checklist items (`ul.dharna-list li`), Blessing card (`div.card-murli`), and Slogan card (`div.card-murli`).
*   **CSS Files**: [static/css/content.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/content.css), [static/css/cards.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/cards.css), [static/css/variables.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/variables.css)
*   **JavaScript Functions**:
    *   `loadFile(filename)` in [static/fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js)
    *   `parseMurli(sentences)` in [static/fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js) (Parses Hindi substrings to segment the text into "Essence" (मीठे बच्चे), "Dharna" (धारणा), "Blessing" (वरदान), and "Slogan" (स्लोगन)).
    *   `renderMurliContent(data)` in [static/fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js) (Compiles CSS templates for extracted cards).
*   **API Endpoints**: `GET /files/<filename>`
*   **Python Functions**: `get_file_content(filename)` in [reaDirectroy.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py)
*   **Data Source**: `Corpus.sentences` structures populated from file directories.

```
[Spiritual Practice Cards (Dharna, Blessing, Slogan)]
       ↓
HTML: <div class="card-murli"> / <ul class="dharna-list">
       ↓
JavaScript: loadFile() -> parseMurli() -> renderMurliContent()
       ↓
API Endpoint: GET /files/01-06-2026.md
       ↓
Flask Controller: get_file_content("01-06-2026.md") [reaDirectroy.py]
       ↓
Logic Layer: CORPS.get_file_sentences() -> Corpus.sentences
       ↓
Physical Storage: Individual markdown files (e.g. Daily Murli/01-06-2026.md)
```

---

### Component 5: Drag-and-Drop Spiritual Buckets (analysis.html)

*   **HTML Element**: Drop targets: `<div id="excludedBucket" class="drop-zone">`, `<div id="yogaBucket" class="drop-zone">`, `<div id="knowledgeBucket" class="drop-zone">`, `<div id="favoriteBucket" class="drop-zone">`
*   **CSS Files**: [static/analysis/analysis.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.css), [static/css/sidebar.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/sidebar.css)
*   **JavaScript Functions**:
    *   Drag-and-Drop Listeners: `dragStart(event, wordObject)` and `dragEnd(event, wordObject)` bound in [static/analysis/events.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js).
    *   State Manager: `BucketManager.addWord(bucket, word)` and `BucketManager.moveWord(from, to, word)` in [static/analysis/wordManager.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/wordManager.js).
    *   Renderer: `renderBuckets()` and `renderBucket(bucket)` in [static/analysis/render.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js).
*   **API Endpoints**: *None* (Manages word sets on the client side).
*   **Python Functions**: *None*.
*   **Data Source**: Client application runtime memory `App.buckets` state object.

```
[Spiritual Bucket (Yoga/Knowledge/Favorites) Drop Zones]
       ↓
HTML: <div class="drop-zone">
       ↓
JavaScript: dragStart() -> BucketManager.addWord() -> renderBuckets()
       ↓
State Cache: App.buckets map (Local client-side JS runtime variable)
```

---

### Component 6: Word Frequency Cards Grid (analysis.html)

*   **HTML Element**: Grid container `<div id="cardContainer">` containing `<div class="count-card">` with dynamically rendered `<div class="word-card interactive">` items.
*   **CSS Files**: [static/analysis/analysis.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.css), [static/css/cards.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/cards.css)
*   **JavaScript Functions**:
    *   `loadBucket(characterCount)` in [static/analysis/analysis.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.js) (Queries REST API endpoint)
    *   `renderCards()` in [static/analysis/render.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js) (Clears and appends cards)
    *   `createCountCard(count, words)` and `createWordCard({word, count})` in [static/analysis/cards.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/cards.js) (Initializes HTML structures and binds drag parameters)
*   **API Endpoints**: `GET /api/character-bucket/<characterCount>`
*   **Python Functions**: `character_bucket(count)` in [reaDirectroy.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py)
*   **Data Source**: Logic Layer dictionary buckets: `CORPS.dictionary.build_character_bucket(count)` constructed from extracting words from loaded documents.

```
[Word Analytics Cards Grid]
       ↓
HTML: <div class="word-card interactive">
       ↓
JavaScript: loadBucket() -> renderCards() -> createWordCard()
       ↓
API Endpoint: GET /api/character-bucket/5
       ↓
Flask Controller: character_bucket(5) [reaDirectroy.py]
       ↓
Logic Layer: Dictionary.build_character_bucket(5) -> Dictionary.normalized_words
       ↓
Corpus indexing: Corpus.extracted_words (Extracted Unicode normalized word map)
```

---

### Component 7: Character Length Filters (analysis.html)

*   **HTML Element**: Container `<div id="bucketButtons">` populated with individual `<button>` controls.
*   **CSS Files**: [static/css/buttons.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/buttons.css), [static/analysis/analysis.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.css)
*   **JavaScript Functions**:
    *   `buildButtons()` in [static/analysis/analysis.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.js) (Generates buttons 1 to 10 on page load)
    *   `loadBucket(count)` in [static/analysis/analysis.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.js) (Bound to button click event)
*   **API Endpoints**: `GET /api/character-bucket/<count>`
*   **Python Functions**: `character_bucket(count)` in [reaDirectroy.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py)
*   **Data Source**: `CORPS.dictionary.build_character_bucket(count)`.

```
[Character Selection Button Bar (1 Character, 2 Characters, etc.)]
       ↓
HTML: <div id="bucketButtons"> <button>
       ↓
JavaScript: Event handler -> loadBucket(count)
       ↓
API Endpoint: GET /api/character-bucket/<count>
       ↓
Flask Controller: character_bucket(count) [reaDirectroy.py]
       ↓
Logic Layer: Dictionary.build_character_bucket(count)
```

---

### Component 8: Elasticsearch Document Table Grid (elastic.html)

*   **HTML Element**: Container `<div id="documentsContainer">` holding dynamic list headings `<section class="elastic-file-section">` and tables `<table class="elastic-table">`.
*   **CSS Files**: [static/css/content.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/css/content.css) and inline CSS definitions in [templates/elastic.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/elastic.html) (e.g. `.elastic-table`, `.elastic-file-section`).
*   **JavaScript Functions**:
    *   `loadDocuments()` in [static/elastic.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js) (Triggers on load and on clicking Refresh button)
    *   `fetchDocuments()` in [static/elastic.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js) (Handles promise fetch requests)
    *   `renderDocuments(documents)` in [static/elastic.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js) (Transforms response docs array into table segments grouped by file name)
*   **API Endpoints**: `GET /documents`
*   **Python Functions**: `get_documents()` in [elasticFlask.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elasticFlask.py)
*   **Data Source**: Elasticsearch DB Index `murli` via Elasticsearch client searches.

```
[Elasticsearch Sentences Table Rows]
       ↓
HTML: <table class="elastic-table"> <tr>
       ↓
JavaScript: loadDocuments() -> fetchDocuments() -> renderDocuments()
       ↓
API Endpoint: GET /documents
       ↓
Flask Controller: get_documents() [elasticFlask.py]
       ↓
DB Connector: es_client.create_elasticsearch_client() -> es.search()
       ↓
Persistent Database: Local Elasticsearch Node Cluster (index: "murli")
```
