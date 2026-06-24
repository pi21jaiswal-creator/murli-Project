# corps.py

from corpus import Corpus
from sentence import build_sentence_text

class Corps:

    def __init__(self):

        self.corpus = Corpus()

    def load_words(self, files):

        return self.corpus.load_words(files)

    def get_file_sentences(
     self,
     file_name
    ):

        return self.corpus.sentences[file_name]

    # corps.py

    def build(self):

        self.corpus.build_word_index()

        self.corpus.build_separated_word_index()

        self.corpus.build_extracted_word_index()

        self.corpus.build_sentence_index()

        build_sentence_text(self.corpus)

        self.corpus.build_word_sentence_index()

        self.corpus.build_sentence_word_tree()

        return self