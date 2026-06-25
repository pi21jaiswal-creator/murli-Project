// ==========================================
// COUNT CARD
// ==========================================

function createCountCard(count, words)
{
    const card =
        document.createElement("div");

    card.className =
        "count-card";

    card.dataset.count =
        count;



    // ==========================================
    // HEADER
    // ==========================================

    const header =
        document.createElement("div");

    header.className =
        "count-header";



    // ---------- Left ----------

    const left =
        document.createElement("div");

    left.className =
        "count-left";



    const frequencyButton =
        document.createElement("button");

    frequencyButton.className =
        "frequency-button";

    frequencyButton.textContent =
        `📊 Frequency ${count}`;

    frequencyButton.dataset.role =
        "frequency-button";



    // ==========================================
    // FREQUENCY NAVIGATOR
    // ==========================================

    const navigator =
        document.createElement("div");

    navigator.className =
        "frequency-navigator";



   Object.keys(App.groupedWords)
    .map(Number)
    .sort((a, b) => b - a)
    .forEach(frequency => {

        const frequencyCard =
            createFrequencyCard(
                frequency,
                App.groupedWords[
                    frequency
                ]
            );

        navigator.appendChild(
            frequencyCard
        );

    });



    left.appendChild(
        frequencyButton
    );

    if (
    App.ui.showFrequencyNavigator
    )
    {
    left.appendChild(
        navigator
    );
    }

    bindFrequencyNavigator(

    frequencyButton,

    navigator

    );


    // ---------- Right ----------

    const right =
        document.createElement("div");

    right.className =
        "count-right";

    right.innerHTML =
        `
            <span>
                ${words.length}
                Word${words.length > 1 ? "s" : ""}
            </span>
        `;



    header.appendChild(left);

    header.appendChild(right);



    // ==========================================
    // WORD LIST
    // ==========================================

    const wordList =
        document.createElement("div");

    wordList.className =
        "word-list";



    words.forEach(word => {

        wordList.appendChild(

            createWordCard({

                word,

                count

            })

        );

    });



    card.appendChild(header);

    card.appendChild(wordList);



    return card;
}

// ==========================================
// FREQUENCY CARD
// ==========================================

function createFrequencyCard(
    frequency,
    words
)
{

    console.log(
    "Frequency:",
    frequency,
    words
);
    const card =
        document.createElement("div");

    card.className =
        "frequency-card";

    card.dataset.frequency =
        frequency;



    if (
        frequency ===
        App.selectedFrequency
    )
    {
        card.classList.add(
            "active"
        );
    }



    // -----------------------
    // Header
    // -----------------------

    const header =
        document.createElement("div");

    header.className =
        "frequency-card-header";

    header.textContent =
        `Frequency ${frequency}`;



    // -----------------------
    // Words
    // -----------------------

    const list =
        document.createElement("div");

    list.className =
        "frequency-card-words";



    words.forEach(word => {

    const chip =
        document.createElement("div");

    chip.className =
        "frequency-word";

    chip.textContent =
        word;

    list.appendChild(
        chip
    );

});


    card.appendChild(
        header
    );

    card.appendChild(
        list
    );

    return card;
}

// ==========================================
// WORD CARD
// ==========================================

function createWordCard({
    word,
    count
})
{
    const card =
        document.createElement("div");

    card.className =
        "word-card interactive";



    // -----------------------------
    // DATA
    // -----------------------------

    card.dataset.word =
        word;

    card.dataset.count =
        count;

    card.dataset.selected =
        false;

    card.dataset.favorite =
        false;

    card.dataset.excluded =
        false;

    card.draggable =
        true;



    // -----------------------------
    // TITLE
    // -----------------------------

    const title =
        document.createElement("div");

    title.className =
        "word-title";

    title.textContent =
        word;

    card.appendChild(title);



    // -----------------------------
    // EVENTS
    // -----------------------------

    bindWordCardEvents(

        card,

        {

            word,

            count

        }

    );



    return card;
}