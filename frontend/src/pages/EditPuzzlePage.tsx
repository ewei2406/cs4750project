import Header from "@/components/Header";
import EditablePuzzle from "@/components/Puzzles/EditablePuzzle";
import PuzzleLink from "@/components/Puzzles/PuzzleLink";
import PuzzleStats from "@/components/Puzzles/PuzzleStats";
import { useAuth } from "@/hooks/useAuth";
import { useGet } from "@/hooks/useGet";
import { PuzzleWithData } from "@/util/types";
import { useParams } from "react-router";

const EditPuzzlePage = () => {
	const user = useAuth();
	const { puzzleId } = useParams();

	const { dataResult } = useGet<PuzzleWithData>({
		path: `puzzles/${puzzleId}`,
		queryKey: ["puzzles", puzzleId ?? ""],
	});

	if (dataResult.variant === "loading") {
		document.title = "Loading puzzle...";
		return <div>Loading puzzle...</div>;
	}

	if (dataResult.variant === "error") {
		document.title = "Puzzle not found!";
		return (
			<div>Error: {dataResult.error.detail ?? "Unknown error occurred."}</div>
		);
	}

	const userIsCreator =
		user.type === "user" && user.userId === dataResult.value.createdUserId;
	if (!userIsCreator) {
		document.title = "Unauthorized";
		return <div>You are not authorized to edit this puzzle.</div>;
	}
	
	document.title = `Editing Puzzle: ${dataResult.value.puzzleName}`;

	return (
		<div>
			<Header text={`Editing Puzzle: ${dataResult.value.puzzleName}`} />

			<EditablePuzzle {...dataResult.value} />

			<PuzzleStats puzzle={dataResult.value} />

			<div style={{ marginTop: 10 }}>
				Play puzzle: <PuzzleLink {...dataResult.value} />
			</div>
		</div>
	);
};

export default EditPuzzlePage;
