import AttemptsTable from "@/components/Tables/AttemptsTable";
import Button from "@/components/Button";
import Header from "@/components/Header";
import PlayablePuzzle from "@/components/Puzzles/PlayablePuzzle";
import PuzzleStats from "@/components/Puzzles/PuzzleStats";
import { useAuth } from "@/hooks/useAuth";
import { useGet } from "@/hooks/useGet";
import { deletePuzzle } from "@/hooks/usePuzzle";
import { PuzzleWithData } from "@/util/types";
import { Link, useParams } from "react-router";

const PuzzlePage = () => {
	const user = useAuth();
	const { puzzleId } = useParams();

	const { dataResult } = useGet<PuzzleWithData>({
		path: `puzzles/${puzzleId}`,
		queryKey: ["puzzles", puzzleId ?? ""],
	});

	if (dataResult.variant === "loading") {
		return <div>Loading puzzle...</div>;
	}

	if (dataResult.variant === "error") {
		return (
			<div>Error: {dataResult.error.detail ?? "Unknown error occurred."}</div>
		);
	}

	const userIsAdmin = user.type === "user" && user.isAdmin;
	const userIsCreator =
		user.type === "user" && user.userId === dataResult.value.createdUserId;
	const canDelete = userIsAdmin || userIsCreator;
	const canEdit = userIsCreator;

	return (
		<div>
			<Header text={`Puzzle: ${dataResult.value.puzzleName}`} />

			<PlayablePuzzle
				puzzleData={dataResult.value.puzzleData}
				puzzleId={dataResult.value.puzzleId}
			/>

			<PuzzleStats puzzle={dataResult.value} />

			{canDelete && (
				<div style={{ marginTop: 10 }}>
					<Button
						backgroundColor="darkred"
						text="Delete Puzzle"
						onClick={() => deletePuzzle(Number(puzzleId) ?? -1)}
					/>
				</div>
			)}

			{canEdit && (
				<div style={{ marginTop: 10 }}>
					<Link to={`/puzzles/${dataResult.value.puzzleId}/edit`}>
						<Button text="Edit Puzzle" onClick={() => {}} />
					</Link>
				</div>
			)}

			<Header text="Leaderboard" />
			<AttemptsTable
				endpoint={`puzzles/${dataResult.value.puzzleId}/attempts`}
				queryKey={["puzzles", dataResult.value.puzzleId.toString(), "attempts"]}
			/>
		</div>
	);
};

export default PuzzlePage;
