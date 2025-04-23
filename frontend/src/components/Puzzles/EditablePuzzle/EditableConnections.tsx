import Button from "@/components/Button";
import Timer from "@/components/Timer";
import {
	ConnectionsWord,
	ConnectionsWordGroup,
	useConnections,
} from "@/hooks/puzzles/useConnections";
import { deletePuzzle, updatePuzzle } from "@/hooks/usePuzzle";
import { COLOR_MAP } from "@/util/constants";
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

	const getWordGroup = (groupIdx: number) => (
		<div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
			<div>
				<div style={{ fontWeight: 800 }}>Category {groupIdx + 1}</div>
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
					style={{ width: 200 }}
				/>
			</div>

			<div style={{ display: "flex", gap: 10, marginLeft: 30 }}>
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
						/>
					</div>
				))}
			</div>
		</div>
	);

	return (
		<div>
			<div style={{ fontWeight: 800 }}>Puzzle Name:</div>
			<input
				type="text"
				value={newPuzzleName}
				onChange={(e) => {
					setNewPuzzleName(e.target.value);
				}}
			/>

			<br />
			<br />

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
