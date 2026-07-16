import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('light-theme', !dark);
  }, [dark]);

  return (
    <button className="btn btn-secondary" onClick={() => setDark(!dark)}>
      {dark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};

export default ThemeToggle;
