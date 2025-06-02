import { ViewModeSetting } from '../../../models/settings/view-mode-setting.enum';
import { ViewModeSettings } from '../../../models/settings/view-mode-settings.type';
import { ViewMode } from '../../../models/view-mode.enum';
import { viewModeSettings } from '../../default-settings/view-mode.settings';

export const razuViewModeSettings: ViewModeSettings = {
  [ViewMode.List]: {
    ...viewModeSettings[ViewMode.List],
    [ViewModeSetting.ShowParents]: false,
    [ViewModeSetting.ShowOrganization]: false,
  },
  [ViewMode.Grid]: {
    ...viewModeSettings[ViewMode.Grid],
    [ViewModeSetting.ShowParents]: false,
    [ViewModeSetting.ShowOrganization]: false,
  },
};
