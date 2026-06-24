import unicodedata

class Dictionary:

    def __init__(self):

        self.normalized_words = {}

        self.by_character_count = {}

    def build_normalized_words(self,corpus):
        index = {}

        for file_name, extracted_file in corpus.extracted_words.items():

            index[file_name] = {}

            for position, words in extracted_file.items():

                if not words:
                    continue

                normalized = (
                    unicodedata.normalize(
                        "NFC",
                        words[0]
                    )
                    .strip()
                )

                if not normalized:
                    continue

                index[file_name][position] = normalized

        self.normalized_words = index

        return index

    def count_characters(self, word):
        return len(word)
    
    def build_character_bucket(self, character_count):

        if not self.normalized_words:

            raise ValueError(
                "Run build_normalized_words() first."
            )

        index = {}

        for (
            file_name,
            words
        ) in self.normalized_words.items():

            index[file_name] = {}

            for position, word in words.items():

                if (
                    self.count_characters(word)
                    != character_count
                ):
                    continue

                index[file_name][position] = word

        self.by_character_count[
            character_count
        ] = index

        return index