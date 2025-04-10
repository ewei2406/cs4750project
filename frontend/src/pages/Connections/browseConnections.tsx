import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './browseConnections.css';
import Button from '@/components/Button';

interface Puzzle {
    puzzleId: number;
    puzzleName: string;
    puzzleType: string;
    createdUsername: string;
    ratingCt: number;
    ratingAvg: number | null;
    solvedCt: number;
  }

const ConnectionsPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const response = await fetch('http://localhost:8000/puzzles/recent');
        const data = await response.json();

        // console.log("Fetched puzzles:", data);
        // console.log("First puzzle (if exists):", data[0]);

        const connectionsPuzzles = data.filter((p: Puzzle) => p.puzzleType === 'connections');
        setPuzzles(connectionsPuzzles);
      } catch (error) {
        console.error('Error fetching puzzles:', error);
      }
    };

    fetchPuzzles();
  }, []);

  return (
    <div className="connections-page">
      <div className="hamburger-container">
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        {menuOpen && (
          <div className="dropdown-menu">
          <button onClick={() => navigate("/browseCrosswords")}>
            Browse Crosswords
          </button>
          <button onClick={() => navigate("/browseConnections")}>
            Browse Connections
          </button>
        </div>
        )}
      </div>

      <h1 className="page-heading">Connect With A Game</h1>
      <h3 className="page-subtext">Fresh challenges made by fellow players.</h3>

      <div style={{ 
        display: 'flex',
        flexDirection: "column",
        gap: 15,
        width: 700,
        margin: "0 auto"
      }}>
        {puzzles.map((puzzle) => (
          <div style={{
            background: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
            display: "grid",
            alignItems: "center",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr"
          }} key={puzzle.puzzleId}>
            <div>{puzzle.puzzleName}</div>
            <div style={{ color: 'gray' }}>by {puzzle.createdUsername}</div>
            <div  style={{ color: 'gray' }}>
            {puzzle.ratingCt > 0
                ? `⭐ ${puzzle.ratingAvg?.toFixed(1)} (${puzzle.ratingCt})`
                : `No ratings`}
            </div>
            <div  style={{ color: 'gray' }}>
                {puzzle.solvedCt === 0 ? "No solves" : puzzle.solvedCt === 1 ? "1 solve" : `${puzzle.solvedCt} solves`}
            </div>
            <Button backgroundColor='var(--connections-color)' text="Start Game" onClick={() => navigate(`/connections/${puzzle.puzzleId}`)} />
        </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsPage;

