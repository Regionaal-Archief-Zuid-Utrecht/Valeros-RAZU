import json
from elasticsearch import Elasticsearch
from elasticsearch import helpers
import os
import requests
import xml.etree.ElementTree as ET

mapping_release = "6"


# Params used by the queries

# index_name = "de-gecombineerde"
# title_id = 2

# index_name = "de-gecombineerde-gelderland"
# title_id = 3

# index_name = "de-gecombineerde-midden-nederland"
# title_id = 4

# index_name = "de-gecombineerde-vijfheerenlanden"
# title_id = 5

# index_name = "de-gecombineerde-west-betuwe"
# title_id = 6

# index_name = "de-gecombineerde-zuid-holland"
# title_id = 7

# index_name = "leerdamsche-courant"
# title_id = 8

# index_name = "het-driemanschap"
# title_id = 9

# index_name = "de-voorlichter"
# title_id = 10

# index_name = "amerongsche-courant"
# title_id = 11

# index_name = "de-boekenwereld"
# title_id = 12

# index_name = "de-kaap"
# title_id = 13

# index_name = "asperensche-en-heukelumsche-courant"
# title_id = 14

# index_name = "de-leerdammer"
# title_id = 15

# index_name = "de-lek"
# title_id = 16

# index_name = "de-lingestreek"
# title_id = 17

# index_name = "e9"
# title_id = 18

# index_name = "gelderse-koerier"
# title_id = 19

# index_name = "het-nieuws"
# title_id = 20

# index_name = "het-trefpunt"
# title_id = 21

# index_name = "het-kontakt-vianen"
# title_id = 22

# index_name = "de-lekstroom"
# title_id = 23

# index_name = "nieuwe-tielsche-courant"
# title_id = 24 

# index_name ="pension-en-woningcourant"
# title_id = 25

# index_name = "stichts-nieuws-en-handelsblad"
# title_id = 26

# DONE!
# index_name = "stichtse-courant"
# title_id = 27

# index_name = "de-vijfheerenlanden"
# title_id = 28

# index_name = "vianen-post"
# title_id = 29

# index_name = "vianensche-courant"
# title_id = 30

# index_name = "weekbode"
# title_id = 31 

# index_name = "weekend-post"
# title_id = 32 

# index_name = "wijks-nieuws-bunniks-nieuws"
# title_id = 33

# index_name = "wijkse-courant"
# title_id = 34

# index_name = "zenderstreeknieuws"
# title_id = 35

# index_name = "ameidensch-nieuwsblad"
# title_id = 36

# index_name = "de-burensche-courant"
# title_id = 37

index_name = "demo-kranten"
title_id = 34

limit = ""


# END Params used by the queries


source_dir = os.getenv("SEED_DIR", "./demo/s3/k50907905")

index_name = f"{index_name}_m{mapping_release}"


# Connect to Elasticsearch
es = Elasticsearch(
    os.getenv('ES_URL', 'http://localhost:9200'),
    http_compress=True,
    request_timeout=120
)


# Load mapping
with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "mapping_kranten.json"), "r") as f:
    mapping = json.load(f)

# Function to execute SPARQL query and return results
import time

def execute_sparql_query(query, max_retries=5, wait_seconds=5):
    sparql_endpoint = os.getenv('SPARQL_ENDPOINT', 'http://localhost:7001')
    last_exception = None
    for attempt in range(1, max_retries + 1):
        try:
            response = requests.post(
                sparql_endpoint,
                data={"query": query},
                headers={"Accept": "application/sparql-results+json"},
                timeout=120,
            )
            response.raise_for_status()
            return response.json()["results"]["bindings"]
        except Exception as e:
            print(f"SPARQL query failed (attempt {attempt}/{max_retries}): {e}")
            print("SPARQL query that failed:")
            print(query)
            last_exception = e
            if attempt < max_retries:
                time.sleep(wait_seconds)
    print(f"SPARQL query failed after {max_retries} attempts. Giving up.")
    raise last_exception


