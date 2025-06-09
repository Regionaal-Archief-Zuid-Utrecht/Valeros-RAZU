export enum AboutPosition {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export interface AboutSettings {
  showLogo: boolean;
  showTitle: boolean;
  showColofonButton: boolean;
  logoPath: string;
  position: AboutPosition;
}
