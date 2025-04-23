import Button from "@/components/Button";
import PuzzleIcon from "@/components/PuzzleIcon";
import StarRating from "@/components/StarRating";
import UserLink from "@/components/UserLink";
import { useAuth } from "@/hooks/useAuth";
import { useGet } from "@/hooks/useGet";
import { deletePuzzle, ratePuzzle } from "@/hooks/usePuzzle";
import { Puzzle } from "@/util/types";
import Header from "./Header";

const PuzzleRow = ({ puzzle }: { puzzle: Puzzle }) => {
	const user = useAuth();
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
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<div onClick={() => ratePuzzle(puzzle.puzzleId)}>
					<StarRating rating={puzzle.ratingAvg} ratingCt={puzzle.ratingCt} />
				</div>
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

			<PuzzleIcon puzzleType={puzzle.puzzleType} />
			<div style={{ fontWeight: 800 }}>{puzzle.puzzleName}</div>
			<UserLink
				userId={puzzle.createdUserId}
				username={puzzle.createdUsername}
			/>

			<div style={{ display: "flex", gap: 5 }}>
				<Button text="Play" backgroundColor="lightgreen" onClick={() => {}} />
				{user.type === "user" && user.isAdmin && (
					<Button
						text="Delete"
						backgroundColor="darkred"
						onClick={() => deletePuzzle(puzzle.puzzleId)}
					/>
				)}
			</div>

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

const PuzzleTable = ({ endpoint }: { endpoint: string }) => {
	const { dataResult } = useGet<Puzzle[]>({
		path: endpoint,
		queryKey: ["puzzles", endpoint],
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
