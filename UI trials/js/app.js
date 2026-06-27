/*
 * Avyakt Murli - Application JavaScript
 * Purpose: Manages state, loading files, event listeners, rendering the reading pane,
 * filtering search, and toggling view modes (original vs extracted points).
 */

// Mock Database of Avyakt Murlis
const MOCK_MURLIS = [
  {
    id: "murli_1969_11_15",
    title: "The Power of Silence and Purity",
    date: "15.11.1969",
    essence: "To become an angel, stabilize in your original state of silence. Purity of thoughts creates an atmosphere of peace that can transform the hearts of many soul brothers.",
    originalText: [
      "Today, Baba has come to meet His sweet, long-lost and now-found children. Every child is a point of light, a spark of the Divine. Do you experience yourselves to be these points of light? When you stabilize in your form of light, you naturally connect with the Supreme Light.",
      "The language of the mind is silence. In this world of noise, silence is your greatest power. The power of silence can reach where words cannot. It is through silence that you can transfer spiritual power and peace to other souls. Stabilize in this silence even for a few minutes throughout the day.",
      "Purity is the foundation of peace. Where there is complete purity in thoughts, words, and actions, peace becomes your natural state. Let your vision (drishti) be pure and divine. See the soul, not the body. When your vision becomes pure, your world becomes beautiful and peaceful.",
      "BapDada sees the spiritual glow on the forehead of each child. Let this glow shine constantly. Remain stable in the stage of a detached observer, and you will experience double-light stage."
    ],
    extractedPoints: {
      essence: "Stabilize in your original form of light and use the power of silence to spread peace.",
      dharna: [
        "Practice silence of the mind by slowing down the speed of your thoughts.",
        "Maintain pure vision (drishti) towards every soul, viewing them as brothers."
      ],
      blessing: "May you be a master sun of knowledge who dispels the darkness of negativity with your rays of purity.",
      slogan: "To remain double-light is the easy way to cross all obstacles with a smiling face."
    }
  },
  {
    id: "murli_1970_12_20",
    title: "Becoming an Embodiment of Love",
    date: "20.12.1970",
    essence: "Spiritual love is the key to dissolving all conflicts. When you love the Supreme Soul, you naturally inherit His virtues and become a source of love for all.",
    originalText: [
      "BapDada is looking at the jewel of love in the heart of each child. Spiritual love is a magnetic force that draws the Supreme Soul closer. This love is not physical; it is the love of a soul for the Father. It is pure, selfless, and constant.",
      "When you have true love in your heart, all tasks become easy. There is no labor where there is love. If you find any aspect of spiritual practice difficult, it means you need to increase your love for the Father. Love makes the difficult easy.",
      "Let your words be sweet and filled with love. Never speak words that hurt others. Sweetness is the ornament of a Brahmin soul. Speak less, speak softly, and speak lovingly. This is the sign of a soul who is close to BapDada.",
      "By staying in the remembrance of the One, you will naturally become an embodiment of love. Spread this love to the entire universe, for everyone is searching for true peace and love."
    ],
    extractedPoints: {
      essence: "Let true spiritual love make your spiritual efforts easy and sweeten your relationships.",
      dharna: [
        "Let your words always be sweet, soft, and beneficial to others.",
        "Keep the heart filled with the constant remembrance of the Father."
      ],
      blessing: "May you be an embodiment of love and compassion, transforming anger with your sweet vibration.",
      slogan: "To have good wishes for everyone is the true sign of being a benefactor soul."
    }
  },
  {
    id: "murli_1971_01_04",
    title: "Stabilizing in the Stage of a Detached Observer",
    date: "04.01.1971",
    essence: "By becoming a detached observer, you free yourself from the bondage of expectations and remain constantly stable, experiencing the nectar of super-sensuous joy.",
    originalText: [
      "Today, BapDada is seeing the freedom of His children. Are you truly free? A free soul is a detached observer. They observe the play of life without being colored by it. They do not get caught up in the ups and downs of circumstances.",
      "To be detached does not mean you do not care. It means you care so much that you stay in your stable stage to give strength to others. When you are entangled, you cannot help others. When you are detached, you can be a true helper.",
      "The stage of a detached observer keeps you safe from the storms of waste thoughts. When waste thoughts arise, look at them as a spectator, do not follow them. They will pass like clouds in the sky. Your mind is like a clear sky; let the sun of knowledge shine.",
      "BapDada wishes to see every child free from all bondage, including the subtle bondage of 'I' and 'Mine'. Step into the state of soul-consciousness and claim your inheritance of eternal peace."
    ],
    extractedPoints: {
      essence: "Stabilize as a detached observer to protect your energy and remain stable under all circumstances.",
      dharna: [
        "Do not get entangled in the web of waste thoughts; watch them pass by.",
        "Renounce the subtle body-conscious feelings of 'I' and 'Mine'."
      ],
      blessing: "May you be a detached observer who remains double-light, stable, and happy in all scenes of the drama.",
      slogan: "When you look at everything through the third eye of wisdom, you see benefits in every scene."
    }
  }
];

