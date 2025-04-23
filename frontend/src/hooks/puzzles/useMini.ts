import { PuzzleData } from "@/util/types";
import { useMemo, useState } from "react";
import { solvePuzzle } from "../usePuzzle";

export type MiniWord = {
	id: number;
	letter: string;
};

export const useMini = (
	puzzleData: PuzzleData & { type: "mini" },
	puzzleId: number
) => {
	const solution = useMemo(() => puzzleData.data.solution.toUpperCase(), []);
	const startTime = useMemo(() => new Date().getTime(), []);
	const [hintLetter, setHintLetter] = useState<
		{ idx: number; letter: string } | undefined
	>(undefined);
	const [hint, setHint] = useState<string>("");
	const [solved, setSolved] = useState(false);
	const [grid, setGrid] = useState(solution.replace(/[^_]/g, " "));

	const setCharacter = (index: number, letter: string) => {
		const newGrid = grid.split("");
		newGrid[index] = letter;
		const newGridString = newGrid.join("").toUpperCase();
		setGrid(newGridString);

		if (newGridString === solution) {
			setSolved(true);
			setHint("You solved it!");
			setSolved(true);
			const delta = Math.floor((new Date().getTime() - startTime) / 1000);
			solvePuzzle(puzzleId, delta);
		} else {
			if (!newGridString.includes(" ")) {
				let errorCt = 0;
				for (let i = 0; i < newGridString.length; i++) {
					if (newGridString[i] !== solution[i]) errorCt++;
				}
				if (errorCt === 1) {
					setHint("There is 1 error.");
				} else {
					setHint(`There are ${errorCt} errors.`);
				}
			}
		}
	};

	const getHint = () => {
		if (grid === solution) {
			setHint("Puzzle already solved.");
			return;
		}
		const zipped = Array.from({ length: 25 })
			.map((_, i) => ({
				idx: i,
				letter: solution[i],
				grid: grid[i],
			}))
			.filter((f) => f.grid !== f.letter);
		const random = zipped[Math.floor(Math.random() * zipped.length)];
		setHintLetter({
			idx: random.idx,
			letter: random.letter,
		});
	};

	return {
		hint,
		hintLetter,
		solved,
		grid,
		setCharacter,
		getHint,
	};
};
