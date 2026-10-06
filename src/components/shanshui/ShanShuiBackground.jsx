import { useState, useEffect } from 'react';
import { generateShanShuiScene } from './shanshui';
import './ShanShuiBackground.css';

export function ShanShuiBackground({ seed }) {
  const [landscapeSvg, setLandscapeSvg] = useState('');

  useEffect(() => {
    let isMounted = true;
    const compute = () => {
      const svg = generateShanShuiScene(seed || String(Date.now()));
      if (isMounted) {
        setLandscapeSvg(svg);
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(compute);
      return () => {
        isMounted = false;
        window.cancelIdleCallback(handle);
      };
    }

    const timer = setTimeout(compute, 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [seed]);

  return (
    <div className="shanshui-container" aria-hidden="true">
      <svg
        className="shanshui-svg"
        viewBox="0 0 1600 800"
        preserveAspectRatio="xMidYMax slice"
        dangerouslySetInnerHTML={{ __html: landscapeSvg }}
      />
      <div className="shanshui-mist-overlay" />
      <div className="shanshui-paper-grain" />
    </div>
  );
}
