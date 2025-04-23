import Button from "@/components/Button";
import Timer from "@/components/Timer";
import {
	ConnectionsWord,
	ConnectionsWordGroup,
	useConnections,
} from "@/hooks/puzzles/useConnections";
import { COLOR_MAP } from "@/util/constants";
import { PuzzleData } from "@/util/types";

const WordGroup = ({ group }: { group: ConnectionsWordGroup }) => (
	<div
		key={group.id * 100}
		style={{
			gridColumn: "1 / -1",
			borderRadius: 5,
			height: 65,
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: COLOR_MAP[group.id],
		}}
	>
		<div style={{ fontWeight: 800 }}>{group.group}</div>
		<div style={{ fontSize: "0.9em" }}>
			{group.words.map((w) => w.word).join(", ")}
		</div>
	</div>
);

const WordButton = ({
	word,
	selected,
	onClick,
}: {
	word: ConnectionsWord;
	selected: boolean;
	onClick: () => void;
}) => (
	<div
		onClick={onClick}
		style={{
			backgroundColor: selected ? "#999" : "#eee",
			display: "flex",
			justifyContent: "center",
			cursor: "pointer",
			userSelect: "none",
			alignItems: "center",
			borderRadius: 5,
			height: 65,
		}}
	>
		{word.word}
	</div>
);

const PlayableConnections = ({
	puzzleData,
	puzzleId,
}: {
	puzzleData: PuzzleData & { type: "connections" };
	puzzleId: number;
}) => {
	const {
		hint,
		unusedWords,
		toggleWord,
		selection,
		checkSelection,
		clearSelection,
		solvedGroups,
		solved,
	} = useConnections(puzzleData, puzzleId);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 5,
				alignItems: "center",
			}}
		>
			<Timer disabled={solved} />
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr",
					gap: 5,
					width: 600,
				}}
			>
				{solvedGroups.map((group) => (
					<WordGroup group={group} key={group.id} />
				))}

				{unusedWords.map((word) => (
					<WordButton
						selected={selection.some((s) => s.id === word.id)}
						word={word}
						onClick={() => toggleWord(word)}
						key={word.id}
					/>
				))}
			</div>

			<div style={{ display: "flex", gap: 5 }}>
				<Button
					text="Clear Selection"
					onClick={clearSelection}
					disabled={solved || selection.length === 0}
				/>
				<Button
					text="Verify"
					onClick={checkSelection}
					disabled={solved || selection.length !== 4}
				/>
				{/* <Button text="Cheat" onClick={() => solvePuzzle(puzzleId, 100)} /> */}
			</div>

			<div>{hint}</div>
		</div>
	);
};

export default PlayableConnections;
