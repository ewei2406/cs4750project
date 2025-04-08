import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./connections.css"; // Ensure the CSS is linked

const Connections = () => {
  const [grid, setGrid] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<string[][]>([]);
  const [error, setError] = useState(false);
  const [mistakesRemaining, setMistakesRemaining] = useState(4);
  const [gameOver, setGameOver] = useState(false);

  // Dummy data instead of backend fetch
  useEffect(() => {
    setGrid([
      "Mercury", "Venus", "Mars", "Jupiter", // Planets
      "Red", "Blue", "Green", "Yellow",      // Colors
      "Violin", "Piano", "Drums", "Flute",   // Instruments
      "Dog", "Cat", "Hamster", "Rabbit",     // Pets
    ]);
  }, []);

  useEffect(() => {
    if (mistakesRemaining === 0 || foundGroups.length === 4) {
      setGameOver(true);
    }
  }, [mistakesRemaining, foundGroups]);

  const handleSelect = (word: string) => {
    if (selected.includes(word)) {
      setSelected(selected.filter((w) => w !== word));
    } else if (selected.length < 4) {
      setSelected([...selected, word]);
    }
  };

  const submitGroup = () => {
    if (selected.length !== 4) return;

    const validGroups = [
      ["Mercury", "Venus", "Mars", "Jupiter"],
      ["Red", "Blue", "Green", "Yellow"],
      ["Violin", "Piano", "Drums", "Flute"],
      ["Dog", "Cat", "Hamster", "Rabbit"],
    ];

    const isCorrect = validGroups.some((group) =>
      group.every((word) => selected.includes(word))
    );

    if (isCorrect) {
      setFoundGroups([...foundGroups, selected]);
      setGrid((prev) => prev.filter((word) => !selected.includes(word)));
      setSelected([]);
      setError(false);
    } else {
      setError(true);
      setMistakesRemaining((prev) => prev - 1);
      setTimeout(() => setError(false), 1500);
    }
  };

  const getColor = (word: string) => {
    for (let i = 0; i < foundGroups.length; i++) {
      if (foundGroups[i].includes(word)) {
        return ["#fbc531", "#00a8ff", "#9c88ff", "#e84118"][i];
      }
    }
    return selected.includes(word) ? "#dcdde1" : "#ffffff";
  };

  return (
    <div className="connections-container">
      <h2>Connections Game</h2>
      <p>Mistakes Remaining: {mistakesRemaining}</p>

      {!gameOver ? (
        <>
          <div className="grid">
            {grid.map((word) => (
              <motion.button
                key={word}
                onClick={() => handleSelect(word)}
                style={{ backgroundColor: getColor(word) }}
                whileTap={{ scale: 0.95 }}
              >
                {word}
              </motion.button>
            ))}
          </div>

          <button
            onClick={submitGroup}
            disabled={selected.length !== 4 || mistakesRemaining === 0}
            className="submit-btn"
          >
            Submit
          </button>

          {error && <p className="error">Incorrect group, try again.</p>}
        </>
      ) : (
        <div className="results-container">
          {mistakesRemaining === 0 ? (
            <h3>Game Over! 😢</h3>
          ) : (
            <h3>🎉 You won!</h3>
          )}

          <h4>Found Groups:</h4>
          <ul className="found-groups">
            {foundGroups.map((group, idx) => (
              <li key={idx}>{group.join(", ")}</li>
            ))}
          </ul>

          {grid.length > 0 && (
            <div className="missed-words">
              <h4>Words you missed:</h4>
              <div className="grid">
                {grid.map((word) => (
                  <button key={word} className="missed-word-btn">
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Connections;