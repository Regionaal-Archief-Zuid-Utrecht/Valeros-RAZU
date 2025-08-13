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
    type: {
      label: 'Type',
      fieldIds: ['type'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    source: {
      label: 'Bron',
      fieldIds: ['source'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    participants: {
      label: 'Deelnemers',
      fieldIds: ['participants'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    location: {
      label: 'Locatie',
      fieldIds: ['location'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    date: {
      label: 'Datering',
      fieldIds: ['startDate'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    researched: {
      label: 'Onderzocht',
      fieldIds: ['researched'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    }
  },
};
