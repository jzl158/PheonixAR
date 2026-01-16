import { collection, addDoc, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import type { Coin, Coordinates } from '../types';
import { generateCoinsNearLocation } from '../utils/coinGenerator';

const COINS_COLLECTION = 'coins';

/**
 * Generates and saves new coins to Firestore
 */
export async function generateAndSaveCoins(
  center: Coordinates,
  count: number = 10
): Promise<Coin[]> {
  const coins = generateCoinsNearLocation(center, count);
  const coinsRef = collection(db, COINS_COLLECTION);

  const savePromises = coins.map(coin =>
    addDoc(coinsRef, {
      position: coin.position,
      value: coin.value,
      createdAt: coin.createdAt,
    })
  );

  await Promise.all(savePromises);
  return coins;
}

/**
 * Fetches all active coins from Firestore
 */
export async function fetchActiveCoins(): Promise<Coin[]> {
  const coinsRef = collection(db, COINS_COLLECTION);
  const q = query(coinsRef);
  const snapshot = await getDocs(q);

  const coins: Coin[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    coins.push({
      id: doc.id,
      position: data.position,
      value: data.value,
      createdAt: data.createdAt.toDate(),
    });
  });

  return coins;
}

/**
 * Removes a collected coin from Firestore
 */
export async function removeCoin(coinId: string): Promise<void> {
  const coinRef = doc(db, COINS_COLLECTION, coinId);
  await deleteDoc(coinRef);
}
