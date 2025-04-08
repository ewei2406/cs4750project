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

  const handleSubmit = () => {
    console.log("Created Puzzle:", groups);
    alert("Puzzle Created! Check console for structure.");
  };

  return (
    <div className="create-connections-container">
      <h1>Create Your Own Connections Puzzle</h1>
      <p> Each word must be 7 letters or fewer </p>
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