# Gemeenschappelijke functie voor verwerken en indexeren van resultaten
def process_and_index_results(results):
    actions = []
    for result in results:
        doc = {
            "@id": result["id"]["value"] if "id" in result else "",
            "archief": result["archief"]["value"] if "archief" in result else "",
            "archiefvormer": {
                "uri": result["archiefvormer_uri"]["value"] if "archiefvormer_uri" in result else "",
                "label": result["archiefvormer"]["value"] if "archiefvormer" in result else ""
            },
            "serie": result["serie"]["value"] if "serie" in result else "",
            "naam": result["naam"]["value"] if "naam" in result else "",
            "classificatie": {
                "uri": result["classificatie_uri"]["value"] if "classificatie_uri" in result else "",
                "label": result["classificatie"]["value"] if "classificatie" in result else ""
            },
            "aggregatieniveau": {
                "uri": result["aggregatieniveau_uri"]["value"] if "aggregatieniveau_uri" in result else "",
                "label": result["aggregatieniveau"]["value"] if "aggregatieniveau" in result else ""
            },
            "isOnderdeelVan": result["is_onderdeel_van"]["value"] if "is_onderdeel_van" in result else ""
        }
        # Extra velden voor page-query
        if "position" in result:
            doc["position"] = result["position"]["value"]
        if "URL_bestand" in result:
            doc["URL_bestand"] = result["URL_bestand"]["value"]
            url = result["URL_bestand"]["value"]
            # Strip 'http://localhost:9000/k50907905/' van het begin
            if url.startswith("http://localhost:9000/k50907905/"):
                rel_path = url[len("http://localhost:9000/k50907905/"):]
            else:
                rel_path = url
            file_path = os.path.join(source_dir, rel_path)
            try:
                tree = ET.parse(file_path)
                root = tree.getroot()
                # Dynamisch de namespace bepalen uit het <alto> element
                ns = ''
                if root.tag.startswith('{'):
                    ns = root.tag.split('}')[0].strip('{')
                nsmap = {'alto': ns} if ns else {}
                ocr_text = ""
                for page in root.findall('.//alto:Page', nsmap):
                    for textline in page.findall('.//alto:TextLine', nsmap):
                        for string in textline.findall('alto:String', nsmap):
                            ocr_text += string.attrib.get('CONTENT', '') + ' '
                doc["full_text"] = ocr_text.strip()
            except FileNotFoundError:
                print(f"File not found: {file_path}")
            except ET.ParseError:
                print(f"Error parsing file: {file_path}")
        # Optionele velden
        if "auteursrecht_uri" in result:
            doc["auteursrecht"] = {
                "uri": result["auteursrecht_uri"]["value"],
                "label": result["auteursrecht_label"]["value"] if "auteursrecht_label" in result else ""
            }
            if "auteursrecht_melding" in result:
                doc["auteursrecht"]["melding"] = result["auteursrecht_melding"]["value"]
            if "copyright_holder" in result:
                doc["auteursrecht"]["copyright_holder"] = result["copyright_holder"]["value"]
        if "openbaarheid_uri" in result:
            doc["openbaarheid"] = {
                "uri": result["openbaarheid_uri"]["value"],
                "label": result["openbaarheid_label"]["value"] if "openbaarheid_label" in result else ""
            }
        if "volume" in result:
            doc["volume"] = result["volume"]["value"]
        if "document_year" in result:
            doc["document_year"] = result["document_year"]["value"]
        if "document_month" in result:
            doc["document_month"] = result["document_month"]["value"]
        if "document_day" in result:
            doc["document_day"] = result["document_day"]["value"]
        if "spatial_names" in result:
            doc["spatialCoverage"] = result["spatial_names"]["value"].split(", ")
        doc_id = result["_id"]["value"]
        actions.append({
            "_op_type": "index",
            "_index": index_name,
            "_id": doc_id,
            "_source": doc,
        })
    if actions:
        es_with_opts = es.options(request_timeout=120)
        success, errors = helpers.bulk(
            es_with_opts,
            actions,
            chunk_size=25,
            refresh=False,
            raise_on_error=False,
        )
        print(f"Bulk indexed {success} documents. Errors: {len(errors)}")


def prepare_query(query) -> str:
    query = query.replace('__TITLE_ID__', str(title_id))
    query = query.replace('__INDEX__', index_name)
    query = query.replace('__LIMIT__', limit)
    return query  

