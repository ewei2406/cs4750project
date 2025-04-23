import { PuzzleData } from "@/util/types";
import { useCallback, useMemo, useState } from "react";
import { solvePuzzle } from "../usePuzzle";

export type ConnectionsWord = {
	word: string;
	id: number;
	groupId: number;
};

export type ConnectionsWordGroup = {
	words: ConnectionsWord[];
	id: number;
	group: string;
};

export const useConnections = (
	puzzleData: PuzzleData & { type: "connections" },
	puzzleId: number
) => {
	const [solved, setSolved] = useState(false);
	const startTime = useMemo(() => new Date().getTime(), []);
	const [hint, setHint] = useState<string>("");
	const [selection, setSelection] = useState<ConnectionsWord[]>([]);
	const [solvedGroups, setSolvedGroups] = useState<ConnectionsWordGroup[]>([]);
	const [unusedWords, setUnusedWords] = useState<ConnectionsWord[]>(
		puzzleData.data.solution
			.slice(0, -1)
			.split(";")
			.map((group, groupIdx) =>
				group.split(",").map((word, idx) => ({
					word,
					id: idx + groupIdx * 4,
					groupId: groupIdx + 1,
				}))
			)
			.flat()
			.sort(() => Math.random() - 0.5)
	);

	const toggleWord = useCallback(
		(word: ConnectionsWord) => {
			if (selection.some((w) => w.word === word.word)) {
				setSelection((prev) => prev.filter((w) => w.word !== word.word));
			} else if (selection.length > 3) {
				setSelection((prev) => [...prev.slice(1), word]);
			} else {
				setSelection((prev) => [...prev, word]);
			}
		},
		[selection]
	);

	const checkSelection = useCallback(() => {
		if (selection.length !== 4) {
			alert("Make groups of 4 words!");
			return;
		}
		const groupIds = selection
			.map((word) => word.groupId)
			.sort((a, b) => a - b);
		if (
			groupIds[0] === groupIds[1] &&
			groupIds[0] === groupIds[2] &&
			groupIds[0] === groupIds[3]
		) {
			setSolvedGroups((prev) => [
				...prev,
				{
					words: selection.sort((a, b) => a.id - b.id),
					id: groupIds[0],
					// @ts-ignore
					group: puzzleData.data[`category${groupIds[0]}`],
				},
			]);
			setUnusedWords((prev) =>
				prev.filter((word) => !selection.some((w) => w.id === word.id))
			);
			setHint("Great job!");
			setSelection([]);
			console.log(unusedWords.length);
			if (unusedWords.length === 4) {
				console.log("solved");
				setHint("You solved it!");
				setSolved(true);
				const delta = Math.floor((new Date().getTime() - startTime) / 1000);
				solvePuzzle(puzzleId, delta);
			}
		} else {
			if (groupIds[0] === groupIds[1] && groupIds[0] === groupIds[2]) {
				setHint("One off...");
				return;
			}
			setHint("Not a match...");
		}
	}, [selection, unusedWords, puzzleData.data]);

	const clearSelection = useCallback(() => {
		setSelection([]);
		setHint("");
	}, []);

	return {
		hint,
		solvedGroups,
		unusedWords,
		selection,
		solved,
		clearSelection,
		toggleWord,
		checkSelection,
	};
};
