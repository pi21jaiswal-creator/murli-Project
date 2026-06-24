def build_sentence_text(corpus):

    index = {}

    for file_name in corpus.sentence_index:

        index[file_name] = {}

        for sentence_key, sentence in (
            corpus.sentence_index[file_name].items()
        ):

            words = []

            for position in range(
                sentence["start"],
                sentence["end"] + 1
            ):

                words.extend(
                    corpus.extracted_words[file_name][position]
                )

            index[file_name][sentence_key] = (
                " ".join(words)
            )

    corpus.sentences = index

    return index