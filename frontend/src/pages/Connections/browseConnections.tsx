import React from 'react';
import "./browseConnections.css"; 

interface Puzzle {
  puzzle_id: number;
  puzzle_name: string;
}

const ConnectionsPage: React.FC = () => {
  // Hardcoded list of "Connections" puzzles
  const puzzles: Puzzle[] = [
    { puzzle_id: 1, puzzle_name: 'Connections Puzzle 1' },
    { puzzle_id: 2, puzzle_name: 'Connections Puzzle 2' },
    { puzzle_id: 3, puzzle_name: 'Connections Puzzle 3' },
    { puzzle_id: 4, puzzle_name: 'Connections Puzzle 4' },
  ];

  return (
    <div className="connections-page">
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