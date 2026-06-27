# Living Entities: Project Object Lifecycle & Interaction Analysis

This document analyzes the objects in the project as active, living entities. Instead of looking at classes statically, we trace how they are born, how their states transform, who owns them, how they communicate across network boundaries, how they display themselves to the user, and how they eventually die.

---

## 1. Backend Entities

### 1.1 `Corps` (The Orchestrator)

- **Birth**: Born during startup in the global module scope of [reaDirectroy.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py#L22) (line 22) as `CORPS`, and in the `main` script thread of [elastic_test.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elastic_test.py#L79) (line 79) as `corps`.
- **Initialization**: Initializes in its `__init__` constructor [corps.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corps.py#L10) (line 10) by bringing to life its three dependent subsystems: `Corpus`, `Frequency`, and `Dictionary`.
- **Ownership**: Owned by the main running thread of the server process (`reaDirectroy.py`) or the execution script (`elastic_test.py`). It remains in scope as long as the parent process lives.
- **Transformations**: 
  - Starts as a shell containing empty helper components.
  - Transforms into a loaded, ready state once the `load_words` and `build` pipeline methods execute, linking the internal structures of its child instances.
- **Interactions**: Calls and orchestrates methods across its components: `corpus.load_words()`, `corpus.build_word_index()`, `dictionary.build_normalized_words()`, `sentence.build_sentence_text()`, and `frequency.build_frequency()`.
- **Serialization/Deserialization**: Does not serialize itself. It functions purely as an in-memory coordinator.
- **Transfer between Backend and Frontend**: Never leaves the backend memory space.
- **Representation in the UI**: Does not have a direct visual representation, but acts as the data provider for all UI components.
- **Updates during User Interaction**: Stays read-only after initialization, serving incoming HTTP queries.
- **End of Lifecycle**: Discarded and garbage collected when the Flask server stops or when `elastic_test.py` finishes execution.

---

### 1.2 `Corpus` (The Memory Bank)

- **Birth**: Born inside the `Corps` constructor in [corps.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corps.py#L12) (line 12).
- **Initialization**: Sets up ten empty fields (mappings, lists, trees) in [corpus.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corpus.py#L8) to prepare for data ingestion.
- **Ownership**: Owned entirely by its parent `Corps` instance.
- **Transformations**:
  - **Phase 1: Raw Ingestion**: `load_words` reads text files, tokenizes them, and populates `files` and `file_ids`.
  - **Phase 2: Indexing**: `build_word_index`, `build_separated_word_index`, and `build_extracted_word_index` split punctuation and normalize letters.
  - **Phase 3: Segmentation**: `build_sentence_index` identifies boundaries, and `build_sentence_text` joins ranges into readable sentences.
  - **Phase 4: Linking**: `build_word_sentence_index` links occurrences using `Position` dataclasses.
  - **Phase 5: Document Creation**: `build_documents` compiles records for Elasticsearch.
- **Interactions**: 
  - Supplies data to `Dictionary.build_normalized_words()` and `Frequency` methods.
  - Feeds sentences to `sentence.build_sentence_text()`.
- **Serialization/Deserialization**: 
  - `build_documents` serializes internal dictionary structures into a list of JSON-like document maps.
  - These documents are serialized into JSON bulk payloads by the Elasticsearch helper and sent to the database.
- **Transfer between Backend and Frontend**: 
  - File sentences are transferred as JSON via `/files/<filename>`.
  - Compiled documents are transferred from Elasticsearch via `/documents`.
- **Representation in the UI**:
  - Rendered as lists in the left sidebar and as text segments in the main viewing panel of the file viewer.
  - Displays as data rows in the Elasticsearch viewer.
- **Updates during User Interaction**: Stays static after startup, responding to read-only route queries.
- **End of Lifecycle**: Discarded along with the parent `Corps` instance on process exit.

---

### 1.3 `Frequency` (The Statistical Engine)

- **Birth**: Born inside the `Corps` constructor in [corps.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corps.py#L13) (line 13).
- **Initialization**: Begins as four empty dictionaries in [frequency.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/frequency.py#L6) to store metrics like counts and TF-IDF scores.
- **Ownership**: Owned by the parent `Corps` instance.
- **Transformations**:
  - `build_frequency` computes word count aggregates from the corpus word index.
  - `build_normalized_frequency` groups words by their root extracted forms.
  - `build_tfidf` and `build_normalized_tfidf` compute inverse document frequency (IDF) and relevance scores.
- **Interactions**: Reads indices and file structures from the `Corpus` instance.
- **Serialization/Deserialization**: Serialized into JSON formats for API endpoints (e.g., sorting word frequency tuples).
- **Transfer between Backend and Frontend**: Transferred to the browser via `/api/word-frequency`.
- **Representation in the UI**: Renders on the Word Analysis page as statistics and lists of words.
- **Updates during User Interaction**: Unchanged after server start; serves statistical lookups.
- **End of Lifecycle**: Destroyed when the python process exits.

---

### 1.4 `Dictionary` (The Lexical Bucketer)

- **Birth**: Born inside the `Corps` constructor in [corps.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corps.py#L14) (line 14).
- **Initialization**: Instantiates two empty mappings (`normalized_words`, `by_character_count`) in [dictionary.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/dictionary.py#L5).
- **Ownership**: Owned by the parent `Corps` instance.
- **Transformations**:
  - `build_normalized_words` uses Unicode NFC normalization to clean tokens.
  - `build_character_bucket` groups these normalized terms into lists based on word length.
- **Interactions**: Reads token maps from the `Corpus` instance.
- **Serialization/Deserialization**: Serializes character-bucket word-frequency structures into JSON objects.
- **Transfer between Backend and Frontend**: Transferred via the `/api/character-bucket/<count>` endpoint.
- **Representation in the UI**: Controls the character count buttons ("1 Character", "2 Character") and populates count cards.
- **Updates during User Interaction**: Computes character buckets on demand when a user clicks a length filter button.
- **End of Lifecycle**: Destroyed at server shutdown.

---

### 1.5 `Position` (The Location Reference)

- **Birth**: Born inside `Corpus.build_word_sentence_index` in [corpus.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/corpus.py#L307) (line 307).
- **Initialization**: Set up with fixed values: `file_id`, `sentence_key`, and `position`.
- **Ownership**: Owned by the `Corpus` instance, which stores them inside the `word_sentence_index` dictionary.
- **Transformations**: Being a frozen dataclass, it remains immutable and does not change state.
- **Interactions**: Accessed by index queries to find where words appear in sentences.
- **Serialization/Deserialization**: Not serialized; used only for internal memory operations.
- **Transfer between Backend and Frontend**: Stays on the backend.
- **Representation in the UI**: Indirectly helps highlight matched terms in sentences.
- **Updates during User Interaction**: None.
- **End of Lifecycle**: Discarded when `Corpus` is destroyed.

---

### 1.6 `Flask Application` (The Gateway)

- **Birth**: Born when the `Flask(__name__)` instance is created in [reaDirectroy.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/reaDirectroy.py#L6) (line 6) and [elasticFlask.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/elasticFlask.py#L4) (line 4).
- **Initialization**: Configures routing, registers route handlers, and sets up static and template pathways.
- **Ownership**: Owned by the main process thread.
- **Transformations**: Starts as an unconfigured template and transitions to an active listener socket when `app.run()` executes.
- **Interactions**: Uses `CORPS` or the Elasticsearch client to fetch data, formatting it into HTTP responses for the browser.
- **Serialization/Deserialization**: Serializes Python dicts and lists into JSON HTTP payloads using `jsonify()`.
- **Transfer between Backend and Frontend**: Connects the backend and frontend by serving files and APIs over HTTP.
- **Representation in the UI**: Renders pages using Jinja templates (`index.html`, `analysis.html`, `elastic.html`).
- **Updates during User Interaction**: Processes incoming HTTP requests triggered by user actions.
- **End of Lifecycle**: Stopped when the terminal process receives a close or terminate signal.

---

### 1.7 `Elasticsearch Client` (The Connection Manager)

- **Birth**: Born inside `create_elasticsearch_client()` in [es_client.py](file:///G:/My%20Drive/VS%20Code%20Projects/Project/es_client.py#L11) (line 11).
- **Initialization**: Configures connection parameters like host URLs and security credentials.
- **Ownership**: Owned by the execution scripts (`elastic_test.py` or `elasticFlask.py`).
- **Transformations**: Maintains the connection pool to the database during operations.
- **Interactions**: Receives data from the `Corpus` pipeline and writes index settings to the cluster.
- **Serialization/Deserialization**: Formats document objects into JSON payloads for Elasticsearch APIs.
- **Transfer between Backend and Frontend**: Communicates with the cluster, returning document records to Flask endpoints.
- **Representation in the UI**: Feeds search results to the Elasticsearch viewer.
- **Updates during User Interaction**: Executes queries when the user clicks "Refresh Documents".
- **End of Lifecycle**: Closed when the server process shuts down.

---

## 2. Frontend Entities

### 2.1 `App` (The Frontend Central State)

- **Birth**: Created globally on script execution in [static/analysis/analysis.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/analysis.js#L1) (line 1).
- **Initialization**: Sets up initial placeholders for state tracking (word selections, active filters, UI states).
- **Ownership**: Owned by the browser window context.
- **Transformations**:
  - `loadBucket` updates the state with data from the API, grouping words by frequency.
  - Updates word lists and UI states when managers mutate its values.
- **Interactions**: Updates the DOM when state changes trigger a page redraw.
- **Serialization/Deserialization**: Parsed from incoming JSON responses from Flask endpoints.
- **Transfer between Backend and Frontend**: Created on the frontend; populated by data fetched from the backend.
- **Representation in the UI**: Controls the entire layout of the Word Analysis dashboard.
- **Updates during User Interaction**: Mutated by the manager components on user clicks, hovers, searches, and drag events.
- **End of Lifecycle**: Terminated when the browser tab is closed or reloaded.

---

### 2.2 Frontend Managers (The Mutators)

This namespace includes `WordManager`, `BucketManager`, `SearchManager`, `PreviewManager`, `MenuManager`, and `WorkspaceManager` defined in [static/analysis/wordManager.js](file:///G:/My%20Drive/VS%20Code%20Projects/Project/static/analysis/wordManager.js#L5).

- **Birth**: Declared globally in the browser when `wordManager.js` loads.
- **Initialization**: Instantiated as stateless method namespaces.
- **Ownership**: Owned by the global JavaScript scope in the browser.
- **Transformations**: Do not hold state; they function as clean mutator interfaces.
- **Interactions**: Receive events from `events.js`, modify `App` state values, and call `refresh()` to update the UI.
- **Serialization/Deserialization**: Format parameter strings for operations (e.g. tracking pinned items).
- **Transfer between Backend and Frontend**: Run locally in the browser.
- **Representation in the UI**: 
  - Manage visual states like card styling, drop zone locations, search filters, and menus.
- **Updates during User Interaction**:
  - `WordManager`: Updates active word categories on mouse clicks.
  - `BucketManager`: Updates custom buckets on drag-and-drop actions.
  - `SearchManager`: Updates search filters as the user types.
  - `PreviewManager`: Controls card tooltips on mouse hover.
  - `MenuManager`: Renders options on right-click.
- **End of Lifecycle**: Unloaded and discarded when the page is closed.

---

## 3. Unified Lifecycle Diagram

This diagram traces the flow of all objects from system startup to browser rendering, showing how data transforms and moves through the application.

```mermaid
flowchart TB
    %% Definitions
    subgraph BE_Process ["Backend Process (Startup & Ingestion)"]
        direction TB
        Start([Process Start: reaDirectroy.py / elastic_test.py])
        
        %% Object instantiation
        C_Init["1. Corps Instance Born (corps.py)"]
        Corp_Init["2. Corpus Instance Born (corpus.py)"]
        Freq_Init["3. Frequency Instance Born (frequency.py)"]
        Dict_Init["4. Dictionary Instance Born (dictionary.py)"]
        
        Start --> C_Init
        C_Init --> Corp_Init & Freq_Init & Dict_Init
        
        %% Pipeline Execution
        subgraph Pipeline ["Ingestion & Transformation Pipeline"]
            direction TB
            Ingest["load_words(): Raw Files -> Corpus.files & file_ids"]
            WordsIdx["build_word_index(): Corpus.word_index"]
            SepIdx["build_separated_word_index(): Corpus.separated_words"]
            ExtIdx["build_extracted_word_index(): Corpus.extracted_words"]
            NormDict["build_normalized_words(): Dictionary.normalized_words"]
            SentIdx["build_sentence_index(): Corpus.sentence_index"]
            SentTxt["build_sentence_text(): Corpus.sentences (Reconstruction)"]
            PosDC["build_word_sentence_index(): Position Dataclass Created"]
            Freqs["build_frequency() & build_tfidf(): Frequency metrics computed"]
            Docs["build_documents(): Elasticsearch document records compiled"]
            
            Ingest --> WordsIdx --> SepIdx --> ExtIdx --> NormDict --> SentIdx --> SentTxt --> PosDC --> Freqs --> Docs
        end
        
        Corp_Init & Freq_Init & Dict_Init --> Pipeline
    end

    %% Storage/Persistence Boundary
    subgraph Data_Services ["Data & Hosting Services"]
        direction TB
        ES_Client["Elasticsearch Client (es_client.py)"]
        ES_Index[("Elasticsearch DB ('murli' Index)")]
        Flask_Server["Flask Application (reaDirectroy.py / elasticFlask.py)"]
        
        ES_Client -->|recreate & bulk_index| ES_Index
        Flask_Server -->|Reads in-memory data| BE_Process
        Flask_Server -->|Search query| ES_Client
    end

    Pipeline -->|documents list| ES_Client
    
    %% Network Transfer
    subgraph Network_Transfer ["HTTP Network Boundary"]
        direction LR
        API_Files["GET /files & /files/<name>"]
        API_Bucket["GET /api/character-bucket/<count>"]
        API_Docs["GET /documents"]
    end
    
    Flask_Server --> API_Files & API_Bucket & API_Docs

    %% Frontend Browser Space
    subgraph FE_Browser ["Client-Side Browser (Frontend)"]
        direction TB
        HTML_Load["Page Load: Render HTML/CSS/JS Templates"]
        
        AppState["App State Object (analysis.js)"]
        
        subgraph Managers ["State Mutators (wordManager.js)"]
            WM["WordManager"]
            BM["BucketManager"]
            SM["SearchManager"]
            PM["PreviewManager"]
            MM["MenuManager"]
        end
        
        subgraph DOM_UI ["Browser DOM Interface"]
            ButtonUI["Character Bucket Buttons"]
            SidebarUI["Files & Sidebar List"]
            CardsUI["Word Cards (Draggable)"]
            ZoneUI["Drop Buckets (Yoga, Knowledge, Favorites)"]
        end
        
        HTML_Load --> AppState
        AppState --> DOM_UI
        
        %% Event flow
        DOM_UI -->|UI Events: Drag/Click/Type| Managers
        Managers -->|Mutates state fields| AppState
        AppState -->|refresh() / renderPage()| DOM_UI
    end
    
    API_Files -->|JSON Sentences| HTML_Load
    API_Bucket -->|JSON Groups| AppState
    API_Docs -->|JSON Documents| HTML_Load
    
    %% Styles
    classDef be fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    classDef db fill:#efebe9,stroke:#5d4037,stroke-width:2px;
    classDef fe fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;
    classDef net fill:#fff3e0,stroke:#f57c00,stroke-width:2px;
    
    class Start,C_Init,Corp_Init,Freq_Init,Dict_Init,Pipeline,Ingest,WordsIdx,SepIdx,ExtIdx,NormDict,SentIdx,SentTxt,PosDC,Freqs,Docs be;
    class ES_Client,ES_Index,Flask_Server db;
    class Network_Transfer,API_Files,API_Bucket,API_Docs net;
    class HTML_Load,AppState,Managers,WM,BM,SM,PM,MM,DOM_UI,ButtonUI,SidebarUI,CardsUI,ZoneUI fe;
```