# Function to process metadata-only query results en index them
def process_metadata_query():
    query = """
      PREFIX ldto: <https://data.razu.nl/def/ldto/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX schema: <http://schema.org/>

      SELECT 
        ?index ?_id ?id
        ?archief ?archiefvormer_uri ?archiefvormer
        ?serie ?naam  
        ?classificatie_uri ?classificatie
        ?aggregatieniveau_uri ?aggregatieniveau
        ?is_onderdeel_van 
        ?auteursrecht_uri ?auteursrecht_label ?auteursrecht_melding ?copyright_holder
        ?openbaarheid_uri ?openbaarheid_label
        ?volume ?document_year ?document_month ?document_day 
        ?spatial_names
      WHERE {
        BIND("__INDEX__" AS ?index)
        
        BIND("Collectie kranten RAZU" AS ?archief)
        BIND("https://data.razu.nl/id/actor/2bdb658a032a405d71c19159bd2bbb3a" AS ?archiefvormer_uri)
        BIND("Regionaal Archief Zuid-Utrecht" AS ?archiefvormer)
        
        { 
          ?s ldto:isOnderdeelVan <https://data.razu.nl/id/object/nl-wbdrazu-k50907905-689-__TITLE_ID__> . 
        } UNION { 
          BIND(<https://data.razu.nl/id/object/nl-wbdrazu-k50907905-689-__TITLE_ID__> AS ?s) 
        }

        ?s a ldto:Informatieobject .
          
        BIND(STR(?s) AS ?id)
        BIND(REPLACE(?id, "^.*/", "") AS ?_id)
                
        ?s (ldto:isOnderdeelVan)? ?serie_entiteit .
        ?serie_entiteit ldto:aggregatieniveau <https://data.razu.nl/id/aggregatieniveau/cd4b9482eadd1fea35dbf01c9a05b093> ;
          ldto:naam ?serie .
            
        ?s ldto:naam ?naam .

        ?s ldto:classificatie ?classificatie_uri .
        ?classificatie_uri skos:prefLabel ?classificatie .

        ?s ldto:aggregatieniveau ?aggregatieniveau_uri .
        ?aggregatieniveau_uri skos:prefLabel ?aggregatieniveau .

        ?s ldto:isOnderdeelVan ?is_onderdeel_van .

        OPTIONAL {
          ?s ldto:beperkingGebruik ?beperking_gebruik .
          ?beperking_gebruik ldto:beperkingGebruikType ?auteursrecht_uri .
          <https://data.razu.nl/id/beperkinggebruiktype/3e82de530014486e637ea9257088ccea> skos:member ?auteursrecht_uri .
          ?auteursrecht_uri skos:prefLabel ?auteursrecht_label .
          OPTIONAL { ?beperking_gebruik schema:copyrightNotice ?auteursrecht_melding . }
          OPTIONAL { ?beperking_gebruik schema:copyrightHolder/skos:prefLabel ?copyright_holder . }
        }

        OPTIONAL {
          ?s ldto:beperkingGebruik/ldto:beperkingGebruikType ?openbaarheid_uri .
          <https://data.razu.nl/id/beperkinggebruiktype/45d3fea5c7895348590a22f5134fd2d7> skos:member ?openbaarheid_uri .
          ?openbaarheid_uri skos:prefLabel ?openbaarheid_label .
        }
              
        OPTIONAL { ?s schema:mainEntity/schema:isPartOf/schema:volumeNumber ?volume. }

        OPTIONAL {
          ?s schema:mainEntity/schema:datePublished ?publicatiedatum .
          BIND(SUBSTR(STR(?publicatiedatum), 1, 4) AS ?document_year)
          BIND(SUBSTR(STR(?publicatiedatum), 1, 7) AS ?document_month)
          BIND(STR(?publicatiedatum) AS ?document_day)
        }

        OPTIONAL {
          SELECT ?s (GROUP_CONCAT(DISTINCT ?spatial_name; separator=", ") AS ?spatial_names)
          WHERE {
            ?s schema:mainEntity/schema:isPartOf/schema:spatialCoverage/schema:name ?spatial_name .
          } GROUP BY ?s
        }
      }
      __LIMIT__ 
    """

    query = prepare_query(query)
    results = execute_sparql_query(query)
    process_and_index_results(results)


