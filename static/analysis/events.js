// ==========================================
// WORD CARD EVENTS
// ==========================================

function bindWordCardEvents(
    card,
    wordObject
)
{
    card.addEventListener(
        "click",
        event => openWord(
            event,
            wordObject
        )
    );

    card.addEventListener(
        "dblclick",
        event => pinWord(
            event,
            wordObject
        )
    );

    card.addEventListener(
        "mouseenter",
        event => previewWord(
            event,
            wordObject
        )
    );

    card.addEventListener(
        "mouseleave",
        event => hidePreview(
            event,
            wordObject
        )
    );

    card.addEventListener(
        "contextmenu",
        event => showContextMenu(
            event,
            wordObject
        )
    );

    card.addEventListener(
        "dragstart",
        event => dragStart(
            event,
            wordObject
        )
    );

    card.addEventListener(
        "dragend",
        event => dragEnd(
            event,
            wordObject
        )
    );
}



// ==========================================
// CLICK
// ==========================================

function openWord(
    event,
    wordObject
)
{
    WordManager.open(
        wordObject.word
    );
}



// ==========================================
// DOUBLE CLICK
// ==========================================

function pinWord(
    event,
    wordObject
)
{
    WorkspaceManager.pin(
        wordObject.word
    );
}



// ==========================================
// HOVER
// ==========================================

function previewWord(
    event,
    wordObject
)
{
    PreviewManager.show(
        wordObject.word
    );
}

function hidePreview(
    event,
    wordObject
)
{
    PreviewManager.hide();
}



// ==========================================
// CONTEXT MENU
// ==========================================

function showContextMenu(
    event,
    wordObject
)
{
    event.preventDefault();

    MenuManager.show(

        event,

        wordObject.word

    );
}



// ==========================================
// DRAG
// ==========================================

function dragStart(
    event,
    wordObject
)
{
    event.dataTransfer.effectAllowed =
        "move";

    event.dataTransfer.setData(

        "text/plain",

        wordObject.word

    );
}

function dragEnd(
    event,
    wordObject
)
{

}