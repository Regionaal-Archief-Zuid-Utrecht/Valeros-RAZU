export interface MiscSettings {
  maxNumParallelRequests: number;
  prefixMap: Record<string, string>;
  razu: {
    sura: {
      url: string;
      matchUrlsSubstring: string;
    };
  };
  pdfConversionUrl: string;
}

export const miscSettings: MiscSettings = {
  maxNumParallelRequests: 4, // 4 SPARQL workers max for Triply
  prefixMap: {
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#': 'rdf:',
    'http://www.w3.org/2000/01/rdf-schema#': 'rdfs:',
    'http://www.w3.org/2004/02/skos/core#': 'skos:',
    'https://schema.org/': 'schema:',
    'http://xmlns.com/foaf/0.1/': 'foaf:',
    'https://www.ica.org/standards/RiC/ontology#': 'rico:',
    'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#':
      'ric-rst:',
    'https://data.cbg.nl/pico-terms#': 'picot:',
    'http://www.nationaalarchief.nl/mdto-shacl#': 'mdto-sh:',
    'http://www.w3.org/ns/shacl#': 'sh:',
  },
  razu: {
    sura: {
      url: 'https://ontwikkel.viewer.razu.nl/sura/process-url',
      matchUrlsSubstring: 'opslag.razu.nl',
    },
  },
  pdfConversionUrl: 'https://ontwikkel.viewer.razu.nl/gotenberg/convert?url=',
};
