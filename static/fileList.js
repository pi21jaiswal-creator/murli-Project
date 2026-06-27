import { loadFile } from './fileViewer.js';

let allFiles = [];

export async function loadFiles() {
    const response = await fetch('/files');
    if (!response.ok) {
        console.error("Failed to load files from server");
        return;
    }
    const data = await response.json();
    allFiles = data.files || [];
    
    // Update file count badge using the original ID 'count'
    const fileCountSpan = document.getElementById('count');
    if (fileCountSpan) {
        fileCountSpan.textContent = `Files Found: ${allFiles.length}`;
    }

    renderFileList(allFiles);
}

export function renderFileList(files) {
    // Target the original list ID 'fileList'
    const fileListContainer = document.getElementById('fileList');
    if (!fileListContainer) return;

    fileListContainer.innerHTML = '';

    if (files.length === 0) {
        fileListContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: var(--space-lg); font-size: var(--font-sm);">
                No Murlis found
            </div>
        `;
        return;
    }

    files.forEach(file => {
        // Parse date from filename e.g. "01-06-2026.md" -> "01.06.2026"
        const datePart = file.replace('.md', '');
        const displayDate = datePart.split('-').join('.');
        const displayTitle = `Avyakt Murli ${displayDate}`;

        const fileItem = document.createElement('li');
        fileItem.className = 'file-item';
        fileItem.setAttribute('data-filename', file);

        fileItem.innerHTML = `
            <div class="file-icon-wrapper">
                <img src="/static/assets/file.svg" alt="Murli Document" class="file-item-icon">
            </div>
            <div class="file-info">
                <span class="file-title" title="${displayTitle}">${displayTitle}</span>
                <span class="file-date">${displayDate}</span>
            </div>
        `;

        fileItem.addEventListener('click', () => {
            // Set active class on selected file
            const activeItems = fileListContainer.querySelectorAll('.file-item.active');
            activeItems.forEach(item => item.classList.remove('active'));
            fileItem.classList.add('active');

            // Load file content
            loadFile(file);

            // On mobile, close sidebar drawer automatically on selection
            const sidebar = document.getElementById('app-sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });

        fileListContainer.appendChild(fileItem);
    });
}

// Filter the list based on search query
export function filterFiles(query) {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
        renderFileList(allFiles);
        return;
    }

    const filtered = allFiles.filter(file => {
        // Match query against filename, or formatted title/date
        const datePart = file.replace('.md', '');
        const displayDate = datePart.split('-').join('.');
        const displayTitle = `Avyakt Murli ${displayDate}`;
        
        return file.toLowerCase().includes(cleanQuery) || 
               displayTitle.toLowerCase().includes(cleanQuery) || 
               displayDate.includes(cleanQuery);
    });

    renderFileList(filtered);
}