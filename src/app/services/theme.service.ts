import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.applyTheme();
    }
  }

  private detectEnvironment(): 'development' | 'acceptance' | 'production' | 'test' {
    if (!isPlatformBrowser(this.platformId)) {
      return 'development';
    }

    // Check for URL parameter first (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');
    if (themeParam && ['development', 'acceptance', 'production', 'test'].includes(themeParam)) {
      console.log(`Using theme from URL parameter: ${themeParam}`);
      return themeParam as 'development' | 'acceptance' | 'production' | 'test';
    }

    // Check for build-time environment variable
    const buildTheme = (window as any).__THEME__;
    if (buildTheme && ['development', 'acceptance', 'production', 'test'].includes(buildTheme)) {
      console.log(`Using theme from build configuration: ${buildTheme}`);
      return buildTheme as 'development' | 'acceptance' | 'production' | 'test';
    }

    // Detect environment based on hostname
    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'development';
    } else if (hostname.includes('acceptance') || hostname.includes('acc')) {
      return 'acceptance';
    } else if (hostname.includes('test')) {
      return 'test';
    } else {
      return 'production';
    }
  }

  private applyTheme(): void {
    const environment = this.detectEnvironment();
    const body = document.body;
    
    // Remove any existing theme classes
    body.classList.remove('theme-development', 'theme-acceptance', 'theme-production', 'theme-test');
    
    // Add the current theme class
    body.classList.add(`theme-${environment}`);
    
    console.log(`Applied theme: ${environment}`);
  }

  public setTheme(theme: 'development' | 'acceptance' | 'production' | 'test'): void {
    const body = document.body;
    body.classList.remove('theme-development', 'theme-acceptance', 'theme-production', 'theme-test');
    body.classList.add(`theme-${theme}`);
    console.log(`Manually set theme: ${theme}`);
  }
}
