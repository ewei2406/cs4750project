import Button from "@/components/Button";
import { deletePuzzle, updatePuzzle } from "@/hooks/usePuzzle";
import { PuzzleData } from "@/util/types";
import { useState } from "react";

const EditableConnections = ({
	puzzleName,
	puzzleData,
	puzzleId,
}: {
	puzzleName: string;
	puzzleData: PuzzleData & { type: "connections" };
	puzzleId: number;
}) => {
	const [newPuzzleName, setNewPuzzleName] = useState(puzzleName);
	const [newPuzzleData, setNewPuzzleData] = useState(puzzleData);

	const getWordGroup = (groupIdx: number) => {
		const backgroundColors = ["#f9f9ff", "#fff8e7", "#e8f6f3", "#fdeff9"];

		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 10,
					padding: 20,
					border: "2px solid #ccc",
					borderRadius: 12,
					backgroundColor: backgroundColors[groupIdx % backgroundColors.length],
					boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
				}}
			>
				<div>
					<div style={{ fontWeight: 800, marginBottom: 5 }}>
						Category {groupIdx + 1}
					</div>
					<input
						type="text"
						// @ts-ignore
						value={newPuzzleData.data[`category${groupIdx + 1}`]}
						onChange={(e) => {
							setNewPuzzleData((prev) => ({
								...prev,
								data: {
									...prev.data,
									[`category${groupIdx + 1}`]: e.target.value,
								},
							}));
						}}
						style={{
							width: 200,
							padding: 5,
							borderRadius: 6,
							border: "1px solid #aaa",
						}}
					/>
				</div>

				<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
					{Array.from({ length: 4 }).map((_, idx) => (
						<div key={idx}>
							<div style={{ fontWeight: 800 }}>Word {idx + 1}</div>
							<input
								type="text"
								// @ts-ignore
								value={
									newPuzzleData.data.solution.split(";")[groupIdx].split(",")[idx]
								}
								onChange={(e) => {
									setNewPuzzleData((prev) => ({
										...prev,
										data: {
											...prev.data,
											solution: prev.data.solution
												.split(";")
												.map((group, gIdx) =>
													groupIdx === gIdx
														? group
																.split(",")
																.map((word, wordIdx) =>
																	wordIdx === idx ? e.target.value : word
																)
																.join(",")
														: group
												)
												.join(";"),
										},
									}));
								}}
								style={{
									padding: 5,
									borderRadius: 6,
									border: "1px solid #aaa",
									width: 150,
								}}
							/>
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div>
			<div style={{ fontWeight: 800 }}>Puzzle Name:</div>
			<input
				type="text"
				value={newPuzzleName}
				onChange={(e) => {
					setNewPuzzleName(e.target.value);
				}}
				style={{
					padding: 5,
					marginTop: 4,
					marginBottom: 16,
					borderRadius: 6,
					border: "1px solid #aaa",
					width: 300,
				}}
			/>

			<div style={{ display: "flex", gap: 20, flexDirection: "column" }}>
				{getWordGroup(0)}
				{getWordGroup(1)}
				{getWordGroup(2)}
				{getWordGroup(3)}
			</div>

			<div style={{ margin: "20px 0", display: "flex", gap: 10 }}>
				<Button
					text="Save"
					onClick={() => updatePuzzle(puzzleId, newPuzzleName, newPuzzleData)}
				/>
				<Button
					backgroundColor="darkred"
					text="Delete"
					onClick={() => deletePuzzle(puzzleId)}
				/>
			</div>
		</div>
	);
};

export default EditableConnections;
