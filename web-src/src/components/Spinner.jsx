// Reuses the app's own loading GIF (src/assets/Loading.gif via IMGS.LOADINGGIF)
// so this stays the same loading indicator as the rest of the app, not a generic spinner.
import React from 'react';
import { IMGS } from '../constants';

const Spinner = ({ label = 'Loading…' }) => (
  <div className="spinner-wrap">
    <img src={IMGS.LOADINGGIF} alt="" width={40} height={40} />
    <span>{label}</span>
  </div>
);

export default Spinner;
