# Google Maps MCP Server

An MCP (Model Context Protocol) server that provides Google Maps/Places API functionality for use with Claude Code and other MCP-compatible clients.

## Features

- **Search Places**: Find businesses and locations using text search
- **Place Details**: Get detailed info including reviews, hours, contact info
- **Geocoding**: Convert addresses to coordinates
- **Reverse Geocoding**: Convert coordinates to addresses
- **Distance Matrix**: Calculate travel distances and times
- **Nearby Search**: Find places by type near a location

## Setup

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the following APIs:
   - Places API
   - Geocoding API
   - Distance Matrix API
4. Create credentials (API Key)
5. Optionally restrict the key to these APIs for security

### 2. Install Dependencies

```bash
cd google-maps-mcp-server
npm install
```

### 3. Build

```bash
npm run build
```

### 4. Configure Claude Code

Add to your Claude Code MCP settings (`.claude/settings.json` or global config):

```json
{
  "mcpServers": {
    "google-maps": {
      "command": "node",
      "args": ["C:/path/to/google-maps-mcp-server/dist/index.js"],
      "env": {
        "GOOGLE_MAPS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

### search_places
Search for places/businesses.
```
query: "cleaning services in Huntsville AL"
location: "34.7304,-86.5861" (optional)
radius: 5000 (optional, in meters)
type: "store" (optional)
```

### get_place_details
Get detailed information about a place.
```
place_id: "ChIJ..." (required)
fields: "name,rating,reviews" (optional)
```

### geocode_address
Convert address to coordinates.
```
address: "123 Main St, Huntsville, AL 35801"
```

### reverse_geocode
Convert coordinates to address.
```
lat: 34.7304
lng: -86.5861
```

### get_distance_matrix
Calculate travel distance/time.
```
origins: "Huntsville, AL"
destinations: "Birmingham, AL"
mode: "driving" (optional: driving, walking, bicycling, transit)
```

### find_nearby_places
Find places near a location by type.
```
location: "34.7304,-86.5861"
radius: 5000
type: "restaurant"
keyword: "pizza" (optional)
```

## Example Usage

Once configured, you can use these tools in Claude Code:

- "Find cleaning services near Huntsville, AL"
- "Get details for place ID ChIJ..."
- "What's the driving distance from Nashville to Birmingham?"
- "Find restaurants within 1km of downtown Huntsville"

## Cost Considerations

Google Maps API has usage-based pricing. Monitor your usage in Google Cloud Console:
- Places API: ~$17 per 1000 requests
- Geocoding API: ~$5 per 1000 requests
- Distance Matrix: ~$5 per 1000 elements

Set up billing alerts to avoid unexpected charges.

## License

MIT
