// ==========================================
// WORD MANAGER
// ==========================================

const WordManager = {

    open(word)
    {
        App.currentWord = word;

        refresh();
    },

    preview(word)
    {
        App.ui.previewWord = word;

        refresh();
    },

    pin(word)
    {
        App.pinnedWords.add(word);

        refresh();
    },

    unpin(word)
    {
        App.pinnedWords.delete(word);

        refresh();
    },

    exclude(word)
    {
        App.excludedWords.add(word);

        refresh();
    },

    restore(word)
    {
        App.excludedWords.delete(word);

        refresh();
    },

    favorite(word)
    {
        App.favoriteWords.add(word);

        refresh();
    },

    unfavorite(word)
    {
        App.favoriteWords.delete(word);

        refresh();
    },

    rename(oldWord, newWord)
    {
        console.log(
            "Rename:",
            oldWord,
            "→",
            newWord
        );
    },

    remove(word)
    {
        console.log(
            "Remove:",
            word
        );
    }

};



// ==========================================
// BUCKET MANAGER
// ==========================================

const BucketManager = {

    create(name)
    {
        if (!App.buckets[name])
        {
            App.buckets[name] = [];
        }

        refresh();
    },

    delete(name)
    {
        delete App.buckets[name];

        refresh();
    },

    rename(oldName, newName)
    {
        if (!App.buckets[oldName])
        {
            return;
        }

        App.buckets[newName] =
            App.buckets[oldName];

        delete App.buckets[oldName];

        refresh();
    },

    addWord(bucket, word)
    {
        if (!App.buckets[bucket])
        {
            App.buckets[bucket] = [];
        }

        if (!App.buckets[bucket].includes(word))
        {
            App.buckets[bucket].push(word);
        }

        refresh();
    },

    removeWord(bucket, word)
    {
        if (!App.buckets[bucket])
        {
            return;
        }

        App.buckets[bucket] =
            App.buckets[bucket].filter(
                w => w !== word
            );

        refresh();
    },

    moveWord(fromBucket, toBucket, word)
    {
        this.removeWord(
            fromBucket,
            word
        );

        this.addWord(
            toBucket,
            word
        );
    }

};



// ==========================================
// SEARCH MANAGER
// ==========================================

const SearchManager = {

    search(text)
    {
        App.ui.searchText =
            text.trim();

        refresh();
    },

    filter(options)
    {
        console.log(
            "Filter:",
            options
        );
    },

    clear()
    {
        App.ui.searchText = "";

        refresh();
    }

};



// ==========================================
// PREVIEW MANAGER
// ==========================================

const PreviewManager = {

    show(word)
    {
        App.ui.previewWord =
            word;

        refresh();
    },

    hide()
    {
        App.ui.previewWord =
            null;

        refresh();
    }

};



// ==========================================
// MENU MANAGER
// ==========================================

const MenuManager = {

    show(event, word)
    {
        App.ui.contextMenu = {

            event,

            word

        };

        refresh();
    },

    hide()
    {
        App.ui.contextMenu =
            null;

        refresh();
    }

};



// ==========================================
// WORKSPACE MANAGER
// ==========================================

const WorkspaceManager = {

    pin(word)
    {
        App.pinnedWords.add(word);

        refresh();
    },

    unpin(word)
    {
        App.pinnedWords.delete(word);

        refresh();
    },

    saveLayout()
    {
        console.log(
            "Save Workspace"
        );
    },

    loadLayout()
    {
        console.log(
            "Load Workspace"
        );
    }

};