from pathlib import Path
import argparse

import urllib3
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

from corps import Corps

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

DIRECTORY_PATH = r"G:\My Drive\Obsidian Daily Murli\Daily Murli"
DEFAULT_INDEX = "murli"


def build_document_id(document):
    file_name = document.get("file_name", "unknown")
    start = document.get("sentence_start")
    end = document.get("sentence_end")
    return f"{file_name}_{start}_{end}"


def create_index(es, index_name):
    if es.indices.exists(index=index_name):
        print(f"Index '{index_name}' already exists.")
        return

    print(f"Creating Elasticsearch index '{index_name}'.")
    es.indices.create(index=index_name)


def recreate_index(es, index_name):
    if es.indices.exists(index=index_name):
        print(f"Deleting existing index '{index_name}'.")
        es.indices.delete(index=index_name)
    create_index(es, index_name)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Index Murli sentences into Elasticsearch with stable document IDs."
    )
    parser.add_argument(
        "--recreate-index",
        action="store_true",
        help="Delete and recreate the Elasticsearch index before indexing."
    )
    parser.add_argument(
        "--index-name",
        default=DEFAULT_INDEX,
        help="Name of the Elasticsearch index to use."
    )
    return parser.parse_args()


def main():
    args = parse_args()

    print("1. Finding markdown files...")
    files = list(Path(DIRECTORY_PATH).glob("*.md"))
    print(f"Found {len(files)} markdown files.")
    for file in files:
        print("  ", file.name)

    print("\n2. Connecting to Elasticsearch...")
    es = Elasticsearch(
        "https://localhost:9200",
        basic_auth=("elastic", "2MHzCYmiPx*m2j=NOG7l"),
        verify_certs=False,
    )
    print("Connected.")

    index_exists = es.indices.exists(index=args.index_name)
    print(f"Index exists: {index_exists}")

    if index_exists:
        print(f"Deleting existing index '{args.index_name}' to ensure clean reindex.")
        es.indices.delete(index=args.index_name)
        print(f"Deleted index '{args.index_name}'.")

    print(f"Creating Elasticsearch index '{args.index_name}'.")
    es.indices.create(index=args.index_name)
    print(f"Created index '{args.index_name}'.")

    print("3. Creating Corps object...")
    corps = Corps()
    print("Corps object created.")

    print("4. Loading files...")
    corps.load_words(files)
    print(f"Files loaded into corpus: {len(corps.corpus.files)}")

    print("5. Building corpus...")
    corps.build()
    print("Corpus build completed.")

    print("6. Building Elasticsearch documents...")
    documents = corps.corpus.build_documents()
    print(f"Documents created: {len(documents)}")

    print("Files represented in documents:")
    file_names = sorted({document["file_name"] for document in documents})
    for name in file_names:
        print("  ", name)
    print(f"\nUnique files in documents: {len(file_names)}")

    print("7. Indexing documents into Elasticsearch...")
    actions = [
        {
            "_index": args.index_name,
            "_id": build_document_id(document),
            "_source": document,
        }
        for document in documents
    ]

    print("Sending documents to Elasticsearch with stable IDs...")
    success, errors = bulk(es, actions)
    print(f"Indexed {success} documents.")
    if errors:
        print("Errors occurred during bulk indexing:")
        for error in errors[:10]:
            print(error)

    es.indices.refresh(index=args.index_name)
    final_count = es.count(index=args.index_name)['count']
    print(f"Final Elasticsearch document count for '{args.index_name}': {final_count}")
    print(f"\nFinished indexing {len(documents)} documents.")


if __name__ == "__main__":
    main()
