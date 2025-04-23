import { Link } from "react-router";
import PuzzleIcon from "../PuzzleIcon";
import { Puzzle } from "@/util/types";

const PuzzleLink = ({
	puzzleType,
	puzzleName,
	puzzleId,
}: {
	puzzleType: Puzzle["puzzleType"];
	puzzleName: Puzzle["puzzleName"];
	puzzleId: Puzzle["puzzleId"];
}) => (
	<Link
		to={`/puzzles/${puzzleId}`}
		style={{
			color: "inherit",
			textDecoration: "none",
			display: "grid",
			gridTemplateColumns: "25px 1fr",
			gap: 5,
			alignItems: "center",
		}}
	>
		<PuzzleIcon puzzleType={puzzleType} size={12} iconOnly />
		<div style={{ fontSize: 13 }}>{puzzleName}</div>
	</Link>
);

export default PuzzleLink;
