# corps.py

from corpus import Corpus
from sentence import build_sentence_text
from frequency import Frequency
from dictionary import Dictionary

class Corps:

    def __init__(self):

        self.corpus = Corpus()
        self.frequency = Frequency()
        self.dictionary = Dictionary()

    def load_words(self, files):

        return self.corpus.load_words(files)

    def get_file_sentences(self, file_name):

        return self.corpus.sentences[file_name]

    def get_file_original(self, filename):

        return self.corpus.files[filename]
    
    def get_word_frequency(self):

        return self.frequency.word_count
    
    # corps.py

    def build(self):

        self.corpus.build_word_index()
        self.corpus.build_separated_word_index()
        self.corpus.build_extracted_word_index()
        
        self.dictionary.build_normalized_words(self.corpus)
        
        self.corpus.build_sentence_index()

        build_sentence_text(self.corpus)

        self.corpus.build_word_sentence_index()
        self.corpus.build_sentence_word_tree()

        self.frequency.build_frequency(self.corpus)
        self.frequency.build_normalized_frequency(self.corpus)
        self.frequency.build_tfidf(self.corpus)
        self.frequency.build_normalized_tfidf(self.corpus)
        self.corpus.build_documents()

        return self