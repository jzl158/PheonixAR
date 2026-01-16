import { useEffect, useState } from 'react';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { useMap } from '@vis.gl/react-google-maps';
import type { Coin } from '../../types';

interface CoinOverlayProps {
  coins: Coin[];
  onCoinClick: (coin: Coin) => void;
}

export function CoinOverlay({ coins, onCoinClick }: CoinOverlayProps) {
  const map = useMap();
  const [overlay, setOverlay] = useState<GoogleMapsOverlay | null>(null);

  useEffect(() => {
    if (!map) return;

    const newOverlay = new GoogleMapsOverlay({
      layers: [],
    });

    newOverlay.setMap(map);
    setOverlay(newOverlay);

    return () => {
      newOverlay.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (!overlay) return;

    const scatterplotLayer = new ScatterplotLayer({
      id: 'coins-layer',
      data: coins,
      getPosition: (d: Coin) => [d.position.lng, d.position.lat, 10],
      getRadius: 15,
      getFillColor: [251, 191, 36, 255], // Gold color
      getLineColor: [234, 179, 8, 255],
      lineWidthMinPixels: 2,
      pickable: true,
      onClick: (info) => {
        if (info.object) {
          onCoinClick(info.object as Coin);
        }
      },
    });

    const textLayer = new TextLayer({
      id: 'coin-labels',
      data: coins,
      getPosition: (d: Coin) => [d.position.lng, d.position.lat, 30],
      getText: (d: Coin) => String(d.value),
      getSize: 16,
      getColor: [255, 255, 255, 255],
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'center',
      fontWeight: 'bold',
    });

    overlay.setProps({
      layers: [scatterplotLayer, textLayer],
    });
  }, [overlay, coins, onCoinClick]);

  return null;
}
