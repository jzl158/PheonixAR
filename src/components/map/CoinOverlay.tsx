import { useEffect, useState } from 'react';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ScatterplotLayer, TextLayer, IconLayer } from '@deck.gl/layers';
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

    // Separate 1 coins from other coins
    const oneCoins = coins.filter(coin => coin.value === 1);
    const otherCoins = coins.filter(coin => coin.value !== 1);

    // Icon layer for 1 coins
    const iconLayer = new IconLayer({
      id: 'one-coins-layer',
      data: oneCoins,
      getPosition: (d: Coin) => [d.position.lng, d.position.lat, 10],
      getIcon: () => ({
        url: '/1coin.png',
        width: 256,
        height: 256,
        anchorY: 128,
        anchorX: 128,
      }),
      sizeScale: 1,
      getSize: 40,
      pickable: true,
      onClick: (info) => {
        if (info.object) {
          onCoinClick(info.object as Coin);
        }
      },
    });

    // Scatterplot layer for other coins
    const scatterplotLayer = new ScatterplotLayer({
      id: 'coins-layer',
      data: otherCoins,
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

    // Text layer for other coins
    const textLayer = new TextLayer({
      id: 'coin-labels',
      data: otherCoins,
      getPosition: (d: Coin) => [d.position.lng, d.position.lat, 30],
      getText: (d: Coin) => String(d.value),
      getSize: 16,
      getColor: [255, 255, 255, 255],
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'center',
      fontWeight: 'bold',
    });

    overlay.setProps({
      layers: [iconLayer, scatterplotLayer, textLayer],
    });
  }, [overlay, coins, onCoinClick]);

  return null;
}
