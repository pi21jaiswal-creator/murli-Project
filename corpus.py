from pathlib import Path
import regex

from models import Position

class Corpus:

    def __init__(self):

        # variables

        self.files = {}
        self.file_ids = {}

        self.word_index = {}
        self.separated_words = {}
        self.extracted_words = {}

        self.sentences = {}

        self.sentence_index = {}
        self.sentence_word_tree = {}
        self.word_sentence_index = {}


    def load_words(self, files):

        self.file_ids = {}

        file_id = 0

        for file_path in files:

            file_name = Path(file_path).name

            self.file_ids[file_name] = file_id
            file_id += 1

            text = Path(file_path).read_text(
                encoding="utf-8"
            )

            words = text.split()

            self.files[file_name] = {}

            position = 0

            for word in words:

                if not word:
                    continue

                position += 1

                self.files[file_name][position] = word

        return self.files

    def build_word_index(self):

        index = {}

        for file_name, words in self.files.items():

            current_file_id = self.file_ids[file_name]

            for position, word in words.items():

                index.setdefault(word, {})
                index[word].setdefault(
                    current_file_id,
                    []
                )

                index[word][current_file_id].append(
                    position
                )

        self.word_index = index

        return index

    def build_separated_word_index(self):

        index = {}

        for file_name in self.files:

            index[file_name] = {}

            positions = sorted(
                self.files[file_name].keys()
            )

            for position in positions:

                word = self.files[file_name][position]

                raw_parts = regex.findall(
                    r'[\p{L}\p{M}\p{N}]+|[^\p{L}\p{M}\p{N}\s]',
                    word
                )

                parts = []

                for part in raw_parts:

                    if (
                        parts
                        and len(part) == 1
                        and parts[-1][0] == part
                    ):

                        parts[-1] += part

                    else:

                        parts.append(part)

                index[file_name][position] = parts

        self.separated_words = index

        return index

    def build_extracted_word_index(self):

        index = {}

        for file_name in self.files:

            index[file_name] = {}

            positions = sorted(
                self.files[file_name].keys()
            )

            for position in positions:

                word = self.files[file_name][position]

                extracted_words = regex.findall(
                     r'[\p{L}\p{M}\p{N}]+',
                     word
                )

                index[file_name][position] = (
                    extracted_words
                )

        self.extracted_words = index

        return index

    def build_sentence_index(self):

        separated = self.separated_words

        if not separated:

            raise ValueError(
                "Run build_separated_word_index() first."
            )

        index = {}

        section_markers = {

            "प्रश्न",
            "उत्तर",
            "गीत",
            "वरदान",
            "स्लोगन",
            "धारणा"

        }

        for file_name in separated:

            index[file_name] = {}

            positions = sorted(
                separated[file_name].keys()
            )

            start_pos = None

            for position in positions:

                parts = separated[file_name][position]

                is_section_marker = any(
                    part in section_markers
                    for part in parts
                )

                if start_pos is None:

                    start_pos = position

                if (
                    is_section_marker
                    and position != start_pos
                ):

                    index[file_name][start_pos] = {

                        "start": start_pos,

                        "end": position - 1

                    }

                    start_pos = position

                    continue

                has_sentence_end = any(

                    part == "."
                    or part == "!"
                    or part == "?"
                    or set(part) == {"।"}
                    or set(part) == {"॥"}

                    for part in parts

                )

                if has_sentence_end:

                    index[file_name][start_pos] = {

                        "start": start_pos,

                        "end": position

                    }

                    start_pos = None

            if start_pos is not None:

                index[file_name][start_pos] = {

                    "start": start_pos,

                    "end": positions[-1]

                }

        self.sentence_index = index

        return index

    def build_word_sentence_index(self):
     
     index = {}

     file_id_to_name = {}

     for file_name, file_id in self.file_ids.items():

        file_id_to_name[file_id] = file_name

     for word in self.word_index:

         index[word] = {}

         files = self.word_index[word]

         for file_id in files:

            file_name = file_id_to_name[file_id]

            index[word][file_id] = {}

            positions = files[file_id]

            for position in positions:

                for sentence_key, sentence in (
                    self.sentence_index[file_name]
                    .items()
                ):

                    if (

                        sentence["start"]
                        <= position
                        <= sentence["end"]

                    ):

                        index[word][file_id]\
                            .setdefault(
                                sentence_key,
                                []
                            )

                        index[word][file_id][
                            sentence_key
                        ].append(

                            Position(

                                file_id=file_id,

                                sentence_key=int(
                                    sentence_key
                                ),

                                position=position

                            )

                        )

                        break

     self.word_sentence_index = index

     return index

    def build_sentence_word_tree(self):

     separated = self.separated_words

     sentence_index = self.sentence_index

     if not sentence_index:

        raise ValueError(
            "Run build_sentence_index() first."
        )

     index = {}

     for file_name in separated:

        index[file_name] = {}

        boundaries = (
            sentence_index[file_name]
            .values()
        )

        for sentence in boundaries:

            start = sentence["start"]

            end = sentence["end"]

            index[file_name][start] = {}

            for position in range(
                start,
                end + 1
            ):

                index[file_name][start][
                    position
                ] = separated[
                    file_name
                ][
                    position
                ]

     self.sentence_word_tree = index

     return index

    