from flask import Flask, jsonify, render_template
from elasticsearch import Elasticsearch

app = Flask(__name__)

es = Elasticsearch(
    "https://localhost:9200",
    basic_auth=(
        "elastic",
        "2MHzCYmiPx*m2j=NOG7l"
    ),
    verify_certs=False
)


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