import os
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/files")
def get_files():

    directory_path = r'G:\My Drive\Obsidian Daily Murli\Daily Murli'

    files_and_directories = os.listdir(directory_path)

    files = [
        item
        for item in files_and_directories
        if os.path.isfile(os.path.join(directory_path, item))
    ]

    return jsonify({
        "directory": directory_path,
        "file_count": len(files),
        "files": files
    })

@app.route("/files/<filename>")
def get_file_content(filename):

    directory_path = (
        r'G:\My Drive\Obsidian Daily Murli\Daily Murli'
    )

    file_path = os.path.join(
        directory_path,
        filename
    )

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:

        content = file.read()

    return content

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)