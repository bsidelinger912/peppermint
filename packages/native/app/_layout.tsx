import { Slot } from 'expo-router';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

import { SessionProvider } from '../hooks/auth-context';
import '../global.css';


export default function Root() {
  // Set up the auth context and render our layout inside of it.
  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      // Handle deep links
    });
   
    return () => subscription.remove();
  }, []);
  
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}

