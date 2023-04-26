export interface MapboxConfig {
  accessToken: string;
  baseUrl: string;
}

export default (): { mapbox: MapboxConfig } => ({
  mapbox: {
    accessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
    baseUrl: process.env.MAPBOX_BASE_URL || 'https://api.mapbox.com'
  }
});
