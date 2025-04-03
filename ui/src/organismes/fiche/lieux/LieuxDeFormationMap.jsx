import React, { useRef } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import useOnce from '../../../common/hooks/useOnce.js'; // eslint-disable-line import/no-webpack-loader-syntax
import bluePin from './map-pin-blue.svg';
import redPin from './map-pin-red.svg';
import redBluePin from './map-pin-red-blue.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '../../../common/Flexbox.jsx';
import Legend from './Legend.jsx';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmd1ZXJvdXQiLCJhIjoiY2wwamM5bmMyMGI5cDNrcDZzeGE0Y3RuNyJ9.R3_znqXpyJ8_98pEUYQuwQ';

function addSVGImage(map, name, definitions) {
  return new Promise((resolve) => {
    const img = new Image(definitions.width, definitions.height);
    img.src = definitions.file;
    img.onload = () => {
      map.addImage(name, img);
      resolve();
    };
  });
}

function adaptGeojson(adresse, props = {}) {
  const geojson = adresse.geojson;

  return {
    ...geojson,
    properties: {
      ...geojson.properties,
      ...props,
    },
  };
}

function getCoordinates(geojson) {
  const { geometry } = geojson;
  return geometry.type === 'Polygon' ? geometry.coordinates[0][0] : geometry.coordinates;
}

function getCenter(organisme) {
  const adresse = organisme.adresse;
  if (adresse) {
    return getCoordinates(adresse.geojson);
  }

  return organisme.lieux_de_formation[0].adresse?.geojson.geometry.coordinates;
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function distanceInKmBetweenCoords(coords1, coords2) {
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(coords2[1] - coords1[1]);
  const dLon = degreesToRadians(coords2[0] - coords1[0]);
  const lat1 = degreesToRadians(coords1[1]);
  const lat2 = degreesToRadians(coords2[1]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function buildSource(organisme) {
  const features = [];
  let lieux = organisme.lieux_de_formation;

  if (organisme.adresse) {
    const coords = organisme.adresse.geojson.geometry.coordinates;
    lieux = lieux.filter(({ adresse }) => {
      return distanceInKmBetweenCoords(coords, adresse.geojson.geometry.coordinates) !== 0;
    });

    features.push(
      adaptGeojson(organisme.adresse, {
        label: organisme.enseigne || organisme.raison_sociale,
        popup: organisme.adresse?.label,
        icon: organisme.lieux_de_formation.length !== lieux.length ? 'map-pin-red-blue' : 'map-pin-red',
        sortKey: 1,
      })
    );
  }

  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        ...features,
        ...lieux.map((l) => {
          return adaptGeojson(l.adresse, {
            popup: l.adresse?.label,
            icon: 'map-pin-blue',
            sortKey: 2,
          });
        }),
      ],
    },
  };
}

function showPopupOnMouseHover(map, layerName) {
  const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false });

  map.on('mouseenter', layerName, (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup.setLngLat(coordinates).setText(e.features[0].properties.popup).addTo(map);
  });

  map.on('mouseleave', layerName, () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
}

function getBounds(source) {
  const first = source.data.features[0];
  const coords = getCoordinates(first);
  const bounds = new mapboxgl.LngLatBounds(coords, coords);

  source.data.features.forEach((geojson) => bounds.extend(getCoordinates(geojson)));

  return bounds;
}

async function configureMap(map, source) {
  await Promise.all([
    addSVGImage(map, 'map-pin-blue', { file: bluePin, width: 30, height: 36 }),
    addSVGImage(map, 'map-pin-red', { file: redPin, width: 30, height: 36 }),
    addSVGImage(map, 'map-pin-red-blue', { file: redBluePin, width: 40, height: 41 }),
  ]);

  showPopupOnMouseHover(map, 'layer-points');

  map
    .addControl(new mapboxgl.NavigationControl())
    .addSource('ecosysteme', source)
    .addLayer({
      id: 'layer-commune',
      source: 'ecosysteme',
      filter: ['==', '$type', 'Polygon'],
      layout: {},
      type: 'fill',
      paint: {
        'fill-color': '#e1000f',
        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.8, 0.5],
      },
    })
    .addLayer({
      id: 'layer-points',
      source: 'ecosysteme',
      filter: ['==', '$type', 'Point'],
      type: 'symbol',
      'symbol-z-order': 'source',
      layout: {
        'text-field': ['get', 'label'],
        'text-offset': [0, 1.25],
        'text-anchor': 'top',
        'icon-image': '{icon}',
        'icon-allow-overlap': true,
      },
    })
    .fitBounds(getBounds(source), { padding: 200, maxZoom: 12 });
}

export default function LieuxDeFormationMap({ organisme }) {
  const mapContainer = useRef(null);

  useOnce(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: getCenter(organisme),
      zoom: 7,
    });

    map.on('load', () => {
      const source = buildSource(organisme);
      return configureMap(map, source);
    });
  });

  return (
    <>
      <Box className={'fr-mb-5v'}>
        <Legend color={'#E1000F'}>Organisme</Legend>
        <Legend className={'fr-ml-3w'} color={'#000091'}>
          Lieux de formation
        </Legend>
      </Box>
      <div style={{ height: '620px', width: '100%' }} ref={mapContainer} className="map-container" />
    </>
  );
}
