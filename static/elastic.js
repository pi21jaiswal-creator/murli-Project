const status = document.getElementById('status');
const refreshBtn = document.getElementById('refreshBtn');
const documentsContainer = document.getElementById('documentsContainer');

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function fetchDocuments() {
    const response = await fetch('/documents');
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    const documents = await response.json();
    if (!Array.isArray(documents)) {
        throw new Error('Expected an array of documents.');
    }

    return documents;
}

function createTableHeader() {
    const headerRow = document.createElement('tr');
    ['No.', 'Range', 'Sentence'].forEach((label) => {
        const th = document.createElement('th');
        th.textContent = label;
        headerRow.appendChild(th);
    });
    const thead = document.createElement('thead');
    thead.appendChild(headerRow);
    return thead;
}

function renderDocuments(documents) {
    documentsContainer.innerHTML = '';

    if (documents.length === 0) {
        status.textContent = 'No documents found.';
        return;
    }

    const groupedByFile = documents.reduce((group, document) => {
        const fileName = document.file_name || 'unknown';
        group[fileName] = group[fileName] || [];
        group[fileName].push(document);
        return group;
    }, {});

    Object.entries(groupedByFile).forEach(([fileName, docs]) => {
        const fileSection = document.createElement('section');
        fileSection.className = 'elastic-file-section';

        const title = document.createElement('h2');
        title.textContent = fileName;
        fileSection.appendChild(title);

        const table = document.createElement('table');
        table.className = 'elastic-table';
        table.appendChild(createTableHeader());

        const tbody = document.createElement('tbody');

        docs.forEach((doc, index) => {
            const row = document.createElement('tr');

            const numberCell = document.createElement('td');
            numberCell.textContent = index + 1;
            row.appendChild(numberCell);

            const rangeCell = document.createElement('td');
            rangeCell.textContent = `${doc.sentence_start}–${doc.sentence_end}`;
            row.appendChild(rangeCell);

            const sentenceCell = document.createElement('td');
            const sentencePre = document.createElement('pre');
            sentencePre.innerHTML = escapeHtml(doc.original_sentence || '');
            sentenceCell.appendChild(sentencePre);
            row.appendChild(sentenceCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        fileSection.appendChild(table);
        documentsContainer.appendChild(fileSection);
    });

    status.textContent = `Loaded ${documents.length} Elasticsearch documents.`;
}

async function loadDocuments() {
    status.textContent = 'Loading documents from Elasticsearch...';
    documentsContainer.innerHTML = '';

    try {
        const documents = await fetchDocuments();
        renderDocuments(documents);
    } catch (error) {
        status.textContent = `Error loading documents: ${error.message}`;
    }
}

refreshBtn.addEventListener('click', loadDocuments);
window.addEventListener('DOMContentLoaded', loadDocuments);
