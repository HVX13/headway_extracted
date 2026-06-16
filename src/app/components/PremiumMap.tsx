import { useEffect, useRef } from 'react';
import L from 'leaflet';

const defaultPropertyLocation: [number, number] = [18.9579, 72.8162];

const landmarks = [
  { name: 'Marine Drive', position: [18.9432, 72.8236] as [number, number], distance: '5 min' },
  { name: 'Nariman Point', position: [18.9254, 72.8243] as [number, number], distance: '12 min' },
  { name: 'Breach Candy', position: [18.9712, 72.8051] as [number, number], distance: '8 min' },
  { name: 'Grant Road Station', position: [18.9640, 72.8150] as [number, number], distance: '10 min walk' },
  { name: 'BKC', position: [19.0596, 72.8656] as [number, number], distance: '25 min' },
];


interface ComparableProperty {
  name: string;
  price: string;
  position: [number, number];
}

interface PremiumMapProps {
  comparableProperties?: ComparableProperty[];
  hoveredCompIndex?: number | null;
  centerPosition?: [number, number];
}

export default function PremiumMap({ comparableProperties, hoveredCompIndex, centerPosition }: PremiumMapProps = {}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const compMarkersRef = useRef<L.Marker[]>([]);

  const propertyLocation = centerPosition || defaultPropertyLocation;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: propertyLocation,
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    });

    const hybridLayer = L.layerGroup([
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
      }),
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      })
    ]);

    streetLayer.addTo(map);

    const baseMaps = {
      "Street": streetLayer,
      "Satellite": satelliteLayer,
      "Hybrid": hybridLayer
    };

    L.control.layers(baseMaps, {}, {
      position: 'topright'
    }).addTo(map);

    const propertyIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAzMCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgM0M5LjQ3NyAzIDUgNy40NzcgNSAxM2MwIDguNzUgMTAgMjQgMTAgMjRzMTAtMTUuMjUgMTAtMjRjMC01LjUyMy00LjQ3Ny0xMC0xMC0xMHoiIGZpbGw9IiMwRjNEMkUiIHN0cm9rZT0iI0ZBRjhGNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTUiIGN5PSIxMyIgcj0iNCIgZmlsbD0iI0I4OTM1RSIvPjwvc3ZnPg==',
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

    const landmarkIcon = L.divIcon({
      html: '<div style="width: 10px; height: 10px; background: #B8935E; border: 2px solid #FAF8F5; border-radius: 50%; box-shadow: 0 2px 8px rgba(184, 147, 94, 0.4);"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      className: '',
    });

    L.circle(propertyLocation, {
      radius: 500,
      fillColor: '#B8935E',
      fillOpacity: 0.15,
      color: '#B8935E',
      opacity: 0.3,
      weight: 2,
    }).addTo(map);

    L.marker(propertyLocation, { icon: propertyIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; font-family: 'Inter', sans-serif;">
          <div style="font-family: 'Crimson Pro', serif; font-size: 16px; color: #B8935E; margin-bottom: 4px;">
            Rushab Apartments
          </div>
          <div style="font-size: 11px; color: rgba(250, 248, 245, 0.8);">Asset HC-017</div>
          <div style="font-size: 11px; color: rgba(250, 248, 245, 0.8); margin-top: 8px;">Girgaum, South Mumbai</div>
          <div style="font-size: 13px; color: #B8935E; margin-top: 8px;">₹4.15 Cr</div>
        </div>
      `);

    landmarks.forEach((landmark) => {
      L.marker(landmark.position, { icon: landmarkIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; font-family: 'Inter', sans-serif;">
            <div style="font-size: 13px; color: #B8935E; margin-bottom: 4px;">
              ${landmark.name}
            </div>
            <div style="font-size: 11px; color: rgba(250, 248, 245, 0.8);">${landmark.distance}</div>
          </div>
        `);
    });

    // Add comparable property markers if provided
    if (comparableProperties) {
      const compIcon = L.divIcon({
        html: '<div style="width: 12px; height: 12px; background: #0F3D2E; border: 2px solid #FAF8F5; border-radius: 50%; box-shadow: 0 2px 8px rgba(15, 61, 46, 0.4);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: '',
      });

      comparableProperties.forEach((comp, index) => {
        const marker = L.marker(comp.position, { icon: compIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; font-family: 'Inter', sans-serif;">
              <div style="font-size: 13px; color: #FAF8F5; margin-bottom: 4px; font-weight: 500;">
                ${comp.name}
              </div>
              <div style="font-size: 12px; color: #B8935E;">${comp.price}</div>
            </div>
          `);
        compMarkersRef.current.push(marker);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      compMarkersRef.current = [];
    };
  }, [comparableProperties]);

  // Handle hover state changes
  useEffect(() => {
    if (!mapInstanceRef.current || !comparableProperties) return;

    compMarkersRef.current.forEach((marker, index) => {
      if (index === hoveredCompIndex) {
        marker.openPopup();
        // Add a pulsing effect by temporarily changing the icon
        const highlightIcon = L.divIcon({
          html: '<div style="width: 16px; height: 16px; background: #B8935E; border: 3px solid #FAF8F5; border-radius: 50%; box-shadow: 0 0 12px rgba(184, 147, 94, 0.8); animation: pulse 0.5s ease-in-out;"></div>',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          className: '',
        });
        marker.setIcon(highlightIcon);
      } else {
        marker.closePopup();
        // Reset to normal icon
        const normalIcon = L.divIcon({
          html: '<div style="width: 12px; height: 12px; background: #0F3D2E; border: 2px solid #FAF8F5; border-radius: 50%; box-shadow: 0 2px 8px rgba(15, 61, 46, 0.4);"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          className: '',
        });
        marker.setIcon(normalIcon);
      }
    });
  }, [hoveredCompIndex, comparableProperties]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-black/5 bg-[#FAF8F5]">
      <style>
        {`
          .leaflet-container {
            background: #FAF8F5;
            font-family: 'Inter', sans-serif;
          }

          .leaflet-control-zoom {
            border: 1px solid rgba(0, 0, 0, 0.05) !important;
            border-radius: 8px !important;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
          }

          .leaflet-control-zoom a {
            background: white !important;
            color: #0F3D2E !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            width: 36px !important;
            height: 36px !important;
            line-height: 36px !important;
            font-size: 18px !important;
            transition: all 0.2s;
          }

          .leaflet-control-zoom a:hover {
            background: #FAF8F5 !important;
            color: #B8935E !important;
          }

          .leaflet-control-layers {
            border: 1px solid rgba(0, 0, 0, 0.05) !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
            background: white !important;
          }

          .leaflet-control-layers-toggle {
            background-image: none !important;
            width: 36px !important;
            height: 36px !important;
            background: white !important;
            border-radius: 8px !important;
          }

          .leaflet-control-layers-toggle::after {
            content: '🗺️';
            font-size: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .leaflet-control-layers-expanded {
            padding: 8px 12px !important;
            font-family: 'Inter', sans-serif;
            color: #0F3D2E !important;
          }

          .leaflet-control-layers-base label {
            padding: 6px 0 !important;
            font-size: 13px !important;
          }

          .leaflet-control-layers input[type="radio"] {
            accent-color: #B8935E;
          }

          .leaflet-popup-content-wrapper {
            background: rgba(15, 61, 46, 0.95) !important;
            border: 1px solid rgba(184, 147, 94, 0.3);
            border-radius: 12px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
            backdrop-filter: blur(10px);
          }

          .leaflet-popup-content {
            margin: 12px 16px !important;
            color: #FAF8F5 !important;
            font-size: 13px !important;
            line-height: 1.5 !important;
          }

          .leaflet-popup-tip {
            background: rgba(15, 61, 46, 0.95) !important;
          }

          .leaflet-control-attribution {
            background: rgba(250, 248, 245, 0.9) !important;
            font-size: 10px !important;
            color: #6B6B6B !important;
            padding: 2px 8px !important;
            border-radius: 4px;
          }
        `}
      </style>

      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

    </div>
  );
}
