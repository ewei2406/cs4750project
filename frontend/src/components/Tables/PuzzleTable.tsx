import StarRating from "@/components/StarRating";
import UserLink from "@/components/UserLink";
import { useGet } from "@/hooks/useGet";
import { Puzzle } from "@/util/types";
import PuzzleLink from "../Puzzles/PuzzleLink";

const PuzzleRow = ({ puzzle }: { puzzle: Puzzle }) => {
	return (
		<div
			style={{
				display: "flex",
				width: 150,
				alignItems: "center",
				gap: 5,
				padding: 5,
				flexDirection: "column",
				borderRadius: 10,
				border: "1px solid lightgray",
				backgroundColor: "white",
				transition: "transform 0.2s ease, box-shadow 0.2s ease",
				cursor: "pointer",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = "scale(1.05)";
				e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = "scale(1)";
				e.currentTarget.style.boxShadow = "none";
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<StarRating {...puzzle} />
				<div
					style={{
						fontSize: 12,
						color: puzzle.solvedCt === 0 ? "gray" : "black",
					}}
				>
					{puzzle.solvedCt === 0 ? "No" : puzzle.solvedCt}{" "}
					{puzzle.solvedCt === 1 ? "solve" : "solves"}
				</div>
			</div>

			<PuzzleLink {...puzzle} />

			<UserLink
				userId={puzzle.createdUserId}
				username={puzzle.createdUsername}
			/>

			<div
				style={{
					fontSize: 10,
					color: "gray",
				}}
			>
				Updated {puzzle.updatedAt.slice(0, 10)}
			</div>
		</div>
	);
};


const PuzzleTable = ({
	endpoint,
	queryKey,
}: {
	endpoint: string;
	queryKey: string[];
}) => {
	const { dataResult } = useGet<Puzzle[]>({
		path: endpoint,
		queryKey,
	});

	if (dataResult.variant === "loading") {
		return <div>Loading puzzles...</div>;
	}

	if (dataResult.variant === "error") {
		return (
			<div>Error: {dataResult.error.detail ?? "Unknown error ocurred."}</div>
		);
	}

	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				maxHeight: 350,
				overflowY: "auto",
				gap: "5px",
				padding: "10px",
			}}
		>
			{dataResult.value.map((puzzle) => (
				<PuzzleRow key={puzzle.puzzleId} puzzle={puzzle} />
			))}
			{dataResult.value.length === 0 && <div>No puzzles found.</div>}
		</div>
	);
};

export default PuzzleTable;
