import Button from "@/components/Button";
import { deletePuzzle, updatePuzzle } from "@/hooks/usePuzzle";
import { PuzzleData } from "@/util/types";
import { useState } from "react";

const EditableMini = ({
	puzzleName,
	puzzleData,
	puzzleId,
}: {
	puzzleName: string;
	puzzleData: PuzzleData & { type: "mini" };
	puzzleId: number;
}) => {
	const [newPuzzleName, setNewPuzzleName] = useState(puzzleName);
	const [newPuzzleData, setNewPuzzleData] = useState(puzzleData);

	const handleChange =
		(idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const letter = e.target.value.toUpperCase().slice(-1);
			if (letter.match(/^[A-Z_]$/)) {
				setNewPuzzleData((prev) => ({
					...prev,
					data: {
						...prev.data,
						solution: prev.data.solution
							.split("")
							.map((l, i) => (i === idx ? letter : l))
							.join("")
							.toLowerCase(),
					},
				}));
			}
		};

	const getHint = (direction: string, num: number) => (
		<div>
			{num}:{" "}
			<input
				type="text"
				//@ts-ignore
				value={newPuzzleData.data[`${direction}${num}`]}
				onChange={(e) => {
					setNewPuzzleData((prev) => ({
						...prev,
						data: {
							...prev.data,
							[`${direction}${num}`]: e.target.value,
						},
					}));
				}}
			/>
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

			<div style={{ display: "flex", gap: 20 }}>
				<div>
					<div style={{ fontWeight: 800 }}>Solution:</div>
					(Use underscores for black squares)
					<br />
					<br />
					<div
						style={{
							position: "relative",
							display: "grid",
							border: "1px solid black",
							gridTemplateColumns: "repeat(5, 1fr)",
							width: "max-content",
						}}
					>
						{Array.from({ length: 25 }).map((_, i) => (
							<input
								key={i}
								style={{
									width: 50,
									height: 50,
									textAlign: "center",
									boxSizing: "border-box",
									border: "1px solid black",
									fontSize: 24,
									backgroundColor:
										newPuzzleData.data.solution[i] === "_" ? "black" : "white",
									color:
										newPuzzleData.data.solution[i] === "_" ? "white" : "black",
								}}
								value={newPuzzleData.data.solution[i].toUpperCase()}
								onChange={handleChange(i)}
							/>
						))}

						<div
							style={{
								pointerEvents: "none",
								display: "grid",
								gridTemplateColumns: "repeat(5, 1fr)",
								position: "absolute",
								top: 0,
								left: 4,
								width: "100%",
								color: "gray",
							}}
						>
							<div>1</div>
							<div>2</div>
							<div>3</div>
							<div>4</div>
							<div>5</div>
						</div>
						<div
							style={{
								pointerEvents: "none",
								display: "flex",
								position: "absolute",
								top: 52,
								left: 4,
								color: "gray",
								flexDirection: "column",
							}}
						>
							<div style={{ height: 50 }}>2</div>
							<div style={{ height: 50 }}>3</div>
							<div style={{ height: 50 }}>4</div>
							<div style={{ height: 50 }}>5</div>
						</div>
					</div>
				</div>

				<div>
					<div style={{ fontWeight: 800 }}>Hints:</div>

					<br />
					<div style={{ fontWeight: 800 }}>Across</div>
					{getHint("across", 1)}
					{getHint("across", 2)}
					{getHint("across", 3)}
					{getHint("across", 4)}
					{getHint("across", 5)}

					<br />
					<div style={{ fontWeight: 800 }}>Down</div>
					{getHint("down", 1)}
					{getHint("down", 2)}
					{getHint("down", 3)}
					{getHint("down", 4)}
					{getHint("down", 5)}
				</div>
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

export default EditableMini;
