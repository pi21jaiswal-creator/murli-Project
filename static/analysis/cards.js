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

    // -----------------------------
    // Header
    // -----------------------------

    const header =
        document.createElement("div");

    header.className =
        "count-header";

    header.textContent =
        `Count : ${count} (${words.length} words)`;

    // -----------------------------
    // Word Container
    // -----------------------------

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