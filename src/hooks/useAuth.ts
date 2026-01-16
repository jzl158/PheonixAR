import { useEffect } from 'react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged
} from 'firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export function useAuth() {
  const { user, setUser, setVerificationId } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            id: firebaseUser.uid,
            phoneNumber: firebaseUser.phoneNumber || '',
            totalCoins: userData.totalCoins || 0,
            collectedCoins: userData.collectedCoins || [],
            createdAt: userData.createdAt?.toDate() || new Date(),
          });
        } else {
          // Create new user document
          const newUser: User = {
            id: firebaseUser.uid,
            phoneNumber: firebaseUser.phoneNumber || '',
            totalCoins: 0,
            collectedCoins: [],
            createdAt: new Date(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  const setupRecaptcha = (elementId: string) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
      });
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<void> => {
    try {
      setupRecaptcha('recaptcha-container');
      const appVerifier = window.recaptchaVerifier!;
      const confirmationResult: ConfirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      // Store verification ID in session storage as backup
      sessionStorage.setItem('verificationId', JSON.stringify(confirmationResult));
      setVerificationId(confirmationResult.verificationId);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const verifyOTP = async (code: string): Promise<void> => {
    try {
      const confirmationResult = sessionStorage.getItem('verificationId');
      if (confirmationResult) {
        const result = JSON.parse(confirmationResult) as ConfirmationResult;
        await result.confirm(code);
        sessionStorage.removeItem('verificationId');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  return {
    user,
    sendOTP,
    verifyOTP,
  };
}
