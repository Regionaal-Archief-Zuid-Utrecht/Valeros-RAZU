import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  readonly imageUnavailableUrl =
    'https://placehold.co/600x400/EEE/999?text=Image+Unavailable';

  getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = url;
    });
  }

  async _getValidImageUrl(imgUrl: string): Promise<string> {
    try {
      const infoResponse = await fetch(imgUrl);
      if (infoResponse.ok) {
        return imgUrl;
      }
    } catch {}
    return this.imageUnavailableUrl;
  }
}
