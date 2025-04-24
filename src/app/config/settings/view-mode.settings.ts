import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { ViewModeSettings } from '../../models/settings/view-mode-settings.type';
import { ViewMode } from '../../models/view-mode.enum';

export const viewModeSettings: ViewModeSettings = {
  [ViewMode.List]: {
    [ViewModeSetting.ShowDetails]: true,
    [ViewModeSetting.ShowParents]: false,
    [ViewModeSetting.ShowTypes]: true,
    [ViewModeSetting.ShowTitle]: true,
    [ViewModeSetting.ShowOrganization]: false,
    [ViewModeSetting.ShowFileNextToTable]: true,
    [ViewModeSetting.EnrichWithIncomingRelations]: false, // NOTE: Detail view always enriches with incoming relations, regardless of this setting
  },
  [ViewMode.Grid]: {
    [ViewModeSetting.ShowTitle]: true,
    [ViewModeSetting.ShowDetails]: true,
    [ViewModeSetting.ShowParents]: false,
    [ViewModeSetting.ShowTypes]: true,
    [ViewModeSetting.ShowOrganization]: false,
    [ViewModeSetting.ShowFileNextToTable]: true,
    [ViewModeSetting.EnrichWithIncomingRelations]: false,
  },
};
