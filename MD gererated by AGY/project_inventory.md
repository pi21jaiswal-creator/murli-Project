# Project Inventory

This document provides a comprehensive inventory and analysis of the files, templates, styles, and configurations of the project.

---

## 1. Folder Structure

Below is the directory structure of the project workspace:

```text
Project/
│
├── .vscode/
│   └── settings.json
│
├── static/
│   ├── analysis/
│   │   ├── analysis.css
│   │   ├── analysis.js
│   │   ├── cards.js
│   │   ├── events.js
│   │   ├── render.js
│   │   └── wordManager.js
│   │
│   ├── app.js
│   ├── elastic.js
│   ├── fileList.js
│   ├── fileViewer.js
│   ├── main.js
│   └── style.css
│
├── templates/
│   ├── analysis.html
│   ├── elastic.html
│   └── index.html
│
├── corps.py
├── corpus.py
├── dictionary.py
├── elasticFlask.py
├── elastic_test.py
├── es_client.py
├── frequency.py
├── models.py
├── reaDirectroy.py
└── sentence.py
```

---

## 2. Python Files

### [corps.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corps.py)
* **Purpose**: Serves as a high-level wrapper and orchestrator for corpus, frequency, and dictionary computations.
* **Responsibility**: Exposes simple methods to load words, get sentences/original documents, check word frequencies, and build the entire corpus indices.
* **Imports**:
  * `from corpus import Corpus`
  * `from sentence import build_sentence_text`
  * `from frequency import Frequency`
  * `from dictionary import Dictionary`
