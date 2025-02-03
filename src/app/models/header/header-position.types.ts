export type HeaderScale = 'small' | 'medium' | 'large';
export type HeaderHorizontalPosition =
  | 'stick-to-left'
  | 'left'
  | 'center'
  | 'right'
  | 'stick-to-right';
export type HeaderVerticalPosition = 'top' | 'middle' | 'bottom';

export interface HeaderSettings {
  showLogo: boolean;
  showTitle: boolean;
  showButton: boolean;
  logoPath: string;
  titleType: 'short' | 'regular';
  scale: HeaderScale;
  gapBeforeContent: HeaderScale;
  horizontalPosition: HeaderHorizontalPosition;
  verticalPosition: HeaderVerticalPosition;
}

export interface HeaderPosition {
  isStickingLeft: boolean;
  isStickingRight: boolean;
  isStickingSide: boolean;
  effectiveVerticalPosition: HeaderVerticalPosition;
}
