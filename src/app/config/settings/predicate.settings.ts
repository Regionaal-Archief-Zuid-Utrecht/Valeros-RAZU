export const typePredicates: string[] = [
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  'https://data.razu.nl/def/ldto/classificatie',
];

export const labelPredicates: string[] = [
  'naam',
  'http://www.w3.org/2000/01/rdf-schema#label',
  'http://www.w3.org/2004/02/skos/core#prefLabel',
  'https://data.razu.nl/def/ldto/naam',
  'https://data.razu.nl/def/ldto/begripLabel',
  'https://data.razu.nl/def/ldto/verwijzingNaam',
  'https://data.razu.nl/def/ldto/identificatieKenmerk',
];

export const parentPredicates: string[] = [
  'https://data.razu.nl/def/ldto/isOnderdeelVan',
];
