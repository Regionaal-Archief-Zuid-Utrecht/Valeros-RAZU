import { PredicateSettings } from '../../models/settings/predicate-settings.model';

export const typePredicates: string[] = [
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  'https://schema.org/additionalType',
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
  'https://www.ica.org/standards/RiC/ontology#isOrWasIncludedIn',
  'https://schema.org/isPartOf',
  'https://schema.org/hadPrimarySource',
];

export const filePredicates: string[] = [
  'http://xmlns.com/foaf/0.1/depiction',
  'https://schema.org/image',
  'bestand_url',
];

export const hopFilePredicates: string[][] = [
  [
    'https://data.razu.nl/def/ldto/heeftRepresentatie',
    'https://data.razu.nl/def/ldto/URLBestand',
  ],
];

export const predicateSettings: PredicateSettings = {
  parents: parentPredicates,
  label: labelPredicates,
  type: typePredicates,
  files: filePredicates,
  hopFiles: hopFilePredicates,
};
