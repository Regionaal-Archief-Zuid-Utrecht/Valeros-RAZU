import {
  PredicateVisibility,
  PredicateVisibilitySettings,
} from '../../models/settings/predicate-visibility-settings.model';
import { ViewMode } from '../../models/view-mode.enum';
import {
  filePredicates,
  parentPredicates,
  typePredicates,
} from './predicate.settings';

export const predicateVisibilitySettings: PredicateVisibilitySettings = {
  [ViewMode.List]: {
    [PredicateVisibility.Show]: [
      {
        predicates: [
          'aggregatieniveau',
          'archief',
          'classificatie',
          'archiefvormer',
        ],
      },
    ],
    [PredicateVisibility.Details]: [
      {
        predicates: [
          ...filePredicates,
          'https://data.razu.nl/def/ldto/heeftRepresentatie',
          'https://data.razu.nl/def/ldto/dekkingInRuimte',
          'https://data.razu.nl/def/ldto/dekkingInTijd',
          'https://data.razu.nl/def/ldto/naam',
          'https://schema.org/author',
          'https://data.razu.nl/def/ldto/omschrijving',
          'https://data.razu.nl/def/ldto/URLBestand',
          'https://www.ica.org/standards/RiC/ontology#expressedDateValue',
          'https://www.ica.org/standards/RiC/ontology#hasCreator',
          '*',
        ],
      },
    ],
    [PredicateVisibility.Hide]: [
      {
        predicates: [
          ...typePredicates,
          ...parentPredicates,
          'https://identifier.overheid.nl/tooi/def/thes/kern/c_7f9dffa7',
          'https://identifier.overheid.nl/tooi/def/thes/kern/c_42e406dd',
          'https://identifier.overheid.nl/tooi/def/thes/kern/c_f90465b3',
          'https://identifier.overheid.nl/tooi/def/thes/kern/c_7f9dffa10',
          'https://identifier.overheid.nl/tooi/def/thes/kern/c_3d782f30',
          'https://identifier.overheid.nl/tooi/def/thes/kern/c_de27ae7a',
          'https://identifier.overheid.nl/tooi/def/thes/kern/c_dfa0ff1f',
        ],
      },
    ],
  },
  [ViewMode.Grid]: {
    [PredicateVisibility.Show]: [],
    [PredicateVisibility.Details]: [{ predicates: ['*'] }],
    [PredicateVisibility.Hide]: [],
  },
};
