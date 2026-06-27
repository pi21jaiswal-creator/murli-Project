import urllib3
from elasticsearch import Elasticsearch

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

ELASTICSEARCH_HOST = "https://localhost:9200"
ELASTICSEARCH_USER = "elastic"
ELASTICSEARCH_PASSWORD = "2MHzCYmiPx*m2j=NOG7l"


def create_elasticsearch_client():
    return Elasticsearch(
        ELASTICSEARCH_HOST,
        basic_auth=(ELASTICSEARCH_USER, ELASTICSEARCH_PASSWORD),
        verify_certs=False,
    )
