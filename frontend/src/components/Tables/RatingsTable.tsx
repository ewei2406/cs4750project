import { useGet } from "@/hooks/useGet";
import { Rating } from "@/util/types";
import UserLink from "../UserLink";
import StarRating from "../StarRating";
import PuzzleLink from "../Puzzles/PuzzleLink";

const RatingRow = ({ rating }: { rating: Rating }) => (
	<div
		style={{
			display: "grid",
			gridTemplateColumns: "1fr 2fr 1fr",
			gap: 5,
			padding: 5,
		}}
	>
		<UserLink userId={rating.userId} username={rating.username} />
		<PuzzleLink
			puzzleType={rating.puzzleType}
			puzzleName={rating.puzzleName}
			puzzleId={rating.puzzleId}
		/>
		<div>
			<StarRating ratingAvg={rating.rating} {...rating} />
			<div style={{ fontSize: 11, color: "gray" }}>
				(Updated {rating.updatedAt.slice(0, 10)})
			</div>
		</div>
	</div>
);

const RatingsTable = ({
	endpoint,
	queryKey,
}: {
	endpoint: string;
	queryKey: string[];
}) => {
	const { dataResult } = useGet<Rating[]>({
		path: endpoint,
		queryKey,
	});

	if (dataResult.variant === "loading") {
		return <div>Loading ratings...</div>;
	}

	if (dataResult.variant === "error") {
		return (
			<div>Error: {dataResult.error.detail ?? "Unknown error occurred."}</div>
		);
	}

	return (
		<div style={{ border: "1px solid lightgray", borderRadius: 5 }}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 2fr 1fr",
					gap: 5,
					fontWeight: 800,
					padding: 5,
					borderBottom: "1px solid lightgray",
				}}
			>
				<div style={{ fontWeight: 800 }}>User</div>
				<div style={{ fontWeight: 800 }}>Puzzle</div>
				<div style={{ fontWeight: 800 }}>Rating</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 5,
				}}
			>
				{dataResult.value.map((rating) => (
					<RatingRow
						key={`${rating.puzzleId}-${rating.userId}`}
						rating={rating}
					/>
				))}
			</div>
		</div>
	);
};

export default RatingsTable;
