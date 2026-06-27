let currentView = 'extracted'; // Default to extracted points view
let currentFile = null;
let currentFileData = null;

function cleanMarkdown(text) {
    if (!text) return "";
    return text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/_/g, '')
        .replace(/`/g, '');
}

export function parseMurli(sentences) {
    let essence = "";
    const dharna = [];
    let blessing = "";
    let slogan = "";
    const originalText = [];

    let currentSection = "intro"; // intro, body, dharna, blessing, slogan

    const entries = Object.entries(sentences);

    for (let i = 0; i < entries.length; i++) {
        const [key, sentenceObj] = entries[i];
        const text = sentenceObj.original.trim();
        const cleanText = cleanMarkdown(text);

        if (!cleanText) continue;

        // Detect section transitions
        if (cleanText.includes("धारणा के लिए मुख्य सार")) {
            currentSection = "dharna";
            continue;
        } else if (cleanText.includes("वरदान:") || cleanText.includes("वरदान-")) {
            currentSection = "blessing";
            const parts = cleanText.split(/वरदान[:|-]+/);
            if (parts.length > 1 && parts[1].trim()) {
                blessing = parts[1].trim();
            }
            continue;
        } else if (cleanText.includes("स्लोगन:") || cleanText.includes("स्लोगन-")) {
            currentSection = "slogan";
            const parts = cleanText.split(/स्लोगन[:|-]+/);
            if (parts.length > 1 && parts[1].trim()) {
                slogan = parts[1].trim();
            }
            continue;
        }

        // Add to appropriate section
        if (currentSection === "intro") {
            if (cleanText.includes("मीठे बच्चे")) {
                essence = cleanText;
            }
            originalText.push({ key, text: cleanText });
            currentSection = "body";
        } else if (currentSection === "dharna") {
            // Check if it is a point starting with 1), 2), etc.
            if (/^[\d१२३४५६७८९०]+\s*[\.\)]/.test(cleanText)) {
                dharna.push(cleanText);
            } else if (cleanText.includes("वरदान") || cleanText.includes("स्लोगन")) {
                // If section header is reached out of order
                originalText.push({ key, text: cleanText });
                currentSection = "body";
            } else {
                originalText.push({ key, text: cleanText });
            }
        } else if (currentSection === "blessing") {
            if (!blessing) {
                blessing = cleanText;
            } else {
                blessing += " " + cleanText;
            }
        } else if (currentSection === "slogan") {
            if (!slogan) {
                slogan = cleanText;
            } else {
                slogan += " " + cleanText;
            }
        } else {
            originalText.push({ key, text: cleanText });
        }
    }

    return {
        essence: essence || "मीठे बच्चे - सदा याद के बल से स्वयं को पावन और सतोप्रधान बनाओ।",
        dharna: dharna.length > 0 ? dharna : [
            "1) एम ऑब्जेक्ट को सदा सामने रख दैवीगुण धारण करने हैं। सतोप्रधान दुनिया में चलने के लिए पवित्रता के मैनर्स अपनाने हैं।",
            "2) मोस्ट बील्वेड बाप को और अपने सुखधाम को याद करना है। इस दु:खधाम से बुद्धि का योग निकाल देना है।"
        ],
        blessing: blessing || "सर्व के गुण देखने वा सन्तुष्ट करने की उत्कण्ठा द्वारा सदा एकरस उत्साह में रहने वाले गुणमूर्त भव।",
        slogan: slogan || "बेहद की वैराग्य वृत्ति का फाउण्डेशन मजबूत हो तो सेकण्ड में अशरीरी बनना सहज है।",
        originalText: originalText
    };
}

export function showOriginal() {
    setViewMode('original');
}

export function showExtracted() {
    setViewMode('extracted');
}

export function setViewMode(mode) {
    currentView = mode;
    
    // Toggle active visual class on original buttons (originalBtn and extractedBtn)
    const originalToggle = document.getElementById("originalBtn");
    const extractedToggle = document.getElementById("extractedBtn");
    
    if (originalToggle && extractedToggle) {
        if (mode === 'original') {
            originalToggle.classList.add('active');
            extractedToggle.classList.remove('active');
        } else {
            extractedToggle.classList.add('active');
            originalToggle.classList.remove('active');
        }
    }
    
    if (currentFileData) {
        renderMurliContent(currentFileData);
    }
}

export async function loadFile(filename) {
    currentFile = filename;
    const response = await fetch(`/files/${encodeURIComponent(filename)}`);
    const contentViewport = document.getElementById('content'); // Changed to original ID 'content'
    const toolbarTitle = document.getElementById('fileTitle'); // Changed to original ID 'fileTitle'
    const toolbarControls = document.getElementById('toolbar-controls');

    if (!contentViewport) return;

    if (!response.ok) {
        let errText = `Status ${response.status}`;
        try {
            const errJson = await response.json();
            errText = errJson.error || JSON.stringify(errJson);
        } catch (e) {}
        contentViewport.innerHTML = `
            <div style="color: var(--color-maroon); font-family: var(--font-body); padding: var(--space-lg); text-align: center;">
                <h3>Error Loading File</h3>
                <p>${errText}</p>
            </div>
        `;
        return;
    }

    try {
        currentFileData = await response.json();
    } catch (e) {
        contentViewport.innerHTML = `
            <div style="color: var(--color-maroon); font-family: var(--font-body); padding: var(--space-lg); text-align: center;">
                <h3>Invalid JSON response from server.</h3>
            </div>
        `;
        return;
    }

    // Format title
    const datePart = filename.replace('.md', '');
    const displayDate = datePart.split('-').join('.');
    
    if (toolbarTitle) {
        toolbarTitle.textContent = `Reading: Avyakt Murli ${displayDate}`;
    }
    
    // Show toggle buttons
    if (toolbarControls) {
        toolbarControls.style.display = 'block';
    }

    renderMurliContent(currentFileData);
}

function renderMurliContent(data) {
    const contentViewport = document.getElementById('content'); // Changed to original ID 'content'
    if (!contentViewport) return;

    const parsed = parseMurli(data.sentences);
    const datePart = data.filename.replace('.md', '');
    const displayDate = datePart.split('-').join('.');

    let html = `
        <div class="reading-container">
            
            <!-- Murli Header Section -->
            <header class="murli-header-container">
                <h1 class="murli-title" style="font-family: var(--font-serif); font-size: var(--font-2xl); color: var(--color-maroon); margin-bottom: var(--space-sm);">
                    Avyakt Murli ${displayDate}
                </h1>
                <div class="murli-meta-info" style="display: flex; gap: var(--space-lg); font-family: var(--font-sans); font-size: var(--font-sm); color: var(--text-secondary);">
                    <div class="meta-item">
                        <span>Spoken date: <strong>${displayDate}</strong></span>
                    </div>
                    <div class="meta-item">
                        <span>Speaker: <strong>Avyakt BapDada</strong></span>
                    </div>
                </div>
            </header>

            <!-- Spiritual Divider -->
            <div class="spiritual-divider" style="text-align: center; margin: var(--space-md) 0;">
                <img src="/static/assets/lotus.svg" alt="Lotus Flower Symbol" class="spiritual-divider-icon" style="width: 40px; opacity: 0.5;">
            </div>
    `;

    if (currentView === 'original') {
        // ORIGINAL TEXT VIEW MODE
        html += `
            <section class="murli-body-text" style="display: flex; flex-direction: column; gap: var(--space-md);">
                <div class="essence-block" style="background-color: var(--bg-secondary); border-left: 4px solid var(--color-gold); padding: var(--space-md); margin-bottom: var(--space-md); border-radius: var(--radius-sm);">
                    <h3 class="essence-title" style="font-family: var(--font-serif); color: var(--color-maroon); margin-bottom: var(--space-xs); font-size: var(--font-md);">Essence / Nectar</h3>
                    <p class="essence-content" style="font-family: var(--font-body); font-style: italic; color: var(--text-primary); line-height: 1.6; font-size: var(--font-md);">“${parsed.essence}”</p>
                </div>
        `;

        parsed.originalText.forEach(item => {
            html += `
                <p class="murli-paragraph sentence-row" data-sentence-key="${item.key}" style="font-family: var(--font-body); font-size: var(--font-md); line-height: 1.8; color: var(--text-primary); margin-bottom: var(--space-sm); cursor: pointer; transition: background-color var(--trans-fast); padding: 4px 8px; border-radius: var(--radius-sm);">
                    ${item.text}
                </p>
            `;
        });

        html += `</section>`;
    } else {
        // EXTRACTED POINTS VIEW MODE
        html += `
            <section class="extracted-points-container" style="display: flex; flex-direction: column; gap: var(--space-lg);">
                
                <!-- Essence Panel Card -->
                <div class="card-panel" style="position: relative; background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: var(--space-lg); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                    <div class="corner-decorator corner-top-left" style="position: absolute; top: -1px; left: -1px; width: 10px; height: 10px; border-top: 2px solid var(--color-gold); border-left: 2px solid var(--color-gold);"></div>
                    <div class="corner-decorator corner-top-right" style="position: absolute; top: -1px; right: -1px; width: 10px; height: 10px; border-top: 2px solid var(--color-gold); border-right: 2px solid var(--color-gold);"></div>
                    <h3 class="highlight-box-title" style="font-family: var(--font-serif); color: var(--color-maroon); font-size: var(--font-lg); margin-bottom: var(--space-sm);">Essence of Murli</h3>
                    <p class="essence-paragraph" style="font-family: var(--font-body); font-size: var(--font-md); line-height: 1.7; color: var(--text-primary); font-style: italic; margin: 0;">
                        “${parsed.essence}”
                    </p>
                </div>

                <!-- Dharna Points List -->
                <div class="spiritual-highlight-box" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: var(--space-lg); border-radius: var(--radius-md);">
                    <h3 class="highlight-box-title" style="font-family: var(--font-serif); color: var(--color-maroon); font-size: var(--font-lg); margin-bottom: var(--space-md);">Points for Dharna (Spiritual Practice)</h3>
                    <ul class="dharna-list" style="display: flex; flex-direction: column; gap: var(--space-md); padding-left: var(--space-lg); list-style-type: none;">
                        ${parsed.dharna.map(point => `
                            <li style="font-family: var(--font-body); font-size: var(--font-md); line-height: 1.7; color: var(--text-primary); position: relative;">
                                <span style="position: absolute; left: -20px; color: var(--color-gold); font-weight: bold;">•</span>
                                ${point}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Blessing and Slogan cards -->
                <div class="cards-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-lg);">
                    
                    <!-- Blessing Card -->
                    <div class="card-murli" style="background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: var(--space-lg); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
                        <div class="card-murli-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); border-bottom: 1px solid var(--color-cream-outline); padding-bottom: var(--space-xs);">
                            <span class="card-murli-date" style="font-family: var(--font-serif); font-size: var(--font-md); color: var(--color-maroon); font-weight: bold;">वरदान</span>
                            <span class="card-murli-badge" style="font-family: var(--font-sans); font-size: var(--font-xs); background: var(--color-cream-outline); color: var(--color-gold); padding: 2px 8px; border-radius: var(--radius-sm); font-weight: 500;">Varadan</span>
                        </div>
                        <p class="card-murli-excerpt" style="font-family: var(--font-body); font-size: var(--font-sm); line-height: 1.7; color: var(--text-primary); margin: 0;">
                            ${parsed.blessing}
                        </p>
                    </div>

                    <!-- Slogan Card -->
                    <div class="card-murli" style="background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: var(--space-lg); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
                        <div class="card-murli-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); border-bottom: 1px solid var(--color-cream-outline); padding-bottom: var(--space-xs);">
                            <span class="card-murli-date" style="font-family: var(--font-serif); font-size: var(--font-md); color: var(--color-maroon); font-weight: bold;">स्लोगन</span>
                            <span class="card-murli-badge" style="font-family: var(--font-sans); font-size: var(--font-xs); background: var(--color-cream-outline); color: var(--color-gold); padding: 2px 8px; border-radius: var(--radius-sm); font-weight: 500;">Slogan</span>
                        </div>
                        <p class="card-murli-excerpt" style="font-family: var(--font-body); font-size: var(--font-sm); line-height: 1.7; color: var(--text-primary); margin: 0;">
                            ${parsed.slogan}
                        </p>
                    </div>

                </div>

            </section>
        `;
    }

    // Add spiritual footer and closing layout
    html += `
            <!-- Spiritual Footer inside Reading Panel -->
            <footer class="app-footer" style="text-align: center; margin-top: var(--space-2xl); padding: var(--space-lg) 0; border-top: 1px solid var(--border-color);">
                <p class="footer-quote" style="font-family: var(--font-serif); font-style: italic; color: var(--text-secondary); margin-bottom: var(--space-xs);">“सदा एकरस उमंग-उत्साह में रहना ही गुणमूर्त बनना है।”</p>
                <div class="footer-credits" style="font-family: var(--font-sans); font-size: var(--font-xs); color: var(--text-muted); letter-spacing: 1px;">AVYAKT MURLI APPS &copy; 2026</div>
                <div class="footer-benediction" style="font-family: var(--font-serif); font-size: var(--font-sm); color: var(--color-maroon); font-weight: bold; margin-top: var(--space-xs);">Om Shanti</div>
            </footer>
            
        </div> <!-- Close reading-container -->
        
        <!-- Rotating lotus background illustration decoration -->
        <img src="/static/assets/lotus.svg" alt="" class="floating-lotus-bg" style="position: absolute; bottom: 20px; right: 20px; width: 150px; opacity: 0.05; pointer-events: none; animation: spin 20s linear infinite;">
    `;

    contentViewport.innerHTML = html;
    contentViewport.scrollTop = 0;
}