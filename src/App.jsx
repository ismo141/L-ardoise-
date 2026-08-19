import React, { useState } from 'react';

export default function App() {
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);

  return (
    <div className="app-wrapper">
      <header className="toolbar">
        <div className="tool-group">
          <span className="tool-label">Couleur</span>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div className="tool-group">
          <span className="tool-label">Taille ({size}px)</span>
          <input type="range" min="1" max="50" value={size} onChange={(e) => setSize(e.target.value)} />
        </div>

        <div className="tool-group">
          <button className="btn">✏️ Crayon</button>
          <button className="btn">🧽 Gomme</button>
          <button className="btn">🗑️ Effacer</button>
        </div>

        <div className="tool-group">
          <button className="btn btn-fedapay">💳 Payer avec FedaPay</button>
          <div className="status-badge">
            <span className="status-dot"></span> En ligne
          </div>
        </div>
      </header>

      <main className="canvas-card">
        <canvas id="board"></canvas>
      </main>
    </div>
  );
}
