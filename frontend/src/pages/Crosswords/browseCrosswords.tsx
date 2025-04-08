import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./browseCrosswords.css";

interface Puzzle {
  puzzleId: number;
  puzzleName: string;
  puzzleType: string;
}

const CrosswordPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const response = await fetch('http://localhost:8000/puzzles/recent');
        const data = await response.json();
        const miniPuzzles = data.filter((p: Puzzle) => p.puzzleType === 'mini');
        setPuzzles(miniPuzzles);
      } catch (error) {
        console.error('Error fetching puzzles:', error);
      }
    };

    fetchPuzzles();
  }, []);

  return (
    <div className="crossword-page">
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

      <h1>Choose a Crossword Game</h1>
      <div className="puzzle-list">
        {puzzles.map((puzzle) => (
          <div key={puzzle.puzzleId} className="puzzle-item">
            <h3>{puzzle.puzzleName}</h3>
            <button onClick={() => navigate(`/crosswords/${puzzle.puzzleId}`)}>
              Start Game
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrosswordPage;
