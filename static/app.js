async function loadFiles() {

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

async function loadFile(filename) {

const response = await fetch(
    `/files/${encodeURIComponent(filename)}`
);

document.getElementById(
    'fileTitle'
).innerText = filename;

const content =
    document.getElementById(
        'content'
    );

content.innerHTML = '';

if (!response.ok) {

    let errText =
        `Status ${response.status}`;

    try {

        const errJson =
            await response.json();

        errText =
            errJson.error
            || JSON.stringify(errJson);

    } catch (e) {

        try {

            errText =
                await response.text();

        } catch (e) {
            /* ignore */
        }

    }

    content.textContent =
        `Error loading file: ${errText}`;

    return;
}

let data;

try {

    data =
        await response.json();

} catch (e) {

    content.textContent =
        'Invalid JSON response from server.';

    return;
}

if (data.sentences) {

    Object.entries(
        data.sentences
    ).forEach(

        ([sentenceKey, sentence], index) => {

            const row =
                document.createElement(
                    'div'
                );

            row.className =
                'sentence-row';

            row.dataset.sentenceKey =
                sentenceKey;

            const number =
                document.createElement(
                    'span'
                );

            number.className =
                'sentence-number';

            number.innerText =
                `${index + 1}. `;

            const text =
                document.createElement(
                    'span'
                );

            text.className =
                'sentence-text';

            text.textContent =
                sentence;

            row.appendChild(
                number
            );

            row.appendChild(
                text
            );

            content.appendChild(
                row
            );

        }
    );

} else if (data.error) {

    content.textContent =
        data.error;

} else {

    content.textContent =
        'Unable to load sentences.';
}

}