# Function to process pages query results and index them
def process_pages_query():
    batch_size = 100
    offset = 0
    total_results = 0
    while True:
        limit_clause = f"LIMIT {batch_size} OFFSET {offset}"
        query = """
          PREFIX ldto: <https://data.razu.nl/def/ldto/>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          PREFIX schema: <http://schema.org/>

          SELECT 
            ?index ?_id ?id
            ?archief ?archiefvormer_uri ?archiefvormer
            ?serie ?naam
            ?classificatie_uri ?classificatie
            ?aggregatieniveau_uri ?aggregatieniveau
            ?is_onderdeel_van 
            ?auteursrecht_uri ?auteursrecht_label ?auteursrecht_melding ?copyright_holder
            ?openbaarheid_uri ?openbaarheid_label
            ?volume ?document_year ?document_month ?document_day 
            ?spatial_names
            ?position
            ?URL_bestand
          WHERE { 
            BIND("__INDEX__" AS ?index) 

            ?bestand_uri ldto:isRepresentatieVan ?io .
            ?bestand_uri a ldto:Bestand .
            ?bestand_uri ldto:bestandsformaat <https://data.razu.nl/id/bestandsformaat/63e8775df9a69fa0aadbb461fafe4c1e> .
            ?bestand_uri ldto:URLBestand ?URL_bestand .
            
            ?bestand_uri schema:position ?position .
            ?io (ldto:isOnderdeelVan)+ <https://data.razu.nl/id/object/nl-wbdrazu-k50907905-689-__TITLE_ID__> .
            BIND(CONCAT(STR(?io),"#", STR(?position)) AS ?id)
            BIND(REPLACE(REPLACE(?id, "^.*/", ""), "#", "%23") AS ?_id)


            BIND("Collectie kranten RAZU" AS ?archief)
            BIND("https://data.razu.nl/id/actor/2bdb658a032a405d71c19159bd2bbb3a" AS ?archiefvormer_uri)
            BIND("Regionaal Archief Zuid-Utrecht" AS ?archiefvormer)

            ?io (ldto:isOnderdeelVan)? ?serie_entiteit .
            ?serie_entiteit ldto:aggregatieniveau <https://data.razu.nl/id/aggregatieniveau/cd4b9482eadd1fea35dbf01c9a05b093> ;
                  ldto:naam ?serie .

            ?io ldto:naam ?naam_aflevering
            BIND(CONCAT(?naam_aflevering, ", p. ", STR(?position)) AS ?naam)

            BIND("https://data.razu.nl/id/soort/265753c2d190a0266797b69903c13123" AS ?classificatie_uri)
            BIND("Pagina" AS ?classificatie)

            BIND("https://data.razu.nl/id/aggregatieniveau/2cb05e4bb7830be982f0922fed86b4cd" AS ?aggregatieniveau_uri)
            BIND("Component" AS ?aggregatieniveau)

            BIND(?io AS ?is_onderdeel_van)
            
            OPTIONAL {
              ?io ldto:beperkingGebruik ?beperking_gebruik .
              ?beperking_gebruik ldto:beperkingGebruikType ?auteursrecht_uri .
              <https://data.razu.nl/id/beperkinggebruiktype/3e82de530014486e637ea9257088ccea> skos:member ?auteursrecht_uri .
              ?auteursrecht_uri skos:prefLabel ?auteursrecht_label .
              OPTIONAL { ?beperking_gebruik schema:copyrightNotice ?auteursrecht_melding . }
              OPTIONAL { ?beperking_gebruik schema:copyrightHolder/skos:prefLabel ?copyright_holder . }
            }

            OPTIONAL {
              ?io ldto:beperkingGebruik/ldto:beperkingGebruikType ?openbaarheid_uri .
              <https://data.razu.nl/id/beperkinggebruiktype/45d3fea5c7895348590a22f5134fd2d7> skos:member ?openbaarheid_uri .
              ?openbaarheid_uri skos:prefLabel ?openbaarheid_label .
            }

            OPTIONAL { ?io schema:mainEntity/schema:isPartOf/schema:volumeNumber ?volume. }

            OPTIONAL {
              ?io schema:mainEntity/schema:datePublished ?publicatiedatum .
              BIND(SUBSTR(STR(?publicatiedatum), 1, 4) AS ?document_year)
              BIND(SUBSTR(STR(?publicatiedatum), 1, 7) AS ?document_month)
              BIND(STR(?publicatiedatum) AS ?document_day)
            }

            OPTIONAL {
              SELECT ?io (GROUP_CONCAT(DISTINCT ?spatial_name; separator=", ") AS ?spatial_names)
              WHERE {
                ?io schema:mainEntity/schema:isPartOf/schema:spatialCoverage/schema:name ?spatial_name .
              }
              GROUP BY ?io
            }
          } 
          __LIMIT__
        """
        query = prepare_query(query.replace("__LIMIT__", limit_clause))
        results = execute_sparql_query(query)
        if not results:
            break
        process_and_index_results(results)
        count = len(results)
        total_results += count
        print(f"Processed {count} results (offset {offset})")
        if count < batch_size:
            break
        offset += batch_size
    print(f"Total processed page results: {total_results}")


def main():
    # Check if index exists and create if it doesn't
    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name, body=mapping)
        print(f"Created new index: {index_name}")
    else:
        print(f"Index {index_name} already exists")
    
    # Process and index metadata-only documents
    print("Processing metadata-only documents...")
    process_metadata_query()
    
    # Process and index page documents with URL_bestand
    print("\nProcessing page documents with URL_bestand...")
    process_pages_query()
    
    # Show index stats
    stats = es.indices.stats(index=index_name)
    print(f"\nIndex stats:")
    print(f"Document count: {stats['_all']['total']['docs']['count']}")


if __name__ == "__main__":
    main()
