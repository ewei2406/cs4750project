import { Puzzle } from "@/util/types";
import UserLink from "../UserLink";
import StarRating from "../StarRating";

const PuzzleStats = ({ puzzle }: { puzzle: Puzzle }) => (
	<div style={{ display: "grid", gap: 5, gridTemplateColumns: "75px 200px" }}>
		<div>Author:</div>
		<UserLink userId={puzzle.createdUserId} username={puzzle.createdUsername} />

		<div>Updated:</div>
		<div>{puzzle.updatedAt.slice(0, 10)}</div>

		<div>Rating:</div>
		<StarRating {...puzzle} />

		<div>Solves:</div>
		<div>{puzzle.solvedCt}</div>

		<div>Type:</div>
		<div>{puzzle.puzzleType}</div>
	</div>
);

export default PuzzleStats;
