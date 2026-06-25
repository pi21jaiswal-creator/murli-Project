const App = {

    corpus: null,

    groupedWords: {},

    currentCharacterCount: null,

    currentWord: null,

    selectedFrequency: null,

    selectedWords: new Set(),

    pinnedWords: new Set(),

    excludedWords: new Set(),

    favoriteWords: new Set(),

    buckets: {},

    ui: {

        searchText: "",

        previewWord: null,

        selectedBucket: null,

        contextMenu: null,

        // Frequency Navigator

        showFrequencyNavigator: false,

        hoveredFrequency: null

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

    // ---------------------------------
    // Select highest frequency by default
    // ---------------------------------

    const frequencies =
        Object.keys(grouped)
            .map(Number)
            .sort((a, b) => b - a);

    App.selectedFrequency =
        frequencies.length > 0
            ? frequencies[0]
            : null;

    refresh();
}

function loadFrequency()
{
    const characterCount =
        App.currentCharacterCount || 10;

    loadBucket(characterCount);
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
