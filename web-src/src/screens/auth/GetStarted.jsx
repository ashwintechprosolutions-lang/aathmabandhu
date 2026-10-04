import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, ROUTES } from '../../constants';
import { useStore } from '../../store';
import Logo from '../../components/Logo';

const GetStarted = () => {
  const navigate = useNavigate();
  const { logout } = useStore();

  // Landing on this screen clears the session (also how "Logout" works).
  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="screen" style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="column container glass-card" style={{ alignItems: 'center', width: '100%' }}>
        <Logo color={COLORS.navy} width="100%" style={{ maxWidth: 320 }} />

        <span style={{ color: 'black', fontSize: 'min(22px, 6.3vw)', fontWeight: 'bold', textAlign: 'center' }}>Service in your hands</span>

        <button type="button" className="touchable btn-navy" style={{ width: '60%', marginTop: 40, padding: 15 }} onClick={() => navigate(ROUTES.LOGIN)}>
          <span style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Get Started</span>
        </button>
      </div>
    </div>
  );
};

export default GetStarted;
