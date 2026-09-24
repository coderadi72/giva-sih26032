import React, { useEffect, useRef, useState } from 'react';
import './styles.css';

export default function IndiaMap({ onStateClick, selectedState, hi }) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  useEffect(() => {
    fetch('/india-map.svg')
      .then(response => response.text())
      .then(svgString => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = svgString;
        
        const svg = containerRef.current.querySelector('svg');
        if (svg) {
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
          svg.style.maxHeight = '600px';
          
          const paths = svg.querySelectorAll('path, g, polygon');
          
          paths.forEach(path => {
            // Some SVGs use title, some use id.
            let stateName = path.getAttribute('id') || path.getAttribute('title') || path.getAttribute('data-name');
            if (!stateName) return;
            
            // Clean up state name (e.g. remove "IN-", underscores, etc)
            stateName = stateName.replace(/IN-/g, '').replace(/_/g, ' ');
            // Simple Capitalization
            stateName = stateName.replace(/\b\w/g, c => c.toUpperCase());
            
            // Override styles for interactiveness
            path.style.cursor = 'pointer';
            path.style.transition = 'all 0.3s ease';
            path.style.fill = '#e2e8f0'; // Default gray
            path.style.stroke = '#ffffff';
            path.style.strokeWidth = '1';

            // Events
            path.addEventListener('mouseenter', (e) => {
              path.style.fill = '#cbd5e1';
              path.style.filter = 'drop-shadow(2px 4px 6px rgba(0,0,0,0.1))';
              setTooltip({ visible: true, text: stateName, x: e.clientX, y: e.clientY });
            });
            
            path.addEventListener('mousemove', (e) => {
              setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
            });

            path.addEventListener('mouseleave', () => {
              path.style.fill = '#e2e8f0';
              path.style.filter = 'none';
              setTooltip(prev => ({ ...prev, visible: false }));
            });

            path.addEventListener('click', () => {
              if (onStateClick) {
                onStateClick(stateName);
                setTooltip(prev => ({ ...prev, visible: false }));
              }
            });
          });

          // Style text labels strictly
          const texts = svg.querySelectorAll('text, tspan');
          texts.forEach(text => {
            text.style.pointerEvents = 'none';
            text.style.fill = '#111827';
          });
        }
      });
  }, [onStateClick]);

  return (
    <div className="india-map-container" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {tooltip.visible && (
        <div style={{
          position: 'fixed',
          top: tooltip.y + 15,
          left: tooltip.x + 15,
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '4px',
          pointerEvents: 'none',
          zIndex: 1000,
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
