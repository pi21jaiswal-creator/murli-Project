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

if __name__ == "__main__":
    app.run(
        debug=True,
        use_reloader=False
    )