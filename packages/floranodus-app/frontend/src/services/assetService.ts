interface AssetMetadata {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'model' | 'texture';
  path: string;
  size?: number;
  dimensions?: { width: number; height: number };
  tags?: string[];
}

class AssetService {
  private assetCache: Map<string, AssetMetadata> = new Map();
  private baseAssetPath = '/assets';

  async loadAssetManifest() {
    try {
      const response = await fetch(`${this.baseAssetPath}/manifest.json`);
      if (response.ok) {
        const manifest = await response.json();
        manifest.assets.forEach((asset: AssetMetadata) => {
          this.assetCache.set(asset.id, asset);
        });
        console.log(`📦 Loaded ${this.assetCache.size} assets`);
      }
    } catch (error) {
      console.warn('No asset manifest found, using default assets');
    }
  }

  getAssetUrl(assetId: string): string {
    const asset = this.assetCache.get(assetId);
    if (asset) {
      return `${this.baseAssetPath}/${asset.path}`;
    }
    // Fallback to direct path if not in manifest
    return `${this.baseAssetPath}/${assetId}`;
  }

  async uploadAsset(file: File): Promise<AssetMetadata> {
    // For now, store in memory - in production, this would upload to backend
    const assetId = `local-${Date.now()}-${file.name}`;
    const url = URL.createObjectURL(file);
    
    const metadata: AssetMetadata = {
      id: assetId,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'model',
      path: url,
      size: file.size
    };

    // If it's an image, get dimensions
    if (metadata.type === 'image') {
      const dimensions = await this.getImageDimensions(url);
      metadata.dimensions = dimensions;
    }

    this.assetCache.set(assetId, metadata);
    return metadata;
  }

  private async getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = url;
    });
  }

  getAssetsByType(type: AssetMetadata['type']): AssetMetadata[] {
    return Array.from(this.assetCache.values()).filter(asset => asset.type === type);
  }
}

export const assetService = new AssetService(); 