import { loadFile } from './fileViewer.js';

export async function loadFiles() {

    const response =
        await fetch('/files');

    const data =
        await response.json();

    document
        .getElementById('count')
        .innerText =
        `Files Found: ${data.file_count}`;

    const fileList =
        document.getElementById(
            'fileList'
        );

    fileList.innerHTML = '';

    data.files.forEach(file => {

        const li =
            document.createElement(
                'li'
            );

        li.textContent = file;

        li.className =
            'file-item';

        li.onclick =
            () => loadFile(file);

        fileList.appendChild(li);

    });

}