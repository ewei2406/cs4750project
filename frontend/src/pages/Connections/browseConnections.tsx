import React, { useState } from 'react';
import "./browseConnections.css";

interface Puzzle {
  puzzle_id: number;
  puzzle_name: string;
}

const ConnectionsPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const puzzles: Puzzle[] = [
    { puzzle_id: 1, puzzle_name: 'Connections Puzzle 1' },
    { puzzle_id: 2, puzzle_name: 'Connections Puzzle 2' },
    { puzzle_id: 3, puzzle_name: 'Connections Puzzle 3' },
    { puzzle_id: 4, puzzle_name: 'Connections Puzzle 4' },
  ];

  return (
    <div className="connections-page">
      <div className="hamburger-container">
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        {menuOpen && (
          <div className="dropdown-menu">
            <button onClick={() => alert('Switching to Crosswords')}>
              Browse Crosswords
            </button>
            <button onClick={() => alert('You are on Connections')}>
              Browse Connections
            </button>
          </div>
        )}
      </div>

      <h1>Choose a Connections Game</h1>
      <div className="puzzle-list">
        {puzzles.map((puzzle) => (
          <div key={puzzle.puzzle_id} className="puzzle-item">
            <h3>{puzzle.puzzle_name}</h3>
            <button onClick={() => alert(`Starting game: ${puzzle.puzzle_name}`)}>
              Start Game
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsPage;
