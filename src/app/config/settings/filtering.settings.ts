import { FilterPanelLocation } from '../../models/settings/filter-panel-location.enum';
import { FilteringSettings } from '../../models/settings/filtering-settings.model';

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

export const filteringSettings: FilteringSettings = {
  showFilterPanel: true,
  showImageFilter: false, // TODO: Remove
  showOrganizationsFilter: false,
  filterPanelLocation: FilterPanelLocation.Left,
  minNumOfValuesForFilterOptionToAppear: 1,
  filterOptions: {
    archiefVormer: {
      label: 'Archiefvormer',
      fieldIds: ['archiefvormer'],
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
      fieldIds: ['aggregatieniveau'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    classificatie: {
      label: 'Classificatie',
      fieldIds: ['classificatie'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    licenties: {
      label: 'Licenties',
      fieldIds: ['licenties'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
    wettelijke_beperkingen_openbaarheid: {
      label: 'Wettelijke beperkingen openbaarheid',
      fieldIds: ['wettelijke_beperkingen_openbaarheid'],
      values: [],
      hideValueIds: [...hideFilterOptionValueIds],
    },
  },
};
