import { FilterType } from '../../../models/filters/filter.model';
import { FilteringSettings } from '../../../models/settings/filtering-settings.model';
import { filteringSettings } from '../../default-settings/settings/filtering.settings';

const hideFilterOptionValueIds: string[] = [
  'https://data.razu.nl/def/ldto/ChecksumGegevens',
  'https://data.razu.nl/def/ldto/begripBegrippenlijst',
  'https://data.razu.nl/def/ldto/verwijzingIdentificatie',
  'https://data.razu.nl/def/ldto/GerelateerdInformatieobjectGegevens',
  'https://data.razu.nl/def/ldto/Object',
  'https://data.razu.nl/def/ldto/DekkingInTijdGegevens',
  'https://data.razu.nl/def/ldto/VerwijzingGegevens',
  'https://data.razu.nl/def/ldto/BegripGegevens',
  'https://data.razu.nl/def/ldto/IdentificatieGegevens',
  'https://data.razu.nl/def/ldto/BetrokkeneGegevens',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_7f9dffa7',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_42e406dd',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_f90465b3',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_7f9dffa10',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_3d782f30',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_de27ae7a',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_dfa0ff1f',
];

export const razuFilteringSettings: FilteringSettings = {
  ...filteringSettings,
  filterOptions: {
    title: {
      label: 'Titel',
      fieldIds: ['serie.keyword'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    archiefVormer: {
      label: 'Archiefvormer',
      fieldIds: ['archiefvormer.uri'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    archief: {
      label: 'Archief',
      fieldIds: ['archief'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    aggregatieniveau: {
      label: 'Aggregatieniveau',
      fieldIds: ['aggregatieniveau.uri'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    classificatie: {
      label: 'Classificatie',
      fieldIds: ['classificatie.uri'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    auteursrecht: {
      label: 'Auteursrecht',
      fieldIds: ['auteursrecht.uri'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    openbaarheid: {
      label: 'Openbaarheid',
      fieldIds: ['openbaarheid.uri'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    documentYear: {
      label: 'Jaar',
      fieldIds: ['document_year'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
      sort: {
        type: '_key',
        order: 'asc',
      },
    },
    documentMonth: {
      label: 'Maand',
      fieldIds: ['document_month'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
      showOnlyForSelectedFilters: {
        documentYear: {
          fieldIds: ['document_year'],
          valueIds: [],
          type: FilterType.Field,
        },
      },
      sort: {
        type: '_key',
        order: 'asc',
      },
    },
    documentDay: {
      label: 'Dag',
      fieldIds: ['document_day'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
      showOnlyForSelectedFilters: {
        documentMonth: {
          fieldIds: ['document_month'],
          valueIds: [],
          type: FilterType.Field,
        },
      },
      sort: {
        type: '_key',
        order: 'asc',
      },
    },
  },
};
