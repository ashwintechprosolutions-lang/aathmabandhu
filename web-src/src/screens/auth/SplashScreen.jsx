// Mirrors the Expo splash (app.json: splash.png, contain, hidden after 3s in App.js),
// on the app's animated tricolour background.
import React from 'react';
import { COLORS } from '../../constants';
import Logo from '../../components/Logo';

const SplashScreen = () => (
  <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Logo color={COLORS.navy} width="100%" style={{ maxWidth: 380 }} />
  </div>
);

export default SplashScreen;
