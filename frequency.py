import math


class Frequency:

    def __init__(self):
        self.word_count = {}
        self.normalized_words = {}
        self.tfidf = {}
        self.normalized_tfidf = {}


    def build_frequency(self, corpus):

        word_count = {}

        for word, files in corpus.word_index.items():

            count = sum(
                len(positions)
                for positions in files.values()
            )

            word_count[word] = count

        self.word_count = word_count

        return word_count

    def build_normalized_frequency(self, corpus):

        index = {}

        for file_name, extracted_file in corpus.extracted_words.items():

            original_file = corpus.files[file_name]

            for position, extracted_words in extracted_file.items():

                original_word = original_file[position]

                for word in extracted_words:

                    if word not in index:

                        index[word] = {
                            "count": 0,
                            "originals": {}
                        }

                    index[word]["count"] += 1

                    originals = index[word]["originals"]

                    originals[original_word] = (
                        originals.get(original_word, 0) + 1
                    )

        self.normalized_words = index

        return index

    def build_tfidf(self, corpus):

        total_documents = len(corpus.file_ids)

        if total_documents == 0:
            raise ValueError("No documents loaded.")

        tfidf = {}

        for word, files in corpus.word_index.items():

            document_frequency = len(files)

            idf = math.log(
                1 + (total_documents / document_frequency)
            )

            tfidf[word] = {
                "document_frequency": document_frequency,
                "idf": idf,
                "files": {}
            }

            for file_id, positions in files.items():

                term_frequency = len(positions)

                score = term_frequency * idf

                tfidf[word]["files"][file_id] = {
                    "term_frequency": term_frequency,
                    "score": score
                }

        self.tfidf = tfidf

        return tfidf
    
    def build_normalized_tfidf(self, corpus):

        total_documents = len(corpus.file_ids)

        document_words = {}

        for file_name, extracted_file in corpus.extracted_words.items():

            file_id = corpus.file_ids[file_name]

            document_words.setdefault(
                file_id,
                {}
            )

            for words in extracted_file.values():

                for word in words:

                    document_words[file_id][word] = (
                        document_words[file_id].get(word, 0)
                        + 1
                    )

        document_frequency = {}

        for words in document_words.values():

            for word in words:

                document_frequency[word] = (
                    document_frequency.get(word, 0)
                    + 1
                )

        index = {}

        for word, df in document_frequency.items():

            idf = math.log(
                1 + (total_documents / df)
            )

            index[word] = {
                "document_frequency": df,
                "idf": idf,
                "files": {},
                "total_score": 0
            }

            for file_id, words in document_words.items():

                tf = words.get(word)

                if not tf:
                    continue

                score = tf * idf

                index[word]["files"][file_id] = {
                    "term_frequency": tf,
                    "score": score
                }

                index[word]["total_score"] += score

        self.normalized_tfidf = index

        return index