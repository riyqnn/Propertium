import React, { useEffect, useRef, useState } from 'react';

export default function Maps() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapStyle, setMapStyle] = useState('osm');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState('');
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Map tile sources
  const mapTiles = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri, Maxar, Earthstar Geographics'
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© OpenTopoMap (CC-BY-SA)'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '© OpenStreetMap © CARTO'
    }
  };

  // Load Leaflet dynamically
  useEffect(() => {
    // Check if already loaded
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // Load CSS
    const cssLink = document.createElement('link');
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    cssLink.rel = 'stylesheet';
    cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    cssLink.crossOrigin = '';
    document.head.appendChild(cssLink);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => {
      setLeafletLoaded(true);
    };
    script.onerror = () => {
      setError('Failed to load Leaflet library');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      try {
        document.head.removeChild(cssLink);
        document.head.removeChild(script);
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || map.current || !mapContainer.current || !window.L) return;

    try {
      // Initialize map
      map.current = window.L.map(mapContainer.current, {
        center: [-6.175403054116954, 106.82717425766694], // Jakarta coordinates [lat, lng]
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true
      });

      // Add initial tile layer
      const tileLayer = window.L.tileLayer(mapTiles[mapStyle].url, {
        attribution: mapTiles[mapStyle].attribution,
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      });
      tileLayer.addTo(map.current);

      // Add a marker for Jakarta
      const jakartaMarker = window.L.marker([-6.175403054116954, 106.82717425766694])
        .addTo(map.current)
        .bindPopup('<b>Jakarta, Indonesia</b><br>Pusat Kota Jakarta')
        .openPopup();

      // Map loaded event
      map.current.whenReady(() => {
        console.log('Map loaded successfully');
        setIsMapLoaded(true);
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [leafletLoaded, mapStyle]);

  // Handle style changes
  const changeMapStyle = (newStyle) => {
    if (map.current && isMapLoaded) {
      setMapStyle(newStyle);
      
      // Remove existing tile layers
      map.current.eachLayer((layer) => {
        if (layer instanceof window.L.TileLayer) {
          map.current.removeLayer(layer);
        }
      });

      // Add new tile layer
      const newTileLayer = window.L.tileLayer(mapTiles[newStyle].url, {
        attribution: mapTiles[newStyle].attribution,
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      });
      newTileLayer.addTo(map.current);

      // Re-add Jakarta marker
      const jakartaMarker = window.L.marker([-6.175403054116954, 106.82717425766694])
        .addTo(map.current)
        .bindPopup('<b>Jakarta, Indonesia</b><br>Pusat Kota Jakarta');
    }
  };

  // Handle search
  const handleSearch = () => {
    if (map.current && searchQuery) {
      // Simple search simulation - in real app, use geocoding API
      const searchLocations = {
        'jakarta': [-6.175403054116954, 106.82717425766694],
        'bandung': [-6.9175, 107.6191],
        'surabaya': [-7.2575, 112.7521],
        'medan': [3.5952, 98.6722],
        'bali': [-8.3405, 115.0920],
        'yogyakarta': [-7.7956, 110.3695]
      };

      const searchLower = searchQuery.toLowerCase();
      let found = false;

      for (const [city, coords] of Object.entries(searchLocations)) {
        if (city.includes(searchLower) || searchLower.includes(city)) {
          map.current.setView(coords, 12);
          
          // Add marker for searched location
          window.L.marker(coords)
            .addTo(map.current)
            .bindPopup(`<b>${city.charAt(0).toUpperCase() + city.slice(1)}</b><br>Hasil pencarian`)
            .openPopup();
          
          found = true;
          break;
        }
      }

      if (!found) {
        alert(`Lokasi "${searchQuery}" tidak ditemukan. Coba: Jakarta, Bandung, Surabaya, Medan, Bali, Yogyakarta`);
      }
    }
  };

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">Map Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Failed to load Leaflet library from CDN
          </p>
        </div>
      </div>
    );
  }

  if (!leafletLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Map Library</h2>
          <p className="text-gray-600">
            Downloading Leaflet.js...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-200">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* Loading Indicator */}
      {!isMapLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Initializing Map...</p>
          </div>
        </div>
      )}

      {/* Style Switcher */}
      {isMapLoaded && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          {Object.keys(mapTiles).map((style) => (
            <button
              key={style}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg ${
                mapStyle === style 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
              onClick={() => changeMapStyle(style)}
            >
              {style === 'osm' ? 'Street' : style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Search Feature */}
      {isMapLoaded && (
        <div className="absolute top-4 left-4 w-80 z-10">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kota (Jakarta, Bandung, Surabaya...)"
              className="w-full p-3 pl-10 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-lg bg-white"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cari
            </button>
          </div>
        </div>
      )}

      {/* Map Info */}
      {isMapLoaded && (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg z-10">
          <div className="text-xs text-gray-600">
            <div className="font-semibold">🗺️ Leaflet Map</div>
            <div>Style: {mapStyle === 'osm' ? 'Street' : mapStyle}</div>
            <div>Zoom & Pan enabled</div>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-10">
        <div>Style: {mapStyle}</div>
        <div>Loaded: {isMapLoaded ? 'Yes' : 'No'}</div>
        <div>Leaflet: {leafletLoaded ? 'Ready' : 'Loading...'}</div>
      </div>
    </div>
  );
}