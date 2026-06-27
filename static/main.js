import { loadFiles, filterFiles } from './fileList.js';
import { showOriginal, showExtracted } from './fileViewer.js';

// Bind global functions to window for any legacy/direct HTML call fallbacks
window.loadFiles = loadFiles;
window.showOriginal = showOriginal;
window.showExtracted = showExtracted;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Automatically load file list from API on startup
    loadFiles();

    // 2. Bind search input listener
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            filterFiles(e.target.value);
        });
    }

    // 3. Bind view toggle buttons using original IDs
    const toggleOriginal = document.getElementById("originalBtn");
    const toggleExtracted = document.getElementById("extractedBtn");

    if (toggleOriginal) {
        toggleOriginal.addEventListener("click", () => {
            showOriginal();
        });
    }

    if (toggleExtracted) {
        toggleExtracted.addEventListener("click", () => {
            showExtracted();
        });
    }

    // 4. Bind mobile menu hamburger toggle button
    const menuToggleBtn = document.getElementById("btn-menu-toggle");
    const sidebar = document.getElementById("app-sidebar");
    
    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }
});