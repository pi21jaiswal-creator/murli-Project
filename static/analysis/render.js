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

    Object.keys(grouped)
        .sort((a, b) => b - a)
        .forEach(count => {

            container.appendChild(

                renderCountCard(

                    Number(count),

                    grouped[count]

                )

            );

        });
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