// App State
let state = {
  murlis: [],
  filteredMurlis: [],
  selectedMurliId: "",
  viewMode: "extracted", // "original" or "extracted"
  searchQuery: ""
};

/**
 * Initializes the application state, loads data, and binds UI interactions.
 */
function initializeApp() {
  console.log("Avyakt Murli Web Application Initializing...");
  
  // 1. Load mock data
  state.murlis = loadFiles();
  state.filteredMurlis = [...state.murlis];
  
  // 2. Select the first Murli by default
  if (state.murlis.length > 0) {
    state.selectedMurliId = state.murlis[0].id;
  }
  
  // 3. Render layouts
  renderSidebar();
  renderContent();
  
  // 4. Bind event listeners
  bindEvents();
}

/**
 * Simulates fetching Murli files from database.
 * @returns {Array} List of Murli objects
 */
function loadFiles() {
  return MOCK_MURLIS;
}

/**
 * Renders the sidebar file listing based on filtered Murlis.
 */
function renderSidebar() {
  const fileListContainer = document.getElementById("sidebar-file-list");
  if (!fileListContainer) return;
  
  fileListContainer.innerHTML = "";
  
  if (state.filteredMurlis.length === 0) {
    fileListContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: var(--space-lg); font-size: var(--font-sm);">
        No Murlis found matching "${state.searchQuery}"
      </div>
    `;
    return;
  }
  
  state.filteredMurlis.forEach(murli => {
    const isActive = murli.id === state.selectedMurliId;
    
    const fileItem = document.createElement("li");
    fileItem.className = `file-item ${isActive ? "active" : ""}`;
    fileItem.setAttribute("data-id", murli.id);
    
    fileItem.innerHTML = `
      <div class="file-icon-wrapper">
        <img src="assets/file.svg" alt="Murli Document" class="file-item-icon">
      </div>
      <div class="file-info">
        <span class="file-title" title="${murli.title}">${murli.title}</span>
        <span class="file-date">${murli.date}</span>
      </div>
    `;
    
    fileListContainer.appendChild(fileItem);
  });
}

/**
 * Renders the active Murli in the main content viewport.
 */
function renderContent() {
  const activeMurli = state.murlis.find(m => m.id === state.selectedMurliId);
  const contentViewport = document.getElementById("content-viewport");
  const toolbarTitle = document.getElementById("toolbar-title");
  
  if (!activeMurli || !contentViewport) return;
  
  // Update toolbar status
  if (toolbarTitle) {
    toolbarTitle.textContent = `Reading: ${activeMurli.title}`;
  }
  
  // Build main html structure
  let html = `
    <div class="reading-container">
      
      <!-- Murli Header Section -->
      <header class="murli-header-container">
        <h1 class="murli-title">${activeMurli.title}</h1>
        <div class="murli-meta-info">
          <div class="meta-item">
            <img src="assets/icons/calendar.svg" alt="" class="meta-icon" style="display:none;"> <!-- Graceful fallback helper -->
            <span>Spoken date: <strong>${activeMurli.date}</strong></span>
          </div>
          <div class="meta-item">
            <span>Speaker: <strong>Avyakt BapDada</strong></span>
          </div>
        </div>
      </header>

      <!-- Spiritual Divider -->
      <div class="spiritual-divider">
        <img src="assets/lotus.svg" alt="Lotus Flower Symbol" class="spiritual-divider-icon">
      </div>
  `;
  
  if (state.viewMode === "original") {
    // RENDER ORIGINAL TEXT (PARAGRAPHS)
    html += `
      <section class="murli-body-text">
        <div class="essence-block">
          <h3 class="essence-title">Essence / Nectar</h3>
          <p class="essence-content">“${activeMurli.essence}”</p>
        </div>
    `;
    
    activeMurli.originalText.forEach(paragraph => {
      html += `<p class="murli-paragraph">${paragraph}</p>`;
    });
    
    html += `</section>`;
    
  } else {
    // RENDER EXTRACTED SPIRITUAL POINTS
    html += `
      <section class="extracted-points-container">
        
        <!-- Essence Panel Card -->
        <div class="card-panel">
          <div class="corner-decorator corner-top-left"></div>
          <div class="corner-decorator corner-top-right"></div>
          <h3 class="highlight-box-title">Essence of Murli</h3>
          <p class="essence-paragraph">
            “${activeMurli.extractedPoints.essence}”
          </p>
        </div>

        <!-- Dharna Points List -->
        <div class="spiritual-highlight-box">
          <h3 class="highlight-box-title">Points for Dharna (Spiritual Practice)</h3>
          <ul class="dharna-list">
            ${activeMurli.extractedPoints.dharna.map(point => `
              <li>${point}</li>
            `).join('')}
          </ul>
        </div>

        <!-- Blessing and Slogan cards -->
        <div class="cards-row">
          
          <!-- Blessing Card -->
          <div class="card-murli">
            <div class="card-murli-header">
              <span class="card-murli-date">Blessing</span>
              <span class="card-murli-badge">Varadan</span>
            </div>
            <p class="card-murli-excerpt">
              ${activeMurli.extractedPoints.blessing}
            </p>
          </div>

          <!-- Slogan Card -->
          <div class="card-murli">
            <div class="card-murli-header">
              <span class="card-murli-date">Slogan</span>
              <span class="card-murli-badge">Slogan</span>
            </div>
            <p class="card-murli-excerpt">
              ${activeMurli.extractedPoints.slogan}
            </p>
          </div>

        </div>

      </section>
    `;
  }
  
  // Close container & add Footer
  html += `
      <!-- Spiritual Footer inside Reading Panel -->
      <footer class="app-footer">
        <p class="footer-quote">“To remain double-light is the easy way to be a self-sovereign.”</p>
        <div class="footer-credits">AVYAKT MURLI APPS &copy; 2026</div>
        <div class="footer-benediction">Om Shanti</div>
      </footer>
      
    </div> <!-- Close reading-container -->
    
    <!-- Rotating lotus background illustration decoration -->
    <img src="assets/lotus.svg" alt="" class="floating-lotus-bg">
  `;
  
  contentViewport.innerHTML = html;
  
  // Scroll to top of content pane
  contentViewport.scrollTop = 0;
}

/**
 * Binds DOM event listeners.
 */
function bindEvents() {
  // 1. Sidebar File Selection clicks
  const sidebarFileList = document.getElementById("sidebar-file-list");
  if (sidebarFileList) {
    sidebarFileList.addEventListener("click", function(e) {
      const fileItem = e.target.closest(".file-item");
      if (fileItem) {
        const id = fileItem.getAttribute("data-id");
        state.selectedMurliId = id;
        
        // Re-render sidebar items to update active status
        const items = sidebarFileList.querySelectorAll(".file-item");
        items.forEach(item => item.classList.remove("active"));
        fileItem.classList.add("active");
        
        renderContent();
        
        // On mobile, automatically close sidebar after choosing a file
        const sidebar = document.getElementById("app-sidebar");
        if (sidebar && sidebar.classList.contains("active")) {
          sidebar.classList.remove("active");
        }
      }
    });
  }
  
  // 2. Search Box Input
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function(e) {
      const query = e.target.value;
      searchFiles(query);
    });
  }
  
  // 3. Toggle Original / Extracted Points Mode
  const toggleOriginal = document.getElementById("toggle-view-original");
  const toggleExtracted = document.getElementById("toggle-view-extracted");
  
  if (toggleOriginal && toggleExtracted) {
    toggleOriginal.addEventListener("click", () => {
      toggleOriginalExtracted("original");
    });
    toggleExtracted.addEventListener("click", () => {
      toggleOriginalExtracted("extracted");
    });
  }
  
  // 4. Mobile Drawer Toggler (Hamburger menu button)
  const menuToggleBtn = document.getElementById("btn-menu-toggle");
  const sidebar = document.getElementById("app-sidebar");
  if (menuToggleBtn && sidebar) {
    menuToggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }
}

/**
 * Toggles the view mode between original prose paragraphs and extracted cards.
 * @param {string} mode - "original" or "extracted"
 */
function toggleOriginalExtracted(mode) {
  if (mode !== "original" && mode !== "extracted") return;
  
  state.viewMode = mode;
  
  // Update toggle classes
  const toggleOriginal = document.getElementById("toggle-view-original");
  const toggleExtracted = document.getElementById("toggle-view-extracted");
  
  if (toggleOriginal && toggleExtracted) {
    if (mode === "original") {
      toggleOriginal.classList.add("active");
      toggleExtracted.classList.remove("active");
    } else {
      toggleOriginal.classList.remove("active");
      toggleExtracted.classList.add("active");
    }
  }
  
  renderContent();
}

/**
 * Filters files based on search queries and re-renders lists.
 * @param {string} query - The search query string
 */
function searchFiles(query) {
  state.searchQuery = query.trim().toLowerCase();
  
  if (state.searchQuery === "") {
    state.filteredMurlis = [...state.murlis];
  } else {
    state.filteredMurlis = state.murlis.filter(murli => 
      murli.title.toLowerCase().includes(state.searchQuery) ||
      murli.date.includes(state.searchQuery) ||
      murli.essence.toLowerCase().includes(state.searchQuery)
    );
  }
  
  renderSidebar();
}

// Attach listener to trigger startup when DOM is fully built
document.addEventListener("DOMContentLoaded", initializeApp);
