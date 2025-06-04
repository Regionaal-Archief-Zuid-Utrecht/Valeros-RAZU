import { ViewModeSetting } from '../../../models/settings/view-mode-setting.enum';
import { ViewModeSettings } from '../../../models/settings/view-mode-settings.type';
import { ViewMode } from '../../../models/view-mode.enum';

export const viewModeSettings: ViewModeSettings = {
  [ViewMode.List]: {
    [ViewModeSetting.ShowDetails]: true,
    [ViewModeSetting.ShowParents]: true,
    [ViewModeSetting.ShowTypes]: true,
    [ViewModeSetting.ShowTitle]: true,
    [ViewModeSetting.ShowOrganization]: false,
    [ViewModeSetting.ShowFileNextToTable]: true,
    [ViewModeSetting.EnrichWithIncomingRelations]: false,
    [ViewModeSetting.ShowDetailsButton]: true,
  },
  [ViewMode.Grid]: {
    [ViewModeSetting.ShowTitle]: true,
    [ViewModeSetting.ShowDetails]: true,
    [ViewModeSetting.ShowParents]: true,
    [ViewModeSetting.ShowTypes]: true,
    [ViewModeSetting.ShowOrganization]: false,
    [ViewModeSetting.ShowFileNextToTable]: true,
    [ViewModeSetting.EnrichWithIncomingRelations]: false,
    [ViewModeSetting.ShowDetailsButton]: false,
  },
};
