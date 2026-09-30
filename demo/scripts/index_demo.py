#!/usr/bin/env python3
"""Index a small demo dataset from the local QLever triplestore into Elasticsearch.

Environment variables:
- SPARQL_ENDPOINT: URL of the QLever SPARQL endpoint (default: http://localhost:7001)
- ES_HOST: URL of the Elasticsearch instance (default: http://localhost:9200)
- ES_INDEX: Name of the index to create/populate (default: demo-kranten-m1)
- SEED_DIR: Root directory that mirrors the local S3 bucket layout (default: ./demo/s3/k50907905)
"""
import json
import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

import requests
from elasticsearch import Elasticsearch, helpers

SPARQL_ENDPOINT = os.getenv("SPARQL_ENDPOINT", "http://localhost:7001")
ES_HOST = os.getenv("ES_HOST", "http://localhost:9200")
ES_INDEX = os.getenv("ES_INDEX", "demo-kranten-m1")
SEED_DIR = Path(os.getenv("SEED_DIR", "./demo/s3/k50907905"))

ARCHIEF = "Collectie kranten RAZU"
ARCHIEFVORMER_URI = "https://data.razu.nl/id/actor/2bdb658a032a405d71c19159bd2bbb3a"
ARCHIEFVORMER_LABEL = "Regionaal Archief Zuid-Utrecht"

CLASSIFICATIE_PAGINA_URI = "https://data.razu.nl/id/soort/265753c2d190a0266797b69903c13123"
CLASSIFICATIE_PAGINA_LABEL = "Pagina"

AGGREGATIENIVEAU_COMPONENT_URI = "https://data.razu.nl/id/aggregatieniveau/2cb05e4bb7830be982f0922fed86b4cd"
AGGREGATIENIVEAU_COMPONENT_LABEL = "Component"


def sparql_query(query: str) -> list[dict]:
    response = requests.get(
        SPARQL_ENDPOINT,
        params={"query": query},
        headers={"Accept": "application/sparql-results+json"},
        timeout=60,
    )
    response.raise_for_status()
    return response.json()["results"]["bindings"]


def value(result: dict, key: str, default: str = "") -> str:
    return result[key]["value"] if key in result else default


def extract_alto_text(url: str) -> str:
    parsed = urlparse(url)
    # URL path is expected to be /k50907905/<relative-path>; strip the leading bucket segment.
    relative = parsed.path.lstrip("/")
    if relative.startswith("k50907905/"):
        relative = relative[len("k50907905/"):]
    file_path = SEED_DIR / relative
    try:
        tree = ET.parse(file_path)
    except (FileNotFoundError, ET.ParseError) as exc:
        print(f"Could not read ALTO file {file_path}: {exc}", file=sys.stderr)
        return ""

    root = tree.getroot()
    text_parts = []
    for elem in root.iter():
        if elem.tag.endswith("String"):
            text_parts.append(elem.attrib.get("CONTENT", ""))
    return " ".join(text_parts).strip()


def build_page_document(result: dict, parent_info: dict) -> dict:
    url = value(result, "url")
    name = value(result, "name")
    position = int(value(result, "position", "0")) if value(result, "position") else None

    doc = {
        "@id": value(result, "io"),
        "archief": ARCHIEF,
        "archiefvormer": {
            "uri": ARCHIEFVORMER_URI,
            "label": ARCHIEFVORMER_LABEL,
        },
        "serie": parent_info.get("serie", ""),
        "naam": name,
        "classificatie": {
            "uri": CLASSIFICATIE_PAGINA_URI,
            "label": CLASSIFICATIE_PAGINA_LABEL,
        },
        "aggregatieniveau": {
            "uri": AGGREGATIENIVEAU_COMPONENT_URI,
            "label": AGGREGATIENIVEAU_COMPONENT_LABEL,
        },
        "isOnderdeelVan": value(result, "io"),
        "position": position,
        "URL_bestand": url,
        "image": url,
        "full_text": "",
    }

    date_published = parent_info.get("date_published", "")
    if date_published:
        iso_date = date_published[:10]
        parts = iso_date.split("-")
        if len(parts) == 3:
            doc["document_year"], doc["document_month"] = parts[0], parts[1]
            doc["document_day"] = iso_date

    alto_url = value(result, "altoUrl")
    if alto_url:
        doc["full_text"] = extract_alto_text(alto_url)

    return doc


def index_pages(es: Elasticsearch) -> int:
    parent_query = """
    PREFIX ldto: <https://data.razu.nl/def/ldto/>
    PREFIX schema: <http://schema.org/>
    SELECT ?io ?serie ?datePublished
    WHERE {
      ?io a ldto:Informatieobject .
      ?io ldto:naam ?serie .
      OPTIONAL {
        ?io schema:mainEntity ?mainEntity .
        ?mainEntity schema:datePublished ?datePublished .
      }
    }
    """
    parent_rows = sparql_query(parent_query)
    parent_info = {
        value(row, "io"): {
            "serie": value(row, "serie"),
            "date_published": value(row, "datePublished"),
        }
        for row in parent_rows
    }

    page_query = """
    PREFIX ldto: <https://data.razu.nl/def/ldto/>
    PREFIX schema: <http://schema.org/>
    SELECT ?file ?io ?name ?url ?position ?altoUrl
    WHERE {
      ?file a ldto:Bestand .
      ?file ldto:naam ?name .
      ?file ldto:URLBestand ?url .
      ?file ldto:isRepresentatieVan ?io .
      OPTIONAL { ?file schema:position ?position . }
      FILTER(STRENDS(STR(?url), ".jpg"))
      OPTIONAL {
        ?alto a ldto:Bestand .
        ?alto ldto:URLBestand ?altoUrl .
        ?alto ldto:isRepresentatieVan ?io .
        ?alto schema:position ?position .
        FILTER(STRENDS(STR(?altoUrl), ".alto.xml"))
      }
    }
    ORDER BY ?file
    """
    results = sparql_query(page_query)

    actions = []
    for row in results:
        io = value(row, "io")
        doc_id = value(row, "file").split("/")[-1]
        doc = build_page_document(row, parent_info.get(io, {}))
        actions.append({
            "_op_type": "index",
            "_index": ES_INDEX,
            "_id": doc_id,
            "_source": doc,
        })

    if not actions:
        print("No page documents found to index.")
        return 0

    success, errors = helpers.bulk(
        es,
        actions,
        chunk_size=25,
        refresh=False,
        raise_on_error=False,
    )
    print(f"Indexed {success} page documents. Errors: {len(errors)}")
    if errors:
        for err in errors[:5]:
            print(err, file=sys.stderr)
    return success


def main() -> None:
    mapping_path = Path(__file__).with_name("elasticsearch-mapping.json")
    if not mapping_path.exists():
        mapping_path = Path(__file__).parent.parent / "elasticsearch-mapping.json"
    mapping = json.loads(mapping_path.read_text())

    es = Elasticsearch(ES_HOST, request_timeout=120)

    if es.indices.exists(index=ES_INDEX):
        es.indices.delete(index=ES_INDEX)
        print(f"Deleted existing index: {ES_INDEX}")

    es.indices.create(index=ES_INDEX, body=mapping)
    print(f"Created index: {ES_INDEX}")

    count = index_pages(es)
    es.indices.refresh(index=ES_INDEX)
    stats = es.indices.stats(index=ES_INDEX)
    total_docs = stats["_all"]["total"]["docs"]["count"]
    print(f"Index '{ES_INDEX}' now contains {total_docs} documents.")
    return 0 if count == total_docs else 1


if __name__ == "__main__":
    sys.exit(main())
