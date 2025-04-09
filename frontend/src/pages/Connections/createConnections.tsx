import React, { useState } from "react";
import "./CreateConnections.css"; // Make sure the path matches your file structure

type Group = {
  label: string;
  words: string[];
};

const CreateConnections = () => {
  const [groups, setGroups] = useState<Group[]>([
    { label: "", words: ["", "", "", ""] },
    { label: "", words: ["", "", "", ""] },
    { label: "", words: ["", "", "", ""] },
    { label: "", words: ["", "", "", ""] },
  ]);

  const [puzzleName, setPuzzleName] = useState<string>("");

  const handleLabelChange = (groupIndex: number, value: string) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].label = value;
    setGroups(updatedGroups);
  };

  const handleWordChange = (
    groupIndex: number,
    wordIndex: number,
    value: string
  ) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].words[wordIndex] = value;
    setGroups(updatedGroups);
  };

  const handleSubmit = async () => {
    const puzzleData = {
      solution: groups
        .map((group) => group.words.join(","))
        .join(";"),
      category1: groups[0].label,
      category2: groups[1].label,
      category3: groups[2].label,
      category4: groups[3].label,
    };
  
    try {
    const queryParams = new URLSearchParams({
        puzzle_name: puzzleName,
        puzzle_type: "connections",
      });
  
      const createPuzzleResponse = await fetch(
        `http://localhost:8000/puzzles/?${queryParams.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      console.log("HELLOOOOOO")
      console.log(createPuzzleResponse)
  
      const createPuzzleData = await createPuzzleResponse.json();
  
      if (createPuzzleData.puzzleId) {
        const updatePuzzleResponse = await fetch(
          `http://localhost:8000/puzzles/${createPuzzleData.puzzleId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              puzzleName,
              puzzleData: {
                type: "connections",
                data: puzzleData,
              },
            }),
          }
        );
  
        const updatePuzzleData = await updatePuzzleResponse.json();
        console.log("Puzzle Updated:", updatePuzzleData);
        alert("Puzzle Created and Updated!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error creating or updating the puzzle.");
    }
  };
  

  return (
    <div className="create-connections-container">
      <h1>Create Your Own Connections Puzzle</h1>
      <p> Each word must be 7 letters or fewer </p>
      <input
        className="puzzle-name-input"
        type="text"
        placeholder="Puzzle Name"
        value={puzzleName}
        onChange={(e) => setPuzzleName(e.target.value)}
      />
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="group-section">
          <input
            className="group-label-input"
            type="text"
            placeholder={`Group ${groupIndex + 1} Label`}
            value={group.label}
            onChange={(e) => handleLabelChange(groupIndex, e.target.value)}
          />
          <div className="words-grid">
            {group.words.map((word, wordIndex) => (
              <input
                key={wordIndex}
                type="text"
                value={word}
                placeholder={`Word ${wordIndex + 1}`}
                maxLength={7}
                onChange={(e) =>
                  handleWordChange(groupIndex, wordIndex, e.target.value)
                }
              />
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} className="submit-button">
        Create Puzzle
      </button>
    </div>
  );
};

export default CreateConnections;
