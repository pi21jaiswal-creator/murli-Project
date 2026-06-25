const App = {

    corpus: null,

    groupedWords: {},

    currentCharacterCount: null,

    currentWord: null,

    selectedWords: new Set(),

    pinnedWords: new Set(),

    excludedWords: new Set(),

    favoriteWords: new Set(),

    buckets: {},

    ui: {

        searchText: "",

        previewWord: null,

        selectedBucket: null,

        contextMenu: null

    }

};

async function loadBucket(characterCount)
{
    const response =
        await fetch(
            `/api/character-bucket/${characterCount}`
        );

    const data =
        await response.json();

    const grouped = {};

    data.forEach(([word, count]) => {

        if (!grouped[count]) {

            grouped[count] = [];

        }

        grouped[count].push(word);

    });

    App.currentCharacterCount =
        characterCount;

    App.groupedWords =
        grouped;

    refresh();
}


function buildButtons()
{
    const container =
        document.getElementById(
            "bucketButtons"
        );

    for (
        let count = 1;
        count <= 10;
        count++
    )
    {
        const button =
            document.createElement(
                "button"
            );

        button.textContent =
            `${count} Character`;

        button.onclick =
            () => loadBucket(count);

        container.appendChild(
            button
        );
    }
}

buildButtons();
