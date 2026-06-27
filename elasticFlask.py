from flask import Flask, jsonify, render_template
from es_client import create_elasticsearch_client

app = Flask(__name__)

es = create_elasticsearch_client()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/elastic")
def elastic_page():
    return render_template("elastic.html")


@app.route("/documents")
def get_documents():

    response = es.search(
        index="murli",
        query={
            "match_all": {}
        },
        sort=[
            {
                "file_name.keyword": {
                    "order": "asc"
                }
            },
            {
                "sentence_start": {
                    "order": "asc"
                }
            }
        ],
        size=6000
    )

    documents = [
        hit["_source"]
        for hit in response["hits"]["hits"]
    ]

    return jsonify(documents)


if __name__ == "__main__":
    app.run(debug=True)