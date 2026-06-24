import os
from pathlib import Path
from flask import Flask, jsonify, render_template
from corps import Corps

app = Flask(__name__)

# Configuration

DIRECTORY_PATH = r'G:\My Drive\Obsidian Daily Murli\Daily Murli'

# Load files once at startup

FILES = [
    file.name
    for file in sorted(Path(DIRECTORY_PATH).iterdir())
    if file.is_file()
]

# Build Corps once at startup

CORPS = Corps()

file_paths = [
    str(Path(DIRECTORY_PATH) / filename)
    for filename in FILES
]

CORPS.load_words(file_paths)
CORPS.build()

print(f"Loaded {len(FILES)} files")
print("Corps ready")

# Routes

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/files")
def get_files():

    return jsonify({
        "directory": DIRECTORY_PATH,
        "file_count": len(FILES),
        "files": FILES
    })


@app.route("/files/<filename>")
def get_file_content(filename):

    try:
        sentences = CORPS.get_file_sentences(
            filename
        )

    except KeyError:

        return (
            jsonify({
                "error": "File not found",
                "filename": filename
            }),
            404
        )

    return jsonify({
        "filename": filename,
        "sentences": sentences
    })

@app.route("/analysis")
def analysis_page():
    return render_template("/analysis.html")

@app.route("/api/word-frequency")
def word_frequency():

    result = sorted(
        CORPS.get_word_frequency().items(),
        key=lambda item: item[1],
        reverse=True
    )

    return jsonify(result)

@app.route("/api/character-buckets")
def character_buckets():

    result = {}

    for count in range(1, 15):

        bucket = CORPS.dictionary.build_character_bucket(
            count
        )

        frequencies = {}

        for file_words in bucket.values():

            for word in file_words.values():

                frequencies[word] = (
                    frequencies.get(word, 0)
                    + 1
                )

        result[count] = sorted(
            frequencies.items(),
            key=lambda x: x[1],
            reverse=True
        )

    return jsonify(result)

@app.route("/api/character-bucket/<int:count>")
def character_bucket(count):

    bucket = CORPS.dictionary.build_character_bucket(
        count
    )

    frequency = {}

    for file_words in bucket.values():

        for word in file_words.values():

            frequency[word] = (
                frequency.get(word, 0)
                + 1
            )

    result = sorted(
        frequency.items(),
        key=lambda item: item[1],
        reverse=True
    )

    return jsonify(result)

if __name__ == "__main__":
    app.run(
        debug=True,
        use_reloader=False
    )