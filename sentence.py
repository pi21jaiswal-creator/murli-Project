def build_sentence_text(corpus):

    index = {}

    for file_name in corpus.sentence_index:

        index[file_name] = {}

        for sentence_key, sentence in (
            corpus.sentence_index[file_name].items()
        ):

            original_words = []
            extracted_words = []

            for position in range(
                sentence["start"],
                sentence["end"] + 1
            ):

                original_words.append(
                    corpus.files[file_name][position]
                )

                extracted_words.extend(
                    corpus.extracted_words[file_name][position]
                )

            index[file_name][sentence_key] = {

                "original":
                    " ".join(original_words),

                "extracted":
                    " ".join(extracted_words)

            }

    corpus.sentences = index

    return index