* **Exported Classes/Functions**:
  * [Corps](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corps.py#L8) (class)
* **Dependencies**:
  * [corpus.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corpus.py)
  * [sentence.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/sentence.py)
  * [frequency.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/frequency.py)
  * [dictionary.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/dictionary.py)

### [corpus.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corpus.py)
* **Purpose**: Manages the base document collection, tokenizes content, constructs word/sentence indices, and extracts words.
* **Responsibility**: Reads text files, separates words/punctuation, builds index mappings (e.g., word-to-position, sentences, document mapping for search indexes).
* **Imports**:
  * `from pathlib import Path`
  * `import regex`
  * `from models import Position`
* **Exported Classes/Functions**:
  * [Corpus](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corpus.py#L6) (class)
* **Dependencies**:
  * `regex` (external library)
  * [models.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/models.py)

### [dictionary.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/dictionary.py)
* **Purpose**: Handles normalization of words and categorizes words by character counts.
* **Responsibility**: Provides character bucketing and Unicode normalization features on corpus words.
* **Imports**:
  * `import unicodedata`
* **Exported Classes/Functions**:
  * [Dictionary](file:///G:/My%20Drive/VS%20Code%20Projects/Project/dictionary.py#L3) (class)
* **Dependencies**:
  * [corpus.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corpus.py) (passed as parameter to methods)

### [elasticFlask.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elasticFlask.py)
* **Purpose**: Serves as a Flask web application entry point for searching/viewing documents stored in Elasticsearch.
* **Responsibility**: Defines web endpoints to query Elasticsearch index mappings and render the results page.
* **Imports**:
  * `from flask import Flask, jsonify, render_template`
  * `from es_client import create_elasticsearch_client`
* **Exported Classes/Functions**:
  * [home](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elasticFlask.py#L10) (route function)
  * [elastic_page](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elasticFlask.py#L15) (route function)
  * [get_documents](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elasticFlask.py#L20) (route function)
* **Dependencies**:
  * `flask` (external library)
  * [es_client.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/es_client.py)

### [elastic_test.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elastic_test.py)
* **Purpose**: Handles the initial index creation, deletion, and bulk loading of sentences into Elasticsearch.
* **Responsibility**: Finds local markdown files, indexes documents using a custom Corpus wrapper, and pushes actions via bulk indexing helpers.
* **Imports**:
  * `from pathlib import Path`
  * `import argparse`
  * `from elasticsearch.helpers import bulk`
  * `from corps import Corps`
  * `from es_client import create_elasticsearch_client`
* **Exported Classes/Functions**:
  * [build_document_id](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elastic_test.py#L13) (function)
  * [create_index](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elastic_test.py#L20) (function)
  * [recreate_index](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elastic_test.py#L29) (function)
  * [parse_args](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elastic_test.py#L36) (function)
  * [main](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elastic_test.py#L53) (function)
* **Dependencies**:
  * `elasticsearch` (external library)
  * [corps.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corps.py)
  * [es_client.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/es_client.py)

### [es_client.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/es_client.py)
* **Purpose**: Supplies the centralized connection parameters and client creation logic for Elasticsearch.
* **Responsibility**: Disables insecure SSL request warnings and instantiates an Elasticsearch client instance with authentication credentials.
* **Imports**:
  * `import urllib3`
  * `from elasticsearch import Elasticsearch`
* **Exported Classes/Functions**:
  * [create_elasticsearch_client](file:///G:/My%20Drive/VS%20Code%20Projects/Project/es_client.py#L11) (function)
* **Dependencies**:
  * `elasticsearch` (external library)
  * `urllib3` (external library)

### [frequency.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/frequency.py)
* **Purpose**: Computes raw/normalized frequency metrics and TF-IDF scores for the words across the corpus files.
* **Responsibility**: Tracks document counts, term frequency calculations, and computes total score distributions.
* **Imports**:
  * `import math`
* **Exported Classes/Functions**:
  * [Frequency](file:///G:/My%20Drive/VS%20Code%20Projects/Project/frequency.py#L4) (class)
* **Dependencies**:
  * [corpus.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corpus.py) (passed as parameter to methods)

### [models.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/models.py)
* **Purpose**: Defines structured data models shared throughout the project.
* **Responsibility**: Holds the read-only frozen dataclass for tracking positions of words in sentences.
* **Imports**:
  * `from dataclasses import dataclass`
* **Exported Classes/Functions**:
  * [Position](file:///G:/My%20Drive/VS%20Code%20Projects/Project/models.py#L4) (dataclass)
* **Dependencies**:
  * Python standard library `dataclasses` module.

### [reaDirectroy.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py)
* **Purpose**: Serves as the primary Flask server for the file viewer and word statistics/character-bucket APIs.
* **Responsibility**: Scans local directories for documents, instantiates the Corps object, handles static template routing, and returns JSON endpoints.
* **Imports**:
  * `import os`
  * `from pathlib import Path`
  * `from flask import Flask, jsonify, render_template`
  * `from corps import Corps`
* **Exported Classes/Functions**:
  * [home](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py#L38) (route function)
  * [get_files](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py#L42) (route function)
  * [get_file_content](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py#L52) (route function)
  * [analysis_page](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py#L75) (route function)
  * [word_frequency](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py#L79) (route function)
  * [character_buckets](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py#L90) (route function)
  * [character_bucket](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py#L120) (route function)
* **Dependencies**:
  * `flask` (external library)
  * [corps.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corps.py)

### [sentence.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/sentence.py)
* **Purpose**: Formats and reconstructs sentence contents from token indices.
* **Responsibility**: Reconstructs both "original" (exact words with punctuation) and "extracted" (normalized word lists) sentence texts.
* **Imports**:
  * None
* **Exported Classes/Functions**:
  * [build_sentence_text](file:///G:/My%20Drive/VS%20Code%20Projects/Project/sentence.py#L1) (function)
* **Dependencies**:
  * [corpus.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corpus.py) (passed as parameter to method)

---

## 3. HTML Templates

### [templates/analysis.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/analysis.html)
* **Purpose**: UI template for word frequency statistics, bucketing, and search categorizations.
* **Responsibility**: Renders the Toolbar search field, bucket configuration buttons, card layout panels, and drag-and-drop category buckets (Excluded, Yoga, Knowledge, Favorites).
* **Imports/Scripts/Links**:
  * Stylesheet: `analysis/analysis.css`
  * Scripts: `analysis/cards.js`, `analysis/render.js`, `analysis/wordManager.js`, `analysis/events.js`, `analysis/analysis.js`
* **Dependencies**: Renders via backend [reaDirectroy.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py).

### [templates/elastic.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/elastic.html)
* **Purpose**: UI template showing structured records loaded from Elasticsearch.
* **Responsibility**: Renders action buttons (Refresh Documents), connection status messages, and table container for grouped sentence outputs.
* **Imports/Scripts/Links**:
  * Stylesheet: `style.css`
  * Scripts: `elastic.js`
* **Dependencies**: Renders via backend [elasticFlask.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elasticFlask.py).

### [templates/index.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/index.html)
* **Purpose**: Home dashboard of the application showing local file directory listings.
* **Responsibility**: Shows file selector buttons, toggle buttons for Original/Extracted text views, and document content panel.
* **Imports/Scripts/Links**:
  * Stylesheet: `style.css`
  * Scripts: `main.js`
* **Dependencies**: Renders via backend [reaDirectroy.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py) or [elasticFlask.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elasticFlask.py).

---

## 4. CSS Files

### [static/style.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/style.css)
* **Purpose**: Main style adjustments for index file explorer and Elasticsearch explorer.
* **Responsibility**: Configures base page typography, flex panels (left-panel for file lists, right-panel for text contents), sentence rows, and tab toggle button layout rules.
* **Imports**: None.
* **Dependencies**: Linked from [index.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/index.html) and [elastic.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/elastic.html).

### [static/analysis/analysis.css](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.css)
* **Purpose**: Advanced stylesheet rules for the Word Analysis interface page.
* **Responsibility**: Manages reset layout rules, count cards, active toggle styling transitions, custom scrollbars, responsive columns, and absolute position mappings for pop-up frequency navigators.
* **Imports**: None.
* **Dependencies**: Linked from [analysis.html](file:///G:/My%20Drive/VS%20Code%20Projects/Project/templates/analysis.html).

---

## 5. JavaScript Files

### [static/app.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/app.js)
* **Purpose**: Old/Legacy handler for file lists loading.
* **Responsibility**: Calls `/files` endpoint, dynamically generates file items, and queries `/files/<name>` to output individual sentences.
* **Imports**: None.
* **Exported Functions**:
  * [loadFiles](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/app.js#L1) (async function)
  * [loadFile](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/app.js#L42) (async function)
* **Dependencies**: Backend endpoints `/files` and `/files/<filename>`.

### [static/elastic.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js)
* **Purpose**: Handles front-end logic for querying and listing Elasticsearch records.
* **Responsibility**: Fetches document payload list, groups entries by their file source, structures them inside a formatted table, and safely escapes inner HTML strings.
* **Imports**: None.
* **Exported Functions**:
  * [escapeHtml](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js#L5) (helper function)
  * [fetchDocuments](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js#L14) (async function)
  * [createTableHeader](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js#L28) (helper function)
  * [renderDocuments](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js#L40) (helper function)
  * [loadDocuments](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/elastic.js#L97) (async function)
* **Dependencies**: Backend endpoint `/documents`.

### [static/fileList.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileList.js)
* **Purpose**: Modern modular file lister component.
* **Responsibility**: Queries files API and populates UI directory sidebar.
* **Imports**:
  * `import { loadFile } from './fileViewer.js';`
* **Exported Functions**:
  * [loadFiles](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileList.js#L3) (async function)
* **Dependencies**:
  * [fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js)

### [static/fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js)
* **Purpose**: Modern modular file viewer component.
* **Responsibility**: Maintains active toggle state (`original` vs `extracted` view) and updates central viewer layout.
* **Imports**: None.
* **Exported Functions**:
  * [showOriginal](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js#L4) (function)
  * [showExtracted](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js#L11) (function)
  * [loadFile](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js#L18) (async function)
* **Dependencies**: Backend endpoint `/files/<filename>`.

### [static/main.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/main.js)
* **Purpose**: Exposes modular functions to global window namespace.
* **Responsibility**: Binds imported functions so inline click attributes can trigger them safely.
* **Imports**:
  * `import { loadFiles } from './fileList.js';`
  * `import { showOriginal, showExtracted } from './fileViewer.js';`
* **Exported Functions**: Exposes imported methods on window.
* **Dependencies**:
  * [fileList.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileList.js)
  * [fileViewer.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/fileViewer.js)

### [static/analysis/analysis.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.js)
* **Purpose**: Coordinates state management for the analysis dashboard.
* **Responsibility**: Tracks state variables (favorite words, excluded buckets, selected frequencies), loads frequency buckets from server endpoints, and populates the character button header.
* **Imports**: None.
* **Exported Functions**:
  * [loadBucket](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.js#L43) (async function)
  * [loadFrequency](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.js#L90) (function)
  * [buildButtons](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.js#L98) (function)
* **Dependencies**: Backend endpoint `/api/character-bucket/<count>`.

### [static/analysis/cards.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/cards.js)
* **Purpose**: Generates interactive DOM cards for words.
* **Responsibility**: Programmatically constructs card nodes, populates subcomponents (header statistics, count badges, word lists, frequency chips), and sets up event bindings.
* **Imports**: None.
* **Exported Functions**:
  * [createCountCard](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/cards.js#L5) (function)
  * [createFrequencyCard](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/cards.js#L176) (function)
  * [createWordCard](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/cards.js#L270) (function)
* **Dependencies**: Global `App` configuration object and [events.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js).

### [static/analysis/events.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js)
* **Purpose**: Binds user interaction event listeners to the generated word cards.
* **Responsibility**: Handles click (open), double click (pin), hover (preview), context menus, drag/drop starts, and navigation selections.
* **Imports**: None.
* **Exported Functions**:
  * [bindWordCardEvents](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js#L5) (function)
  * [openWord](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js#L73) (function)
  * [pinWord](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js#L89) (function)
  * [previewWord](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js#L105) (function)
  * [hidePreview](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js#L115) (function)
  * [showContextMenu](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js#L129) (function)
  * [dragStart](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js#L151) (function)
  * [dragEnd](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js#L168) (function)
  * [bindFrequencyNavigator](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/events.js#L180) (function)
* **Dependencies**: [wordManager.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/wordManager.js).

### [static/analysis/render.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js)
* **Purpose**: Renders the complete HTML interface panels on state changes.
* **Responsibility**: Cleans and rebuilds word list containers, bucket panels, context options, search sections, and preview containers.
* **Imports**: None.
* **Exported Functions**:
  * [refresh](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L5) (function)
  * [renderPage](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L16) (function)
  * [renderCards](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L39) (function)
  * [renderCountCard](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L76) (function)
  * [renderWordCard](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L89) (function)
  * [renderSidebar](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L104) (function)
  * [renderBuckets](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L115) (function)
  * [renderBucket](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L130) (function)
  * [renderToolbar](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L143) (function)
  * [renderSearch](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L154) (function)
  * [renderPreview](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L165) (function)
  * [renderContextMenu](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L176) (function)
  * [clearCards](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L187) (function)
  * [clearBuckets](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js#L199) (function)
* **Dependencies**: [cards.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/cards.js) and global `App` state.

### [static/analysis/wordManager.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/wordManager.js)
* **Purpose**: Coordinates state changes (adds, deletes, filters) for workspace objects.
* **Responsibility**: Provides utility methods for adding words to specific lists, handling category transfers, searching queries, toggling context menus, and pinning layouts.
* **Imports**: None.
* **Exported Objects**:
  * [WordManager](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/wordManager.js#L5) (object)
  * [BucketManager](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/wordManager.js#L89) (object)
  * [SearchManager](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/wordManager.js#L174) (object)
  * [PreviewManager](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/wordManager.js#L207) (object)
  * [MenuManager](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/wordManager.js#L233) (object)
  * [WorkspaceManager](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/wordManager.js#L264) (object)
* **Dependencies**: Global `App` state and [render.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/render.js).

---

## 6. JSON Files

### [.vscode/settings.json](file:///G:/My%20Drive/VS%20Code%20Projects/Project/.vscode/settings.json)
* **Purpose**: Configures workspace settings in VS Code.
* **Responsibility**: Tells VS Code to use the system default Python environment manager.
* **Imports**: None.
* **Exported Values**: JSON configurations.
* **Dependencies**: VS Code Editor environment.

---

## 7. Markdown Files
There are no markdown files stored in the project workspace itself. However, the external directory `G:\My Drive\Obsidian Daily Murli\Daily Murli` contains raw `.md` files that are loaded as data documents.

---

## 8. Static Assets
There are no additional static assets (such as images, icons, or fonts) stored in the project workspace. All UI rendering uses browser fonts and dynamic CSS shapes.

---

## 9. Configuration Files
The only configuration file inside the workspace is [.vscode/settings.json](file:///G:/My%20Drive/VS%20Code%20Projects/Project/.vscode/settings.json).

---

## 10. External Libraries

The project references the following external Python and Javascript libraries:

* **Python Libraries**:
  * `flask`: Web routing frameworks for Flask instances.
  * `elasticsearch`: Official Python client for interfacing with Elasticsearch cluster APIs.
  * `regex`: Unicode-aware pattern matching.
  * `urllib3`: Safe connection pool and certificate request handling.
* **Javascript Libraries**:
  * None. All scripts use standard Vanilla JavaScript DOM APIs.
