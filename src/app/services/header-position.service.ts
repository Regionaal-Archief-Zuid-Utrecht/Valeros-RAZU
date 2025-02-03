import { Injectable } from '@angular/core';
import {
  HeaderPosition,
  HeaderSettings,
  HeaderVerticalPosition,
} from '../models/header/header-position.types';

@Injectable({
  providedIn: 'root',
})
export class HeaderPositionService {
  private readonly NARROW_SCREEN_THRESHOLD = 1600;

  isNarrowScreen(): boolean {
    return window.innerWidth < this.NARROW_SCREEN_THRESHOLD;
  }

  getPosition(settings: HeaderSettings): HeaderPosition {
    const { horizontalPosition } = settings;
    const isStickingLeft = horizontalPosition === 'stick-to-left';
    const isStickingRight = horizontalPosition === 'stick-to-right';
    const isStickingSide =
      (isStickingLeft || isStickingRight) && !this.isNarrowScreen();

    return {
      isStickingLeft,
      isStickingRight,
      isStickingSide,
      effectiveVerticalPosition: this.getEffectiveVerticalPosition(settings),
    };
  }

  private getEffectiveVerticalPosition(
    settings: HeaderSettings,
  ): HeaderVerticalPosition {
    const { horizontalPosition, verticalPosition } = settings;

    // Convert middle to top on narrow screens, regardless of stick position
    if (this.isNarrowScreen()) {
      return verticalPosition === 'bottom' ? 'bottom' : 'top';
    }

    // On non-stick positions, also convert middle to top
    const isStickPosition = ['stick-to-left', 'stick-to-right'].includes(
      horizontalPosition,
    );
    if (!isStickPosition) {
      return verticalPosition === 'bottom' ? 'bottom' : 'top';
    }

    return verticalPosition;
  }

  getPositionClasses(settings: HeaderSettings): string {
    const classes = ['fixed'];
    const { horizontalPosition, verticalPosition } = settings;

    // On screens below threshold, force center position
    classes.push('left-1/2 -translate-x-1/2');

    // For wider screens, apply the configured position
    if (['stick-to-left', 'left'].includes(horizontalPosition)) {
      classes.push('wide:left-0 wide:translate-x-0');
      if (horizontalPosition === 'left') {
        classes.push('wide:left-6');
      }
    } else if (['stick-to-right', 'right'].includes(horizontalPosition)) {
      classes.push('wide:right-0 wide:left-auto wide:translate-x-0');
      if (horizontalPosition === 'right') {
        classes.push('wide:right-6');
      }
    } else if (horizontalPosition === 'center') {
      classes.push('wide:left-1/2 wide:-translate-x-1/2');
    }

    // On narrow screens, only allow top or bottom position
    const smallScreenVertical =
      verticalPosition === 'bottom' ? 'bottom-0' : 'top-0';
    classes.push(smallScreenVertical);

    // For wider screens, apply the configured vertical position
    const useMiddle =
      verticalPosition === 'middle' &&
      (horizontalPosition === 'stick-to-left' ||
        horizontalPosition === 'stick-to-right');

    if (useMiddle) {
      classes.push('wide:top-1/2 wide:-translate-y-1/2 wide:bottom-auto');
    } else if (verticalPosition === 'bottom') {
      classes.push('wide:bottom-0 wide:top-auto');
    } else {
      // 'top' or fallback
      classes.push('wide:top-0 wide:bottom-auto');
    }

    return classes.join(' ');
  }

  getRoundedClasses(settings: HeaderSettings): string {
    const position = this.getPosition(settings);

    if (!position.isStickingSide) {
      // When not sticking to sides or on narrow screen, round based on vertical position only
      return position.effectiveVerticalPosition === 'top'
        ? 'rounded-b-lg'
        : position.effectiveVerticalPosition === 'bottom'
          ? 'rounded-t-lg'
          : 'rounded-lg';
    }

    // When sticking to sides on wide screen, only round the inner corners
    if (position.effectiveVerticalPosition === 'top') {
      return position.isStickingLeft ? 'rounded-br-lg' : 'rounded-bl-lg';
    }
    if (position.effectiveVerticalPosition === 'bottom') {
      return position.isStickingLeft ? 'rounded-tr-lg' : 'rounded-tl-lg';
    }
    // Middle position (only possible when sticking to sides and screen is wide)
    return position.isStickingLeft ? 'rounded-r-lg' : 'rounded-l-lg';
  }

  getPlaceholderClasses(
    settings: HeaderSettings,
    headerHeight: string,
    contentGap: string,
  ): string {
    const classes = [headerHeight];
    const position = this.getPosition(settings);

    // On narrow screens, always center
    classes.push('mx-auto');

    // On wider screens, position according to settings
    switch (settings.horizontalPosition) {
      case 'right':
        classes.push('wide:ml-auto wide:mr-6');
        break;
      case 'center':
        classes.push('wide:mx-auto');
        break;
      case 'left':
        classes.push('wide:ml-6');
        break;
      default: // stick-to positions don't need margin
        classes.push('wide:mx-0');
    }

    // Add content gap when needed
    if (position.effectiveVerticalPosition === 'top') {
      classes.push(contentGap);
    }

    return classes.join(' ');
  }
}
