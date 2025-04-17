import { HeaderSettings } from '../../models/header/header-position.types';

export const headerSettings: HeaderSettings = {
  showLogo: true,
  showTitle: false,
  showButton: false,
  logoPath: '/assets/img/logo.svg',
  titleType: 'short' as const,
  scale: 'small' as const,
  gapBeforeContent: 'small' as const,
  horizontalPosition: 'left' as const,
  verticalPosition: 'top' as const,
};
