// ==========================================
// APPLICATION RENDERER
// ==========================================

function refresh()
{
    renderPage();
}



// ==========================================
// PAGE
// ==========================================

function renderPage()
{
    renderToolbar();

    renderSearch();

    renderCards();

    renderSidebar();

    renderBuckets();

    renderPreview();

    renderContextMenu();
}



// ==========================================
// CARD AREA
// ==========================================

function renderCards()
{
    const container =
        document.getElementById(
            "cardContainer"
        );

    container.innerHTML = "";

    const grouped =
        App.groupedWords;

    if (
        !App.selectedFrequency ||
        !grouped[App.selectedFrequency]
    )
    {
        return;
    }

    container.appendChild(

        renderCountCard(

            App.selectedFrequency,

            grouped[
                App.selectedFrequency
            ]

        )

    );
}



function renderCountCard(
    count,
    words
)
{
    return createCountCard(
        count,
        words
    );
}



function renderWordCard(
    wordObject
)
{
    return createWordCard(
        wordObject
    );
}



// ==========================================
// SIDEBAR
// ==========================================

function renderSidebar()
{

}



// ==========================================
// BUCKETS
// ==========================================

function renderBuckets()
{
    Object.keys(
        App.buckets
    ).forEach(bucket => {

        renderBucket(
            bucket
        );

    });
}



function renderBucket(
    bucket
)
{

}



// ==========================================
// TOOLBAR
// ==========================================

function renderToolbar()
{

}



// ==========================================
// SEARCH
// ==========================================

function renderSearch()
{

}



// ==========================================
// PREVIEW
// ==========================================

function renderPreview()
{

}



// ==========================================
// CONTEXT MENU
// ==========================================

function renderContextMenu()
{

}



// ==========================================
// CLEAR
// ==========================================

function clearCards()
{
    const container =
        document.getElementById(
            "cardContainer"
        );

    container.innerHTML = "";
}



function clearBuckets()
{

}